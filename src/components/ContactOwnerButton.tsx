import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/hooks/useConversations';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ContactOwnerButtonProps {
  listingId: string;
  ownerId: string;
  ownerName?: string;
  className?: string;
}

export const ContactOwnerButton: React.FC<ContactOwnerButtonProps> = ({
  listingId,
  ownerId,
  ownerName,
  className
}) => {
  const { user } = useAuth();
  const { createOrFindConversation } = useConversations();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContact = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour contacter le propriétaire",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    const conversationId = await createOrFindConversation(listingId, ownerId);
    if (conversationId) {
      navigate(`/messages/${conversationId}`);
    }
  };

  if (user?.id === ownerId) {
    return null; // Ne pas afficher le bouton pour le propriétaire
  }

  return (
    <Button 
      onClick={handleContact}
      className={className}
      variant="outline"
    >
      <MessageCircle className="w-4 h-4 mr-2" />
      Contacter {ownerName ? ownerName : 'le propriétaire'}
    </Button>
  );
};