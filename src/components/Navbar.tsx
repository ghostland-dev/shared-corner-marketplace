
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, Plus } from "lucide-react";
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Dans un vrai scénario, vous redirigeriez vers une page de résultats de recherche
      console.log("Recherche pour:", searchQuery);
      // Pour l'instant, naviguer vers les catégories
      navigate('/categories');
    }
  };

  return (
    <nav className="bg-white shadow-md relative z-10">
      <div className="kiwiiz-container">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-kiwiiz-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-2xl font-bold text-kiwiiz-primary">Kiwiiz</span>
          </Link>

          {/* Search input - hidden on mobile */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  className="kiwiiz-input pl-10"
                  placeholder="Rechercher un objet, un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/categories">
              <Button variant="ghost" className="text-kiwiiz-dark">Catégories</Button>
            </Link>
            <Button variant="ghost" className="text-kiwiiz-dark">Comment ça marche</Button>
            <Link to="/deposer-annonce">
              <Button className="kiwiiz-btn-primary flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Déposer une annonce</span>
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" className="border-kiwiiz-primary text-kiwiiz-primary flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Connexion</span>
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-kiwiiz-dark"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search - visible only on mobile */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                className="kiwiiz-input pl-10"
                placeholder="Rechercher un objet, un service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-white border-t border-gray-100 shadow-lg animate-fade-in">
          <div className="kiwiiz-container py-4 flex flex-col space-y-4">
            <Link to="/categories" className="px-4 py-2 hover:bg-gray-50 rounded-md">
              Catégories
            </Link>
            <Link to="/comment-ca-marche" className="px-4 py-2 hover:bg-gray-50 rounded-md">
              Comment ça marche
            </Link>
            <Link to="/deposer-annonce" className="kiwiiz-btn-primary text-center">
              Déposer une annonce
            </Link>
            <Link to="/auth" className="px-4 py-2 border border-kiwiiz-primary text-kiwiiz-primary text-center rounded-md">
              Connexion
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
