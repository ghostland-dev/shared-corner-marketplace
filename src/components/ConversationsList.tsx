import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Conversation } from '@/hooks/useConversations';

interface ConversationsListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
}

export const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation
}) => {
  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Aucune conversation pour le moment</p>
        <p className="text-sm mt-1">
          Contactez des propriétaires depuis leurs annonces pour commencer à discuter
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      {conversations.map((conversation) => {
        const otherParticipant = conversation.other_participant;
        const participantName = otherParticipant?.full_name || 
                               otherParticipant?.username || 
                               'Utilisateur inconnu';
        const participantInitials = participantName.split(' ').map(n => n[0]).join('').toUpperCase();
        const isSelected = conversation.id === selectedConversationId;

        return (
          <Card
            key={conversation.id}
            className={`cursor-pointer transition-colors hover:bg-muted/50 ${
              isSelected ? 'bg-muted border-primary' : ''
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={otherParticipant?.avatar_url || ''} />
                  <AvatarFallback className="text-sm">
                    {participantInitials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm truncate">
                      {participantName}
                    </h3>
                    <div className="flex items-center gap-2">
                      {conversation.unread_count && conversation.unread_count > 0 && (
                        <Badge variant="default" className="text-xs h-5 min-w-[20px] px-1">
                          {conversation.unread_count}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(conversation.last_message_at), 'dd/MM', { locale: fr })}
                      </span>
                    </div>
                  </div>

                  {conversation.listing && (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      À propos de: {conversation.listing.title}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};