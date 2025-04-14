
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import { categories } from '@/data/mockData';

const CategoriesList = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="kiwiiz-container py-8">
          {/* Retour et titre */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-kiwiiz-primary mb-2">
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span>Retour à l'accueil</span>
            </Link>
            <h1 className="text-3xl font-bold">Toutes les catégories</h1>
          </div>
          
          {/* Liste des catégories */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                icon={category.icon}
                color={category.color}
                link={category.link}
              />
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoriesList;
