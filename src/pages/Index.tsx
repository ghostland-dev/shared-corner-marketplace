
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import ListingCard from '@/components/ListingCard';
import HowItWorks from '@/components/HowItWorks';
import { categories, listings, testimonials } from '@/data/mockData';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  // On prend quelques annonces pour la page d'accueil
  const featuredListings = listings.slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.append('q', searchQuery.trim());
    }
    
    if (location.trim()) {
      params.append('location', location.trim());
    }
    
    navigate(`/recherche?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-20">
          <div className="kiwiiz-container">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Louez ce dont vous avez besoin, près de chez vous
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                Économisez de l'argent et rencontrez vos voisins en louant des objets et services du quotidien
              </p>
              
              <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-lg flex flex-col sm:flex-row items-stretch gap-2">
                <div className="relative flex-grow">
                  <Input 
                    type="text" 
                    placeholder="Que cherchez-vous ?" 
                    className="pl-10 bg-gray-50 h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                <div className="relative flex-grow">
                  <Input 
                    type="text" 
                    placeholder="Où ? (ville, code postal)" 
                    className="pl-10 bg-gray-50 h-12"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 sm:w-auto w-full">
                  Rechercher
                </Button>
              </form>
            </div>
          </div>
        </section>
        
        {/* Categories */}
        <section className="py-16">
          <div className="kiwiiz-container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Catégories populaires</h2>
              <Link to="/categories" className="text-primary font-medium flex items-center hover:underline">
                Voir toutes <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
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
        </section>
        
        {/* Featured listings */}
        <section className="py-10 bg-muted/30">
          <div className="kiwiiz-container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Découvrez près de chez vous</h2>
              <Link to="/recherche" className="text-primary font-medium flex items-center hover:underline">
                Voir tout <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredListings.map((listing) => (
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
          </div>
        </section>
        
        {/* How it works */}
        <HowItWorks />
        
        {/* Testimonials */}
        <section className="py-16">
          <div className="kiwiiz-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">Ce que disent nos utilisateurs</h2>
              <p className="text-gray-600 max-w-lg mx-auto">
                Rejoignez des milliers d'utilisateurs satisfaits qui utilisent Kiwiiz au quotidien
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="kiwiiz-card p-6">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  
                  <div className="font-medium">
                    {testimonial.name}
                    <span className="text-gray-500 ml-1">• {testimonial.location}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/recherche">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Commencer dès maintenant
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="kiwiiz-container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Vous avez des objets qui prennent la poussière ?</h2>
              <p className="text-lg mb-8 opacity-90">
                Louez-les sur Kiwiiz et transformez-les en une source de revenu. C'est simple, rapide et sans engagement.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-background text-foreground hover:bg-background/90">
                  <Calendar className="mr-2 h-5 w-5" />
                  Créer un compte
                </Button>
                <Link to="/deposer-annonce">
                  <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    Déposer une annonce
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
