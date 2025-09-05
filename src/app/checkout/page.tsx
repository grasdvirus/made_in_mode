
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
    if (cartItems.length === 0 && !isSubmitting) {
      toast({
        title: 'Panier vide',
        description: 'Votre panier est vide. Vous allez être redirigé.',
        variant: 'destructive',
      });
      router.push('/cart');
    }
  }, [cartItems, router, toast, isSubmitting]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 50000 || subtotal === 0 ? 0 : 5000;
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
      clearCart();
      toast({
        title: 'Commande Soumise !',
        description: 'Merci pour votre confiance. Nous allons vérifier votre paiement et traiter votre commande.',
      });
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
    <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[80vh]">
            
            {/* Left Side: Payment Info & Customer Form */}
            <div className="space-y-8">
                <Card className="border-primary/50 bg-secondary/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3"><CreditCard /> Paiement Manuel</CardTitle>
                        <CardDescription>Pour finaliser votre commande, veuillez effectuer un transfert via l'un des services ci-dessous.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="font-semibold">Veuillez envoyer le montant total de <strong className="text-primary">FCFA {total.toLocaleString()}</strong> à l'un des contacts suivants :</p>
                        <div className="p-4 bg-background/50 rounded-lg space-y-3">
                            <div className="flex items-start gap-3">
                                <span className="text-primary mt-1">&#9830;</span>
                                <div>
                                    <p className="font-semibold">Orange Money :</p>
                                    <p className="text-muted-foreground">+225 07 08 22 56 82 (Nom: N'guia Achi Nadege)</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-primary mt-1">&#9830;</span>
                                <div>
                                    <p className="font-semibold">WAVE :</p>
                                    <p className="text-muted-foreground">+225 05 03 65 48 86</p>
                                </div>
                            </div>
                              <div className="flex items-start gap-3">
                                <span className="text-primary mt-1">&#9830;</span>
                                <div>
                                    <p className="font-semibold">WAVE :</p>
                                    <p className="text-muted-foreground">+225 07 08 22 56 82</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Après le paiement, veuillez remplir et soumettre le formulaire avec vos informations de livraison. Nous vous contacterons pour confirmer.</p>
                    </CardContent>
                </Card>

                <Card className="bg-secondary/30 border-none">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3"><Info/> Vos Informations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Nom complet</Label>
                                <Input id="fullName" {...register('fullName')} placeholder="Prénom et Nom" className="bg-background"/>
                                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Numéro de téléphone</Label>
                                <Input id="phone" type="tel" {...register('phone')} placeholder="Pour la confirmation de la commande" className="bg-background" />
                                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Adresse de livraison complète</Label>
                                <Textarea id="address" {...register('address')} placeholder="ex: Cité Keur Gorgui, Villa 123, Dakar" className="bg-background"/>
                                {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="transactionId">ID/Référence de la transaction</Label>
                                <Input id="transactionId" {...register('transactionId')} placeholder="ID de la transaction ou nom de l'expéditeur" className="bg-background" />
                                {errors.transactionId && <p className="text-sm text-destructive">{errors.transactionId.message}</p>}
                            </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Side: Order Summary */}
            <div className="sticky top-24 h-fit">
                <Card className="bg-secondary/30 border-none">
                    <CardHeader>
                        <CardTitle>Résumé de la commande</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id + item.size + item.color} className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">Qté: {item.quantity}</p>
                                    </div>
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
                                <span>Total</span>
                                <span>FCFA {total.toLocaleString()}</span>
                            </div>
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
            </div>
        </div>
    </form>
  );
}
