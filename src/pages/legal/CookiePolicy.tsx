
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="kiwiiz-container py-12">
          <h1 className="text-4xl font-bold mb-8">Gestion des Cookies</h1>
          
          <div className="prose max-w-none">
            <h2>Qu'est-ce qu'un cookie ?</h2>
            <p>Un cookie est un petit fichier texte déposé sur votre terminal lors de la visite d'un site web.</p>
            
            <h2>Les cookies que nous utilisons</h2>
            <ul>
              <li>Cookies techniques (nécessaires au fonctionnement du site)</li>
              <li>Cookies de performance (analyse d'audience)</li>
              <li>Cookies de personnalisation</li>
            </ul>
            
            <h2>Gestion de vos préférences</h2>
            <p>Vous pouvez à tout moment modifier vos préférences concernant les cookies.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
