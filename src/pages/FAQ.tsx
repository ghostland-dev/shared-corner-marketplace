import React from 'react';
import { ArrowLeft, Search, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FAQ() {
  const [searchTerm, setSearchTerm] = React.useState('');

  const faqCategories = [
    {
      title: "Utilisation de la plateforme",
      items: [
        {
          question: "Comment créer un compte sur Kiwiiz ?",
          answer: "Pour créer un compte, cliquez sur 'Connexion' puis 'S'inscrire'. Renseignez votre email, créez un mot de passe et confirmez votre inscription via l'email de validation."
        },
        {
          question: "Comment publier une annonce ?",
          answer: "Une fois connecté, cliquez sur 'Publier une annonce' dans le menu. Remplissez les informations de votre objet : titre, description, prix, photos et localisation. Votre annonce sera visible immédiatement."
        },
        {
          question: "Comment rechercher un objet ?",
          answer: "Utilisez la barre de recherche en tapant le nom de l'objet. Vous pouvez filtrer par localisation, catégorie et prix. Cliquez sur une annonce pour voir les détails."
        }
      ]
    },
    {
      title: "Réservations et location",
      items: [
        {
          question: "Comment effectuer une réservation ?",
          answer: "Sur la page de l'objet, sélectionnez vos dates de location, vérifiez le prix total et cliquez sur 'Réserver'. Confirmez votre réservation et effectuez le paiement sécurisé."
        },
        {
          question: "Puis-je annuler une réservation ?",
          answer: "Oui, vous pouvez annuler selon les conditions du propriétaire. L'annulation gratuite est généralement possible jusqu'à 24h avant le début de la location."
        }
      ]
    },
    {
      title: "Paiements et facturation",
      items: [
        {
          question: "Quels moyens de paiement sont acceptés ?",
          answer: "Nous acceptons toutes les cartes bancaires (Visa, Mastercard, American Express) via notre partenaire sécurisé Stripe."
        },
        {
          question: "Y a-t-il des frais de service ?",
          answer: "Kiwiiz prélève une commission de 5% sur le montant total de la location. Ce montant est inclus dans le prix affiché lors de la réservation."
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Questions Fréquentes</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trouvez rapidement les réponses à vos questions sur l'utilisation de Kiwiiz
            </p>
          </div>
        </div>

        {/* Barre de recherche */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher dans la FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* FAQ Content */}
        {filteredCategories.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                Aucun résultat trouvé pour "{searchTerm}".
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Essayez avec d'autres mots-clés ou{' '}
                <Link to="/contact" className="text-primary hover:underline">
                  contactez notre support
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">{category.title}</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {category.items.map((item, itemIndex) => (
                      <AccordionItem key={itemIndex} value={`item-${categoryIndex}-${itemIndex}`}>
                        <AccordionTrigger className="text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground leading-relaxed">
                            {item.answer}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Contact support */}
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Vous ne trouvez pas la réponse ?</h3>
            <p className="text-muted-foreground mb-4">
              Notre équipe support est là pour vous aider
            </p>
            <Link to="/contact">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
                Contacter le support
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}