import React from 'react';
import { ArrowLeft, Search, MessageCircle, CreditCard, HandHeart, Shield, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Recherchez",
      description: "Trouvez l'objet dont vous avez besoin grâce à notre moteur de recherche intelligent",
      icon: Search,
      color: "bg-blue-500",
      details: [
        "Recherche par mot-clé, catégorie ou localisation",
        "Filtres avancés (prix, disponibilité, distance)",
        "Suggestions personnalisées basées sur vos besoins"
      ]
    },
    {
      number: 2,
      title: "Contactez",
      description: "Échangez avec le propriétaire pour organiser la location",
      icon: MessageCircle,
      color: "bg-green-500",
      details: [
        "Messagerie intégrée sécurisée",
        "Profils vérifiés et évaluations",
        "Planification des rendez-vous de remise"
      ]
    },
    {
      number: 3,
      title: "Réservez",
      description: "Confirmez votre réservation et effectuez le paiement sécurisé",
      icon: CreditCard,
      color: "bg-purple-500",
      details: [
        "Paiement sécurisé via Stripe",
        "Assurance incluse sur chaque location",
        "Confirmation instantanée par email"
      ]
    },
    {
      number: 4,
      title: "Profitez",
      description: "Récupérez l'objet et profitez de votre location en toute tranquillité",
      icon: HandHeart,
      color: "bg-orange-500",
      details: [
        "Remise en main propre ou point de retrait",
        "Support client disponible 7j/7",
        "Évaluation mutuelle après la location"
      ]
    }
  ];

  const advantages = [
    {
      icon: Shield,
      title: "Sécurisé",
      description: "Paiements sécurisés, profils vérifiés et assurance incluse"
    },
    {
      icon: Star,
      title: "Évalué",
      description: "Système d'évaluations pour garantir la qualité des échanges"
    },
    {
      icon: Users,
      title: "Communautaire",
      description: "Rejoignez une communauté de plus de 10 000 utilisateurs"
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Comment ça marche ?</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez comment Kiwiiz révolutionne la location d'objets entre particuliers en 4 étapes simples
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <Card className="mb-12 bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">La location d'objets, simplifiée</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Que vous souhaitiez louer ou mettre en location vos objets, Kiwiiz vous accompagne 
              à chaque étape pour des échanges sécurisés et conviviaux.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/auth">
                <Button size="lg">
                  Commencer maintenant
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="outline" size="lg">
                  Parcourir les objets
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">4 étapes pour une location réussie</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Notre processus a été conçu pour être simple, sécurisé et efficace
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className={`flex flex-col lg:flex-row ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className="lg:w-1/2 p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center`}>
                          <span className="text-white font-bold text-lg">{step.number}</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{step.title}</h3>
                          <Badge variant="outline">Étape {step.number}</Badge>
                        </div>
                      </div>
                      <p className="text-lg text-muted-foreground mb-6">{step.description}</p>
                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <span className="text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="lg:w-1/2 bg-muted/20 flex items-center justify-center p-8">
                      <div className={`w-24 h-24 rounded-full ${step.color} flex items-center justify-center`}>
                        <step.icon className="h-12 w-12 text-white" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Advantages */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Pourquoi choisir Kiwiiz ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Une plateforme pensée pour votre sécurité et votre satisfaction
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {advantages.map((advantage, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <advantage.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>{advantage.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{advantage.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="mt-12 bg-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Prêt à commencer ?</h2>
            <p className="text-lg mb-6 opacity-90">
              Rejoignez la communauté Kiwiiz et découvrez une nouvelle façon de consommer
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" variant="secondary">
                  S'inscrire gratuitement
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}