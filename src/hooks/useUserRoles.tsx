import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'user' | 'admin' | 'super_admin';

interface UserWithRoles {
  id: string;
  email: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  roles: UserRole[];
  created_at: string;
}

export const useUserRoles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [allUsers, setAllUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les rôles de l'utilisateur actuel
  const loadCurrentUserRoles = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserRoles(data?.map(r => r.role) || []);
    } catch (error) {
      console.error('Error loading user roles:', error);
    }
  };

  // Charger tous les utilisateurs avec leurs rôles (super admin uniquement)
  const loadAllUsers = async () => {
    if (!isSuperAdmin()) return;

    setLoading(true);
    try {
      // Récupérer les profils
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Récupérer les rôles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combiner les données
      const usersWithRoles: UserWithRoles[] = profiles?.map(profile => ({
        id: profile.user_id,
        email: profile.username || '',
        full_name: profile.full_name,
        username: profile.username,
        avatar_url: profile.avatar_url,
        roles: roles?.filter(r => r.user_id === profile.user_id).map(r => r.role) || [],
        created_at: profile.created_at
      })) || [];

      setAllUsers(usersWithRoles);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Assigner un rôle à un utilisateur
  const assignRole = async (userId: string, role: UserRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role });

      if (error) throw error;

      toast({
        title: "Rôle assigné",
        description: `Le rôle ${role} a été assigné avec succès`,
      });

      await loadAllUsers();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'assigner le rôle",
        variant: "destructive",
      });
    }
  };

  // Retirer un rôle d'un utilisateur
  const removeRole = async (userId: string, role: UserRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast({
        title: "Rôle retiré",
        description: `Le rôle ${role} a été retiré avec succès`,
      });

      await loadAllUsers();
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer le rôle",
        variant: "destructive",
      });
    }
  };

  // Vérifications de rôles
  const hasRole = (role: UserRole) => userRoles.includes(role);
  const isAdmin = () => hasRole('admin') || hasRole('super_admin');
  const isSuperAdmin = () => hasRole('super_admin');

  useEffect(() => {
    loadCurrentUserRoles();
  }, [user]);

  return {
    userRoles,
    allUsers,
    loading,
    loadAllUsers,
    assignRole,
    removeRole,
    hasRole,
    isAdmin,
    isSuperAdmin,
  };
};