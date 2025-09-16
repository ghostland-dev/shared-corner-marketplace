
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Listing } from '@/types/supabase';

export type CreateListingData = Omit<Listing, 'id' | 'owner_id' | 'created_at' | 'updated_at' | 'views'>;

export const useCreateListing = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const createListing = async (data: CreateListingData) => {
    if (!user) {
      toast({
        title: "Non autorisé",
        description: "Vous devez être connecté pour créer une annonce",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: listing, error } = await supabase
        .from('listings')
        .insert({
          ...data,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Annonce créée",
        description: "Votre annonce a été publiée avec succès",
      });

      if (listing) { navigate(`/annonces/${listing.id}`); }
    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'annonce",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    createListing,
    loading
  };
};
