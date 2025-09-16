import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type UserVerification = {
  id: string;
  user_id: string;
  verification_type: 'email' | 'phone' | 'identity' | 'address';
  status: 'pending' | 'verified' | 'rejected';
  verified_at: string | null;
  created_at: string;
};

export const useUserVerification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [verifications, setVerifications] = useState<UserVerification[]>([]);
  const [loading, setLoading] = useState(false);

  const loadVerifications = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_verifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVerifications(data || []);
    } catch (error) {
      console.error('Error loading verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestVerification = async (type: UserVerification['verification_type']) => {
    if (!user) return { success: false, error: 'Non authentifié' };

    try {
      // Vérifier s'il n'y a pas déjà une demande en cours
      const { data: existing } = await supabase
        .from('user_verifications')
        .select('id')
        .eq('user_id', user.id)
        .eq('verification_type', type)
        .eq('status', 'pending')
        .maybeSingle();

      if (existing) {
        toast({
          title: "Demande en cours",
          description: "Vous avez déjà une demande de vérification en cours pour ce type",
          variant: "destructive",
        });
        return { success: false, error: 'Demande déjà en cours' };
      }

      const { data, error } = await supabase
        .from('user_verifications')
        .insert({
          user_id: user.id,
          verification_type: type,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setVerifications(prev => [data, ...prev]);
      
      toast({
        title: "Demande envoyée",
        description: "Votre demande de vérification a été envoyée",
      });

      return { success: true, error: null };
    } catch (error) {
      console.error('Error requesting verification:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande de vérification",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const getVerificationStatus = (type: UserVerification['verification_type']) => {
    const verification = verifications.find(v => v.verification_type === type);
    return verification?.status || 'none';
  };

  const isVerified = (type: UserVerification['verification_type']) => {
    return getVerificationStatus(type) === 'verified';
  };

  const getVerificationLevel = () => {
    const verifiedTypes = verifications.filter(v => v.status === 'verified').length;
    if (verifiedTypes >= 3) return 'premium';
    if (verifiedTypes >= 2) return 'verified';
    if (verifiedTypes >= 1) return 'basic';
    return 'none';
  };

  useEffect(() => {
    if (user) {
      loadVerifications();
    }
  }, [user]);

  return {
    verifications,
    loading,
    loadVerifications,
    requestVerification,
    getVerificationStatus,
    isVerified,
    getVerificationLevel
  };
};