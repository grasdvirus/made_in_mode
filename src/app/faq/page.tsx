
'use client';

import React from 'react';
import Footer from '@/components/footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const faqData = [
  {
    question: "Comment passer une commande ?",
    answer: "C'est très simple ! Parcourez nos collections, ajoutez vos articles préférés au panier, puis cliquez sur 'Passer au paiement'. Vous serez redirigé vers une page où vous trouverez nos informations pour le paiement manuel (Orange Money, Wave). Une fois le paiement effectué, remplissez le formulaire avec vos informations de livraison et l'ID de la transaction, puis confirmez. Nous vous contacterons rapidement pour valider votre commande."
  },
  {
    question: "Quels sont les délais de livraison ?",
    answer: "Pour les livraisons à Abidjan, nous livrons généralement en 24 à 48 heures après la confirmation de votre paiement. Pour les autres villes de Côte d'Ivoire, le délai est de 2 à 5 jours ouvrés. Les livraisons internationales varient selon la destination mais nous vous fournirons une estimation précise lors de la confirmation."
  },
  {
    question: "Quelle est votre politique de retour et d'échange ?",
    answer: "Votre satisfaction est notre priorité. Si un article ne vous convient pas, vous disposez d'un délai de 7 jours après réception pour demander un échange ou un avoir. L'article doit être retourné dans son état d'origine, non porté et avec ses étiquettes. Les frais de retour sont à votre charge, sauf en cas d'erreur de notre part. Veuillez nous contacter pour initier le processus."
  },
  {
    question: "Comment puis-je suivre ma commande ?",
    answer: "Une fois votre commande confirmée et expédiée, nous vous enverrons une notification par SMS ou WhatsApp avec les détails pour le suivi, si un numéro de suivi est fourni par le transporteur. Pour les livraisons locales, notre livreur vous contactera directement avant son passage."
  },
  {
    question: "Les paiements sont-ils sécurisés ?",
    answer: "Nous utilisons des méthodes de paiement mobile réputées et sécurisées comme Orange Money et Wave. Votre transaction est protégée par les systèmes de sécurité de ces opérateurs. Conservez toujours votre référence de transaction, elle nous sert de preuve pour valider votre commande."
  },
  {
    question: "Comment choisir la bonne taille ?",
    answer: "Chaque page produit dispose d'informations détaillées sur la composition et la coupe du vêtement. Nous indiquons souvent la taille portée par le mannequin et ses mensurations pour vous aider. Si vous hésitez entre deux tailles, nous vous conseillons de prendre la plus grande ou de nous contacter directement pour un conseil personnalisé."
  }
];

export default function FaqPage() {
  return (
    <div className="bg-background text-foreground -mx-4 -mt-8">
      <header className="bg-secondary py-16 text-center rounded-b-3xl">
          <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">Foire Aux Questions</h1>
              <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                  Trouvez ici les réponses à vos questions les plus fréquentes. Si vous ne trouvez pas ce que vous cherchez, n'hésitez pas à nous contacter.
              </p>
          </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20 space-y-16">
        <section>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-secondary/50 border-border/50 rounded-2xl px-6">
                <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="bg-secondary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold">Vous ne trouvez pas de réponse ?</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Notre équipe est là pour vous aider. Contactez-nous directement et nous nous ferons un plaisir de vous assister.</p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-6">
                <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary"/>
                    <a href="mailto:contact@aceplace.com" className="hover:underline">contact@aceplace.com</a>
                </div>
                 <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary"/>
                    <a href="tel:+2250708225682" className="hover:underline">+225 07 08 22 56 82</a>
                </div>
            </div>
             <Button size="lg" className="mt-8" asChild>
                <Link href="/discover">Explorer nos produits</Link>
             </Button>
        </section>
      </main>

       <Footer />
    </div>
  );
}
