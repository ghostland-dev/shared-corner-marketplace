
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
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with improved hover effect */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center group-hover:scale-105 transition-all duration-200">
              <span className="text-primary-foreground font-bold text-base sm:text-lg">K</span>
            </div>
            <span className="text-lg sm:text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors duration-200">
              Kiwiiz
            </span>
          </Link>

          {/* Search input - responsive */}
          <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 pl-10 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder="Rechercher un objet, un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </form>
          </div>

          {/* Desktop Navigation - improved spacing */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm" className="hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-1">
                <Home className="h-4 w-4" />
                <span className="hidden xl:inline">Accueil</span>
              </Button>
            </Link>
            <Link to="/categories">
              <Button variant="ghost" size="sm" className="hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-1">
                <Grid3X3 className="h-4 w-4" />
                <span className="hidden xl:inline">Catégories</span>
              </Button>
            </Link>
            <Link to="/aide">
              <Button variant="ghost" size="sm" className="hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-1">
                <HelpCircle className="h-4 w-4" />
                <span className="hidden xl:inline">Aide</span>
              </Button>
            </Link>
            {user && (
              <>
                <NotificationDropdown className="hover:bg-accent hover:text-accent-foreground" />
                <Link to="/messages">
                  <Button variant="ghost" size="sm" className="hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span className="hidden xl:inline">Messages</span>
                  </Button>
                </Link>
              </>
            )}
            <Link to="/deposer-annonce">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105 flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Déposer</span>
                <span className="hidden lg:inline">une annonce</span>
              </Button>
            </Link>
            {!user ? (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span className="hidden xl:inline">Connexion</span>
                </Button>
              </Link>
            ) : (
              <UserProfileMenu />
            )}
          </div>

          {/* Tablet Navigation - medium screens */}
          <div className="hidden md:flex lg:hidden items-center gap-2">
            {user && <NotificationDropdown className="hover:bg-accent" />}
            <Link to="/deposer-annonce">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
            {!user ? (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <UserProfileMenu />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hover:bg-accent"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {user && <NotificationDropdown className="hover:bg-accent" />}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hover:bg-accent transition-colors"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 transition-transform duration-200 rotate-0" />
              ) : (
                <Menu className="h-5 w-5 transition-transform duration-200" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search - responsive spacing */}
        <div className="md:hidden pb-3 pt-1">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-2 pl-10 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile menu with improved animations */}
      <div 
        className={`md:hidden lg:hidden absolute w-full bg-background/95 backdrop-blur border-t border-border shadow-lg transition-all duration-300 ease-in-out z-40 ${
          mobileMenuOpen 
            ? 'opacity-100 translate-y-0 visible' 
            : 'opacity-0 -translate-y-2 invisible'
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col space-y-2">
            <Link 
              to="/"
              className="flex items-center px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4 mr-3 text-primary" />
              Accueil
            </Link>
            <Link 
              to="/categories" 
              className="flex items-center px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Grid3X3 className="h-4 w-4 mr-3 text-primary" />
              Catégories
            </Link>
            <Link 
              to="/aide" 
              className="flex items-center px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <HelpCircle className="h-4 w-4 mr-3 text-primary" />
              Aide
            </Link>
            {user && (
              <Link 
                to="/messages"
                className="flex items-center px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MessageCircle className="h-4 w-4 mr-3 text-primary" />
                Messages
              </Link>
            )}
            
            <div className="pt-2 border-t border-border">
              <Link 
                to="/deposer-annonce" 
                className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Déposer une annonce
              </Link>
            </div>

            {!user ? (
              <Link 
                to="/auth" 
                className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium border border-primary text-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-4 w-4 mr-2" />
                Connexion
              </Link>
            ) : (
              <div className="flex items-center px-3 py-2 text-sm font-medium text-foreground border border-border rounded-md bg-muted">
                <User className="h-4 w-4 mr-2 text-primary" />
                <span className="truncate">{user.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
