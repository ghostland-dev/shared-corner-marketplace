import React, { useState } from 'react';
import { Calendar, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useReservations } from '@/hooks/useReservations';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReservationFormProps {
  listingId: string;
  price: number;
  priceUnit: string;
  title: string;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({
  listingId,
  price,
  priceUnit,
  title
}) => {
  const { user } = useAuth();
  const { createReservation, loading } = useReservations();
  const { toast } = useToast();
  
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState(1);

  const handleDateChange = (dateRange: { from: Date; to?: Date }) => {
    setStartDate(dateRange.from);
    setEndDate(dateRange.to || dateRange.from);
    
    // Calculer la durée
    if (dateRange.from && dateRange.to) {
      const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDuration(diffDays);
    } else {
      setDuration(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour faire une réservation",
        variant: "destructive",
      });
      return;
    }

    if (!startDate || !endDate) {
      toast({
        title: "Dates requises",
        description: "Veuillez sélectionner les dates de réservation",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = price * duration;

    const { data } = await createReservation({
      listing_id: listingId,
      start_date: startDate,
      end_date: endDate,
      total_amount: totalAmount,
      message: message.trim() || undefined
    });

    if (data) {
      setMessage('');
      setStartDate(new Date());
      setEndDate(new Date());
      setDuration(1);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Connectez-vous pour faire une réservation
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/auth'}>
              Se connecter
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Réserver
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Calendrier */}
          <div>
            <Label className="text-sm font-medium">Dates de réservation</Label>
            <CalendarComponent
              mode="range"
              selected={{
                from: startDate,
                to: endDate,
              }}
              onSelect={(range) => range && handleDateChange(range)}
              className="rounded-md border mt-2"
              locale={fr}
              disabled={{ before: new Date() }}
            />
          </div>

          {/* Message optionnel */}
          <div>
            <Label htmlFor="message" className="text-sm font-medium">
              Message pour le propriétaire (optionnel)
            </Label>
            <Textarea
              id="message"
              placeholder="Présentez-vous et expliquez l'usage prévu..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Résumé de la réservation */}
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Prix par {priceUnit}</span>
              <span>{price.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Durée
              </span>
              <span>{duration} {duration > 1 ? 'jours' : 'jour'}</span>
            </div>
            {startDate && endDate && (
              <div className="flex justify-between text-sm">
                <span>Période</span>
                <span>
                  {format(startDate, 'dd MMM', { locale: fr })} - {format(endDate, 'dd MMM', { locale: fr })}
                </span>
              </div>
            )}
            <div className="flex justify-between font-medium text-base border-t pt-2">
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                Total
              </span>
              <span>{(price * duration).toFixed(2)}€</span>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading || !startDate || !endDate}
          >
            {loading ? 'Envoi en cours...' : 'Envoyer la demande de réservation'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Votre demande sera envoyée au propriétaire pour validation
          </p>
        </form>
      </CardContent>
    </Card>
  );
};