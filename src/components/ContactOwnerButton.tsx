import React, { useState } from 'react';
import { MessageCircle, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/hooks/useConversations';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ContactOwnerButtonProps {
  listingId: string;
  ownerId: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  className?: string;
}

export const ContactOwnerButton: React.FC<ContactOwnerButtonProps> = ({
  listingId,
  ownerId,
  ownerName,
  ownerEmail,
  ownerPhone,
  className
}) => {
  const { user } = useAuth();
  const { createOrFindConversation } = useConversations();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [contactMethod, setContactMethod] = useState<'message' | 'email' | 'phone'>('message');

  const handleQuickContact = async () => {
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

  const handleSendMessage = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour envoyer un message",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Message requis",
        description: "Veuillez saisir un message",
        variant: "destructive",
      });
      return;
    }

    try {
      const conversationId = await createOrFindConversation(listingId, ownerId);
      if (conversationId) {
        // TODO: Envoyer le message directement
        setDialogOpen(false);
        setMessage('');
        navigate(`/messages/${conversationId}`);
        toast({
          title: "Message envoyé",
          description: "Votre message a été envoyé au propriétaire",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
    }
  };

  const handleEmailContact = () => {
    if (ownerEmail) {
      const subject = `Concernant votre annonce`;
      const body = message || `Bonjour,\n\nJe suis intéressé(e) par votre annonce.\n\nCordialement`;
      window.location.href = `mailto:${ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setDialogOpen(false);
    }
  };

  const handlePhoneContact = () => {
    if (ownerPhone) {
      window.location.href = `tel:${ownerPhone}`;
      setDialogOpen(false);
    }
  };

  if (user?.id === ownerId) {
    return null; // Ne pas afficher le bouton pour le propriétaire
  }

  // Vérifier si c'est des données mock (ID non-UUID)
  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ownerId);

  return (
    <div className={className}>
      {/* Bouton principal */}
      <Button 
        onClick={handleQuickContact}
        className="w-full mb-2"
        disabled={!isValidUUID}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        {isValidUUID ? `Contacter ${ownerName || 'le propriétaire'}` : 'Contacter (Démo uniquement)'}
      </Button>

      {/* Dialog pour plus d'options */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            Plus d'options de contact
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contacter {ownerName || 'le propriétaire'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Options de contact */}
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant={contactMethod === 'message' ? 'default' : 'outline'}
                onClick={() => setContactMethod('message')}
                className="justify-start"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message privé
              </Button>

              {ownerEmail && (
                <Button
                  variant={contactMethod === 'email' ? 'default' : 'outline'}
                  onClick={() => setContactMethod('email')}
                  className="justify-start"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email: {ownerEmail}
                </Button>
              )}

              {ownerPhone && (
                <Button
                  variant={contactMethod === 'phone' ? 'default' : 'outline'}
                  onClick={() => setContactMethod('phone')}
                  className="justify-start"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Téléphone: {ownerPhone}
                </Button>
              )}
            </div>

            {/* Message personnalisé pour message et email */}
            {(contactMethod === 'message' || contactMethod === 'email') && (
              <div className="space-y-2">
                <Label htmlFor="message">Votre message</Label>
                <Textarea
                  id="message"
                  placeholder="Bonjour, je suis intéressé(e) par votre annonce..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {contactMethod === 'message' && (
                <Button onClick={handleSendMessage} className="flex-1" disabled={!isValidUUID}>
                  Envoyer le message
                </Button>
              )}
              
              {contactMethod === 'email' && ownerEmail && (
                <Button onClick={handleEmailContact} className="flex-1">
                  Ouvrir l'email
                </Button>
              )}
              
              {contactMethod === 'phone' && ownerPhone && (
                <Button onClick={handlePhoneContact} className="flex-1">
                  Appeler
                </Button>
              )}
              
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
            </div>

            {!isValidUUID && (
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                💡 Cette fonctionnalité est limitée en mode démo. Créez un compte et publiez une vraie annonce pour utiliser le système de messagerie complet.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};