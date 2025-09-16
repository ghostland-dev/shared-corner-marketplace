import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronLeft, Star, MapPin, Calendar, Clock, Shield, MessageSquare, Heart, Share2, Flag, Eye, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ContactOwnerButton } from '@/components/ContactOwnerButton';
import { FavoriteButton } from '@/components/FavoriteButton';
import { ReservationForm } from '@/components/ReservationForm';
import { ReviewsSection } from '@/components/ReviewsSection';
import { useListingDetail } from '@/hooks/listing/useListingDetail';
import { Listing } from '@/types/supabase';
import { categories } from '@/data/categories';
import { listings as mockListings } from '@/data/listings';

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchListing, loading } = useListingDetail();
  const [listing, setListing] = useState<Listing | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    if (id) {
      loadListing(id);
    }
  }, [id]);

  const isValidUUID = (val: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

  const mapMockToListing = (mock: any): Listing => ({
    id: mock.id,
    title: mock.title,
    description: mock.description,
    price: mock.price,
    price_unit: mock.priceUnit,
    location: mock.location,
    category_id: mock.categoryId,
    owner_id: mock.owner?.id || 'mock-owner-id',
    image_urls: mock.imageUrl ? [mock.imageUrl] : [],
    features: mock.features || [],
    is_available: true,
    views: mock.views || 0,
    created_at: mock.createdAt || new Date().toISOString(),
    updated_at: mock.createdAt || new Date().toISOString(),
  });

  const loadListing = async (listingId: string) => {
    if (!isValidUUID(listingId)) {
      const mock = mockListings.find((m) => m.id === listingId);
      if (mock) {
        setListing(mapMockToListing(mock));
        return;
      }
    }

    const { data, error } = await fetchListing(listingId);
    if (data) {
      setListing(data);
    } else if (error) {
      console.error('Error loading listing:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share && listing) {
      try {
        await navigator.share({
          title: listing.title,
          text: listing.description || '',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié !",
        description: "Le lien a été copié dans le presse-papiers",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Chargement de l'annonce...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Annonce introuvable</h1>
            <p className="mb-6">Cette annonce n'existe pas ou a été supprimée.</p>
            <Link to="/" className="inline-block">
              <Button>Retour à l'accueil</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Trouver la catégorie correspondante
  const category = categories.find(cat => cat.id === listing.category_id);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Images principales */}
        <div className="relative h-[500px] overflow-hidden">
          <img 
            src={listing.image_urls?.[0] || '/placeholder.svg'} 
            alt={listing.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{listing.title}</h1>
            <div className="flex items-center text-white gap-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{listing.location}</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                <span>{listing.views || 0} vues</span>
              </div>
            </div>
          </div>
          <div className="absolute top-4 left-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/')}
              className="bg-white/80 hover:bg-white text-gray-800"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Retour
            </Button>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleShare}
              className="bg-white/80 hover:bg-white text-gray-800"
              aria-label="Partager"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/80 hover:bg-white text-gray-800"
              aria-label="Ajouter aux favoris"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne de gauche - Détails de l'annonce */}
            <div className="lg:col-span-2 space-y-8">
              {/* Prix et badges */}
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-primary">{listing.price}€</span>
                  <span className="text-muted-foreground ml-1">/ {listing.price_unit}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                  <Badge variant="secondary">{category?.name || listing.category_id}</Badge>
                  <Badge variant="outline">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(listing.created_at), 'dd MMM yyyy', { locale: fr })}
                  </Badge>
                  <Badge variant="outline" className="text-green-600">
                    <Shield className="h-3 w-3 mr-1" />
                    {listing.views || 0} vues
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {listing.description || 'Aucune description disponible.'}
                </p>
              </div>

              {/* Caractéristiques */}
              {listing.features && listing.features.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Caractéristiques</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {listing.features.map((feature, index) => (
                      <div key={index} className="flex items-center p-3 bg-secondary rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Images supplémentaires */}
              {listing.image_urls && listing.image_urls.length > 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Photos</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {listing.image_urls.slice(1).map((url, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <img 
                          src={url} 
                          alt={`${listing.title} - Photo ${index + 2}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Informations sur le propriétaire */}
              <div>
                <h2 className="text-xl font-semibold mb-4">À propos du propriétaire</h2>
                <div className="flex items-start p-6 bg-secondary rounded-lg">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={(listing as any).profiles?.avatar_url || (listing as any).owner?.avatar} />
                    <AvatarFallback>
                      <User className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium">
                      {(listing as any).profiles?.full_name || 
                       (listing as any).profiles?.username || 
                       (listing as any).owner?.name || 
                       'Utilisateur'}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Membre depuis {format(new Date(listing.created_at), 'yyyy', { locale: fr })}</span>
                    </div>
                    <ContactOwnerButton
                      listingId={listing.id}
                      ownerId={listing.owner_id}
                      ownerName={(listing as any).profiles?.full_name || (listing as any).owner?.name || 'Propriétaire'}
                      ownerEmail={(listing as any).profiles?.email}
                      ownerPhone={(listing as any).profiles?.phone_number}
                      listingTitle={listing.title}
                      className="w-full sm:w-auto"
                    />
                  </div>
                </div>
              </div>
              
              {/* Section des avis */}
              <ReviewsSection 
                listingId={listing.id} 
                ownerId={listing.owner_id}
                listingTitle={listing.title}
                className="mt-8"
              />
            </div>

            {/* Colonne de droite - Réservation */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-2xl font-bold text-primary">
                        {listing.price}€ <span className="text-base font-normal text-muted-foreground">/ {listing.price_unit}</span>
                      </div>
                      {listing.is_available ? (
                        <Badge className="mt-2 bg-green-500">Disponible</Badge>
                      ) : (
                        <Badge variant="destructive" className="mt-2">Non disponible</Badge>
                      )}
                    </div>
                    
                    {listing.is_available && (
                      <ReservationForm 
                        listingId={listing.id}
                        price={listing.price}
                        priceUnit={listing.price_unit}
                        title={listing.title}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Informations complémentaires */}
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Sécurité
                    </h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                        Identité vérifiée
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                        Paiement sécurisé
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                        Support client 24/7
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4"
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      Signaler cette annonce
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ListingDetail;