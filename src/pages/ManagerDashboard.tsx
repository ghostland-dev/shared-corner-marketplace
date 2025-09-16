import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  Package, 
  TrendingUp, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useListingsCRUD } from '@/hooks/useListingsCRUD';
import { useReservationsCRUD } from '@/hooks/useReservationsCRUD';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Company {
  id: string;
  name: string;
  description?: string;
  manager_id: string;
  created_at: string;
  updated_at: string;
}

export const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { isManager, isSuperAdmin } = useUserRoles();
  const { listings, loadListings } = useListingsCRUD();
  const { reservations, loadReservationsForMyListings } = useReservationsCRUD();

  const [company, setCompany] = useState<Company | null>(null);
  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    name: '',
    description: ''
  });

  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalReservations: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalViews: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!isManager() && !isSuperAdmin()) {
      navigate('/');
      return;
    }

    loadCompany();
    loadListings();
    loadReservationsForMyListings();
  }, [user, isManager, isSuperAdmin]);

  useEffect(() => {
    calculateStats();
  }, [listings, reservations, company]);

  const loadCompany = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('manager_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setCompany(data);
    } catch (error) {
      console.error('Error loading company:', error);
    }
  };

  const createCompany = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([{
          ...companyForm,
          manager_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setCompany(data);
      setIsCreateCompanyOpen(false);
      setCompanyForm({ name: '', description: '' });

      toast({
        title: "Entreprise créée",
        description: "Votre entreprise a été créée avec succès",
      });
    } catch (error) {
      console.error('Error creating company:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'entreprise",
        variant: "destructive",
      });
    }
  };

  const updateCompany = async () => {
    if (!company) return;

    try {
      const { data, error } = await supabase
        .from('companies')
        .update(companyForm)
        .eq('id', company.id)
        .select()
        .single();

      if (error) throw error;

      setCompany(data);
      setIsEditCompanyOpen(false);

      toast({
        title: "Entreprise mise à jour",
        description: "Les informations ont été mises à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'entreprise",
        variant: "destructive",
      });
    }
  };

  const calculateStats = () => {
    if (!company) return;

    const companyListings = listings.filter(l => l.company_id === company.id);
    const activeListings = companyListings.filter(l => l.is_available);
    const companyReservations = reservations.filter(r => 
      companyListings.some(l => l.id === r.listing_id)
    );
    
    const completedReservations = companyReservations.filter(r => r.status === 'completed');
    const totalRevenue = completedReservations.reduce((sum, r) => sum + Number(r.total_amount), 0);
    const totalViews = companyListings.reduce((sum, l) => sum + (l.views || 0), 0);

    setStats({
      totalListings: companyListings.length,
      activeListings: activeListings.length,
      totalReservations: companyReservations.length,
      totalRevenue,
      averageRating: 0, // TODO: Calculer la note moyenne
      totalViews
    });
  };

  const startEditCompany = () => {
    if (company) {
      setCompanyForm({
        name: company.name,
        description: company.description || ''
      });
      setIsEditCompanyOpen(true);
    }
  };

  if (!isManager() && !isSuperAdmin()) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Accès refusé</h1>
            <p className="text-muted-foreground">Vous n'avez pas les permissions pour accéder à cette page.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Tableau Manager</h1>
              <p className="text-muted-foreground">
                {company ? company.name : 'Gérez votre entreprise'}
              </p>
            </div>
          </div>
          
          {!company ? (
            <Dialog open={isCreateCompanyOpen} onOpenChange={setIsCreateCompanyOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer mon entreprise
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer votre entreprise</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company-name">Nom de l'entreprise</Label>
                    <Input
                      id="company-name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Mon Entreprise SARL"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-description">Description</Label>
                    <Textarea
                      id="company-description"
                      value={companyForm.description}
                      onChange={(e) => setCompanyForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Décrivez votre activité..."
                      rows={3}
                    />
                  </div>
                  <Button onClick={createCompany} className="w-full">
                    Créer l'entreprise
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Button variant="outline" onClick={startEditCompany}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier l'entreprise
            </Button>
          )}
        </div>

        {company ? (
          <>
            {/* Informations de l'entreprise */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {company.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{company.description}</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span>Créée le {new Date(company.created_at).toLocaleDateString('fr-FR')}</span>
                  <Badge variant="outline">Manager</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Statistiques */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Annonces</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeListings}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalListings} au total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Réservations</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalReservations}</div>
                  <p className="text-xs text-muted-foreground">
                    Toutes les réservations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalRevenue}€</div>
                  <p className="text-xs text-muted-foreground">
                    Réservations terminées
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vues totales</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalViews}</div>
                  <p className="text-xs text-muted-foreground">
                    Sur toutes les annonces
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Basé sur les avis
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Actions rapides */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                    onClick={() => navigate('/deposer-annonce')}>
                <CardContent className="flex items-center p-6">
                  <Plus className="h-8 w-8 text-primary mr-4" />
                  <div>
                    <h3 className="font-semibold">Créer une annonce</h3>
                    <p className="text-sm text-muted-foreground">
                      Ajouter un nouveau produit/service
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                    onClick={() => navigate('/mes-annonces')}>
                <CardContent className="flex items-center p-6">
                  <Package className="h-8 w-8 text-primary mr-4" />
                  <div>
                    <h3 className="font-semibold">Gérer les annonces</h3>
                    <p className="text-sm text-muted-foreground">
                      Modifier et organiser le catalogue
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                    onClick={() => navigate('/mes-reservations')}>
                <CardContent className="flex items-center p-6">
                  <Calendar className="h-8 w-8 text-primary mr-4" />
                  <div>
                    <h3 className="font-semibold">Réservations</h3>
                    <p className="text-sm text-muted-foreground">
                      Gérer les demandes clients
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Créez votre entreprise</h2>
            <p className="text-muted-foreground mb-6">
              Commencez par créer votre entreprise pour gérer vos annonces et équipes.
            </p>
          </div>
        )}

        {/* Dialog de modification d'entreprise */}
        <Dialog open={isEditCompanyOpen} onOpenChange={setIsEditCompanyOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier l'entreprise</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-company-name">Nom de l'entreprise</Label>
                <Input
                  id="edit-company-name"
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-company-description">Description</Label>
                <Textarea
                  id="edit-company-description"
                  value={companyForm.description}
                  onChange={(e) => setCompanyForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <Button onClick={updateCompany} className="w-full">
                Mettre à jour
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};