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

    setLoading(true);
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId);

      if (error) throw error;

      setFavorites(prev => prev.filter(id => id !== listingId));
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