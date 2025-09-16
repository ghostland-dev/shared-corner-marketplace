import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { useReviews } from '@/hooks/useReviews';
import { useToast } from '@/hooks/use-toast';

interface AddReviewFormProps {
  listingId: string;
  ownerId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddReviewForm = ({ 
  listingId, 
  ownerId, 
  onSuccess, 
  onCancel 
}: AddReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { createReview } = useReviews();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Note requise",
        description: "Veuillez sélectionner une note",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { success } = await createReview(listingId, ownerId, rating, comment.trim() || undefined);
    setLoading(false);

    if (success) {
      setRating(0);
      setComment('');
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-card border rounded-lg">
      <div>
        <h3 className="text-lg font-semibold mb-4">Laisser un avis</h3>
        
        {/* Note avec étoiles */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Note *</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`p-1 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? 'text-yellow-400'
                    : 'text-muted-foreground'
                }`}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star 
                  className="w-6 h-6 fill-current" 
                  aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {rating === 1 && "Très insatisfaisant"}
              {rating === 2 && "Insatisfaisant"}
              {rating === 3 && "Correct"}
              {rating === 4 && "Bien"}
              {rating === 5 && "Excellent"}
            </p>
          )}
        </div>

        {/* Commentaire */}
        <div className="mb-4">
          <Label htmlFor="comment" className="text-sm font-medium mb-2 block">
            Commentaire (optionnel)
          </Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience avec cette location..."
            className="min-h-[100px]"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {comment.length}/500 caractères
          </p>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={loading}
          >
            Annuler
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={rating === 0 || loading}
        >
          {loading ? 'Publication...' : 'Publier l\'avis'}
        </Button>
      </div>
    </form>
  );
};