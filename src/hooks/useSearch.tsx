import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Listing } from '@/types/supabase';
import { useToast } from './use-toast';

interface SearchFilters {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}

export const useSearch = () => {
  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const search = async (
    query: string, 
    filters: SearchFilters = {}, 
    page: number = 0, 
    limit: number = 20
  ) => {
    setLoading(true);
    try {
      let supabaseQuery = supabase
        .from('listings')
        .select(`
          *,
          profiles!listings_owner_id_fkey (
            username,
            full_name,
            avatar_url
          )
        `, { count: 'exact' })
        .eq('is_available', true);

      // Recherche textuelle
      if (query && query.trim()) {
        supabaseQuery = supabaseQuery.or(
          `title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`
        );
      }

      // Filtres
      if (filters.category) {
        supabaseQuery = supabaseQuery.eq('category_id', filters.category);
      }

      if (filters.location) {
        supabaseQuery = supabaseQuery.ilike('location', `%${filters.location}%`);
      }

      if (filters.minPrice !== undefined) {
        supabaseQuery = supabaseQuery.gte('price', filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        supabaseQuery = supabaseQuery.lte('price', filters.maxPrice);
      }

      // Pagination
      const from = page * limit;
      const to = from + limit - 1;
      supabaseQuery = supabaseQuery.range(from, to);

      // Tri par pertinence et date
      supabaseQuery = supabaseQuery.order('views', { ascending: false });
      supabaseQuery = supabaseQuery.order('created_at', { ascending: false });

      const { data, error, count } = await supabaseQuery;

      if (error) throw error;

      setResults(data || []);
      setTotalCount(count || 0);

      return {
        results: data || [],
        totalCount: count || 0,
        hasMore: (count || 0) > (page + 1) * limit
      };
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Erreur de recherche",
        description: "Impossible d'effectuer la recherche",
        variant: "destructive",
      });
      return {
        results: [],
        totalCount: 0,
        hasMore: false
      };
    } finally {
      setLoading(false);
    }
  };

  const searchByCategory = async (categoryId: string, page: number = 0, limit: number = 20) => {
    return search('', { category: categoryId }, page, limit);
  };

  const searchNearby = async (location: string, page: number = 0, limit: number = 20) => {
    return search('', { location }, page, limit);
  };

  const clearResults = () => {
    setResults([]);
    setTotalCount(0);
  };

  return {
    results,
    loading,
    totalCount,
    search,
    searchByCategory,
    searchNearby,
    clearResults
  };
};