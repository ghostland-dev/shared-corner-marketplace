
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Map, List, Filter, Search as SearchIcon, Loader } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ListingCard from '@/components/ListingCard';
import { SearchFilters } from '@/components/SearchFilters';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/hooks/useSearch';
import { useToast } from '@/hooks/use-toast';

const SearchResults = () => {
  const locationRouter = useLocation();
  const { search, results, loading } = useSearch();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const { toast } = useToast();
  
  // Récupération des paramètres de requête
  useEffect(() => {
    const params = new URLSearchParams(locationRouter.search);
    const query = params.get('q') || '';
    const category = params.get('category') || '';
    const locationParam = params.get('location') || '';
    
    // Add this check to avoid infinite loop
    const searchParams = {
      query: query || undefined,
      categoryId: category || undefined,
      location: locationParam || undefined
    };
    
    if (query || category || locationParam) {
      search(query, { 
        category: category || undefined,
        location: locationParam || undefined 
      });
    }
  }, [locationRouter.search]);
  
  const handleApplyFilters = (filters: any) => {
    toast({
      title: 'Filtres appliqués',
      description: 'Vos résultats ont été mis à jour',
    });
    
    search('', {
      minPrice: filters.priceRange[0],
      maxPrice: filters.priceRange[1],
      category: filters.categories.length ? filters.categories[0] : undefined
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        <div className="kiwiiz-container py-8">
          {/* En-tête et navigation */}
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-kiwiiz-primary transition-colors mb-2 group">
              <ChevronLeft className="h-5 w-5 mr-1 group-hover:transform group-hover:-translate-x-1 transition-transform" />
              <span>Retour à l'accueil</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Résultats de recherche</h1>
            
            {/* Récapitulatif de recherche */}
            <div className="flex flex-wrap items-center gap-2 text-gray-600 bg-white p-3 rounded-md shadow-sm">
              <SearchIcon className="h-4 w-4 text-kiwiiz-primary" />
              <span className="font-medium">Recherche:</span>
              <span className="bg-kiwiiz-light px-2 py-0.5 rounded-full text-kiwiiz-dark">
                {new URLSearchParams(locationRouter.search).get('q') || 'Toutes les annonces'}
              </span>
            </div>
          </div>
          
          {/* Filters section with better styling */}
          <div className="mb-6 bg-white rounded-lg shadow-md p-5">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Filter className="h-5 w-5 mr-2 text-kiwiiz-primary" />
              Affiner votre recherche
            </h2>
            <SearchFilters onFiltersChange={handleApplyFilters} />
          </div>
          
          {/* Résultats with improved header */}
          <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
            <div>
              <p className="text-gray-600 font-medium">
                {loading ? (
                  <span className="flex items-center">
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Recherche en cours...
                  </span>
                ) : (
                  `${results.length} résultat${results.length > 1 ? 's' : ''} trouvé${results.length > 1 ? 's' : ''}`
                )}
              </p>
            </div>
            
            {/* View mode toggle with improved design */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-kiwiiz-primary text-white' : 'bg-transparent text-gray-600'}
              >
                <List className="h-4 w-4 mr-1" />
                Liste
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className={viewMode === 'map' ? 'bg-kiwiiz-primary text-white' : 'bg-transparent text-gray-600'}
              >
                <Map className="h-4 w-4 mr-1" />
                Carte
              </Button>
            </div>
          </div>
          
          {/* Results display with animations */}
        {loading ? (
            // Enhanced loading skeleton
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden shadow-md">
                  <div className="bg-gray-200 animate-pulse h-48 w-full"></div>
                  <div className="p-4 bg-white space-y-2">
                    <div className="bg-gray-200 animate-pulse h-6 w-3/4 rounded"></div>
                    <div className="bg-gray-200 animate-pulse h-4 w-1/2 rounded"></div>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="bg-gray-200 animate-pulse h-4 w-4 rounded-full"></div>
                      <div className="bg-gray-200 animate-pulse h-4 w-1/4 rounded"></div>
                    </div>
                    <div className="bg-gray-200 animate-pulse h-5 w-1/4 rounded mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : viewMode === 'list' ? (
            results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((listing) => (
                  <div key={listing.id} className="transform hover:-translate-y-1 transition-all duration-300">
                    <ListingCard
                      id={listing.id}
                      title={listing.title}
                  price={listing.price}
                  priceUnit={listing.price_unit}
                  imageUrl={listing.image_urls?.[0] || '/placeholder.svg'}
                  location={listing.location}
                  category={listing.category_id}
                  rating={4.5}
                  distance={2}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <div className="mb-4 bg-kiwiiz-light p-4 rounded-full inline-flex items-center justify-center">
                  <Filter className="h-12 w-12 text-kiwiiz-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h2>
                <p className="text-gray-600 mb-6">Essayez de modifier vos critères de recherche</p>
                <Link to="/" className="kiwiiz-btn-primary inline-block hover:shadow-md transition-shadow">
                  Retour à l'accueil
                </Link>
              </div>
            )
          ) : (
            // Enhanced map placeholder
            <div className="bg-white rounded-lg shadow-md h-96 flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <Map className="h-12 w-12 text-kiwiiz-primary mx-auto mb-4" />
                <p className="text-gray-700 font-medium">Carte interactive</p>
                <p className="text-gray-500 text-sm max-w-md mx-auto mt-2">
                  La vue carte sera bientôt disponible. Elle vous permettra de visualiser les annonces géographiquement.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4 border-kiwiiz-primary text-kiwiiz-primary hover:bg-kiwiiz-light"
                >
                  Revenir en vue liste
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResults;
