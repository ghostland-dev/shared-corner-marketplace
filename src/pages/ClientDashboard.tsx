import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Users, 
  Calendar, 
  TrendingUp, 
  Eye,
  MessageSquare,
  Star,
  Plus,
  Building2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useListingsCRUD } from '@/hooks/useListingsCRUD';
import { useReservationsCRUD } from '@/hooks/useReservationsCRUD';
import { useConversationsCRUD } from '@/hooks/useConversationsCRUD';
import { useReviews } from '@/hooks/useReviews';

export const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userRoles, hasRole } = useUserRoles();
  const { listings, loadListings } = useListingsCRUD();
  const { reservations, loadMyReservations, loadReservationsForMyListings } = useReservationsCRUD();
  const { conversations, loadConversations, getUnreadCount } = useConversationsCRUD();
  const { reviews } = useReviews();

  const [stats, setStats] = useState({
    myListings: 0,
    myReservations: 0,
    unreadMessages: 0,
    totalViews: 0,
    averageRating: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Charger les données
    loadListings();
    loadMyReservations();
    loadReservationsForMyListings();
    loadConversations();
    getUnreadCount().then(count => {
      setStats(prev => ({ ...prev, unreadMessages: count }));
    });
  }, [user]);

  useEffect(() => {
    // Calculer les statistiques
    const myListings = listings.filter(l => l.owner_id === user?.id).length;
    const myReservations = reservations.filter(r => r.renter_id === user?.id).length;
    const totalViews = listings
      .filter(l => l.owner_id === user?.id)
      .reduce((sum, l) => sum + (l.views || 0), 0);
    
    const completedReservations = reservations.filter(
      r => r.status === 'completed' && 
      listings.some(l => l.id === r.listing_id && l.owner_id === user?.id)
    );
    const totalEarnings = completedReservations.reduce((sum, r) => sum + Number(r.total_amount), 0);

    const myListingIds = listings.filter(l => l.owner_id === user?.id).map(l => l.id);
    const myReviews = reviews.filter(r => myListingIds.includes(r.listing_id));
    const averageRating = myReviews.length > 0 
      ? myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length 
      : 0;

    setStats(prev => ({
      ...prev,
      myListings,
      myReservations,
      totalViews,
      totalEarnings,
      averageRating
    }));
  }, [listings, reservations, reviews, user]);

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Accès refusé</h1>
            <p className="text-muted-foreground">Vous devez être connecté pour accéder à cette page.</p>
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
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground">
              Gérez vos annonces et réservations
            </p>
          </div>
          <Button onClick={() => navigate('/deposer-annonce')}>
            <Plus className="h-4 w-4 mr-2" />
            Créer une annonce
          </Button>
        </div>

        {/* Rôles de l'utilisateur */}
        {userRoles.length > 0 && (
          <div className="flex gap-2 mb-6">
            {userRoles.map(role => (
              <Badge key={role} variant="outline">
                {role === 'user' && 'Utilisateur'}
                {role === 'manager' && 'Manager'}
                {role === 'admin' && 'Administrateur'}
                {role === 'super_admin' && 'Super Admin'}
              </Badge>
            ))}
          </div>
        )}

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mes Annonces</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.myListings}</div>
              <p className="text-xs text-muted-foreground">
                Annonces actives
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Réservations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.myReservations}</div>
              <p className="text-xs text-muted-foreground">
                Réservations effectuées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unreadMessages}</div>
              <p className="text-xs text-muted-foreground">
                Messages non lus
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
                Sur toutes vos annonces
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques vendeur */}
        {stats.myListings > 0 && (
          <div className="grid gap-4 md:grid-cols-2 mb-8">
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
                  Basé sur les avis clients
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gains totaux</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEarnings}€</div>
                <p className="text-xs text-muted-foreground">
                  Réservations terminées
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions rapides */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                onClick={() => navigate('/mes-annonces')}>
            <CardContent className="flex items-center p-6">
              <Package className="h-8 w-8 text-primary mr-4" />
              <div>
                <h3 className="font-semibold">Gérer mes annonces</h3>
                <p className="text-sm text-muted-foreground">
                  Modifier, mettre en pause ou supprimer
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                onClick={() => navigate('/mes-reservations')}>
            <CardContent className="flex items-center p-6">
              <Calendar className="h-8 w-8 text-primary mr-4" />
              <div>
                <h3 className="font-semibold">Mes réservations</h3>
                <p className="text-sm text-muted-foreground">
                  Voir le statut et l'historique
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                onClick={() => navigate('/messages')}>
            <CardContent className="flex items-center p-6">
              <MessageSquare className="h-8 w-8 text-primary mr-4" />
              <div>
                <h3 className="font-semibold">Messages</h3>
                <p className="text-sm text-muted-foreground">
                  Communiquer avec les clients
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Accès aux tableaux de bord spécialisés */}
        <div className="grid gap-4 md:grid-cols-2">
          {hasRole('manager') && (
            <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                  onClick={() => navigate('/manager')}>
              <CardContent className="flex items-center p-6">
                <Building2 className="h-8 w-8 text-orange-500 mr-4" />
                <div>
                  <h3 className="font-semibold">Tableau Manager</h3>
                  <p className="text-sm text-muted-foreground">
                    Gérer votre entreprise et équipe
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {hasRole('super_admin') && (
            <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                  onClick={() => navigate('/admin')}>
              <CardContent className="flex items-center p-6">
                <Users className="h-8 w-8 text-red-500 mr-4" />
                <div>
                  <h3 className="font-semibold">Administration</h3>
                  <p className="text-sm text-muted-foreground">
                    Gérer la plateforme et les utilisateurs
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};