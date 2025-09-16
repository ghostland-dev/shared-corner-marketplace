
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ChevronLeft, Star, MapPin, Calendar, Clock, Shield, MessageSquare, Heart, Share2, Flag } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ContactOwnerButton } from '@/components/ContactOwnerButton';
import { ReservationForm } from '@/components/ReservationForm';
import { listings } from '@/data/listings';

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [duration, setDuration] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Trouver l'annonce correspondante
  const listing = listings.find(item => item.id === id);

  if (!listing) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow kiwiiz-container py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Annonce introuvable</h1>
            <p className="mb-6">Cette annonce n'existe pas ou a été supprimée.</p>
            <Link to="/" className="kiwiiz-btn-primary inline-block">
              Retour à l'accueil
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Retiré des favoris" : "Ajouté aux favoris",
      description: isBookmarked ? 
        "Cette annonce a été retirée de vos favoris" : 
        "Cette annonce a été ajoutée à vos favoris",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
        url: window.location.href,
      }).catch((error) => console.log('Erreur de partage', error));
    } else {
      // Copier le lien dans le presse-papier
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié",
        description: "Le lien de l'annonce a été copié dans le presse-papier",
      });
    }
  };

  const handleDateChange = (dateRange: { from: Date; to?: Date }) => {
    setStartDate(dateRange.from);
    setEndDate(dateRange.to || dateRange.from);
    
    // Calculer la durée
    if (dateRange.from && dateRange.to) {
      const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDuration(diffDays);
    } else {
      setDuration(1);
    }
  };

  const handleContactOwner = () => {
    toast({
      title: "Message envoyé",
      description: `Votre demande a été envoyée à ${listing.owner.name}. Vous recevrez une réponse sous peu.`,
    });
  };

  const handleReportListing = () => {
    toast({
      title: "Annonce signalée",
      description: "Merci pour votre signalement. Notre équipe va examiner cette annonce.",
    });
  };

  const handleBookNow = () => {
    toast({
      title: "Réservation initiée",
      description: "Votre demande de réservation a été envoyée. Veuillez attendre la confirmation du propriétaire.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Image principale */}
        <div className="relative w-full h-72 md:h-96 bg-gray-100 overflow-hidden">
          <img 
            src={listing.imageUrl} 
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
                {listing.distance && (
                  <span className="ml-2 bg-kiwiiz-primary text-white px-2 py-0.5 rounded-full text-xs">
                    {listing.distance < 1 ? (listing.distance * 1000).toFixed(0) + 'm' : listing.distance.toFixed(1) + 'km'}
                  </span>
                )}
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span>{listing.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <div className="absolute top-4 left-4">
            <Link to="/" className="bg-white/80 hover:bg-white text-gray-800 px-3 py-2 rounded-full flex items-center transition shadow-sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Retour</span>
            </Link>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={handleShare}
              className="bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition shadow-sm"
              aria-label="Partager"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button 
              onClick={handleBookmarkToggle}
              className={`${isBookmarked ? 'bg-kiwiiz-primary text-white' : 'bg-white/80 hover:bg-white text-gray-800'} p-2 rounded-full transition shadow-sm`}
              aria-label={isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
        
        <div className="kiwiiz-container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne de gauche - Détails de l'annonce */}
            <div className="lg:col-span-2 space-y-8">
              {/* Prix et badges */}
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-kiwiiz-primary">{listing.price.toFixed(2)}€</span>
                  <span className="text-gray-500 ml-1">/ {listing.priceUnit}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                  <Badge className="bg-kiwiiz-primary">{listing.category}</Badge>
                  <Badge variant="outline">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(listing.createdAt).toLocaleDateString('fr-FR')}
                  </Badge>
                  <Badge variant="outline">
                    <Star className="h-3 w-3 mr-1" />
                    {listing.rentals} locations
                  </Badge>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                  <TabsTrigger value="features" className="flex-1">Caractéristiques</TabsTrigger>
                  <TabsTrigger value="availability" className="flex-1">Disponibilité</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="pt-4">
                  <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
                </TabsContent>
                <TabsContent value="features" className="pt-4">
                  <h3 className="font-medium mb-3">Caractéristiques</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {listing.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <div className="h-2 w-2 bg-kiwiiz-primary rounded-full mr-2"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="availability" className="pt-4">
                  <h3 className="font-medium mb-3">Jours de disponibilité</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                    {Object.entries(listing.availability).map(([day, isAvailable]) => (
                      <div 
                        key={day} 
                        className={`text-center p-2 rounded-lg ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        <div className="capitalize">{day.slice(0, 3)}</div>
                        <div>{isAvailable ? 'Oui' : 'Non'}</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Propriétaire */}
              <div>
                <h2 className="text-xl font-semibold mb-4">À propos du propriétaire</h2>
                <div className="flex items-start">
                  <div className="relative">
                    <img 
                      src={listing.owner.avatar} 
                      alt={listing.owner.name} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 h-4 w-4 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">{listing.owner.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Star className="h-3 w-3 text-yellow-400 mr-1" />
                      <span>{listing.owner.rating} • Membre depuis {listing.owner.memberSince}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Répond en {listing.owner.responseTime} • Taux de réponse {listing.owner.responseRate}%</span>
                    </div>
                    <ContactOwnerButton
                      listingId={listing.id}
                      ownerId={listing.owner.id || 'mock-owner-id'}
                      ownerName={listing.owner.name}
                      className="mt-3 text-kiwiiz-primary border-kiwiiz-primary"
                    />
                  </div>
                </div>
              </div>
              
              {/* Actions supplémentaires */}
              <div className="pt-4 border-t">
                <button onClick={handleReportListing} className="text-gray-500 hover:text-red-500 flex items-center text-sm">
                  <Flag className="h-4 w-4 mr-1" />
                  Signaler cette annonce
                </button>
              </div>
            </div>
            
            {/* Colonne de droite - Réservation */}
            <div className="lg:col-span-1">
              <ReservationForm
                listingId={listing.id}
                price={listing.price}
                priceUnit={listing.priceUnit}
                title={listing.title}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ListingDetail;
