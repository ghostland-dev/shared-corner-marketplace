import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface ConversationWithDetails {
  id: string;
  participant_1: string;
  participant_2: string;
  listing_id?: string;
  last_message_at?: string;
  created_at: string;
  listing?: {
    id: string;
    title: string;
    image_urls: string[];
  };
  other_participant?: {
    id: string;
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
  last_message?: {
    content: string;
    sender_id: string;
    created_at: string;
  };
}

export const useConversationsCRUD = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger toutes les conversations de l'utilisateur
  const loadConversations = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          listing:listings(id, title, image_urls),
          messages(content, sender_id, created_at)
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Enrichir avec les détails des participants
      const enrichedConversations = await Promise.all(
        (data || []).map(async (conv) => {
          const otherParticipantId = conv.participant_1 === user.id 
            ? conv.participant_2 
            : conv.participant_1;

          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', otherParticipantId)
            .maybeSingle();

          // Trier les messages et prendre le dernier
          const sortedMessages = conv.messages?.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );

          return {
            ...conv,
            other_participant: profile ? {
              id: profile.user_id,
              full_name: profile.full_name,
              username: profile.username,
              avatar_url: profile.avatar_url,
            } : null,
            last_message: sortedMessages?.[0] || null,
          };
        })
      );

      setConversations(enrichedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les conversations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle conversation
  const createConversation = async (
    participant2Id: string, 
    listingId?: string
  ): Promise<string | null> => {
    if (!user) return null;

    try {
      // Vérifier si une conversation existe déjà
      const { data: existing, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant_1.eq.${user.id},participant_2.eq.${participant2Id}),and(participant_1.eq.${participant2Id},participant_2.eq.${user.id})`)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existing) {
        return existing.id;
      }

      // Créer une nouvelle conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert([{
          participant_1: user.id,
          participant_2: participant2Id,
          listing_id: listingId,
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Conversation créée",
        description: "Une nouvelle conversation a été créée",
      });

      // Recharger les conversations
      await loadConversations();
      
      return data.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la conversation",
        variant: "destructive",
      });
      return null;
    }
  };

  // Supprimer une conversation
  const deleteConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;

      toast({
        title: "Conversation supprimée",
        description: "La conversation a été supprimée avec succès",
      });

      setConversations(prev => prev.filter(c => c.id !== conversationId));
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la conversation",
        variant: "destructive",
      });
    }
  };

  // Marquer une conversation comme lue (utilitaire)
  const markAsRead = async (conversationId: string) => {
    if (!user) return;

    try {
      // Marquer tous les messages de cette conversation comme lus
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  };

  // Obtenir le nombre de messages non lus
  const getUnreadCount = async () => {
    if (!user) return 0;

    try {
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id')
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`);

      if (!conversations) return 0;

      const conversationIds = conversations.map(c => c.id);

      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .in('conversation_id', conversationIds)
        .neq('sender_id', user.id)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  };

  return {
    conversations,
    loading,
    loadConversations,
    createConversation,
    deleteConversation,
    markAsRead,
    getUnreadCount,
  };
};