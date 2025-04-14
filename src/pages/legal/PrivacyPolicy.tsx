
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="kiwiiz-container py-12">
          <h1 className="text-4xl font-bold mb-8">Politique de Confidentialité</h1>
          
          <div className="prose max-w-none">
            <p>Dernière mise à jour : {new Date().toLocaleDateString()}</p>
            
            <h2>1. Collecte des données</h2>
            <p>Nous collectons uniquement les données nécessaires au bon fonctionnement de nos services.</p>
            
            <h2>2. Utilisation des données</h2>
            <p>Vos données sont utilisées pour améliorer votre expérience et assurer la sécurité de la plateforme.</p>
            
            <h2>3. Protection des données</h2>
            <p>Nous mettons en œuvre des mesures de sécurité pour protéger vos données personnelles.</p>
            
            <h2>4. Vos droits</h2>
            <p>Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
