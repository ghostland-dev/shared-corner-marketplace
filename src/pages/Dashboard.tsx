import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Heart, 
  MessageCircle, 
  Calendar, 
  Star, 
  Settings, 
  Plus,
  Home,
  TrendingUp,
  Shield,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type DashboardStats = {
  totalListings: number;
  totalReservations: number;
  totalReviews: number;
  averageRating: number;
  totalEarnings: number;
  activeReservations: number;
};

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    totalReservations: 0,
    totalReviews: 0,
    averageRating: 0,
    totalEarnings: 0,
    activeReservations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadDashboardStats();
  }, [user, navigate]);

  const loadDashboardStats = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Charger les statistiques
      const [
        listingsResult,
        reservationsResult,
        reviewsResult,
        earningsResult
      ] = await Promise.all([
        // Mes annonces
        supabase
          .from('listings')
          .select('id')
          .eq('owner_id', user.id),
        
        // Mes réservations (reçues)
        supabase
          .from('reservations')
          .select('id, status, total_amount, listing:listings!inner(owner_id)')
          .eq('listing.owner_id', user.id),
        
        // Mes reviews (reçues)
        supabase
          .from('reviews')
          .select('rating')
          .eq('owner_id', user.id),
        
        // Gains totaux
        supabase
          .from('reservations')
          .select('total_amount, listing:listings!inner(owner_id)')
          .eq('listing.owner_id', user.id)
          .eq('status', 'completed')
      ]);

      const totalListings = listingsResult.data?.length || 0;
      const totalReservations = reservationsResult.data?.length || 0;
      const activeReservations = reservationsResult.data?.filter(r => 
        r.status === 'confirmed' || r.status === 'pending'
      ).length || 0;
      
      const reviews = reviewsResult.data || [];
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
        : 0;
      
      const totalEarnings = earningsResult.data?.reduce((sum, r) => sum + r.total_amount, 0) || 0;

      setStats({
        totalListings,
        totalReservations,
        totalReviews,
        averageRating,
        totalEarnings,
        activeReservations
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const userInitials = (profile?.full_name || profile?.username || user.email || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* En-tête du dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">
                Bonjour, {profile?.full_name || profile?.username || 'Utilisateur'}
              </h1>
              <p className="text-muted-foreground">
                Bienvenue sur votre tableau de bord Kiwiiz
              </p>
              {profile?.is_premium && (
                <Badge className="mt-2 bg-gradient-to-r from-yellow-400 to-yellow-600">
                  <Award className="w-3 h-3 mr-1" />
                  Membre Premium
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/parametres')}>
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
            <Button onClick={() => navigate('/deposer-annonce')}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle annonce
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mes annonces</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalListings}</div>
              <p className="text-xs text-muted-foreground">
                Annonces publiées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Réservations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeReservations}</div>
              <p className="text-xs text-muted-foreground">
                En cours ({stats.totalReservations} total)
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
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '-'}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.totalReviews} avis reçus
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gains totaux</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEarnings.toFixed(2)}€</div>
              <p className="text-xs text-muted-foreground">
                Depuis vos débuts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/mes-annonces')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Mes annonces
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Gérez vos {stats.totalListings} annonces publiées
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/mes-reservations')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Réservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {stats.activeReservations} réservations actives à gérer
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/messages')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Communiquez avec vos locataires
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/favoris')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Favoris
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Vos annonces sauvegardées
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/avis')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Avis et évaluations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {stats.totalReviews} avis reçus
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Vérification et paramètres de sécurité
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Section aide */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Besoin d'aide ?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" onClick={() => navigate('/aide')}>
                Centre d'aide
              </Button>
              <Button variant="outline" onClick={() => navigate('/contact')}>
                Contacter le support
              </Button>
              <Button variant="outline" onClick={() => navigate('/comment-ca-marche')}>
                Guide d'utilisation
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;