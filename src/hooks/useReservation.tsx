
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Reservation {
  listingId: string;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
}

export const useReservation = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Créer une nouvelle réservation
  const createReservation = async (reservation: Omit<Reservation, 'status'>) => {
    setIsLoading(true);

    try {
      // Simuler un appel à l'API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const newReservation: Reservation = {
        ...reservation,
        status: 'pending',
      };
      
      setReservations([...reservations, newReservation]);
      
      toast({
        title: "Demande envoyée",
        description: "Votre demande de réservation a été envoyée au propriétaire",
      });
      
      return newReservation;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la réservation",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Annuler une réservation
  const cancelReservation = async (listingId: string) => {
    setIsLoading(true);

    try {
      // Simuler un appel à l'API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const updatedReservations = reservations.map(reservation => 
        reservation.listingId === listingId 
          ? { ...reservation, status: 'cancelled' as const } 
          : reservation
      );
      
      setReservations(updatedReservations);
      
      toast({
        title: "Réservation annulée",
        description: "Votre réservation a été annulée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la réservation",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer les réservations de l'utilisateur (simulé)
  const getUserReservations = async () => {
    setIsLoading(true);
    
    try {
      // Simuler un appel à l'API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return reservations;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer vos réservations",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createReservation,
    cancelReservation,
    getUserReservations,
    isLoading,
    reservations,
  };
};
