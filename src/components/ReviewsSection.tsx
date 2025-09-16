import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Star, MessageSquare, User as UserIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useReviews, Review } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewsSectionProps {
  listingId: string;
  ownerId: string;
  className?: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  listingId,
  ownerId,
  className
}) => {
  const { user } = useAuth();
  const { reviews, loading, loadReviews, createReview, getAverageRating, canUserReview } = useReviews();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews(listingId);
    
    if (user) {
      canUserReview(listingId).then(setCanReview);
    }
  }, [listingId, user]);

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
          {canReview && user && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              {!showReviewForm ? (
                <Button onClick={() => setShowReviewForm(true)}>
                  Laisser un avis
                </Button>
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