import React from 'react';
import { Shield, Users, Zap, Award, Heart, Lightbulb, Target, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Sécurité",
      description: "Transactions sécurisées et vérification des utilisateurs pour votre tranquillité d'esprit."
    },
    {
      icon: Users,
      title: "Communauté",
      description: "Une communauté bienveillante de particuliers qui s'entraident au quotidien."
    },
    {
      icon: Zap,
      title: "Simplicité",
      description: "Une plateforme intuitive qui rend la location entre particuliers accessible à tous."
    },
    {
      icon: Award,
      title: "Qualité",
      description: "Des annonces vérifiées et un système d'évaluation pour garantir la qualité."
    }
  ];

  const stats = [
    { number: "50,000+", label: "Utilisateurs actifs" },
    { number: "25,000+", label: "Annonces publiées" },
    { number: "100,000+", label: "Locations réussies" },
    { number: "4.8/5", label: "Note moyenne" }
  ];

  const team = [
    {
      name: "Marie Dubois",
      role: "CEO & Fondatrice",
      description: "Passionnée par l'économie collaborative et l'innovation technologique.",
      avatar: "/placeholder.svg"
    },
    {
      name: "Thomas Martin",
      role: "CTO",
      description: "Expert en développement web et sécurité des données.",
      avatar: "/placeholder.svg"
    },
    {
      name: "Sophie Laurent",
      role: "Head of Community",
      description: "Dédiée à l'expérience utilisateur et au développement communautaire.",
      avatar: "/placeholder.svg"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4" variant="outline">
                <Heart className="w-4 h-4 mr-2" />
                À propos de Kiwiiz
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                L'économie collaborative 
                <span className="text-primary"> réinventée</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Kiwiiz connecte les particuliers pour partager, louer et échanger leurs biens. 
                Nous croyons en un monde plus durable et solidaire où chacun peut tirer parti 
                de ses ressources inutilisées.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => window.location.href = '/auth'}>
                  Rejoindre la communauté
                </Button>
                <Button size="lg" variant="outline" onClick={() => window.location.href = '/comment-ca-marche'}>
                  Comment ça marche
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Notre mission</h2>
                <p className="text-xl text-muted-foreground">
                  Transformer la façon dont les gens partagent et utilisent leurs ressources
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-6 h-6 text-primary" />
                      Pourquoi Kiwiiz ?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Nous avons créé Kiwiiz parce que nous croyons que chacun possède des objets 
                      qui pourraient être utiles à d'autres. Plutôt que de laisser dormir ces 
                      ressources, pourquoi ne pas les partager et créer des liens au sein de sa communauté ?
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-6 h-6 text-primary" />
                      Impact positif
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      En facilitant le partage entre particuliers, nous contribuons à réduire 
                      la surconsommation, à créer du lien social et à permettre à chacun de 
                      générer des revenus complémentaires tout en rendant service.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos valeurs</h2>
                <p className="text-xl text-muted-foreground">
                  Les principes qui guident chacune de nos décisions
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <value.icon className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Notre équipe</h2>
                <p className="text-xl text-muted-foreground">
                  Des passionnés dédiés à votre expérience
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {team.map((member, index) => (
                  <Card key={index} className="text-center border-0 shadow-lg">
                    <CardHeader>
                      <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-primary font-medium">{member.role}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {member.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Prêt à rejoindre l'aventure ?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Rejoignez des milliers d'utilisateurs qui font confiance à Kiwiiz 
                pour leurs locations entre particuliers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" onClick={() => window.location.href = '/auth'}>
                  Créer mon compte
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" onClick={() => window.location.href = '/contact'}>
                  Nous contacter
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

export default About;