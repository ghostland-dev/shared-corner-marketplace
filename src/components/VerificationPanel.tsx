import React, { useState } from 'react';
import { Shield, CheckCircle, AlertCircle, Mail, Phone, MapPin, Upload, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUserVerification } from '@/hooks/useUserVerification';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface VerificationPanelProps {
  className?: string;
}

export const VerificationPanel: React.FC<VerificationPanelProps> = ({ className = '' }) => {
  const { user, profile, updateProfile } = useAuth();
  const { 
    verifications, 
    loading, 
    requestVerification, 
    getVerificationStatus, 
    isVerified, 
    getVerificationLevel 
  } = useUserVerification();
  const { toast } = useToast();
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const verificationTypes = [
    {
      type: 'email' as const,
      title: 'Email',
      description: 'Vérifiez votre adresse email',
      icon: Mail,
      requirement: 'Cliquez sur le lien dans l\'email de confirmation'
    },
    {
      type: 'phone' as const,
      title: 'Téléphone',
      description: 'Vérifiez votre numéro de téléphone',
      icon: Phone,
      requirement: 'Recevez un code SMS de vérification'
    },
    {
      type: 'identity' as const,
      title: 'Identité',
      description: 'Vérifiez votre identité avec une pièce d\'identité',
      icon: Shield,
      requirement: 'Téléchargez une photo de votre carte d\'identité ou passeport'
    },
    {
      type: 'address' as const,
      title: 'Adresse',
      description: 'Vérifiez votre adresse de résidence',
      icon: MapPin,
      requirement: 'Téléchargez un justificatif de domicile récent'
    }
  ];

  const handleRequestVerification = async (type: typeof verificationTypes[0]['type']) => {
    const result = await requestVerification(type);
    if (result.success) {
      // Ici vous pourriez déclencher des actions spécifiques selon le type
      if (type === 'email') {
        toast({
          title: "Email de vérification envoyé",
          description: "Vérifiez votre boîte mail et cliquez sur le lien de confirmation",
        });
      } else if (type === 'phone') {
        toast({
          title: "SMS envoyé",
          description: "Vous allez recevoir un code de vérification par SMS",
        });
      }
    }
  };

  const handleDocumentUpload = async (type: string, file: File) => {
    setUploadingDoc(type);
    try {
      // Simuler l'upload de document
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Demander la vérification après l'upload
      await requestVerification(type as any);
      
      toast({
        title: "Document téléchargé",
        description: "Votre document a été envoyé pour vérification",
      });
    } catch (error) {
      toast({
        title: "Erreur d'upload",
        description: "Impossible de télécharger le document",
        variant: "destructive",
      });
    } finally {
      setUploadingDoc(null);
    }
  };

  const getStatusBadge = (type: typeof verificationTypes[0]['type']) => {
    const status = getVerificationStatus(type);
    switch (status) {
      case 'verified':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 mr-1" />Vérifié</Badge>;
      case 'pending':
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge variant="outline">Non vérifié</Badge>;
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

  const getVerificationBenefits = () => {
    const level = getVerificationLevel();
    const benefits = [];
    
    if (level === 'none') {
      benefits.push('Accès limité aux fonctionnalités');
    } else {
      benefits.push('Profil plus visible dans les recherches');
      if (level !== 'basic') {
        benefits.push('Badge de confiance sur votre profil');
        benefits.push('Priorité dans les demandes de location');
      }
      if (level === 'premium') {
        benefits.push('Accès aux fonctionnalités premium');
        benefits.push('Support client prioritaire');
        benefits.push('Réduction sur les frais de service');
      }
    }
    
    return benefits;
  };

  if (!user) return null;

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Vérification de compte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Niveau de confiance actuel */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Niveau de confiance</span>
              <span className="text-2xl font-bold text-primary">{getTrustScore()}%</span>
            </div>
            <Progress value={getTrustScore()} className="h-3" />
            <div className="text-sm text-muted-foreground">
              Niveau: <span className="font-medium capitalize">{getVerificationLevel()}</span>
            </div>
          </div>

          {/* Vérifications disponibles */}
          <div className="space-y-4">
            <h3 className="font-medium">Vérifications</h3>
            <div className="grid gap-4">
              {verificationTypes.map((verificationType) => {
                const Icon = verificationType.icon;
                const status = getVerificationStatus(verificationType.type);
                const isVerifiedType = isVerified(verificationType.type);
                
                return (
                  <Card key={verificationType.type} className={`transition-colors ${isVerifiedType ? 'bg-success/5 border-success/20' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 mt-0.5 ${isVerifiedType ? 'text-success' : 'text-muted-foreground'}`} />
                          <div className="space-y-1">
                            <h4 className="font-medium">{verificationType.title}</h4>
                            <p className="text-sm text-muted-foreground">{verificationType.description}</p>
                            <p className="text-xs text-muted-foreground">{verificationType.requirement}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(verificationType.type)}
                          
                          {!isVerifiedType && status !== 'pending' && (
                            <div>
                              {verificationType.type === 'identity' || verificationType.type === 'address' ? (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <Upload className="w-3 h-3 mr-1" />
                                      Télécharger
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Télécharger un document - {verificationType.title}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <p className="text-sm text-muted-foreground">
                                        {verificationType.requirement}
                                      </p>
                                      <div className="space-y-2">
                                        <Label htmlFor={`doc-${verificationType.type}`}>
                                          Sélectionner un fichier
                                        </Label>
                                        <Input
                                          id={`doc-${verificationType.type}`}
                                          type="file"
                                          accept="image/*,.pdf"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              handleDocumentUpload(verificationType.type, file);
                                            }
                                          }}
                                          disabled={uploadingDoc === verificationType.type}
                                        />
                                      </div>
                                      {uploadingDoc === verificationType.type && (
                                        <div className="text-sm text-muted-foreground">
                                          Téléchargement en cours...
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              ) : (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleRequestVerification(verificationType.type)}
                                  disabled={loading}
                                >
                                  Vérifier
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Avantages de la vérification */}
          <div className="space-y-3">
            <h3 className="font-medium">Avantages de votre niveau</h3>
            <div className="space-y-2">
              {getVerificationBenefits().map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progression vers le niveau suivant */}
          {getVerificationLevel() !== 'premium' && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Niveau suivant</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {getVerificationLevel() === 'none' 
                  ? 'Vérifiez au moins un élément pour débloquer le niveau basique'
                  : getVerificationLevel() === 'basic'
                  ? 'Vérifiez au moins 2 éléments pour le niveau vérifié'
                  : 'Vérifiez tous les éléments pour le niveau premium'
                }
              </p>
              <Progress 
                value={(verifications.filter(v => v.status === 'verified').length / 4) * 100} 
                className="h-2" 
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};