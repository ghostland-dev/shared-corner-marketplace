import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface ReservationWithDetails {
  id: string;
  listing_id: string;
  renter_id: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  message?: string;
  created_at: string;
  updated_at: string;
  listing?: {
    id: string;
    title: string;
    owner_id: string;
    price: number;
    image_urls: string[];
  };
  renter?: {
    id: string;
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
  payments?: any[];
}

export const useReservationsCRUD = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reservations, setReservations] = useState<ReservationWithDetails[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les réservations de l'utilisateur (en tant que locataire)
  const loadMyReservations = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          listing:listings(id, title, owner_id, price, image_urls),
          payments(*)
        `)
        .eq('renter_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      console.error('Error loading reservations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les réservations pour les annonces de l'utilisateur (en tant que propriétaire)
  const loadReservationsForMyListings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          listing:listings!inner(id, title, owner_id, price, image_urls),
          renter:profiles!reservations_renter_id_fkey(user_id, full_name, username, avatar_url),
          payments(*)
        `)
        .eq('listing.owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      console.error('Error loading reservations for listings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger toutes les réservations (admin/super admin)
  const loadAllReservations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          listing:listings(id, title, owner_id, price, image_urls),
          renter:profiles!reservations_renter_id_fkey(user_id, full_name, username, avatar_url),
          payments(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      console.error('Error loading all reservations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle réservation
  const createReservation = async (reservationData: {
    listing_id: string;
    start_date: string;
    end_date: string;
    total_amount: number;
    message?: string;
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert([{
          ...reservationData,
          renter_id: user.id,
          status: 'pending',
        }])
        .select(`
          *,
          listing:listings(id, title, owner_id, price, image_urls)
        `)
        .single();

      if (error) throw error;

      toast({
        title: "Réservation créée",
        description: "Votre demande de réservation a été envoyée",
      });

      setReservations(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la réservation",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Mettre à jour le statut d'une réservation
  const updateReservationStatus = async (
    reservationId: string, 
    status: ReservationWithDetails['status']
  ) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', reservationId)
        .select()
        .single();

      if (error) throw error;

      const statusMessages = {
        approved: 'Réservation approuvée',
        rejected: 'Réservation rejetée',
        completed: 'Réservation terminée',
        cancelled: 'Réservation annulée',
        pending: 'Réservation en attente',
      };

      toast({
        title: "Statut mis à jour",
        description: statusMessages[status],
      });

      setReservations(prev => prev.map(r => 
        r.id === reservationId ? { ...r, status } : r
      ));

      return data;
    } catch (error) {
      console.error('Error updating reservation status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Approuver une réservation
  const approveReservation = async (reservationId: string) => {
    return await updateReservationStatus(reservationId, 'approved');
  };

  // Rejeter une réservation
  const rejectReservation = async (reservationId: string) => {
    return await updateReservationStatus(reservationId, 'rejected');
  };

  // Marquer une réservation comme terminée
  const completeReservation = async (reservationId: string) => {
    return await updateReservationStatus(reservationId, 'completed');
  };

  // Annuler une réservation
  const cancelReservation = async (reservationId: string) => {
    return await updateReservationStatus(reservationId, 'cancelled');
  };

  // Supprimer une réservation (admin/super admin seulement)
  const deleteReservation = async (reservationId: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', reservationId);

      if (error) throw error;

      toast({
        title: "Réservation supprimée",
        description: "La réservation a été supprimée avec succès",
      });

      setReservations(prev => prev.filter(r => r.id !== reservationId));
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la réservation",
        variant: "destructive",
      });
    }
  };

  // Calculer les statistiques des réservations
  const getReservationStats = () => {
    const stats = {
      total: reservations.length,
      pending: reservations.filter(r => r.status === 'pending').length,
      approved: reservations.filter(r => r.status === 'approved').length,
      rejected: reservations.filter(r => r.status === 'rejected').length,
      completed: reservations.filter(r => r.status === 'completed').length,
      cancelled: reservations.filter(r => r.status === 'cancelled').length,
      totalRevenue: reservations
        .filter(r => r.status === 'completed')
        .reduce((sum, r) => sum + Number(r.total_amount), 0)
    };

    return stats;
  };

  return {
    reservations,
    loading,
    loadMyReservations,
    loadReservationsForMyListings,
    loadAllReservations,
    createReservation,
    updateReservationStatus,
    approveReservation,
    rejectReservation,
    completeReservation,
    cancelReservation,
    deleteReservation,
    getReservationStats,
  };
};