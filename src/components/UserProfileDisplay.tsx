import React, { useState } from 'react';
import { Shield, CheckCircle, AlertCircle, Phone, Mail, MapPin, Calendar, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserVerification } from '@/hooks/useUserVerification';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfileDisplayProps {
  userId: string;
  showContactInfo?: boolean;
  showVerificationLevel?: boolean;
  className?: string;
}

export const UserProfileDisplay: React.FC<UserProfileDisplayProps> = ({
  userId,
  showContactInfo = false,
  showVerificationLevel = true,
  className = ''
}) => {
  const { user } = useAuth();
  const { getVerificationLevel, isVerified } = useUserVerification();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      // Simuler le chargement du profil
      setProfile({
        id: userId,
        full_name: 'John Doe',
        username: 'johndoe',
        avatar_url: null,
        phone_number: showContactInfo ? '+33 6 12 34 56 78' : null,
        email: showContactInfo ? 'john@example.com' : null,
        location: 'Paris, France',
        bio: 'Passionné de location et de partage d\'objets.',
        joined_at: '2024-01-15',
        total_listings: 12,
        total_reviews: 45,
        average_rating: 4.8
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVerificationBadge = () => {
    const level = getVerificationLevel();
    switch (level) {
      case 'premium':
        return (
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            <Shield className="w-3 h-3 mr-1" />
            Premium Vérifié
          </Badge>
        );
      case 'verified':
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle className="w-3 h-3 mr-1" />
            Vérifié
          </Badge>
        );
      case 'basic':
        return (
          <Badge variant="secondary">
            <CheckCircle className="w-3 h-3 mr-1" />
            Partiellement vérifié
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="w-3 h-3 mr-1" />
            Non vérifié
          </Badge>
        );
    }
  };

  const getTrustScore = () => {
    const level = getVerificationLevel();
    switch (level) {
      case 'premium': return 95;
      case 'verified': return 80;
      case 'basic': return 60;
      default: return 30;
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-32"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) return null;

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header avec avatar et infos de base */}
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-lg">
                {profile.full_name?.charAt(0) || profile.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold">{profile.full_name || profile.username}</h3>
                {showVerificationLevel && getVerificationBadge()}
              </div>
              
              {profile.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </div>
              )}

              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Membre depuis {new Date(profile.joined_at).getFullYear()}
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-sm text-muted-foreground">{profile.bio}</p>
          )}

          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{profile.total_listings}</div>
              <div className="text-xs text-muted-foreground">Annonces</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{profile.total_reviews}</div>
              <div className="text-xs text-muted-foreground">Avis</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-warning fill-current" />
                <span className="text-lg font-bold">{profile.average_rating}</span>
              </div>
              <div className="text-xs text-muted-foreground">Note moyenne</div>
            </div>
          </div>

          {/* Niveau de confiance */}
          {showVerificationLevel && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Niveau de confiance</span>
                <span className="text-sm text-muted-foreground">{getTrustScore()}%</span>
              </div>
              <Progress value={getTrustScore()} className="h-2" />
              <div className="text-xs text-muted-foreground">
                Basé sur les vérifications effectuées
              </div>
            </div>
          )}

          {/* Vérifications détaillées */}
          {showVerificationLevel && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Vérifications</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  {isVerified('email') ? (
                    <CheckCircle className="w-3 h-3 text-success" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-muted-foreground" />
                  )}
                  <span>Email</span>
                </div>
                <div className="flex items-center gap-2">
                  {isVerified('phone') ? (
                    <CheckCircle className="w-3 h-3 text-success" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-muted-foreground" />
                  )}
                  <span>Téléphone</span>
                </div>
                <div className="flex items-center gap-2">
                  {isVerified('identity') ? (
                    <CheckCircle className="w-3 h-3 text-success" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-muted-foreground" />
                  )}
                  <span>Identité</span>
                </div>
                <div className="flex items-center gap-2">
                  {isVerified('address') ? (
                    <CheckCircle className="w-3 h-3 text-success" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-muted-foreground" />
                  )}
                  <span>Adresse</span>
                </div>
              </div>
            </div>
          )}

          {/* Informations de contact */}
          {showContactInfo && (user?.id === userId || getVerificationLevel() !== 'none') && (
            <div className="space-y-2 pt-4 border-t">
              <h4 className="text-sm font-medium">Contact</h4>
              <div className="space-y-2 text-sm">
                {profile.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${profile.email}`} className="text-primary hover:underline">
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile.phone_number && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${profile.phone_number}`} className="text-primary hover:underline">
                      {profile.phone_number}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};