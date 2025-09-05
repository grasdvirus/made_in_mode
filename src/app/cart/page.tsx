
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, X, CreditCard, ShoppingCart, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cartItems, updateQuantity, removeItem } = useCart();
  const [animate, setAnimate] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Trigger entrance animation
    setAnimate(true);
  }, []);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Panier Vide",
        description: "Vous ne pouvez pas passer au paiement avec un panier vide.",
        variant: "destructive",
      });
      return;
    }
    router.push('/checkout');
  };
  
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50000 ? 0 : 5000;
  const total = subtotal + shipping;

  return (
    <div className="bg-background rounded-t-3xl p-4 sm:p-0 min-h-[80vh] shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
           <h2 className="text-2xl font-bold flex items-center gap-3">
              <ShoppingCart className="w-7 h-7 text-primary" />
              Mon Panier ({cartItems.length})
            </h2>
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <Card
                key={item.id + item.size + item.color}
                className={cn(
                    "flex items-center gap-4 p-4 bg-secondary/50 border-none transition-all duration-500 ease-out",
                    animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Link href={`/discover/${item.id}`} className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" data-ai-hint={item.hint}/>
                </Link>
                <div className="flex-grow">
                   <Link href={`/discover/${item.id}`}>
                      <h3 className="font-semibold hover:underline">{item.name}</h3>
                   </Link>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                   <p className="text-sm text-muted-foreground">Taille: {item.size} / Couleur: {item.color}</p>
                  <p className="font-bold text-lg mt-1">FCFA {item.price.toLocaleString('fr-FR')}</p>
                </div>
                <div className="flex flex-col items-end justify-between h-full">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full h-8 w-8" onClick={() => removeItem(item.id, item.size, item.color)}>
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-2 border rounded-full p-1">
                    <Button variant="ghost" size="icon" className="rounded-full h-6 w-6" onClick={() => updateQuantity(item.id, item.size, item.color, -1)}>
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-6 text-center font-medium">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="rounded-full h-6 w-6" onClick={() => updateQuantity(item.id, item.size, item.color, 1)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="flex flex-col items-center justify-center p-12 text-center bg-secondary/50 border-dashed">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">Votre panier est vide</h3>
                <p className="text-muted-foreground mt-2">Parcourez nos collections pour trouver votre bonheur !</p>
                <Button asChild className="mt-4">
                  <Link href="/discover">Commencer mes achats</Link>
                </Button>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg bg-secondary/50 border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Ticket className="w-7 h-7 text-primary" /> Résumé de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="font-medium">FCFA {subtotal.toLocaleString('fr-FR')}</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span className="font-medium">{shipping === 0 ? 'Gratuite' : `FCFA ${shipping.toLocaleString('fr-FR')}`}</span>
              </div>
               <div className="flex items-center gap-2">
                 <Input placeholder="Code promo" className="bg-background/50 border-border" />
                 <Button variant="outline" className="shrink-0">Appliquer</Button>
               </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>FCFA {total.toLocaleString('fr-FR')}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg group" onClick={handleCheckout}>
                Passer au paiement <CreditCard className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
