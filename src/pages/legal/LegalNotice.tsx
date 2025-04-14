
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LegalNotice = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="kiwiiz-container py-12">
          <h1 className="text-4xl font-bold mb-8">Mentions Légales</h1>
          
          <div className="prose max-w-none">
            <h2>Éditeur du site</h2>
            <p>
              Kiwiiz SAS<br />
              123 rue de Paris<br />
              75000 Paris<br />
              France
            </p>
            
            <h2>Contact</h2>
            <p>
              Email : contact@kiwiiz.fr<br />
              Téléphone : 01 23 45 67 89
            </p>
            
            <h2>Hébergement</h2>
            <p>
              Le site est hébergé par :<br />
              Société d'hébergement<br />
              Adresse de l'hébergeur<br />
              Contact hébergeur
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalNotice;
