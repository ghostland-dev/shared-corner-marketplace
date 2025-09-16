import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

export type Conversation = {
  id: string;
  listing_id: string | null;
  participant_1: string;
  participant_2: string;
  last_message_at: string;
  created_at: string;
  listing?: {
    id: string;
    title: string;
    image_urls: string[];
  };
  other_participant?: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
  unread_count?: number;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
};

export const useConversations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les conversations
  const loadConversations = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          listing:listings(id, title, image_urls),
          participant_1_profile:profiles!conversations_participant_1_fkey(id, username, full_name, avatar_url),
          participant_2_profile:profiles!conversations_participant_2_fkey(id, username, full_name, avatar_url)
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      const processedConversations = await Promise.all(
        (data || []).map(async (conv: any) => {
          // Déterminer l'autre participant
          const isParticipant1 = conv.participant_1 === user.id;
          const otherParticipant = isParticipant1 
            ? conv.participant_2_profile 
            : conv.participant_1_profile;

          // Compter les messages non lus
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('read', false)
            .neq('sender_id', user.id);

          return {
            ...conv,
            other_participant: otherParticipant,
            unread_count: count || 0
          };
        })
      );

      setConversations(processedConversations);
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

  // Charger les messages d'une conversation
  const loadMessages = async (conversationId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, username, full_name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);

      // Marquer les messages comme lus
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('read', false);

    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Créer ou trouver une conversation
  const createOrFindConversation = async (listingId: string, ownerId: string) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour envoyer un message",
        variant: "destructive",
      });
      return null;
    }

    if (user.id === ownerId) {
      toast({
        title: "Erreur",
        description: "Vous ne pouvez pas vous envoyer un message à vous-même",
        variant: "destructive",
      });
      return null;
    }

    try {
      // Vérifier si une conversation existe déjà
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('*')
        .eq('listing_id', listingId)
        .or(`and(participant_1.eq.${user.id},participant_2.eq.${ownerId}),and(participant_1.eq.${ownerId},participant_2.eq.${user.id})`)
        .single();

      if (existingConversation) {
        return existingConversation.id;
      }

      // Créer une nouvelle conversation
      const { data: newConversation, error } = await supabase
        .from('conversations')
        .insert({
          listing_id: listingId,
          participant_1: user.id,
          participant_2: ownerId
        })
        .select()
        .single();

      if (error) throw error;

      return newConversation.id;
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

  // Envoyer un message
  const sendMessage = async (conversationId: string, content: string) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour envoyer un message",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim()
        })
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, username, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Ajouter le message à la liste locale
      setMessages(prev => [...prev, message]);

      // Créer une notification pour l'autre participant
      const { data: conversation } = await supabase
        .from('conversations')
        .select('participant_1, participant_2, listing:listings(title)')
        .eq('id', conversationId)
        .single();

      if (conversation) {
        const otherParticipantId = conversation.participant_1 === user.id 
          ? conversation.participant_2 
          : conversation.participant_1;

        const listingTitle = Array.isArray((conversation as any).listing)
          ? (conversation as any).listing[0]?.title
          : (conversation as any).listing?.title;

        await supabase.from('notifications').insert({
          user_id: otherParticipantId,
          title: "Nouveau message",
          message: `Vous avez reçu un nouveau message${listingTitle ? ` concernant "${listingTitle}"` : ''}`,
          type: 'message',
          related_id: conversationId,
        });
      }

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  // Écouter les nouveaux messages en temps réel
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new as Message;
          
          // Si le message n'est pas de l'utilisateur actuel
          if (newMessage.sender_id !== user.id) {
            setMessages(prev => {
              // Vérifier si le message appartient à la conversation actuellement affichée
              if (prev.length > 0 && prev[0].conversation_id === newMessage.conversation_id) {
                return [...prev, newMessage];
              }
              return prev;
            });
            
            // Recharger les conversations pour mettre à jour les compteurs
            loadConversations();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    conversations,
    messages,
    loading,
    loadConversations,
    loadMessages,
    createOrFindConversation,
    sendMessage
  };
};