import React, { useState, useEffect } from 'react';
import { Star, User, Calendar, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useReviews } from '@/hooks/useReviews';
import { useToast } from '@/hooks/use-toast';
import { safeProp } from '@/lib/safety-utils';

interface ReviewsSectionProps {
  listingId: string;
  ownerId: string;
  listingTitle?: string;
  className?: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ listingId, ownerId, listingTitle, className }) => {
  const { user } = useAuth();
  const { reviews, loading, createReview, loadReviews, getAverageRating } = useReviews();
  const { toast } = useToast();
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    // Charger les avis pour cette annonce
    if (listingId) {
      loadReviews(listingId);
    }
  }, [listingId, loadReviews]);

  const canAddReview = user && user.id !== ownerId;

  const handleSubmitReview = async () => {
    if (!user) return;

    if (newComment.trim().length < 10) {
      toast({
        title: "Commentaire trop court",
        description: "Votre commentaire doit contenir au moins 10 caractères",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await createReview(listingId, ownerId, newRating, newComment.trim());
      setNewComment('');
      setNewRating(5);
      setIsDialogOpen(false);
      toast({
        title: "Avis ajouté",
        description: "Votre avis a été publié avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de publier votre avis",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number, interactive = false, size = 'default') => {
    const starSize = size === 'large' ? 'h-6 w-6' : 'h-4 w-4';
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} cursor-pointer transition-colors ${
              star <= rating 
                ? 'fill-primary text-primary' 
                : 'text-muted-foreground hover:text-primary'
            }`}
            onClick={interactive ? () => setNewRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Avis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="space-y-3">
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-primary text-primary" />
            Avis ({reviews.length})
          </CardTitle>
          
          {canAddReview && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Laisser un avis
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Laisser un avis</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Note</Label>
                    <div className="flex items-center gap-2">
                      {renderStars(newRating, true, 'large')}
                      <span className="text-sm text-muted-foreground">
                        ({newRating}/5)
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="comment">Commentaire</Label>
                    <Textarea
                      id="comment"
                      placeholder="Partagez votre expérience..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={4}
                      maxLength={500}
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {newComment.length}/500 caractères
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={submitting}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSubmitReview}
                    disabled={submitting || newComment.trim().length < 10}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {submitting ? 'Publication...' : 'Publier'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        {reviews.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {renderStars(getAverageRating(reviews))}
              <span className="text-lg font-semibold">{getAverageRating(reviews).toFixed(1)}</span>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {reviews.length} avis
            </Badge>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-3 opacity-50 text-primary" />
            <p>Aucun avis pour le moment</p>
            {canAddReview && (
              <p className="text-sm mt-2">Soyez le premier à laisser un avis !</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={safeProp(review, 'id', '')} className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {safeProp(review, 'reviewer_profile.full_name') || 
                         safeProp(review, 'reviewer_profile.username') || 'Utilisateur'}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(safeProp(review, 'created_at', ''))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {renderStars(safeProp(review, 'rating', 0))}
                  </div>
                </div>
                
                {safeProp(review, 'comment') && (
                  <p className="text-sm leading-relaxed ml-13">
                    {safeProp(review, 'comment', '')}
                  </p>
                )}
                
                <Separator />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};