import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Payment {
  id: string;
  reservation_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method?: string;
  external_payment_id?: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export const usePayments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les paiements de l'utilisateur
  const loadPayments = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error loading payments:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paiements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les paiements d'une réservation
  const loadPaymentsByReservation = async (reservationId: string) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('reservation_id', reservationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading reservation payments:', error);
      return [];
    }
  };

  // Créer un nouveau paiement
  const createPayment = async (paymentData: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Paiement créé",
        description: "Le paiement a été créé avec succès",
      });

      setPayments(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le paiement",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Mettre à jour le statut d'un paiement
  const updatePaymentStatus = async (
    paymentId: string, 
    status: Payment['status'], 
    externalPaymentId?: string
  ) => {
    try {
      const updateData: any = { status };
      if (externalPaymentId) {
        updateData.external_payment_id = externalPaymentId;
      }

      const { data, error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', paymentId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Paiement mis à jour",
        description: `Le statut du paiement a été mis à jour: ${status}`,
      });

      setPayments(prev => prev.map(p => 
        p.id === paymentId ? data : p
      ));

      return data;
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le paiement",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Rembourser un paiement
  const refundPayment = async (paymentId: string) => {
    return await updatePaymentStatus(paymentId, 'refunded');
  };

  // Calculer les statistiques de paiement
  const getPaymentStats = () => {
    const stats = {
      total: payments.length,
      completed: payments.filter(p => p.status === 'completed').length,
      pending: payments.filter(p => p.status === 'pending').length,
      failed: payments.filter(p => p.status === 'failed').length,
      refunded: payments.filter(p => p.status === 'refunded').length,
      totalAmount: payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + Number(p.amount), 0)
    };

    return stats;
  };

  return {
    payments,
    loading,
    loadPayments,
    loadPaymentsByReservation,
    createPayment,
    updatePaymentStatus,
    refundPayment,
    getPaymentStats,
  };
};