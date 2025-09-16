import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfService() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
          <h1 className="text-3xl font-bold">Conditions Générales d'Utilisation</h1>
          <p className="text-muted-foreground mt-2">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Objet</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de la plateforme 
                Kiwiiz, service de mise en relation pour la location d'objets entre particuliers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Inscription et Compte Utilisateur</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                Pour utiliser nos services, vous devez créer un compte en fournissant des informations 
                exactes et à jour. Vous êtes responsable de la confidentialité de vos identifiants.
              </p>
              <ul>
                <li>L'inscription est gratuite et ouverte à toute personne majeure</li>
                <li>Un seul compte par personne physique est autorisé</li>
                <li>Vous devez fournir des informations véridiques lors de l'inscription</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Services Proposés</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>Kiwiiz propose une plateforme permettant de :</p>
              <ul>
                <li>Publier des annonces de location d'objets</li>
                <li>Rechercher et louer des objets auprès d'autres utilisateurs</li>
                <li>Communiquer avec d'autres utilisateurs</li>
                <li>Effectuer des réservations et des paiements sécurisés</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Obligations des Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <h4>4.1 Obligations Générales</h4>
              <ul>
                <li>Respecter les lois et règlements en vigueur</li>
                <li>Ne pas publier de contenu illégal, offensant ou trompeur</li>
                <li>Maintenir la confidentialité des données d'autres utilisateurs</li>
              </ul>

              <h4>4.2 Obligations des Propriétaires</h4>
              <ul>
                <li>S'assurer que les objets proposés sont en bon état</li>
                <li>Fournir des descriptions exactes et des photos récentes</li>
                <li>Respecter les conditions de location convenues</li>
              </ul>

              <h4>4.3 Obligations des Locataires</h4>
              <ul>
                <li>Utiliser les objets loués avec soin</li>
                <li>Respecter les conditions de location</li>
                <li>Restituer les objets dans l'état initial</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Paiements et Tarification</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                Les paiements sont traités de manière sécurisée via notre partenaire de paiement. 
                Kiwiiz prélève une commission sur chaque transaction réussie.
              </p>
              <ul>
                <li>Commission de 5% sur le montant total de la location</li>
                <li>Paiement sécurisé par carte bancaire</li>
                <li>Remboursement possible selon nos conditions</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Contact</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                Pour toute question concernant ces CGU, contactez-nous à : 
                <a href="mailto:legal@kiwiiz.com" className="text-primary hover:underline"> legal@kiwiiz.com</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}