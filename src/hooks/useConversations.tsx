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
          listing:listings(id, title, image_urls)
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      const processedConversations = await Promise.all(
        (data || []).map(async (conv: any) => {
          // Récupérer les profils des participants
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('user_id, username, full_name, avatar_url')
            .in('user_id', [conv.participant_1, conv.participant_2]);

          if (profileError) {
            console.error('Error loading profiles:', profileError);
          }

          // Déterminer l'autre participant
          const isParticipant1 = conv.participant_1 === user.id;
          const otherParticipantId = isParticipant1 ? conv.participant_2 : conv.participant_1;
          const otherParticipant = profiles?.find(p => p.user_id === otherParticipantId);

          // Compter les messages non lus
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('read', false)
            .neq('sender_id', user.id);

          return {
            ...conv,
            other_participant: otherParticipant ? {
              id: otherParticipant.user_id,
              username: otherParticipant.username,
              full_name: otherParticipant.full_name,
              avatar_url: otherParticipant.avatar_url
            } : null,
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
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Récupérer les profils des expéditeurs
      const senderIds = [...new Set((data || []).map(m => m.sender_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, username, full_name, avatar_url')
        .in('user_id', senderIds);

      const messagesWithProfiles = (data || []).map(message => ({
        ...message,
        sender: profiles?.find(p => p.user_id === message.sender_id) ? {
          id: profiles.find(p => p.user_id === message.sender_id)!.user_id,
          username: profiles.find(p => p.user_id === message.sender_id)!.username,
          full_name: profiles.find(p => p.user_id === message.sender_id)!.full_name,
          avatar_url: profiles.find(p => p.user_id === message.sender_id)!.avatar_url
        } : null
      }));

      setMessages(messagesWithProfiles);

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
        .select('*')
        .single();

      if (error) throw error;

      // Récupérer le profil de l'expéditeur
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_id, username, full_name, avatar_url')
        .eq('user_id', user.id)
        .single();

      const messageWithProfile = {
        ...message,
        sender: profile ? {
          id: profile.user_id,
          username: profile.username,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url
        } : null
      };

      // Ajouter le message à la liste locale
      setMessages(prev => [...prev, messageWithProfile]);

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
        async (payload) => {
          const newMessage = payload.new as Message;
          
          // Si le message n'est pas de l'utilisateur actuel
          if (newMessage.sender_id !== user.id) {
            // Récupérer le profil de l'expéditeur
            const { data: profile } = await supabase
              .from('profiles')
              .select('user_id, username, full_name, avatar_url')
              .eq('user_id', newMessage.sender_id)
              .single();

            const messageWithProfile = {
              ...newMessage,
              sender: profile ? {
                id: profile.user_id,
                username: profile.username,
                full_name: profile.full_name,
                avatar_url: profile.avatar_url
              } : null
            };

            setMessages(prev => {
              // Vérifier si le message appartient à la conversation actuellement affichée
              if (prev.length > 0 && prev[0].conversation_id === newMessage.conversation_id) {
                return [...prev, messageWithProfile];
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