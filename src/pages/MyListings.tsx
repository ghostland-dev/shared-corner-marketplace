import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  MoreHorizontal, 
  MapPin, 
  Calendar,
  DollarSign,
  Heart,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useListingMutation } from '@/hooks/listing/useListingMutation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type ListingWithStats = {
  id: string;
  title: string;
  description: string;
  price: number;
  price_unit: string;
  location: string;
  image_urls: string[];
  is_available: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  reservations_count?: number;
  total_earnings?: number;
  average_rating?: number;
  reviews_count?: number;
};

const MyListings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { deleteListing, loading: mutationLoading } = useListingMutation();
  const { toast } = useToast();
  const [listings, setListings] = useState<ListingWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadMyListings();
  }, [user, navigate]);

  const loadMyListings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Charger les annonces avec les statistiques
      const { data: listingsData, error } = await supabase
        .from('listings')
        .select(`
          *,
          reservations (
            id,
            total_amount,
            status
          ),
          reviews (
            id,
            rating
          )
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculer les statistiques pour chaque annonce
      const listingsWithStats: ListingWithStats[] = (listingsData || []).map((listing: any) => {
        const reservations = listing.reservations || [];
        const reviews = listing.reviews || [];
        
        const reservations_count = reservations.length;
        const total_earnings = reservations
          .filter((r: any) => r.status === 'completed')
          .reduce((sum: number, r: any) => sum + r.total_amount, 0);
        
        const reviews_count = reviews.length;
        const average_rating = reviews_count > 0
          ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews_count
          : 0;

        return {
          ...listing,
          reservations_count,
          total_earnings,
          average_rating,
          reviews_count
        };
      });

      setListings(listingsWithStats);
    } catch (error) {
      console.error('Error loading listings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos annonces",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async () => {
    if (!listingToDelete) return;

    const result = await deleteListing(listingToDelete);
    if (result.success) {
      setListings(listings.filter(l => l.id !== listingToDelete));
      setDeleteDialogOpen(false);
      setListingToDelete(null);
    }
  };

  const toggleAvailability = async (listingId: string, currentAvailability: boolean) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ is_available: !currentAvailability })
        .eq('id', listingId)
        .eq('owner_id', user?.id);

      if (error) throw error;

      setListings(listings.map(l => 
        l.id === listingId ? { ...l, is_available: !currentAvailability } : l
      ));

      toast({
        title: "Statut mis à jour",
        description: `Annonce ${!currentAvailability ? 'activée' : 'désactivée'} avec succès`,
      });
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mes annonces</h1>
            <p className="text-muted-foreground">
              Gérez vos {listings.length} annonces publiées
            </p>
          </div>
          <Button onClick={() => navigate('/deposer-annonce')}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle annonce
          </Button>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Annonces actives</p>
                  <p className="text-2xl font-bold">
                    {listings.filter(l => l.is_available).length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Vues totales</p>
                  <p className="text-2xl font-bold">
                    {listings.reduce((sum, l) => sum + l.views, 0)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Réservations</p>
                  <p className="text-2xl font-bold">
                    {listings.reduce((sum, l) => sum + (l.reservations_count || 0), 0)}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gains totaux</p>
                  <p className="text-2xl font-bold">
                    {listings.reduce((sum, l) => sum + (l.total_earnings || 0), 0).toFixed(2)}€
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des annonces */}
        {loading ? (
          <div className="text-center py-12">
            <p>Chargement de vos annonces...</p>
          </div>
        ) : listings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Aucune annonce</h3>
              <p className="text-muted-foreground mb-6">
                Vous n'avez pas encore créé d'annonce. Commencez par publier votre première annonce !
              </p>
              <Button onClick={() => navigate('/deposer-annonce')}>
                <Plus className="w-4 h-4 mr-2" />
                Créer ma première annonce
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="w-full md:w-48 h-48 bg-gray-100">
                      <img
                        src={listing.image_urls?.[0] || '/placeholder.svg'}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {listing.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {listing.price}€/{listing.price_unit}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={listing.is_available ? "default" : "secondary"}>
                              {listing.is_available ? "Active" : "Inactive"}
                            </Badge>
                            {listing.reviews_count > 0 && (
                              <Badge variant="outline">
                                ⭐ {listing.average_rating?.toFixed(1)} ({listing.reviews_count})
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/annonces/${listing.id}`)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Voir l'annonce
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/annonces/${listing.id}/modifier`)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => toggleAvailability(listing.id, listing.is_available)}
                            >
                              <Heart className="w-4 h-4 mr-2" />
                              {listing.is_available ? 'Désactiver' : 'Activer'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                setListingToDelete(listing.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Statistiques */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium">{listing.views}</p>
                          <p className="text-muted-foreground">Vues</p>
                        </div>
                        <div>
                          <p className="font-medium">{listing.reservations_count || 0}</p>
                          <p className="text-muted-foreground">Réservations</p>
                        </div>
                        <div>
                          <p className="font-medium">{(listing.total_earnings || 0).toFixed(2)}€</p>
                          <p className="text-muted-foreground">Gains</p>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mt-4">
                        Créée le {format(new Date(listing.created_at), 'dd MMMM yyyy', { locale: fr })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'annonce</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.
              Toutes les réservations associées seront également supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteListing}
              disabled={mutationLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {mutationLoading ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
};

export default MyListings;