import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface ListingCRUD {
  id: string;
  title: string;
  description?: string;
  price: number;
  price_unit: string;
  category_id: string;
  location: string;
  owner_id: string;
  company_id?: string;
  image_urls: string[];
  features: string[];
  is_available: boolean;
  views?: number;
  created_at: string;
  updated_at: string;
}

export const useListingsCRUD = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [listings, setListings] = useState<ListingCRUD[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger toutes les annonces
  const loadListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error loading listings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les annonces",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les annonces de l'utilisateur
  const loadMyListings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error loading my listings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos annonces",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les annonces d'une entreprise
  const loadCompanyListings = async (companyId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error loading company listings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les annonces de l'entreprise",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle annonce
  const createListing = async (listingData: Omit<ListingCRUD, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .insert([listingData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Annonce créée",
        description: "Votre annonce a été créée avec succès",
      });

      setListings(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'annonce",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Mettre à jour une annonce
  const updateListing = async (id: string, updates: Partial<ListingCRUD>) => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Annonce mise à jour",
        description: "Les modifications ont été sauvegardées",
      });

      setListings(prev => prev.map(l => l.id === id ? data : l));
      return data;
    } catch (error) {
      console.error('Error updating listing:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'annonce",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Supprimer une annonce
  const deleteListing = async (id: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Annonce supprimée",
        description: "L'annonce a été supprimée avec succès",
      });

      setListings(prev => prev.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'annonce",
        variant: "destructive",
      });
    }
  };

  // Basculer la disponibilité d'une annonce
  const toggleAvailability = async (id: string, isAvailable: boolean) => {
    return await updateListing(id, { is_available: isAvailable });
  };

  // Incrémenter les vues d'une annonce
  const incrementViews = async (id: string) => {
    try {
      await supabase.functions.invoke('increment-views', {
        body: { listing_id: id }
      });
      
      // Mettre à jour localement
      setListings(prev => prev.map(l => 
        l.id === id ? { ...l, views: (l.views || 0) + 1 } : l
      ));
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  return {
    listings,
    loading,
    loadListings,
    loadMyListings,
    loadCompanyListings,
    createListing,
    updateListing,
    deleteListing,
    toggleAvailability,
    incrementViews,
  };
};