
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Listing } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

interface IncrementViewsBody {
  listing_id: string;
}

export const useListingDetail = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchListing = async (id: string): Promise<{ data: Listing | null; error: any }> => {
    setLoading(true);
    try {
      // Incrémenter les vues si l'ID est un UUID valide
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      
      if (isValidUUID) {
        await supabase.functions.invoke('increment-views', {
          body: { listing_id: id } as IncrementViewsBody
        });
      }

      // Récupérer l'annonce
      const { data: listing, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching listing:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'annonce",
          variant: "destructive",
        });
        return { data: null, error };
      }

      // Récupérer le profil du propriétaire séparément
      let profileData = null;
      if (listing?.owner_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_id, username, full_name, avatar_url')
          .eq('user_id', listing.owner_id)
          .single();
        
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
