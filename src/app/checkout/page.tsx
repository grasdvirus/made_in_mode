
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AlertCircle, CreditCard, Info, Loader2, Send } from 'lucide-react';
import { submitOrder } from './actions';
import { Textarea } from '@/components/ui/textarea';

const CheckoutFormSchema = z.object({
  fullName: z.string().min(3, 'Le nom complet est requis'),
  phone: z.string().min(8, 'Un numéro de téléphone valide est requis'),
  address: z.string().min(10, 'Une adresse de livraison complète est requise'),
  transactionId: z.string().min(5, 'Une référence de transaction est requise'),
});

type CheckoutFormValues = z.infer<typeof CheckoutFormSchema>;

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(CheckoutFormSchema),
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      toast({
        title: 'Panier vide',
        description: 'Votre panier est vide. Vous allez être redirigé.',
        variant: 'destructive',
      });
      router.push('/cart');
    }
  }, [cartItems, router, toast]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 50000 ? 0 : 5000;
  const total = subtotal + shipping;

  const onSubmit: SubmitHandler<CheckoutFormValues> = async (data) => {
    setIsSubmitting(true);
    const orderData = {
      ...data,
      cartItems,
      total,
    };
    
    const result = await submitOrder(orderData);
    
    if (result.success) {
      toast({
        title: 'Commande Soumise !',
        description: 'Merci pour votre confiance. Nous allons vérifier votre paiement et traiter votre commande.',
      });
      clearCart();
      router.push('/');
    } else {
      toast({
        title: 'Erreur',
        description: result.message || 'Une erreur est survenue lors de la soumission de votre commande.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8" /></div>;
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[80vh]">
        
        {/* Left Side: Order Summary & Payment Info */}
        <div className="space-y-6">
            <Card className="bg-secondary/50 border-none">
                 <CardHeader>
                    <CardTitle>Résumé de votre commande</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                     {cartItems.map(item => (
                         <div key={item.id} className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-md overflow-hidden">
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">{item.quantity}</span>
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-muted-foreground">{item.size} / {item.color}</p>
                            </div>
                            <p className="font-medium">FCFA {(item.price * item.quantity).toLocaleString()}</p>
                         </div>
                     ))}
                     <Separator />
                     <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Sous-total</span>
                            <span className="font-medium">FCFA {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Livraison</span>
                            <span className="font-medium">FCFA {shipping.toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total à payer</span>
                            <span>FCFA {total.toLocaleString()}</span>
                        </div>
                     </div>
                 </CardContent>
            </Card>

            <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CreditCard /> Instructions de Paiement</CardTitle>
                    <CardDescription>Veuillez effectuer votre paiement avant de soumettre le formulaire.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <p>Veuillez transférer le montant total de <strong>FCFA {total.toLocaleString()}</strong> via l'une des méthodes ci-dessous :</p>
                     <div className="p-4 bg-background/50 rounded-lg space-y-2">
                        <div>
                            <p className="font-semibold">Orange Money / Wave</p>
                            <p className="text-muted-foreground">Numéro: <span className="font-mono text-foreground">+221 77 123 45 67</span></p>
                            <p className="text-muted-foreground">Nom: <span className="text-foreground">Vanessa Ace</span></p>
                        </div>
                        <Separator/>
                         <div>
                            <p className="font-semibold">Virement Bancaire</p>
                            <p className="text-muted-foreground">Banque: <span className="text-foreground">UBA Sénégal</span></p>
                            <p className="text-muted-foreground">Titulaire: <span className="text-foreground">ACEPLACE SARL</span></p>
                            <p className="text-muted-foreground">IBAN: <span className="font-mono text-foreground">SN01 2002 1001 123456789012 85</span></p>
                        </div>
                     </div>
                     <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/50 text-destructive">
                         <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0"/>
                         <p className="text-xs">Après le paiement, veuillez utiliser l'ID de la transaction ou le nom de l'expéditeur comme référence de transaction dans le formulaire ci-contre.</p>
                     </div>
                </CardContent>
            </Card>
        </div>

        {/* Right Side: Customer Form */}
        <div>
           <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="sticky top-24 bg-secondary/50 border-none">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Info/> Vos Informations</CardTitle>
                        <CardDescription>Remplissez vos informations pour finaliser la commande.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="fullName">Nom complet</Label>
                            <Input id="fullName" {...register('fullName')} placeholder="ex: Vanessa Ace" />
                            {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
                         </div>
                         <div className="space-y-2">
                            <Label htmlFor="phone">Numéro de téléphone</Label>
                            <Input id="phone" type="tel" {...register('phone')} placeholder="ex: 77 123 45 67" />
                            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                         </div>
                         <div className="space-y-2">
                            <Label htmlFor="address">Adresse de livraison complète</Label>
                            <Textarea id="address" {...register('address')} placeholder="ex: Cité Keur Gorgui, Villa 123, Dakar, Sénégal" />
                            {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
                         </div>
                         <div className="space-y-2">
                            <Label htmlFor="transactionId">ID/Référence de la transaction</Label>
                            <Input id="transactionId" {...register('transactionId')} placeholder="ID de la transaction ou nom de l'expéditeur" />
                            {errors.transactionId && <p className="text-sm text-destructive">{errors.transactionId.message}</p>}
                         </div>
                    </CardContent>
                    <CardFooter>
                         <Button type="submit" size="lg" className="w-full text-lg" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                  Soumission en cours...
                                </>
                            ) : (
                                <>
                                  <Send className="mr-2 h-5 w-5" />
                                  Confirmer ma commande
                                </>
                            )}
                         </Button>
                    </CardFooter>
            </Card>
           </form>
        </div>
    </div>
  );
}
