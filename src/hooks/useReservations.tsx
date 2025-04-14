
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Reservation } from '@/types/supabase';
import { useToast } from './use-toast';

export const useReservations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const createReservation = async (reservationData: {
    listing_id: string;
    start_date: Date;
    end_date: Date;
    total_amount: number;
    message?: string;
  }): Promise<{ data: Reservation | null; error: any }> => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour effectuer une réservation.",
        variant: "destructive",
      });
      return { data: null, error: new Error('Non authentifié') };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert({
          renter_id: user.id,
          listing_id: reservationData.listing_id,
          start_date: reservationData.start_date.toISOString(),
          end_date: reservationData.end_date.toISOString(),
          total_amount: reservationData.total_amount,
          message: reservationData.message,
        })
        .select('*')
        .single();

      if (error) {
        toast({
          title: "Erreur de réservation",
          description: error.message,
          variant: "destructive",
        });
        return { data: null, error };
      }

      // Créer une notification pour le propriétaire
      await supabase
        .from('listings')
        .select('owner_id, title')
        .eq('id', reservationData.listing_id)
        .single()
        .then(({ data: listingData, error: listingError }) => {
          if (!listingError && listingData) {
            supabase.from('notifications').insert({
              user_id: listingData.owner_id,
              title: "Nouvelle demande de réservation",
              message: `Vous avez reçu une nouvelle demande de réservation pour "${listingData.title}"`,
              type: 'reservation',
              related_id: data.id,
            });
          }
        });

      toast({
        title: "Demande envoyée",
        description: "Votre demande de réservation a été envoyée au propriétaire.",
      });

      return { data: data as Reservation, error: null };
    } catch (error) {
      console.error('Error in createReservation:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la demande de réservation.",
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (
    reservationId: string,
    status: 'confirmed' | 'cancelled' | 'completed'
  ): Promise<{ success: boolean; error: any }> => {
    if (!user) {
      return { success: false, error: new Error('Non authentifié') };
    }

    setLoading(true);
    try {
      // Vérifier que l'utilisateur a le droit de modifier cette réservation
      const { data: reservation, error: fetchError } = await supabase
        .from('reservations')
        .select(`
          id,
          renter_id,
          listing_id,
          listings (
            owner_id
          )
        `)
        .eq('id', reservationId)
        .single();

      if (fetchError) {
        toast({
          title: "Erreur",
          description: "Impossible de trouver cette réservation.",
          variant: "destructive",
        });
        return { success: false, error: fetchError };
      }

      // Vérifier que l'utilisateur est soit le locataire, soit le propriétaire
      const canModify = reservation.renter_id === user.id || reservation.listings.owner_id === user.id;
      
      if (!canModify) {
        toast({
          title: "Non autorisé",
          description: "Vous n'êtes pas autorisé à modifier cette réservation.",
          variant: "destructive",
        });
        return { success: false, error: new Error('Non autorisé') };
      }

      // Mettre à jour le statut
      const { error: updateError } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', reservationId);

      if (updateError) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour la réservation.",
          variant: "destructive",
        });
        return { success: false, error: updateError };
      }

      // Créer une notification pour l'autre partie
      const notificationRecipientId = reservation.renter_id === user.id 
        ? reservation.listings.owner_id 
        : reservation.renter_id;

      let notificationTitle, notificationMessage;
      
      if (status === 'confirmed') {
        notificationTitle = "Réservation confirmée";
        notificationMessage = "Votre demande de réservation a été acceptée par le propriétaire.";
      } else if (status === 'cancelled') {
        notificationTitle = "Réservation annulée";
        notificationMessage = "Une réservation a été annulée.";
      } else if (status === 'completed') {
        notificationTitle = "Réservation terminée";
        notificationMessage = "Une réservation est maintenant marquée comme terminée.";
      }

      await supabase.from('notifications').insert({
        user_id: notificationRecipientId,
        title: notificationTitle,
        message: notificationMessage,
        type: 'reservation',
        related_id: reservationId,
      });

      toast({
        title: "Réservation mise à jour",
        description: `La réservation a été ${
          status === 'confirmed' ? 'confirmée' : 
          status === 'cancelled' ? 'annulée' : 'marquée comme terminée'
        } avec succès.`,
      });

      return { success: true, error: null };
    } catch (error) {
      console.error('Error in updateReservationStatus:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour de la réservation.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    createReservation,
    updateReservationStatus,
    loading,
  };
};
