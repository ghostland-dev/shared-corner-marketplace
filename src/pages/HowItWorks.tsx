
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Clock, Users, MessageSquare } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Clock,
      title: 'Gagnez du temps',
      description: 'Trouvez rapidement ce dont vous avez besoin près de chez vous'
    },
    {
      icon: Shield,
      title: 'En toute sécurité',
      description: 'Paiements sécurisés et vérification des utilisateurs'
    },
    {
      icon: Users,
      title: 'Communauté de confiance',
      description: 'Système d\'évaluation et de commentaires'
    },
    {
      icon: MessageSquare,
      title: 'Communication facile',
      description: 'Messagerie intégrée pour échanger avec les propriétaires'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="kiwiiz-container py-12">
          <h1 className="text-4xl font-bold text-center mb-8">Comment ça marche ?</h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {steps.map((step, index) => (
              <div key={index} className="p-6 border rounded-lg text-center hover:shadow-lg transition-shadow">
                <step.icon className="w-12 h-12 mx-auto mb-4 text-kiwiiz-primary" />
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/deposer-annonce">
              <Button className="kiwiiz-btn-primary">
                Déposer une annonce
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
