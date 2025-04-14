
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Listing } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

export type ListingOptions = {
  category?: string;
  search?: string;
  limit?: number;
  page?: number;
};

export const useListingsSearch = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchListings = async (options: ListingOptions = {}): Promise<{ data: Listing[]; count: number; error: any }> => {
    setLoading(true);
    try {
      let query = supabase
        .from('listings')
        .select('*', { count: 'exact' });

      if (options.category) {
        query = query.eq('category_id', options.category);
      }

      if (options.search) {
        query = query.or(
          `title.ilike.%${options.search}%,description.ilike.%${options.search}%,location.ilike.%${options.search}%`
        );
      }

      query = query.eq('is_available', true).order('created_at', { ascending: false });

      if (options.limit) {
        const offset = ((options.page || 1) - 1) * options.limit;
        query = query.range(offset, offset + options.limit - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching listings:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les annonces",
          variant: "destructive",
        });
        return { data: [], count: 0, error };
      }

      return { data: data as Listing[], count: count || 0, error: null };
    } catch (error) {
      console.error('Error in fetchListings:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du chargement des annonces",
        variant: "destructive",
      });
      return { data: [], count: 0, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchListings,
    loading
  };
};
