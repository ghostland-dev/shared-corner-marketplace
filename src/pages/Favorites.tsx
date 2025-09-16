import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Star, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Listing } from '@/types/supabase';

type ListingWithProfile = Listing & {
  profiles?: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
};

type Favorite = {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listing: ListingWithProfile;
};

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadFavorites();
  }, [user, navigate]);

  const loadFavorites = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          listing:listings (
            *,
            profiles:owner_id (
              username,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFavorites(data || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos favoris",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setFavorites(favorites.filter(f => f.id !== favoriteId));
      
      toast({
        title: "Supprimé des favoris",
        description: "L'annonce a été retirée de vos favoris",
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le favori",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mes favoris</h1>
          <p className="text-muted-foreground">
            {favorites.length} annonce{favorites.length !== 1 ? 's' : ''} sauvegardée{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p>Chargement de vos favoris...</p>
          </div>
        ) : favorites.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Aucun favori</h3>
              <p className="text-muted-foreground mb-6">
                Vous n'avez pas encore sauvegardé d'annonces. Parcourez les annonces et cliquez sur le cœur pour les ajouter à vos favoris !
              </p>
              <Button onClick={() => navigate('/')}>
                Parcourir les annonces
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <Card key={favorite.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={favorite.listing.image_urls?.[0] || '/placeholder.svg'}
                    alt={favorite.listing.title}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => navigate(`/annonces/${favorite.listing.id}`)}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={() => removeFavorite(favorite.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-black/50 text-white border-none">
                      {favorite.listing.price}€/{favorite.listing.price_unit}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 
                    className="font-semibold text-lg mb-2 cursor-pointer hover:text-primary"
                    onClick={() => navigate(`/annonces/${favorite.listing.id}`)}
                  >
                    {favorite.listing.title}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    {favorite.listing.location}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {favorite.listing.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {favorite.listing.profiles && (
                        <div className="flex items-center gap-1 text-sm">
                          <img
                            src={favorite.listing.profiles.avatar_url || '/placeholder.svg'}
                            alt="Propriétaire"
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-muted-foreground">
                            {favorite.listing.profiles.full_name || favorite.listing.profiles.username}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>4.8</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-4" 
                    onClick={() => navigate(`/annonces/${favorite.listing.id}`)}
                  >
                    Voir l'annonce
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Favorites;