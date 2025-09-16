
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Listing } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';
import { isValidUUID } from '@/lib/utils-app';

interface IncrementViewsBody {
  listing_id: string;
}

export const useListingDetail = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchListing = async (id: string): Promise<{ data: Listing | null; error: any }> => {
    setLoading(true);
    try {
      // Vérifier si l'ID est un UUID valide pour Supabase
      if (!isValidUUID(id)) {
        return { data: null, error: new Error('Invalid UUID format') };
      }

      // Incrémenter les vues
      await supabase.functions.invoke('increment-views', {
        body: { listing_id: id } as IncrementViewsBody
      });

      // Récupérer l'annonce
      const { data: listing, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching listing:', error);
        return { data: null, error };
      }

      if (!listing) {
        return { data: null, error: new Error('Listing not found') };
      }

      // Récupérer le profil du propriétaire séparément
      let profileData = null;
      if (listing?.owner_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_id, username, full_name, avatar_url')
          .eq('user_id', listing.owner_id)
          .maybeSingle();
        
        profileData = profile;
      }

      // Combiner les données
      const enrichedListing = {
        ...listing,
        profiles: profileData
      };

      return { data: enrichedListing as Listing, error: null };
    } catch (error) {
      console.error('Error in fetchListing:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du chargement de l'annonce",
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchListing,
    loading
  };
};
