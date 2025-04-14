
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="kiwiiz-container py-12">
          <h1 className="text-4xl font-bold mb-8">Conditions Générales d'Utilisation</h1>
          
          <div className="prose max-w-none">
            <p>Dernière mise à jour : {new Date().toLocaleDateString()}</p>
            
            <h2>1. Introduction</h2>
            <p>Les présentes Conditions Générales d'Utilisation régissent l'utilisation de la plateforme Kiwiiz.</p>
            
            <h2>2. Services proposés</h2>
            <p>Kiwiiz est une plateforme de mise en relation entre particuliers pour la location d'objets et de services.</p>
            
            <h2>3. Inscription et compte</h2>
            <p>Pour utiliser nos services, vous devez créer un compte et fournir des informations exactes et à jour.</p>
            
            <h2>4. Responsabilités</h2>
            <p>Les utilisateurs sont responsables des objets qu'ils proposent à la location et de leur utilisation.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
