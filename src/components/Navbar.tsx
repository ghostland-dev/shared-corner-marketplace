
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, Plus, Home, Grid3X3, HelpCircle, MessageCircle, Bell } from "lucide-react";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileMenu } from '@/components/UserProfileMenu';
import { NotificationDropdown } from '@/components/NotificationDropdown';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`);
      toast({
        title: 'Recherche',
        description: `Recherche de "${searchQuery}"`,
      });
    } else {
      toast({
        title: 'Recherche vide',
        description: 'Veuillez saisir un terme de recherche',
        variant: 'destructive',
      });
    }
  };

  return (
    <nav className="bg-white shadow-md relative z-10">
      <div className="kiwiiz-container">
        <div className="flex justify-between items-center py-4">
          {/* Logo with hover effect */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-full bg-kiwiiz-primary flex items-center justify-center group-hover:shadow-md transition-all">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-2xl font-bold text-kiwiiz-primary group-hover:text-kiwiiz-dark transition-colors">Kiwiiz</span>
          </Link>

          {/* Search input - hidden on mobile */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  className="kiwiiz-input pl-10 focus:ring-kiwiiz-primary focus:border-kiwiiz-primary transition-all"
                  placeholder="Rechercher un objet, un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>
          </div>

          {/* Desktop Navigation - enhanced with icons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" className="text-kiwiiz-dark hover:text-kiwiiz-primary transition-colors flex items-center gap-1">
                <Home className="h-4 w-4" />
                <span>Accueil</span>
              </Button>
            </Link>
            <Link to="/categories">
              <Button variant="ghost" className="text-kiwiiz-dark hover:text-kiwiiz-primary transition-colors flex items-center gap-1">
                <Grid3X3 className="h-4 w-4" />
                <span>Catégories</span>
              </Button>
            </Link>
            <Link to="/aide">
              <Button variant="ghost" className="text-kiwiiz-dark hover:text-kiwiiz-primary transition-colors flex items-center gap-1">
                <HelpCircle className="h-4 w-4" />
                <span>Aide</span>
              </Button>
            </Link>
            {user && (
              <NotificationDropdown className="text-kiwiiz-dark hover:text-kiwiiz-primary" />
            )}
            {user && (
              <Link to="/messages">
                <Button variant="ghost" className="text-kiwiiz-dark hover:text-kiwiiz-primary transition-colors flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>Messages</span>
                </Button>
              </Link>
            )}
            <Link to="/deposer-annonce">
              <Button className="kiwiiz-btn-primary hover:shadow-md transition-all flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Déposer une annonce</span>
              </Button>
            </Link>
            {!user ? (
              <Link to="/auth">
                <Button variant="outline" className="border-kiwiiz-primary text-kiwiiz-primary hover:bg-kiwiiz-light transition-colors flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Connexion</span>
                </Button>
              </Link>
            ) : (
              <UserProfileMenu />
            )}
          </div>

          {/* Mobile menu button with animation */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-kiwiiz-dark hover:text-kiwiiz-primary transition-colors"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
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
                className="kiwiiz-input pl-10 focus:ring-kiwiiz-primary focus:border-kiwiiz-primary transition-all"
                placeholder="Rechercher un objet, un service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile menu with animation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-white border-t border-gray-100 shadow-lg animate-fade-in z-20">
          <div className="kiwiiz-container py-4 flex flex-col space-y-4">
            <Link 
              to="/"
              className="px-4 py-2 hover:bg-gray-50 rounded-md flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5 mr-2 text-kiwiiz-primary" />
              Accueil
            </Link>
            <Link 
              to="/categories" 
              className="px-4 py-2 hover:bg-gray-50 rounded-md flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Grid3X3 className="h-5 w-5 mr-2 text-kiwiiz-primary" />
              Catégories
            </Link>
            <Link 
              to="/comment-ca-marche" 
              className="px-4 py-2 hover:bg-gray-50 rounded-md flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <HelpCircle className="h-5 w-5 mr-2 text-kiwiiz-primary" />
              Comment ça marche
            </Link>
            {user && (
              <Link 
                to="/messages"
                className="px-4 py-2 hover:bg-gray-50 rounded-md flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MessageCircle className="h-5 w-5 mr-2 text-kiwiiz-primary" />
                Messages
              </Link>
            )}
            <Link 
              to="/deposer-annonce" 
              className="kiwiiz-btn-primary text-center flex items-center justify-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Déposer une annonce
            </Link>
            {!user ? (
              <Link 
                to="/auth" 
                className="px-4 py-2 border border-kiwiiz-primary text-kiwiiz-primary text-center rounded-md hover:bg-kiwiiz-light transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-5 w-5 mr-2 inline-block" />
                Connexion
              </Link>
            ) : (
              <div className="px-4 py-2 border border-kiwiiz-primary text-kiwiiz-primary text-center rounded-md">
                <User className="h-5 w-5 mr-2 inline-block" />
                {user.email}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
