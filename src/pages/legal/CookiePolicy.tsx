
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="kiwiiz-container py-12">
          <h1 className="text-4xl font-bold mb-8">Gestion des Cookies</h1>
          
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mt-6 mb-4">Qu'est-ce qu'un cookie ?</h2>
            <p>Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, mobile) lors de la visite d'un site web. Il permet au site de mémoriser vos actions et préférences (nom d'utilisateur, langue, taille des caractères et autres paramètres d'affichage) pendant un temps donné, pour que vous n'ayez pas à les réindiquer à chaque nouvelle visite.</p>
            
            <h2 className="text-2xl font-semibold mt-6 mb-4">Les cookies que nous utilisons</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Cookies techniques</strong> : nécessaires au bon fonctionnement du site, ils permettent d'utiliser les principales fonctionnalités du site (comme l'accès à votre compte).
              </li>
              <li>
                <strong>Cookies de performance</strong> : utilisés pour l'analyse d'audience et nous permettent de connaître l'utilisation et les performances de notre site, d'établir des statistiques et volumes de fréquentation et d'utilisation des divers éléments de notre site (contenus visités, parcours).
              </li>
              <li>
                <strong>Cookies de personnalisation</strong> : permettent d'adapter la présentation du site aux préférences d'affichage de votre terminal (langue, résolution d'affichage).
              </li>
              <li>
                <strong>Cookies publicitaires</strong> : permettent de vous proposer des contenus publicitaires adaptés à vos centres d'intérêt.
              </li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-6 mb-4">Gestion de vos préférences</h2>
            <p>Vous pouvez à tout moment modifier vos préférences concernant les cookies en cliquant sur le bouton ci-dessous.</p>
            
            <div className="my-6">
              <Button variant="outline" className="mr-4">Accepter tous les cookies</Button>
              <Button variant="outline">Personnaliser mes préférences</Button>
            </div>
            
            <h2 className="text-2xl font-semibold mt-6 mb-4">Durée de conservation des cookies</h2>
            <p>Les cookies sont conservés pour une durée maximale de 13 mois.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
