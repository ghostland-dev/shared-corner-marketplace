
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
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="kiwiiz-container py-12">
          <h1 className="text-4xl font-bold text-center mb-12">Questions fréquentes</h1>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
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
