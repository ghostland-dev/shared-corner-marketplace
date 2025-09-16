
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
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">K</span>
              </div>
              <span className="text-2xl font-bold text-primary">Kiwiiz</span>
            </div>
            <p className="text-gray-500 max-w-xs">
              La plateforme qui facilite la location et les services entre particuliers, juste à côté de chez vous.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors">Catégories</Link></li>
              <li><Link to="/comment-ca-marche" className="text-muted-foreground hover:text-primary transition-colors">Comment ça marche</Link></li>
              <li><Link to="/deposer-annonce" className="text-muted-foreground hover:text-primary transition-colors">Déposer une annonce</Link></li>
            </ul>
          </div>
          
          {/* Pages légales */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Informations légales</h3>
            <ul className="space-y-2">
              <li><Link to="/conditions-generales" className="text-muted-foreground hover:text-primary transition-colors">Conditions générales</Link></li>
              <li><Link to="/politique-confidentialite" className="text-muted-foreground hover:text-primary transition-colors">Politique de confidentialité</Link></li>
              <li><Link to="/mentions-legales" className="text-muted-foreground hover:text-primary transition-colors">Mentions légales</Link></li>
              <li><Link to="/cookies" className="text-muted-foreground hover:text-primary transition-colors">Gestion des cookies</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">support@kiwiiz.fr</li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Formulaire de contact</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-10 pt-6 text-center">
          <p className="text-muted-foreground">© {currentYear} Kiwiiz. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
