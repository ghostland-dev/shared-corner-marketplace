import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/hooks/useConversations';
import { ConversationsList } from '@/components/ConversationsList';
import { MessagesList } from '@/components/MessagesList';
import { MessageInput } from '@/components/MessageInput';

export const Messages = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    conversations,
    messages,
    loading,
    loadMessages,
    sendMessage
  } = useConversations();

  const [selectedConversation, setSelectedConversation] = useState<string | undefined>(
    conversationId
  );

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (conversationId && conversationId !== selectedConversation) {
      setSelectedConversation(conversationId);
    }
  }, [conversationId]);

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
    navigate(`/messages/${id}`);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return false;
    return await sendMessage(selectedConversation, content);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Messages</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Liste des conversations */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <div className="h-full overflow-y-auto">
              <ConversationsList
                conversations={conversations}
                selectedConversationId={selectedConversation}
                onSelectConversation={handleSelectConversation}
              />
            </div>
          </CardContent>
        </Card>

        {/* Messages de la conversation sélectionnée */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversation && currentConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={currentConversation.other_participant?.avatar_url || ''} />
                    <AvatarFallback>
                      {(currentConversation.other_participant?.full_name || 
                        currentConversation.other_participant?.username || 'U')
                        .split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">
                      {currentConversation.other_participant?.full_name || 
                       currentConversation.other_participant?.username || 
                       'Utilisateur inconnu'}
                    </h2>
                    {currentConversation.listing && (
                      <p className="text-sm text-muted-foreground">
                        À propos de: {currentConversation.listing.title}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <div className="flex-1 flex flex-col min-h-0">
                <MessagesList messages={messages} />
                <MessageInput
                  onSendMessage={handleSendMessage}
                  disabled={loading}
                />
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Sélectionnez une conversation pour commencer à discuter</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};