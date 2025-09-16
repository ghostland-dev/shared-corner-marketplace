import React from 'react';
import { ArrowLeft, Users, Shield, Zap, Heart, Award, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function About() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">À propos de Kiwiiz</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              La plateforme qui révolutionne la location d'objets entre particuliers
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Mission */}
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Heart className="h-6 w-6 text-primary" />
                Notre Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-lg">
                Kiwiiz démocratise l'accès aux objets du quotidien en créant une communauté 
                de partage basée sur la confiance, la simplicité et la durabilité.
              </p>
              <p>
                Nous croyons qu'il est possible de consommer mieux en utilisant les ressources 
                existantes plutôt que d'acheter systématiquement du neuf.
              </p>
            </CardContent>
          </Card>

          {/* Valeurs */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Confiance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Système de vérification d'identité, évaluations mutuelles et assurance 
                  pour garantir des échanges sécurisés.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Simplicité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Interface intuitive, réservation en quelques clics et paiement sécurisé 
                  pour une expérience utilisateur optimale.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Durabilité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Promotion de l'économie circulaire et réduction de l'empreinte carbone 
                  grâce au partage d'objets.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Award className="h-6 w-6 text-primary" />
                Kiwiiz en Chiffres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">1K+</div>
                  <div className="text-muted-foreground">Utilisateurs actifs</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-muted-foreground">Objets disponibles</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">200+</div>
                  <div className="text-muted-foreground">Locations réalisées</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">4.8/5</div>
                  <div className="text-muted-foreground">Note moyenne</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Nous Contacter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Adresse</h4>
                  <p className="text-muted-foreground">
                    123 Avenue des Champs-Élysées<br />
                    75008 Paris, France
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Contact</h4>
                  <p className="text-muted-foreground">
                    Email : <a href="mailto:contact@kiwiiz.com" className="text-primary hover:underline">contact@kiwiiz.com</a><br />
                    Téléphone : +33 1 23 45 67 89
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <p className="text-center text-muted-foreground">
                  Des questions ? Envie de rejoindre l'aventure ? 
                  <Link to="/contact" className="text-primary hover:underline ml-1">Contactez-nous !</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}