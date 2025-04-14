
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Map, List, Filter } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ListingCard from '@/components/ListingCard';
import SearchFilters from '@/components/SearchFilters';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/hooks/useSearch';

const SearchResults = () => {
  const locationRouter = useLocation();
  const { search, results, isLoading } = useSearch();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  // Récupération des paramètres de requête
  useEffect(() => {
    const params = new URLSearchParams(locationRouter.search);
    const query = params.get('q') || '';
    const category = params.get('category') || '';
    const locationParam = params.get('location') || '';
    
    search({
      query,
      categoryId: category || undefined,
      location: locationParam || undefined
    });
  }, [locationRouter.search, search]);
  
  const handleApplyFilters = (filters: any) => {
    search({
      priceMin: filters.priceRange[0],
      priceMax: filters.priceRange[1],
      maxDistance: filters.distance,
      categoryId: filters.categories.length ? filters.categories[0] : undefined
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="kiwiiz-container py-8">
          {/* En-tête et navigation */}
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-kiwiiz-primary mb-2">
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span>Retour à l'accueil</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Résultats de recherche</h1>
            
            {/* Récapitulatif de recherche */}
            <div className="flex flex-wrap items-center gap-2 text-gray-600">
              {locationRouter.search && (
                <>
                  <MapPin className="h-4 w-4" />
                  {new URLSearchParams(locationRouter.search).get('q') || 'Toutes les annonces'}
                </>
              )}
            </div>
          </div>
          
          {/* Filtres */}
          <SearchFilters onApplyFilters={handleApplyFilters} />
          
          {/* Résultats */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600">
                {isLoading ? (
                  'Recherche en cours...'
                ) : (
                  `${results.length} résultat${results.length > 1 ? 's' : ''} trouvé${results.length > 1 ? 's' : ''}`
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-kiwiiz-primary' : ''}
              >
                <List className="h-4 w-4 mr-1" />
                Liste
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className={viewMode === 'map' ? 'bg-kiwiiz-primary' : ''}
              >
                <Map className="h-4 w-4 mr-1" />
                Carte
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            // Afficher un placeholder de chargement
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden">
                  <div className="bg-gray-200 animate-pulse h-48 w-full"></div>
                  <div className="p-4 space-y-2">
                    <div className="bg-gray-200 animate-pulse h-6 w-3/4 rounded"></div>
                    <div className="bg-gray-200 animate-pulse h-4 w-1/2 rounded"></div>
                    <div className="bg-gray-200 animate-pulse h-4 w-1/4 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : viewMode === 'list' ? (
            results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    id={listing.id}
                    title={listing.title}
                    price={listing.price}
                    priceUnit={listing.priceUnit}
                    imageUrl={listing.imageUrl}
                    location={listing.location}
                    category={listing.category}
                    rating={listing.rating}
                    distance={listing.distance}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mb-4">
                  <Filter className="h-12 w-12 mx-auto text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h2>
                <p className="text-gray-600 mb-6">Essayez de modifier vos critères de recherche</p>
                <Link to="/" className="kiwiiz-btn-primary inline-block">
                  Retour à l'accueil
                </Link>
              </div>
            )
          ) : (
            // Afficher la carte (version simplifiée pour la démo)
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500">Carte interactive - Fonctionnalité à implémenter</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResults;
