import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Profile {
  id: string;
  user_id: string;
  username?: string;
  avatar_url?: string;
  full_name?: string;
  phone_number?: string;
  bio?: string;
  location?: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export const useProfiles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  // Charger tous les profils (admin/super admin uniquement)
  const loadProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les profils",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger un profil spécifique
  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      setCurrentProfile(data);
      return data;
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil",
        variant: "destructive",
      });
      return null;
    }
  };

  // Charger le profil de l'utilisateur connecté
  const loadCurrentUserProfile = async () => {
    if (!user) return null;
    return await loadProfile(user.id);
  };

  // Mettre à jour un profil
  const updateProfile = async (userId: string, updates: Partial<Profile>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Le profil a été mis à jour avec succès",
      });

      // Mettre à jour les états locaux
      if (currentProfile && currentProfile.user_id === userId) {
        setCurrentProfile(data);
      }
      
      setProfiles(prev => prev.map(p => 
        p.user_id === userId ? data : p
      ));

      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Supprimer un profil (super admin uniquement)
  const deleteProfile = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Profil supprimé",
        description: "Le profil a été supprimé avec succès",
      });

      setProfiles(prev => prev.filter(p => p.user_id !== userId));
      if (currentProfile && currentProfile.user_id === userId) {
        setCurrentProfile(null);
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le profil",
        variant: "destructive",
      });
    }
  };

  // Promouvoir un utilisateur en premium
  const togglePremium = async (userId: string, isPremium: boolean) => {
    return await updateProfile(userId, { is_premium: isPremium });
  };

  return {
    profiles,
    currentProfile,
    loading,
    loadProfiles,
    loadProfile,
    loadCurrentUserProfile,
    updateProfile,
    deleteProfile,
    togglePremium,
  };
};