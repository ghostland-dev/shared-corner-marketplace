import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicy() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
          <h1 className="text-3xl font-bold">Politique de Confidentialité</h1>
          <p className="text-muted-foreground mt-2">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Collecte des Données</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>Nous collectons les données suivantes dans le cadre de votre utilisation de Kiwiiz :</p>
              <ul>
                <li><strong>Données d'identification :</strong> nom, prénom, adresse email, numéro de téléphone</li>
                <li><strong>Données de profil :</strong> photo de profil, biographie, localisation</li>
                <li><strong>Données de navigation :</strong> adresse IP, cookies, données de navigation</li>
                <li><strong>Données de transaction :</strong> historique des locations, paiements, évaluations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Finalités du Traitement</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>Vos données sont utilisées pour :</p>
              <ul>
                <li>Créer et gérer votre compte utilisateur</li>
                <li>Faciliter les transactions entre utilisateurs</li>
                <li>Améliorer nos services et votre expérience</li>
                <li>Prévenir la fraude et assurer la sécurité</li>
                <li>Vous envoyer des communications importantes</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Vos Droits</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul>
                <li><strong>Accès :</strong> obtenir une copie de vos données</li>
                <li><strong>Rectification :</strong> corriger des données inexactes</li>
                <li><strong>Effacement :</strong> supprimer vos données (sous conditions)</li>
                <li><strong>Limitation :</strong> restreindre le traitement</li>
                <li><strong>Portabilité :</strong> récupérer vos données dans un format structuré</li>
                <li><strong>Opposition :</strong> s'opposer au traitement (sous conditions)</li>
              </ul>
              <p>
                Pour exercer ces droits, contactez-nous à : 
                <a href="mailto:privacy@kiwiiz.com" className="text-primary hover:underline"> privacy@kiwiiz.com</a>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Contact</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>Pour toute question sur cette politique :</p>
              <ul>
                <li>Email : <a href="mailto:privacy@kiwiiz.com" className="text-primary hover:underline">privacy@kiwiiz.com</a></li>
                <li>Adresse : Kiwiiz SAS, 123 Avenue des Champs-Élysées, 75008 Paris</li>
                <li>DPO : <a href="mailto:dpo@kiwiiz.com" className="text-primary hover:underline">dpo@kiwiiz.com</a></li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}