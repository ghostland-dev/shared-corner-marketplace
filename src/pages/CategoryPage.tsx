
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ListingCard from '@/components/ListingCard';
import { SearchFilters } from '@/components/SearchFilters';
import { categories, listings } from '@/data/mockData';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [filters, setFilters] = useState({});
  
  // Récupérer la catégorie actuelle
  const currentCategory = categories.find(cat => cat.id === categoryId);
  
  // Filtrer les annonces par catégorie
  const categoryListings = listings.filter(item => item.categoryId === categoryId);
  
  if (!currentCategory) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow kiwiiz-container py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Catégorie introuvable</h1>
            <p className="mb-6">Cette catégorie n'existe pas.</p>
            <Link to="/" className="kiwiiz-btn-primary inline-block">
              Retour à l'accueil
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    console.log("Filtres appliqués:", newFilters);
    // Ici, vous pourriez implémenter la logique de filtrage réelle
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="kiwiiz-container py-8">
          {/* Retour et titre */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <Link to="/categories" className="inline-flex items-center text-gray-600 hover:text-kiwiiz-primary mb-2">
                <ChevronLeft className="h-5 w-5 mr-1" />
                <span>Toutes les catégories</span>
              </Link>
              <h1 className="text-3xl font-bold flex items-center">
                <div 
                  className={`w-10 h-10 ${currentCategory.color} rounded-full flex items-center justify-center mr-3`}
                >
                  <currentCategory.icon className="text-white h-5 w-5" />
                </div>
                {currentCategory.name}
              </h1>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-600">
                {categoryListings.length} annonce{categoryListings.length > 1 ? 's' : ''} disponible{categoryListings.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          {/* Filtres */}
          <SearchFilters onFiltersChange={handleApplyFilters} />
          
          {/* Liste des annonces */}
          {categoryListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryListings.map((listing) => (
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
              <p className="text-xl mb-4">Aucune annonce disponible dans cette catégorie</p>
              <Link to="/" className="kiwiiz-btn-primary inline-block">
                Explorer d'autres catégories
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
