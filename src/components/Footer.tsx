
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t mt-16">
      <div className="kiwiiz-container py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-kiwiiz-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-2xl font-bold text-kiwiiz-primary">Kiwiiz</span>
            </div>
            <p className="text-gray-500 max-w-xs">
              La plateforme qui facilite la location et les services entre particuliers, juste à côté de chez vous.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-kiwiiz-primary hover:text-kiwiiz-dark">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-kiwiiz-primary hover:text-kiwiiz-dark">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-kiwiiz-primary hover:text-kiwiiz-dark">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-kiwiiz-primary">Accueil</Link></li>
              <li><Link to="/categories" className="text-gray-600 hover:text-kiwiiz-primary">Catégories</Link></li>
              <li><Link to="/comment-ca-marche" className="text-gray-600 hover:text-kiwiiz-primary">Comment ça marche</Link></li>
              <li><Link to="/deposer-annonce" className="text-gray-600 hover:text-kiwiiz-primary">Déposer une annonce</Link></li>
            </ul>
          </div>
          
          {/* Pages légales */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Informations légales</h3>
            <ul className="space-y-2">
              <li><Link to="/conditions-generales" className="text-gray-600 hover:text-kiwiiz-primary">Conditions générales</Link></li>
              <li><Link to="/politique-confidentialite" className="text-gray-600 hover:text-kiwiiz-primary">Politique de confidentialité</Link></li>
              <li><Link to="/mentions-legales" className="text-gray-600 hover:text-kiwiiz-primary">Mentions légales</Link></li>
              <li><Link to="/cookies" className="text-gray-600 hover:text-kiwiiz-primary">Gestion des cookies</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">support@kiwiiz.fr</li>
              <li><Link to="/contact" className="text-gray-600 hover:text-kiwiiz-primary">Formulaire de contact</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-kiwiiz-primary">FAQ</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-10 pt-6 text-center">
          <p className="text-gray-500">© {currentYear} Kiwiiz. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
