
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, X, CreditCard, ShoppingCart, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';

type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  hint: string;
  size: string;
  color: string;
};

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: 'T-shirt Épuré',
    category: 'Hauts',
    price: 20000,
    quantity: 1,
    image: 'https://placehold.co/200x200.png',
    hint: 'white t-shirt',
    size: 'M',
    color: 'Blanc',
  },
  {
    id: 2,
    name: 'Jean Slim Urbain',
    category: 'Pantalons',
    price: 45000,
    quantity: 1,
    image: 'https://placehold.co/200x200.png',
    hint: 'black jeans',
    size: '32/32',
    color: 'Noir délavé',
  },
  {
    id: 3,
    name: 'Baskets en Cuir',
    category: 'Chaussures',
    price: 65000,
    quantity: 1,
    image: 'https://placehold.co/200x200.png',
    hint: 'leather sneakers',
    size: '42',
    color: 'Cognac',
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setAnimate(true);
  }, []);
  
  const updateQuantity = (id: number, delta: number) => {
    setCartItems(
      cartItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 30000 ? 0 : 5000;
  const total = subtotal + shipping;

  return (
    <div className="bg-background rounded-t-3xl sm:p-6 min-h-[80vh] shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 sm:p-0">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
           <h2 className="text-2xl font-bold flex items-center gap-3">
              <ShoppingCart className="w-7 h-7 text-primary" />
              Mon Panier ({cartItems.length})
            </h2>
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <Card
                key={item.id}
                className={cn(
                    "flex items-center gap-4 p-4 bg-secondary/50 border-none transition-all duration-500 ease-out",
                    animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover" data-ai-hint={item.hint}/>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                   <p className="text-sm text-muted-foreground">Taille: {item.size} / Couleur: {item.color}</p>
                  <p className="font-bold text-lg mt-1">FCFA {item.price.toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end justify-between h-full">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full h-8 w-8" onClick={() => removeItem(item.id)}>
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-2 border rounded-full p-1">
                    <Button variant="ghost" size="icon" className="rounded-full h-6 w-6" onClick={() => updateQuantity(item.id, -1)}>
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-6 text-center font-medium">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="rounded-full h-6 w-6" onClick={() => updateQuantity(item.id, 1)}>
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
                <Button className="mt-4">Commencer mes achats</Button>
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
                <span className="font-medium">FCFA {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span className="font-medium">{shipping === 0 ? 'Gratuite' : `FCFA ${shipping.toLocaleString()}`}</span>
              </div>
               <div className="flex items-center gap-2">
                 <Input placeholder="Code promo" className="bg-background/50 border-border" />
                 <Button variant="outline" className="shrink-0">Appliquer</Button>
               </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>FCFA {total.toLocaleString()}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg group">
                Passer au paiement <CreditCard className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
