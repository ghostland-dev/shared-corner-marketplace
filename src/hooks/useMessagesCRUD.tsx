import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface MessageWithDetails {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: {
    id: string;
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

export const useMessagesCRUD = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<MessageWithDetails[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les messages d'une conversation
  const loadMessages = async (conversationId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Enrichir avec les détails des expéditeurs
      const enrichedMessages = await Promise.all(
        (data || []).map(async (message) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', message.sender_id)
            .maybeSingle();

          return {
            ...message,
            sender: profile ? {
              id: profile.user_id,
              full_name: profile.full_name,
              username: profile.username,
              avatar_url: profile.avatar_url,
            } : null,
          };
        })
      );

      setMessages(enrichedMessages);
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

  // Envoyer un nouveau message
  const sendMessage = async (conversationId: string, content: string) => {
    if (!user || !content.trim()) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim(),
        }])
        .select()
        .single();

      if (error) throw error;

      // Ajouter le nouveau message avec les détails de l'expéditeur
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const enrichedMessage = {
        ...data,
        sender: profile ? {
          id: profile.user_id,
          full_name: profile.full_name,
          username: profile.username,
          avatar_url: profile.avatar_url,
        } : null,
      };

      setMessages(prev => [...prev, enrichedMessage]);
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Marquer un message comme lu
  const markMessageAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, read: true } : m
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  // Marquer tous les messages d'une conversation comme lus
  const markAllAsRead = async (conversationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id);

      if (error) throw error;

      setMessages(prev => prev.map(m => 
        m.conversation_id === conversationId && m.sender_id !== user.id
          ? { ...m, read: true }
          : m
      ));
    } catch (error) {
      console.error('Error marking all messages as read:', error);
    }
  };

  // Supprimer un message (seulement si l'utilisateur en est l'expéditeur)
  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', user?.id);

      if (error) throw error;

      toast({
        title: "Message supprimé",
        description: "Le message a été supprimé avec succès",
      });

      setMessages(prev => prev.filter(m => m.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le message",
        variant: "destructive",
      });
    }
  };

  // Écouter les nouveaux messages en temps réel
  const subscribeToMessages = (conversationId: string) => {
    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const newMessage = payload.new as any;
          
          // Enrichir avec les détails de l'expéditeur
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', newMessage.sender_id)
            .maybeSingle();

          const enrichedMessage = {
            ...newMessage,
            sender: profile ? {
              id: profile.user_id,
              full_name: profile.full_name,
              username: profile.username,
              avatar_url: profile.avatar_url,
            } : null,
          };

          setMessages(prev => [...prev, enrichedMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  };

  return {
    messages,
    loading,
    loadMessages,
    sendMessage,
    markMessageAsRead,
    markAllAsRead,
    deleteMessage,
    subscribeToMessages,
  };
};