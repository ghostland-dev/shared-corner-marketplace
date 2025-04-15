
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
            <h2 className="text-2xl font-semibold mt-6 mb-4">Éditeur du site</h2>
            <p>
              Kiwiiz SAS<br />
              123 rue de Paris<br />
              75000 Paris<br />
              France<br />
              SIRET: 123 456 789 00012<br />
              Capital social: 10 000€
            </p>
            
            <h2 className="text-2xl font-semibold mt-6 mb-4">Contact</h2>
            <p>
              Email: <a href="mailto:contact@kiwiiz.fr" className="text-kiwiiz-primary hover:underline">contact@kiwiiz.fr</a><br />
              Téléphone: 01 23 45 67 89<br />
              Adresse: 123 rue de Paris, 75000 Paris
            </p>
            
            <h2 className="text-2xl font-semibold mt-6 mb-4">Directeur de la publication</h2>
            <p>
              Jean Dupont<br />
              Email: <a href="mailto:jean.dupont@kiwiiz.fr" className="text-kiwiiz-primary hover:underline">jean.dupont@kiwiiz.fr</a>
            </p>
            
            <h2 className="text-2xl font-semibold mt-6 mb-4">Hébergement</h2>
            <p>
              Le site est hébergé par:<br />
              Société d'hébergement<br />
              123 rue de l'Hébergeur<br />
              75000 Paris<br />
              Email: <a href="mailto:contact@hebergeur.fr" className="text-kiwiiz-primary hover:underline">contact@hebergeur.fr</a><br />
              Téléphone: 01 23 45 67 89
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalNotice;
