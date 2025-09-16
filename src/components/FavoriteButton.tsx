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

    // Check if listing ID is valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(listingId)) {
      toast({
        title: "Fonctionnalité non disponible", 
        description: "Cette fonctionnalité n'est disponible que pour les vraies annonces",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFavorite(listingId)) {
        await removeFavorite(listingId);
      } else {
        await addFavorite(listingId);
      }
    } catch (error) {
      // Error handling is done in the hooks
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