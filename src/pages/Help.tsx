import React, { useState } from 'react';
import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  ChevronRight,
  Shield,
  CreditCard,
  Home,
  Users,
  Settings,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      icon: Home,
      title: "Gestion des annonces",
      description: "Créer, modifier et optimiser vos annonces",
      count: 12
    },
    {
      icon: CreditCard,
      title: "Paiements et facturation",
      description: "Tout sur les transactions et les paiements",
      count: 8
    },
    {
      icon: Users,
      title: "Réservations",
      description: "Gérer vos demandes et confirmations",
      count: 15
    },
    {
      icon: Shield,
      title: "Sécurité et confiance",
      description: "Conseils pour des échanges sécurisés",
      count: 6
    },
    {
      icon: Settings,
      title: "Compte et paramètres",
      description: "Configuration de votre profil",
      count: 10
    },
    {
      icon: MessageCircle,
      title: "Communication",
      description: "Messages et notifications",
      count: 7
    }
  ];

  const faqGeneral = [
    {
      question: "Comment créer mon premier compte sur Kiwiiz ?",
      answer: "Pour créer votre compte, cliquez sur 'Connexion' puis 'Inscription'. Renseignez votre email, un mot de passe sécurisé et vos informations personnelles. Vous recevrez un email de confirmation pour activer votre compte."
    },
    {
      question: "Comment publier ma première annonce ?",
      answer: "Une fois connecté, cliquez sur 'Déposer une annonce'. Ajoutez des photos de qualité, rédigez un titre accrocheur, décrivez votre objet/service, fixez votre prix et définissez vos disponibilités. N'oubliez pas de préciser les conditions de location."
    },
    {
      question: "Comment Kiwiiz assure-t-il la sécurité des transactions ?",
      answer: "Kiwiiz utilise un système de paiement sécurisé avec cryptage SSL. Les paiements sont traités via Stripe, et nous proposons une assurance optionnelle. De plus, notre système d'évaluation permet de vérifier la fiabilité des utilisateurs."
    },
    {
      question: "Que faire si j'ai un problème avec une réservation ?",
      answer: "En cas de problème, contactez d'abord l'autre partie via notre messagerie. Si le problème persiste, utilisez notre centre de résolution de conflits ou contactez notre support client qui vous aidera à trouver une solution équitable."
    },
    {
      question: "Comment fonctionne le système d'évaluation ?",
      answer: "Après chaque location, le locataire et le propriétaire peuvent s'évaluer mutuellement. Ces notes et commentaires aident la communauté à faire des choix éclairés et encouragent les bonnes pratiques."
    }
  ];

  const faqOwners = [
    {
      question: "Comment optimiser mes annonces pour plus de visibilité ?",
      answer: "Utilisez des photos de haute qualité, rédigez des descriptions détaillées avec mots-clés pertinents, proposez des prix compétitifs, maintenez un taux de réponse élevé et collectez de bonnes évaluations."
    },
    {
      question: "Quand et comment suis-je payé ?",
      answer: "Le paiement est libéré 24h après le début de la location si aucun problème n'est signalé. Les fonds sont versés sur votre compte bancaire sous 2-5 jours ouvrés selon votre banque."
    },
    {
      question: "Puis-je refuser une demande de réservation ?",
      answer: "Oui, vous avez le droit de refuser une demande, mais cela peut affecter votre taux d'acceptation. Privilégiez les refus justifiés (dates indisponibles, profil incomplet, etc.)."
    }
  ];

  const faqRenters = [
    {
      question: "Comment faire une demande de réservation ?",
      answer: "Sur la page de l'annonce, sélectionnez vos dates, ajoutez un message de présentation et cliquez sur 'Réserver'. Le propriétaire a 24h pour répondre à votre demande."
    },
    {
      question: "Que faire avant de récupérer l'objet loué ?",
      answer: "Confirmez les détails avec le propriétaire (lieu, horaire, état), préparez une pièce d'identité, vérifiez l'état de l'objet et n'hésitez pas à poser des questions sur l'utilisation."
    },
    {
      question: "Comment annuler une réservation ?",
      answer: "Selon notre politique d'annulation, vous pouvez annuler jusqu'à 24h avant le début de la location pour un remboursement complet. Les annulations tardives peuvent entraîner des frais."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-background py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Centre d'aide Kiwiiz
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Trouvez rapidement les réponses à toutes vos questions
              </p>
              
              {/* Barre de recherche */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Rechercher dans l'aide (ex: comment créer une annonce)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact rapide */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Chat en direct
                <Badge variant="secondary" className="ml-2">En ligne</Badge>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                01 23 45 67 89
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                support@kiwiiz.com
              </Button>
            </div>
          </div>
        </section>

        {/* Catégories d'aide */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Parcourir par catégorie</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <category.icon className="w-6 h-6 text-primary" />
                        </div>
                        <Badge variant="secondary">{category.count} articles</Badge>
                      </div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{category.description}</p>
                      <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                        Voir les articles
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h2>
              
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="general">Questions générales</TabsTrigger>
                  <TabsTrigger value="owners">Pour les propriétaires</TabsTrigger>
                  <TabsTrigger value="renters">Pour les locataires</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general">
                  <Accordion type="single" collapsible className="w-full">
                    {faqGeneral.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="owners">
                  <Accordion type="single" collapsible className="w-full">
                    {faqOwners.map((faq, index) => (
                      <AccordionItem key={index} value={`owner-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="renters">
                  <Accordion type="single" collapsible className="w-full">
                    {faqRenters.map((faq, index) => (
                      <AccordionItem key={index} value={`renter-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Ressources supplémentaires */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Ressources utiles</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-primary" />
                      Guide du débutant
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Tout ce qu'il faut savoir pour bien commencer sur Kiwiiz
                    </p>
                    <Button variant="outline" className="w-full">
                      Consulter le guide
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      Conseils de sécurité
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Meilleures pratiques pour des échanges sécurisés
                    </p>
                    <Button variant="outline" className="w-full">
                      Lire les conseils
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      Signaler un problème
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Besoin d'aide immédiate ? Contactez notre équipe
                    </p>
                    <Button variant="outline" className="w-full">
                      Signaler
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Vous ne trouvez pas votre réponse ?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Notre équipe support est là pour vous aider 7j/7
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Démarrer une conversation
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  <Mail className="w-5 h-5 mr-2" />
                  Envoyer un email
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Help;