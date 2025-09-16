import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CookiePolicy() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
          <h1 className="text-3xl font-bold">Politique de Cookies</h1>
          <p className="text-muted-foreground mt-2">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Qu'est-ce qu'un cookie ?</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous visitez un site web. 
                Il permet au site de mémoriser certaines informations sur votre visite.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Types de cookies utilisés</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <h4>1. Cookies essentiels</h4>
              <p>Ces cookies sont nécessaires au fonctionnement du site :</p>
              <ul>
                <li><strong>Session utilisateur :</strong> maintient votre connexion</li>
                <li><strong>Panier :</strong> mémorise vos sélections</li>
                <li><strong>Sécurité :</strong> protection contre les attaques</li>
              </ul>

              <h4>2. Cookies de performance</h4>
              <p>Ces cookies nous aident à améliorer notre site :</p>
              <ul>
                <li><strong>Analytics :</strong> mesure de l'audience (Google Analytics)</li>
                <li><strong>Performance :</strong> temps de chargement des pages</li>
                <li><strong>Erreurs :</strong> détection de bugs</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestion des cookies</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <h4>Paramètres du navigateur</h4>
              <p>Vous pouvez gérer les cookies via les paramètres de votre navigateur :</p>
              <ul>
                <li><strong>Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies</li>
                <li><strong>Firefox :</strong> Paramètres → Vie privée et sécurité</li>
                <li><strong>Safari :</strong> Préférences → Confidentialité</li>
                <li><strong>Edge :</strong> Paramètres → Cookies et autorisations de site</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                Pour toute question sur notre utilisation des cookies :
                <a href="mailto:privacy@kiwiiz.com" className="text-primary hover:underline"> privacy@kiwiiz.com</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}