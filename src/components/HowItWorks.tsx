
import { CheckCircle } from 'lucide-react';

const steps = [
  {
    title: "Recherchez",
    description: "Trouvez l'objet ou le service dont vous avez besoin près de chez vous."
  },
  {
    title: "Contactez",
    description: "Échangez avec le propriétaire pour organiser la location."
  },
  {
    title: "Louez",
    description: "Effectuez le paiement sécurisé et profitez du service."
  },
  {
    title: "Évaluez",
    description: "Laissez un avis pour partager votre expérience."
  }
];

const HowItWorks = () => {
  return (
    <section className="bg-kiwiiz-light py-16">
      <div className="kiwiiz-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Comment ça marche ?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kiwiiz simplifie la location entre particuliers en quelques étapes simples
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="kiwiiz-card p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-kiwiiz-primary flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
              </div>
              <h3 className="font-bold text-xl mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-6">Les avantages de Kiwiiz</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-start">
              <CheckCircle className="text-kiwiiz-primary h-6 w-6 mr-2 flex-shrink-0" />
              <p className="text-left">Location sécurisée avec assurance incluse</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-kiwiiz-primary h-6 w-6 mr-2 flex-shrink-0" />
              <p className="text-left">Économisez de l'argent en louant au lieu d'acheter</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-kiwiiz-primary h-6 w-6 mr-2 flex-shrink-0" />
              <p className="text-left">Rencontrez des personnes de votre quartier</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
