
import { useState, useCallback } from 'react';
import { listings } from '@/data/listings';

interface SearchFilters {
  query?: string;
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  location?: string;
  maxDistance?: number;
}

export const useSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(listings);
  const [filters, setFilters] = useState<SearchFilters>({});

  // Fonction de recherche
  const search = useCallback(async (newFilters: SearchFilters) => {
    setIsLoading(true);
    
    try {
      // Mettre à jour les filtres
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      
      // Simuler un délai de recherche
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filtrer les résultats
      let filteredResults = [...listings];
      
      // Filtre par requête textuelle
      if (updatedFilters.query) {
        const query = updatedFilters.query.toLowerCase();
        filteredResults = filteredResults.filter(
          item => item.title.toLowerCase().includes(query) || 
                  item.description.toLowerCase().includes(query)
        );
      }
      
      // Filtre par catégorie
      if (updatedFilters.categoryId) {
        filteredResults = filteredResults.filter(
          item => item.categoryId === updatedFilters.categoryId
        );
      }
      
      // Filtre par prix min
      if (updatedFilters.priceMin !== undefined) {
        filteredResults = filteredResults.filter(
          item => item.price >= updatedFilters.priceMin!
        );
      }
      
      // Filtre par prix max
      if (updatedFilters.priceMax !== undefined) {
        filteredResults = filteredResults.filter(
          item => item.price <= updatedFilters.priceMax!
        );
      }
      
      // Filtre par localisation
      if (updatedFilters.location) {
        const location = updatedFilters.location.toLowerCase();
        filteredResults = filteredResults.filter(
          item => item.location.toLowerCase().includes(location)
        );
      }
      
      // Filtre par distance max (simulé - normalement utilisé avec géolocalisation)
      if (updatedFilters.maxDistance !== undefined) {
        filteredResults = filteredResults.filter(
          item => (item.distance || 0) <= updatedFilters.maxDistance!
        );
      }
      
      setResults(filteredResults);
      return filteredResults;
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setFilters({});
    setResults(listings);
  }, []);

  return {
    search,
    resetFilters,
    results,
    filters,
    isLoading
  };
};
