import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Star, MessageSquare, User as UserIcon, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useReviews, Review } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { isValidUUID } from '@/lib/utils-app';

interface ReviewsSectionProps {
  listingId: string;
  ownerId: string;
  listingTitle?: string;
  className?: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  listingId,
  ownerId,
  listingTitle,
  className
}) => {
  const { user } = useAuth();
  const { reviews, loading, loadReviews, createReview, getAverageRating, canUserReview } = useReviews();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasCompletedReservation, setHasCompletedReservation] = useState(false);

  useEffect(() => {
    // Vérifier si l'ID est un UUID valide pour Supabase
    if (isValidUUID(listingId)) {
      loadReviews(listingId);
      
      if (user) {
        checkUserReviewEligibility();
      }
    }
  }, [listingId, user]);

  const checkUserReviewEligibility = async () => {
    // Vérifier si l'ID est un UUID valide pour Supabase
    if (!isValidUUID(listingId)) {
      setCanReview(false);
      setHasCompletedReservation(false);
      return;
    }

    const canReviewListing = await canUserReview(listingId);
    setCanReview(canReviewListing);
    
    // Vérifier s'il y a une réservation terminée
    if (user) {
      try {
        const { data } = await supabase
          .from('reservations')
          .select('id')
          .eq('listing_id', listingId)
          .eq('renter_id', user.id)
          .eq('status', 'completed')
          .maybeSingle();
        
        setHasCompletedReservation(!!data);
      } catch (error) {
        console.error('Error checking reservation:', error);
      }
    }
  };

  const handleSubmitReview = async () => {
    if (!user) return;

    setSubmitting(true);
    const result = await createReview(listingId, ownerId, reviewRating, reviewComment);
    
    if (result.success) {
      setShowReviewForm(false);
      setReviewComment('');
      setReviewRating(5);
      setCanReview(false);
    }
    setSubmitting(false);
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 transition-colors ${
              star <= rating 
                ? 'text-warning fill-current' 
                : 'text-muted-foreground'
            } ${interactive ? 'cursor-pointer hover:text-warning' : ''}`}
            onClick={() => interactive && onRatingChange?.(star)}
          />
        ))}
      </div>
    );
  };

  const averageRating = getAverageRating(reviews);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Avis ({reviews.length})
            </CardTitle>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2">
                {renderStars(Math.round(averageRating))}
                <Badge variant="secondary">
                  {averageRating.toFixed(1)}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Formulaire d'avis */}
          {user && user.id !== ownerId && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              {!hasCompletedReservation ? (
                <div className="text-center py-4">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Vous devez avoir terminé une réservation pour laisser un avis
                  </p>
                </div>
              ) : !canReview ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-success" />
                  <p className="text-sm text-muted-foreground">
                    Vous avez déjà laissé un avis pour cette annonce
                  </p>
                </div>
              ) : !showReviewForm ? (
                <div className="text-center">
                  <Button onClick={() => setShowReviewForm(true)}>
                    <Star className="w-4 h-4 mr-2" />
                    Laisser un avis
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Partagez votre expérience avec cette {listingTitle ? `"${listingTitle}"` : 'annonce'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-medium">Votre avis</h4>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Note</label>
                    {renderStars(reviewRating, true, setReviewRating)}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Commentaire (optionnel)</label>
                    <Textarea
                      placeholder="Partagez votre expérience..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSubmitReview}
                      disabled={submitting}
                    >
                      {submitting ? 'Publication...' : 'Publier l\'avis'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowReviewForm(false)}
                      disabled={submitting}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Liste des avis */}
          {loading ? (
            <div className="text-center py-8">
              <p>Chargement des avis...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Aucun avis pour le moment. Soyez le premier à laisser un avis !
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="flex gap-4 p-4 border rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={review.reviewer_profile?.avatar_url} />
                    <AvatarFallback>
                      {(review.reviewer_profile?.full_name || review.reviewer_profile?.username || 'U')[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {review.reviewer_profile?.full_name || review.reviewer_profile?.username || 'Utilisateur'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(review.created_at), 'dd MMMM yyyy', { locale: fr })}
                        </p>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    
                    {review.comment && (
                      <p className="text-sm">{review.comment}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};