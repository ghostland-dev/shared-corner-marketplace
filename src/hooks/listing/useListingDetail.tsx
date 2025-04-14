
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Listing } from '@/types/supabase';

interface IncrementViewsBody {
  listing_id: string;
}

export const useListingDetail = () => {
  const [loading, setLoading] = useState(false);

  const fetchListing = async (id: string): Promise<{ data: Listing | null; error: any }> => {
    setLoading(true);
    try {
      await supabase.functions.invoke('increment-views', {
        body: { listing_id: id } as IncrementViewsBody
      });

      const { data, error } = await supabase
        .from('listings')
        .select(
          `
          *,
          profiles:owner_id (
            username,
            avatar_url,
            full_name
          ),
          reviews (
            id,
            rating,
            comment,
            created_at,
            reviewer_id,
            profiles:reviewer_id (
              username,
              avatar_url,
              full_name
            )
          )
        `
        )
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching listing:', error);
        return { data: null, error };
      }

      return { data: data as Listing, error: null };
    } catch (error) {
      console.error('Error in fetchListing:', error);
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
