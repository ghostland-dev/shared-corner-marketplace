
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="kiwiiz-container py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="text-8xl font-bold text-kiwiiz-primary mb-6">404</div>
            <h1 className="text-3xl font-bold mb-4">Page introuvable</h1>
            <p className="text-gray-600 mb-8">
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <Link to="/" className="kiwiiz-btn-primary inline-flex items-center">
              <Home className="mr-2 h-5 w-5" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
