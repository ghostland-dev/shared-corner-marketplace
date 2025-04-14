
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Star, MapPin, Calendar, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { listings } from '@/data/mockData';

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedDates, setSelectedDates] = useState<Date | undefined>(new Date());
  
  // Récupération de l'annonce par son ID
  const listing = listings.find(item => item.id === id);
  
  // Redirection vers 404 si l'annonce n'est pas trouvée
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="kiwiiz-container py-8">
          {/* Retour */}
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-kiwiiz-primary mb-6">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Retour aux résultats</span>
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Image principale */}
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="w-full h-96 object-cover"
                />
              </div>
              
              {/* Titre et informations principales */}
              <div className="mb-8">
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-bold">{listing.title}</h1>
                  <div className="flex items-center">
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-y-2">
                  <Badge className="bg-kiwiiz-primary text-white mr-3">
                    {listing.category}
                  </Badge>
                  <div className="flex items-center text-sm mr-3">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{listing.location}</span>
                    <span className="ml-1 text-kiwiiz-primary font-medium">
                      ({listing.distance} km)
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 mr-1 text-yellow-400" />
                    <span>{listing.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="mt-3 text-xl font-semibold text-kiwiiz-primary">
                  {listing.price.toFixed(2)}€ <span className="text-sm text-gray-500 font-normal">/ {listing.priceUnit}</span>
                </div>
              </div>
              
              {/* Onglets d'information */}
              <Tabs defaultValue="description" className="mb-8">
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="localisation">Localisation</TabsTrigger>
                  <TabsTrigger value="regles">Règles</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-4">
                  <p className="text-gray-700 leading-relaxed">
                    {listing.description}
                  </p>
                </TabsContent>
                <TabsContent value="localisation" className="mt-4">
                  <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">Carte de localisation (approximative)</p>
                  </div>
                </TabsContent>
                <TabsContent value="regles" className="mt-4">
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Caution demandée : équivalente à la valeur du bien</li>
                    <li>Annulation gratuite jusqu'à 24h avant</li>
                    <li>Pièce d'identité obligatoire pour la remise</li>
                    <li>Le bien doit être rendu dans l'état initial</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar - Formulaire de réservation et profil du propriétaire */}
            <div>
              {/* Formulaire de réservation */}
              <div className="kiwiiz-card p-6 mb-8">
                <h3 className="font-bold text-lg mb-4">Réserver</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <div className="border rounded-md p-3">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDates}
                      onSelect={setSelectedDates}
                      className="mx-auto"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{listing.price.toFixed(2)}€ x 1 {listing.priceUnit}</span>
                    <span>{listing.price.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de service</span>
                    <span>{(listing.price * 0.1).toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assurance</span>
                    <span>Incluse</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{(listing.price * 1.1).toFixed(2)}€</span>
                  </div>
                  
                  <Button className="kiwiiz-btn-primary w-full">
                    <Calendar className="mr-2 h-5 w-5" />
                    Réserver
                  </Button>
                  <Button variant="outline" className="w-full border-kiwiiz-primary text-kiwiiz-primary">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Contacter le propriétaire
                  </Button>
                </div>
              </div>
              
              {/* Profil du propriétaire */}
              <div className="kiwiiz-card p-6">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-full mr-4 flex items-center justify-center text-xl font-bold">
                    {listing.owner.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold">{listing.owner.name}</h3>
                    <p className="text-sm text-gray-500">Membre depuis {listing.owner.memberSince}</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>{listing.owner.rating} sur 5</span>
                </div>
                <Button variant="outline" className="w-full border-gray-300 text-gray-700">
                  Voir le profil
                </Button>
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
