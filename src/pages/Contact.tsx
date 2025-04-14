
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="kiwiiz-container py-12">
          <h1 className="text-4xl font-bold text-center mb-12">Contactez-nous</h1>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Nos coordonnées</h2>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-kiwiiz-primary mr-4" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">support@kiwiiz.fr</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-kiwiiz-primary mr-4" />
                  <div>
                    <h3 className="font-medium">Téléphone</h3>
                    <p className="text-gray-600">01 23 45 67 89</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-kiwiiz-primary mr-4" />
                  <div>
                    <h3 className="font-medium">Adresse</h3>
                    <p className="text-gray-600">123 rue de Paris, 75000 Paris</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6">Formulaire de contact</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <Input type="text" placeholder="Votre nom" required />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input type="email" placeholder="votre@email.com" required />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <Textarea 
                    placeholder="Comment pouvons-nous vous aider ?" 
                    className="min-h-[150px]"
                    required 
                  />
                </div>

                <Button type="submit" className="kiwiiz-btn-primary w-full">
                  Envoyer le message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
