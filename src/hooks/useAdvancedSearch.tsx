import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Listing } from '@/types/supabase';
import { FilterState } from '@/components/SearchFilters';

export const useAdvancedSearch = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const searchListings = async (
    filters: FilterState,
    page: number = 1,
    pageSize: number = 12
  ) => {
    setLoading(true);
    try {
      // Construction de la requête de base
      let query = supabase
        .from('listings')
        .select('*', { count: 'exact' })
        .eq('is_available', true);

      // Filtrage par recherche textuelle
      if (filters.query) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
      }

      // Filtrage par catégorie
      if (filters.category) {
        query = query.eq('category_id', filters.category);
      }

      // Filtrage par localisation
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      // Filtrage par prix
      if (filters.priceUnit) {
        query = query.eq('price_unit', filters.priceUnit);
      }

      if (filters.priceRange[0] > 0) {
        query = query.gte('price', filters.priceRange[0]);
      }

      if (filters.priceRange[1] < 1000) {
        query = query.lte('price', filters.priceRange[1]);
      }

      // Filtrage par équipements/caractéristiques
      if (filters.features.length > 0) {
        // Utilisation de l'opérateur overlap pour les arrays
        query = query.overlaps('features', filters.features);
      }

      // Tri
      switch (filters.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'popularity':
          query = query.order('views', { ascending: false });
          break;
        case 'date_desc':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      setListings(data || []);
      setTotalResults(count || 0);

      return {
        listings: data || [],
        totalResults: count || 0,
        hasMore: count ? (page * pageSize) < count : false
      };
    } catch (error) {
      console.error('Error in searchListings:', error);
      setListings([]);
      setTotalResults(0);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const searchWithLocation = async (
    filters: FilterState,
    userLocation: { lat: number; lng: number } | null,
    maxDistance: number = 50 // km
  ) => {
    // Pour une recherche géographique plus avancée, nous pourrions utiliser PostGIS
    // Pour l'instant, nous utilisons la recherche textuelle
    return searchListings(filters);
  };

  const getSuggestions = async (query: string, limit: number = 5) => {
    if (!query || query.length < 2) return [];

    try {
      const { data, error } = await supabase
        .from('listings')
        .select('title, category_id, location')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
        .eq('is_available', true)
        .limit(limit);

      if (error) throw error;

      // Créer des suggestions uniques
      const suggestions = new Set<string>();
      
      data?.forEach(listing => {
        if (listing.title.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(listing.title);
        }
        if (listing.location.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(listing.location);
        }
      });

      return Array.from(suggestions).slice(0, limit);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  };

  const getPopularSearches = async (limit: number = 10) => {
    try {
      // Récupérer les catégories les plus populaires
      const { data, error } = await supabase
        .from('listings')
        .select('category_id')
        .eq('is_available', true);

      if (error) throw error;

      // Compter les occurrences de chaque catégorie
      const categoryCount: { [key: string]: number } = {};
      data?.forEach(listing => {
        if (listing.category_id) {
          categoryCount[listing.category_id] = (categoryCount[listing.category_id] || 0) + 1;
        }
      });

      // Trier par popularité
      const popularCategories = Object.entries(categoryCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([categoryId]) => categoryId);

      return popularCategories;
    } catch (error) {
      console.error('Error getting popular searches:', error);
      return [];
    }
  };

  const getRecentSearches = () => {
    try {
      const stored = localStorage.getItem('recent_searches');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const addToRecentSearches = (searchTerm: string) => {
    try {
      const recent = getRecentSearches();
      const updated = [
        searchTerm,
        ...recent.filter((term: string) => term !== searchTerm)
      ].slice(0, 10); // Garder seulement les 10 dernières

      localStorage.setItem('recent_searches', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  return {
    listings,
    loading,
    totalResults,
    searchListings,
    searchWithLocation,
    getSuggestions,
    getPopularSearches,
    getRecentSearches,
    addToRecentSearches
  };
};