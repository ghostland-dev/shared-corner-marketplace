import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Clock, DollarSign, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useReservations } from '@/hooks/useReservations';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type ReservationWithDetails = {
  id: string;
  listing_id: string;
  renter_id: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  message: string | null;
  created_at: string;
  listing: {
    id: string;
    title: string;
    image_urls: string[];
    price: number;
    price_unit: string;
    owner_id: string;
  };
  renter_profile?: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
};

const MyReservations = () => {
  const { user } = useAuth();
  const { updateReservationStatus, loading } = useReservations();
  const { toast } = useToast();
  const [myReservations, setMyReservations] = useState<ReservationWithDetails[]>([]);
  const [receivedReservations, setReceivedReservations] = useState<ReservationWithDetails[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      loadReservations();
    }
  }, [user]);

  const loadReservations = async () => {
    if (!user) return;

    setLoadingData(true);
    try {
      // Mes réservations (en tant que locataire)
      const { data: myRes, error: myError } = await supabase
        .from('reservations')
        .select(`
          *,
          listing:listings(
            id, title, image_urls, price, price_unit, owner_id
          )
        `)
        .eq('renter_id', user.id)
        .order('created_at', { ascending: false });

      if (myError) throw myError;

      // Réservations reçues (en tant que propriétaire)
      const { data: receivedRes, error: receivedError } = await supabase
        .from('reservations')
        .select(`
          *,
          listing:listings(
            id, title, image_urls, price, price_unit, owner_id
          ),
          renter_profile:profiles!reservations_renter_id_fkey(
            id, username, full_name, avatar_url
          )
        `)
        .eq('listing.owner_id', user.id)
        .order('created_at', { ascending: false });

      if (receivedError) throw receivedError;

      setMyReservations(myRes || []);
      setReceivedReservations(receivedRes || []);
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleStatusUpdate = async (reservationId: string, status: 'confirmed' | 'cancelled') => {
    const result = await updateReservationStatus(reservationId, status);
    if (result.success) {
      loadReservations(); // Recharger les données
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-orange-600 border-orange-600"><AlertCircle className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-3 h-3 mr-1" />Confirmée</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="w-3 h-3 mr-1" />Annulée</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-blue-600 border-blue-600"><CheckCircle className="w-3 h-3 mr-1" />Terminée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const ReservationCard = ({ reservation, showRenterInfo = false, showActions = false }: {
    reservation: ReservationWithDetails;
    showRenterInfo?: boolean;
    showActions?: boolean;
  }) => (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Image de l'annonce */}
          <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={reservation.listing.image_urls?.[0] || '/placeholder.svg'}
              alt={reservation.listing.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Détails */}
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">{reservation.listing.title}</h3>
              {getStatusBadge(reservation.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(reservation.start_date), 'dd MMM yyyy', { locale: fr })} - {' '}
                  {format(new Date(reservation.end_date), 'dd MMM yyyy', { locale: fr })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>{reservation.total_amount.toFixed(2)}€</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Demandé le {format(new Date(reservation.created_at), 'dd MMM à HH:mm', { locale: fr })}</span>
              </div>
            </div>

            {showRenterInfo && reservation.renter_profile && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={reservation.renter_profile.avatar_url || ''} />
                  <AvatarFallback>
                    {(reservation.renter_profile.full_name || reservation.renter_profile.username || 'U')[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">
                    {reservation.renter_profile.full_name || reservation.renter_profile.username}
                  </p>
                  <p className="text-xs text-muted-foreground">Demandeur</p>
                </div>
              </div>
            )}

            {reservation.message && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Message:</p>
                <p className="text-sm text-muted-foreground">{reservation.message}</p>
              </div>
            )}

            {showActions && reservation.status === 'pending' && (
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Accepter
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                  disabled={loading}
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Refuser
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Accès non autorisé</h1>
          <p className="mb-6">Vous devez être connecté pour voir vos réservations.</p>
          <Button onClick={() => window.location.href = '/auth'}>
            Se connecter
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Mes réservations</h1>
          <p className="text-muted-foreground">Gérez vos demandes de location et les réservations reçues</p>
        </div>

        <Tabs defaultValue="my-reservations" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="my-reservations" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Mes demandes ({myReservations.length})
            </TabsTrigger>
            <TabsTrigger value="received-reservations" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Demandes reçues ({receivedReservations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-reservations">
            <Card>
              <CardHeader>
                <CardTitle>Mes demandes de réservation</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="text-center py-8">
                    <p>Chargement des réservations...</p>
                  </div>
                ) : myReservations.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Vous n'avez pas encore fait de demande de réservation.</p>
                    <Button className="mt-4" onClick={() => window.location.href = '/'}>
                      Parcourir les annonces
                    </Button>
                  </div>
                ) : (
                  <div>
                    {myReservations.map((reservation) => (
                      <ReservationCard key={reservation.id} reservation={reservation} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="received-reservations">
            <Card>
              <CardHeader>
                <CardTitle>Demandes reçues</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="text-center py-8">
                    <p>Chargement des demandes...</p>
                  </div>
                ) : receivedReservations.length === 0 ? (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Aucune demande de réservation reçue pour le moment.</p>
                    <Button className="mt-4" onClick={() => window.location.href = '/deposer-annonce'}>
                      Créer une annonce
                    </Button>
                  </div>
                ) : (
                  <div>
                    {receivedReservations.map((reservation) => (
                      <ReservationCard
                        key={reservation.id}
                        reservation={reservation}
                        showRenterInfo={true}
                        showActions={true}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default MyReservations;