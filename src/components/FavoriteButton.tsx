import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface FavoriteButtonProps {
  listingId: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  listingId,
  className,
  size = 'icon',
  variant = 'secondary'
}) => {
  const { user } = useAuth();
  const { addFavorite, removeFavorite, isFavorite, loading } = useFavorites();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour ajouter aux favoris",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    try {
      if (isFavorite(listingId)) {
        await removeFavorite(listingId);
        toast({
          title: "Retiré des favoris",
          description: "L'annonce a été retirée de vos favoris",
        });
      } else {
        await addFavorite(listingId);
        toast({
          title: "Ajouté aux favoris",
          description: "L'annonce a été ajoutée à vos favoris",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier les favoris",
        variant: "destructive",
      });
    }
  };

  const isLiked = isFavorite(listingId);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFavorite}
      disabled={loading}
      className={className}
      aria-label={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart 
        className={size === 'icon' ? "h-5 w-5" : "h-4 w-4"} 
        fill={isLiked ? "currentColor" : "none"}
      />
    </Button>
  );
};