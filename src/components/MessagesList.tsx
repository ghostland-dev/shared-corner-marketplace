import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from '@/hooks/useConversations';

interface MessagesListProps {
  messages: Message[];
}

export const MessagesList: React.FC<MessagesListProps> = ({ messages }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p>Aucun message pour le moment. Commencez la conversation !</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isOwnMessage = message.sender_id === user?.id;
        const senderName = message.sender?.full_name || 
                          message.sender?.username || 
                          'Utilisateur inconnu';
        const senderInitials = senderName.split(' ').map(n => n[0]).join('').toUpperCase();

        return (
          <div
            key={message.id}
            className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={message.sender?.avatar_url || ''} />
              <AvatarFallback className="text-xs">
                {senderInitials}
              </AvatarFallback>
            </Avatar>
            
            <div className={`flex flex-col max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
              <div
                className={`rounded-lg px-3 py-2 ${
                  isOwnMessage
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                {!isOwnMessage && (
                  <span className="text-xs text-muted-foreground font-medium">
                    {senderName}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {format(new Date(message.created_at), 'dd MMM à HH:mm', { locale: fr })}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};