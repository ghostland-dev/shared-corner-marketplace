import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LegalNotice() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
          <h1 className="text-3xl font-bold">Mentions Légales</h1>
          <p className="text-muted-foreground mt-2">Informations légales et éditoriales</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Éditeur du site</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p><strong>Kiwiiz SAS</strong></p>
              <ul>
                <li><strong>Adresse :</strong> 123 Avenue des Champs-Élysées, 75008 Paris, France</li>
                <li><strong>Capital social :</strong> 100 000 €</li>
                <li><strong>RCS :</strong> Paris B 123 456 789</li>
                <li><strong>SIRET :</strong> 123 456 789 00012</li>
                <li><strong>TVA Intracommunautaire :</strong> FR12 123456789</li>
                <li><strong>Téléphone :</strong> +33 1 23 45 67 89</li>
                <li><strong>Email :</strong> contact@kiwiiz.com</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Directeur de la publication</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p><strong>Jean Dupont</strong>, Président de Kiwiiz SAS</p>
              <p>Email : direction@kiwiiz.com</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hébergement</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p><strong>Vercel Inc.</strong></p>
              <ul>
                <li>340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</li>
                <li>Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">vercel.com</a></li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Propriété intellectuelle</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                Le site Kiwiiz et l'ensemble de son contenu (textes, images, logos, graphismes, etc.) 
                sont protégés par le droit d'auteur et les lois sur la propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, transmission ou 
                dénaturation, totale ou partielle, est strictement interdite sans autorisation 
                écrite préalable de Kiwiiz SAS.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>Pour toute question concernant ces mentions légales :</p>
              <ul>
                <li><strong>Email :</strong> legal@kiwiiz.com</li>
                <li><strong>Téléphone :</strong> +33 1 23 45 67 89</li>
                <li><strong>Adresse :</strong> Kiwiiz SAS, 123 Avenue des Champs-Élysées, 75008 Paris</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}