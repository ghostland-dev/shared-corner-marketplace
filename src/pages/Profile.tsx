import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Calendar, 
  Star, 
  MessageCircle, 
  Shield,
  Eye,
  Heart,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ListingCard from '@/components/ListingCard';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings');

  const isOwnProfile = !userId || userId === currentUser?.id;
  const profileUserId = userId || currentUser?.id;

  useEffect(() => {
    if (profileUserId) {
      loadProfile();
    }
  }, [profileUserId]);

  const loadProfile = async () => {
    if (!profileUserId) return;

    setLoading(true);
    try {
      // Charger le profil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', profileUserId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      setProfile(profileData);

      // Charger les annonces de l'utilisateur
      const { data: listingsData, error: listingsError } = await supabase
        .from('listings')
        .select('*')
        .eq('owner_id', profileUserId)
        .eq('is_available', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (!listingsError) {
        setListings(listingsData || []);
      }

      // Charger les avis sur l'utilisateur
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:profiles!reviews_reviewer_id_fkey(
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('owner_id', profileUserId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!reviewsError) {
        setReviews(reviewsData || []);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Chargement du profil...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile && !isOwnProfile) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Profil introuvable</h1>
            <p className="mb-6">Ce profil n'existe pas ou n'est pas accessible.</p>
            <Button onClick={() => navigate('/')}>
              Retour à l'accueil
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const averageRating = calculateAverageRating();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold">
              {isOwnProfile ? 'Mon profil' : 'Profil utilisateur'}
            </h1>
          </div>

          {/* En-tête du profil */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="text-2xl">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        {profile?.full_name || profile?.username || 'Utilisateur'}
                      </h2>
                      
                      {profile?.bio && (
                        <p className="text-muted-foreground mb-4">
                          {profile.bio}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {profile?.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{profile.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Membre depuis {format(new Date(profile?.created_at || new Date()), 'MMMM yyyy', { locale: fr })}
                          </span>
                        </div>
                        {reviews.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>
                              {averageRating.toFixed(1)} ({reviews.length} avis)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!isOwnProfile && currentUser && (
                      <div className="flex gap-2">
                        <Button variant="outline">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contacter
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">{listings.length}</div>
                <p className="text-sm text-muted-foreground">Annonces actives</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">{reviews.length}</div>
                <p className="text-sm text-muted-foreground">Avis reçus</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">
                  {averageRating > 0 ? averageRating.toFixed(1) : '-'}
                </div>
                <p className="text-sm text-muted-foreground">Note moyenne</p>
              </CardContent>
            </Card>
          </div>

          {/* Onglets */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="listings">Annonces</TabsTrigger>
              <TabsTrigger value="reviews">Avis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="listings" className="mt-6">
              {listings.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Eye className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Aucune annonce</h3>
                    <p className="text-muted-foreground">
                      {isOwnProfile 
                        ? "Vous n'avez pas encore d'annonces actives."
                        : "Cet utilisateur n'a pas d'annonces actives."
                      }
                    </p>
                    {isOwnProfile && (
                      <Button className="mt-4" onClick={() => navigate('/deposer-annonce')}>
                        Créer ma première annonce
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      id={listing.id}
                      title={listing.title}
                      price={listing.price}
                      priceUnit={listing.price_unit}
                      imageUrl={listing.image_urls?.[0] || '/placeholder.svg'}
                      location={listing.location}
                      category={listing.category_id}
                      rating={4.5}
                      views={listing.views}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              {reviews.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Aucun avis</h3>
                    <p className="text-muted-foreground">
                      {isOwnProfile 
                        ? "Vous n'avez pas encore reçu d'avis."
                        : "Cet utilisateur n'a pas encore reçu d'avis."
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={review.reviewer?.avatar_url} />
                            <AvatarFallback>
                              {review.reviewer?.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-medium">
                                  {review.reviewer?.full_name || review.reviewer?.username}
                                </h4>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating 
                                          ? 'text-yellow-400 fill-current' 
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                  <span className="text-sm text-muted-foreground ml-2">
                                    {format(new Date(review.created_at), 'dd MMM yyyy', { locale: fr })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {review.comment && (
                              <p className="text-muted-foreground">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;