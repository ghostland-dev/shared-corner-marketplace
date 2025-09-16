import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

export const useFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les favoris de l'utilisateur
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', user.id);

      if (error) throw error;

      setFavorites(data.map(fav => fav.listing_id));
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const addFavorite = async (listingId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour ajouter aux favoris",
        variant: "destructive",
      });
      return;
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(listingId)) {
      console.error('Invalid UUID format for listing:', listingId);
      toast({
        title: "Erreur",
        description: "ID d'annonce invalide",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          listing_id: listingId
        });

      if (error) throw error;

      setFavorites(prev => [...prev, listingId]);
      toast({
        title: "Ajouté aux favoris",
        description: "L'annonce a été ajoutée à vos favoris",
      });
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter aux favoris",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (listingId: string) => {
    if (!user) return;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(listingId)) {
      console.error('Invalid UUID format for listing:', listingId);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId);

      if (error) throw error;

      setFavorites(prev => prev.filter(id => id !== listingId));
      toast({
        title: "Retiré des favoris",
        description: "L'annonce a été retirée de vos favoris",
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le favori",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (listingId: string): boolean => {
    return favorites.includes(listingId);
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    loadFavorites
  };
};