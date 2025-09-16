import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

export type Review = {
  id: string;
  listing_id: string;
  reviewer_id: string;
  owner_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_profile?: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
};

export const useReviews = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const loadReviews = async (listingId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer_profile:profiles!reviews_reviewer_id_fkey(
            id, username, full_name, avatar_url
          )
        `)
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les avis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (
    listingId: string,
    ownerId: string,
    rating: number,
    comment?: string
  ): Promise<{ success: boolean; error: any }> => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour laisser un avis",
        variant: "destructive",
      });
      return { success: false, error: new Error('Non authentifié') };
    }

    try {
      // Vérifier que l'utilisateur a bien eu une réservation terminée pour cette annonce
      const { data: reservation, error: reservationError } = await supabase
        .from('reservations')
        .select('id')
        .eq('listing_id', listingId)
        .eq('renter_id', user.id)
        .eq('status', 'completed')
        .maybeSingle();

      if (reservationError) {
        console.error('Error checking reservation:', reservationError);
        toast({
          title: "Erreur",
          description: "Impossible de vérifier vos réservations",
          variant: "destructive",
        });
        return { success: false, error: reservationError };
      }

      if (!reservation) {
        toast({
          title: "Non autorisé",
          description: "Vous ne pouvez laisser un avis que pour les annonces que vous avez réservées",
          variant: "destructive",
        });
        return { success: false, error: new Error('Non autorisé') };
      }

      // Vérifier qu'il n'y a pas déjà un avis
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('listing_id', listingId)
        .eq('reviewer_id', user.id)
        .maybeSingle();

      if (existingReview) {
        toast({
          title: "Avis déjà donné",
          description: "Vous avez déjà laissé un avis pour cette annonce",
          variant: "destructive",
        });
        return { success: false, error: new Error('Avis déjà donné') };
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          listing_id: listingId,
          reviewer_id: user.id,
          owner_id: ownerId,
          rating,
          comment: comment || null
        })
        .select(`
          *,
          reviewer_profile:profiles!reviews_reviewer_id_fkey(
            id, username, full_name, avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Ajouter le nouvel avis à la liste
      setReviews(prev => [data, ...prev]);

      toast({
        title: "Avis publié",
        description: "Votre avis a été publié avec succès",
      });

      return { success: true, error: null };
    } catch (error) {
      console.error('Error creating review:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier votre avis",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const getAverageRating = (listingReviews: Review[]): number => {
    if (listingReviews.length === 0) return 0;
    const sum = listingReviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / listingReviews.length) * 10) / 10;
  };

  const canUserReview = async (listingId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Vérifier qu'il y a une réservation terminée
      const { data: reservation } = await supabase
        .from('reservations')
        .select('id')
        .eq('listing_id', listingId)
        .eq('renter_id', user.id)
        .eq('status', 'completed')
        .maybeSingle();

      if (!reservation) return false;

      // Vérifier qu'il n'y a pas déjà un avis
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('listing_id', listingId)
        .eq('reviewer_id', user.id)
        .maybeSingle();

      return !existingReview;
    } catch (error) {
      console.error('Error checking if user can review:', error);
      return false;
    }
  };

  return {
    reviews,
    loading,
    loadReviews,
    createReview,
    getAverageRating,
    canUserReview
  };
};