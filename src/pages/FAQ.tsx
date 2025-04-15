
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const FAQ = () => {
  const faqs = [
    {
      question: "Comment fonctionne Kiwiiz ?",
      answer: "Kiwiiz est une plateforme qui permet aux particuliers de louer des objets et services entre eux. Vous pouvez déposer une annonce pour louer vos objets ou chercher ce dont vous avez besoin près de chez vous."
    },
    {
      question: "Comment sont sécurisés les paiements ?",
      answer: "Les paiements sont gérés de manière sécurisée par notre partenaire de paiement. L'argent est conservé jusqu'à ce que la location soit terminée et que tout se soit bien passé."
    },
    {
      question: "Que faire en cas de problème avec une location ?",
      answer: "En cas de problème, vous pouvez contacter directement le propriétaire via notre messagerie intégrée. Si le problème persiste, notre service client est disponible pour vous aider à résoudre la situation."
    },
    {
      question: "Comment puis-je annuler une réservation ?",
      answer: "Vous pouvez annuler une réservation depuis votre espace personnel. Les conditions d'annulation dépendent du délai avant le début de la location."
    },
    {
      question: "Comment sont calculés les frais de service ?",
      answer: "Les frais de service sont calculés en fonction du montant de la location. Ils permettent de couvrir les frais de fonctionnement de la plateforme et d'assurer la sécurité des transactions."
    },
    {
      question: "Comment contacter le support client ?",
      answer: "Vous pouvez contacter notre équipe support par email à support@kiwiiz.fr ou via le formulaire de contact disponible sur notre site. Nous nous engageons à vous répondre sous 24h ouvrées."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="kiwiiz-container py-12">
          <h1 className="text-4xl font-bold text-center mb-4">Questions fréquentes</h1>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Trouvez rapidement des réponses aux questions les plus fréquemment posées sur Kiwiiz
          </p>

          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left hover:text-kiwiiz-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pt-2 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
