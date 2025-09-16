
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Listing } from '@/types/supabase';

export const useListingMutation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const createListing = async (listingData: {
    title: string;
    description: string;
    price: number;
    price_unit: string;
    location: string;
    category_id: string;
    image_urls?: string[];
    features?: string[];
  }): Promise<{ data: Listing | null; error: any }> => {
    if (!user) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour créer une annonce.',
        variant: 'destructive',
      });
      return { data: null, error: new Error('Non authentifié') };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('listings')
        .insert({
          ...listingData,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) {
        toast({
          title: 'Erreur',
          description: "Impossible de créer l'annonce.",
          variant: 'destructive',
        });
        return { data: null, error };
      }

      toast({
        title: 'Annonce créée',
        description: 'Votre annonce a été publiée avec succès !',
      });

      return { data: data as Listing, error: null };
    } catch (error) {
      console.error('Error in createListing:', error);
      toast({
        title: 'Erreur',
        description: "Une erreur s'est produite lors de la création de l'annonce.",
        variant: 'destructive',
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const updateListing = async (
    id: string,
    listingData: Partial<Listing>
  ): Promise<{ success: boolean; error: any }> => {
    if (!user) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour modifier une annonce.',
        variant: 'destructive',
      });
      return { success: false, error: new Error('Non authentifié') };
    }

    setLoading(true);
    try {
      const { data: listing, error: fetchError } = await supabase
        .from('listings')
        .select('owner_id')
        .eq('id', id)
        .single();

      if (fetchError || !listing || listing.owner_id !== user.id) {
        toast({
          title: 'Non autorisé',
          description: "Vous n'êtes pas autorisé à modifier cette annonce.",
          variant: 'destructive',
        });
        return { success: false, error: fetchError || new Error('Non autorisé') };
      }

      const { error } = await supabase.from('listings').update(listingData).eq('id', id);

      if (error) {
        toast({
          title: 'Erreur',
          description: "Impossible de mettre à jour l'annonce.",
          variant: 'destructive',
        });
        return { success: false, error };
      }

      toast({
        title: 'Annonce mise à jour',
        description: 'Votre annonce a été mise à jour avec succès.',
      });

      return { success: true, error: null };
    } catch (error) {
      console.error('Error in updateListing:', error);
      toast({
        title: 'Erreur',
        description: "Une erreur s'est produite lors de la mise à jour de l'annonce.",
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async (id: string): Promise<{ success: boolean; error: any }> => {
    if (!user) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour supprimer une annonce.',
        variant: 'destructive',
      });
      return { success: false, error: new Error('Non authentifié') };
    }

    setLoading(true);
    try {
      const { data: listing, error: fetchError } = await supabase
        .from('listings')
        .select('owner_id')
        .eq('id', id)
        .single();

      if (fetchError || !listing || listing.owner_id !== user.id) {
        toast({
          title: 'Non autorisé',
          description: "Vous n'êtes pas autorisé à supprimer cette annonce.",
          variant: 'destructive',
        });
        return { success: false, error: fetchError || new Error('Non autorisé') };
      }

      const { error } = await supabase.from('listings').delete().eq('id', id);

      if (error) {
        toast({
          title: 'Erreur',
          description: "Impossible de supprimer l'annonce.",
          variant: 'destructive',
        });
        return { success: false, error };
      }

      toast({
        title: 'Annonce supprimée',
        description: 'Votre annonce a été supprimée avec succès.',
      });

      return { success: true, error: null };
    } catch (error) {
      console.error('Error in deleteListing:', error);
      toast({
        title: 'Erreur',
        description: "Une erreur s'est produite lors de la suppression de l'annonce.",
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    createListing,
    updateListing,
    deleteListing,
    loading,
  };
};
