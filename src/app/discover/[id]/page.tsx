
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ShoppingBag, Send, Palette, Ruler, MessageSquare, Plus, Heart } from 'lucide-react';
import { type Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { useRouter, useParams } from 'next/navigation';
import Loader from '@/components/ui/loader';
import '@/components/ui/loader.css';
import { useCart } from '@/hooks/use-cart';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { addReview, getReviews, type Review } from './actions';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [user, loadingAuth] = useAuthState(auth);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const productId = params.id as string;
  
  const [isFavorited, setIsFavorited] = useState(false);
  
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<Product['colors'][0] | undefined>(undefined);
  const [reviewRating, setReviewRating] = useState(0);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [displayedReviews, setDisplayedReviews] = useState(10);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    async function fetchProductAndReviews() {
      setIsLoading(true);
      try {
        const [productResponse, reviewsResponse] = await Promise.all([
          fetch('/products.json'),
          getReviews(productId)
        ]);

        if (!productResponse.ok) throw new Error('Failed to fetch products');
        
        const products: Product[] = await productResponse.json();
        const foundProduct = products.find(p => p.id === productId);
        
        if (foundProduct) {
          const hydratedProduct: Product = {
            ...foundProduct,
            sizes: foundProduct.sizes || ['S', 'M', 'L'],
            colors: foundProduct.colors || [{ name: 'Default', hex: '#000000' }],
            originalPrice: foundProduct.originalPrice || foundProduct.price * 1.2,
            rating: foundProduct.rating || 4.5,
            reviews: reviewsResponse.length, // Update reviews count from fetched reviews
            category: foundProduct.category || 'Non classé',
            description: foundProduct.description || 'Aucune description disponible.'
          };
          setProduct(hydratedProduct);
          if (hydratedProduct.sizes?.length > 0) setSelectedSize(hydratedProduct.sizes[0]);
          if (hydratedProduct.colors?.length > 0) setSelectedColor(hydratedProduct.colors[0]);
        } else {
          setProduct(null);
        }
        setReviews(reviewsResponse);
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les détails du produit.' });
      } finally {
        setIsLoading(false);
      }
    }
    if (productId) fetchProductAndReviews();
  }, [productId, toast]);
  
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    toast({
        title: !isFavorited ? "Ajouté aux favoris!" : "Retiré des favoris",
    });
  };

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) {
        toast({ variant: "destructive", title: "Sélection requise", description: "Veuillez sélectionner une taille et une couleur." });
        return;
    }
    
    addItem({
        id: product.id!, name: product.name, price: product.price, quantity: 1,
        image: product.images[0], hint: product.hint || '', category: product.category,
        size: selectedSize, color: selectedColor.name,
    });
    
    toast({ title: "Ajouté au Panier!", description: `1 x ${product.name} (${selectedSize}, ${selectedColor.name})` });
  };
  
  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const reviewMessage = (form.elements.namedItem('review-message') as HTMLTextAreaElement).value;

    if (reviewRating === 0) {
        toast({ variant: 'destructive', title: 'Note requise', description: 'Veuillez sélectionner au moins une étoile.'});
        return;
    }
     if (!user) {
        toast({ variant: 'destructive', title: 'Connexion requise', description: 'Vous devez être connecté pour laisser un avis.'});
        router.push('/login');
        return;
    }

    setIsSubmittingReview(true);
    const result = await addReview({
        productId: productId,
        rating: reviewRating,
        text: reviewMessage,
        author: user.displayName || 'Anonyme'
    });

    if (result.success && result.review) {
        setReviews([result.review, ...reviews]);
        toast({ title: 'Avis Soumis!', description: 'Merci pour votre retour !'});
        setReviewRating(0);
        (form.elements.namedItem('review-message') as HTMLTextAreaElement).value = '';
    } else {
        toast({ variant: 'destructive', title: 'Erreur', description: result.message || 'Impossible de soumettre l\'avis.'});
    }
     setIsSubmittingReview(false);
  }

  if (isLoading || loadingAuth) {
    return <div className="flex flex-col items-center justify-center min-h-[80vh] bg-background"><Loader /><p className="mt-4 text-lg">Chargement du produit...</p></div>
  }

  if (!product) {
    return <div className="text-center py-20 bg-background">Produit non trouvé.</div>;
  }

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col -mx-4">
        <header className="flex items-center justify-between p-4 z-10 w-full max-w-4xl mx-auto pt-6">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="bg-card text-card-foreground rounded-full shadow-md">
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <span className="font-bold text-lg">ACEPLACE</span>
            <Button variant="ghost" size="icon" onClick={() => router.push('/cart')} className="bg-card text-card-foreground rounded-full shadow-md">
                <ShoppingBag className="h-6 w-6" />
            </Button>
        </header>
        
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 pb-32">
             <section className="mb-4">
                <div className="grid grid-cols-2 gap-2">
                    {product.images.map((image, index) => (
                        <div key={index} className="aspect-square relative">
                             <Card className="bg-secondary h-full w-full overflow-hidden rounded-2xl border-none">
                                <Image
                                src={image} alt={`${product.name} - vue ${index + 1}`} fill
                                className="object-contain p-2" sizes="(max-width: 768px) 50vw, 50vw"
                                data-ai-hint={product.hint}
                                />
                            </Card>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-muted-foreground">{product.category}</p>
                        <h1 className="text-2xl font-bold">{product.name}</h1>
                    </div>
                    <div className="text-right shrink-0">
                         <p className="text-2xl font-bold text-primary">FCFA {product.price.toLocaleString()}</p>
                         <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <p className="font-bold text-foreground">({product.rating.toFixed(1)})</p>
                            <span>- {product.reviews} avis</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                      <Label className="text-base font-medium flex items-center gap-2"><Palette/> Couleur</Label>
                      <RadioGroup value={selectedColor?.hex} onValueChange={(hex) => setSelectedColor(product.colors.find(c => c.hex === hex))} className="flex items-center gap-2 mt-1">
                         {product.colors.map((color) => (
                           <div key={color.hex}>
                            <RadioGroupItem value={color.hex} id={color.hex} className="sr-only" />
                            <Label htmlFor={color.hex} className={cn(
                                "w-8 h-8 rounded-full border-2 cursor-pointer transition-all flex items-center justify-center",
                                selectedColor?.hex === color.hex ? 'border-primary scale-110' : 'border-card hover:border-muted-foreground'
                            )} style={{ backgroundColor: color.hex }} title={color.name}>
                                { selectedColor?.hex === color.hex && <div className="w-3 h-3 rounded-full bg-white mix-blend-difference"/>}
                            </Label>
                           </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-medium flex items-center gap-2"><Ruler/> Taille</Label>
                      <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex items-center gap-2 flex-wrap mt-1">
                        {product.sizes.map((size) => (
                           <div key={size}>
                            <RadioGroupItem id={size} value={size} className="sr-only" />
                            <Label htmlFor={size} className={cn(
                              "px-4 py-2 rounded-xl border-2 cursor-pointer text-base font-semibold transition-colors duration-200",
                              selectedSize === size ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-card hover:border-primary/50'
                            )}>{size}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-2" defaultValue='description'>
                    <AccordionItem value="description" className="bg-card border-none rounded-xl">
                        <AccordionTrigger className="px-4 text-base font-medium hover:no-underline">Description</AccordionTrigger>
                        <AccordionContent className="px-4 text-muted-foreground">{product.description}</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="delivery" className="bg-card border-none rounded-xl">
                        <AccordionTrigger className="px-4 text-base font-medium hover:no-underline">Livraison & Retours</AccordionTrigger>
                        <AccordionContent className="px-4 text-muted-foreground">Livraison gratuite pour les commandes de plus de 50 000 FCFA. Retours acceptés sous 7 jours.</AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="reviews" className="bg-card border-none rounded-xl">
                        <AccordionTrigger className="px-4 text-base font-medium hover:no-underline">Avis des clients ({reviews.length})</AccordionTrigger>
                        <AccordionContent className="px-4 space-y-3">
                            <div className="space-y-3">
                               {reviews.slice(0, displayedReviews).map(review => (
                                   <div key={review.id} className="border-b border-border pb-2 last:border-none last:pb-0">
                                       <div className="flex items-center justify-between mb-1">
                                           <p className="font-semibold">{review.author}</p>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star key={star} className={cn("w-4 h-4", review.rating >= star ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30")} />
                                                ))}
                                            </div>
                                       </div>
                                       <p className="text-muted-foreground text-sm">{review.text}</p>
                                       <p className="text-xs text-muted-foreground/70 mt-1">{new Date(review.date).toLocaleDateString()}</p>
                                   </div>
                               ))}
                               {reviews.length > displayedReviews && (
                                   <Button variant="outline" className="w-full" onClick={() => setDisplayedReviews(reviews.length)}>
                                       Afficher plus d'avis
                                   </Button>
                               )}
                               {reviews.length === 0 && (
                                   <p className="text-muted-foreground text-center py-4">Aucun avis pour ce produit pour le moment.</p>
                               )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="add-review" className="bg-card border-none rounded-xl">
                        <AccordionTrigger className="px-4 text-base font-medium hover:no-underline">Laissez votre avis</AccordionTrigger>
                        <AccordionContent className="px-4">
                            <form onSubmit={handleReviewSubmit} className="space-y-3">
                                <div>
                                    <Label>Votre note</Label>
                                    <div className="flex items-center gap-1 mt-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star key={star} className={cn("w-6 h-6 cursor-pointer transition-all", reviewRating >= star ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/50 hover:text-yellow-400/50")}
                                            onClick={() => setReviewRating(star)} />
                                        ))}
                                    </div>
                                </div>
                                <Textarea name="review-message" placeholder="Partagez votre expérience..." className="bg-secondary border-border" />
                                <Button type="submit" size="sm" disabled={isSubmittingReview}>
                                    {isSubmittingReview ? 'Envoi...' : <><Send className="w-4 h-4 mr-2"/>Envoyer mon avis</>}
                                </Button>
                            </form>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                
                <div className="pt-4 flex items-center justify-between gap-4">
                    <Button variant="outline" size="lg" onClick={handleFavorite} className="bg-card border-card h-14">
                        <Heart className={cn("h-7 w-7 transition-colors", isFavorited ? "text-primary fill-primary" : "text-muted-foreground")} />
                    </Button>
                    <Button size="lg" onClick={handleAddToCart} className="text-lg h-14 rounded-2xl flex-grow">
                        Ajouter au Panier
                    </Button>
                </div>

            </section>
        </main>
    </div>
  );
}
