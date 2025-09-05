
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Minus, Plus, ChevronLeft, Heart } from 'lucide-react';
import { type Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { useRouter, useParams } from 'next/navigation';
import Loader from '@/components/ui/loader';
import '@/components/ui/loader.css';
import { useCart } from '@/hooks/use-cart';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const productId = params.id as string;
  
  const [isFavorited, setIsFavorited] = useState(false);
  const [likes, setLikes] = useState(0);
  const [reviews, setReviews] = useState(0);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      try {
        const response = await fetch('/products.json');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const products: Product[] = await response.json();
        const foundProduct = products.find(p => p.id === productId);
        
        if (foundProduct) {
          const hydratedProduct: Product = {
            ...foundProduct,
            sizes: foundProduct.sizes || ['S', 'M', 'L'],
            colors: foundProduct.colors || [{ name: 'Default', hex: '#000000' }],
            originalPrice: foundProduct.originalPrice || foundProduct.price * 1.2,
            rating: foundProduct.rating || 4.5,
            reviews: foundProduct.reviews || Math.floor(Math.random() * 50) + 5,
            category: foundProduct.category || 'Non classé',
            description: foundProduct.description || 'Aucune description disponible.'
          };
          setProduct(hydratedProduct);
          // Use a random base for likes and reviews for more dynamic feel
          setLikes(Math.floor(Math.random() * 200) + 20);
          setReviews(hydratedProduct.reviews);
          setRating(hydratedProduct.rating);

        } else {
          setProduct(null);
        }

      } catch (error) {
        console.error("Failed to fetch product", error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les détails du produit.' });
      } finally {
        setIsLoading(false);
      }
    }
    if (productId) {
      fetchProduct();
    }
  }, [productId, toast]);

  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
    if (product && product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);
  
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    setLikes(l => isFavorited ? l - 1 : l + 1);
    toast({
        title: !isFavorited ? "Ajouté aux favoris!" : "Retiré des favoris",
        description: `${product?.name} a été ${!isFavorited ? 'ajouté à' : 'retiré de'} votre liste de souhaits !`,
    });
  };
  
  const handleReview = () => {
    setReviews(r => r + 1);
    toast({
        title: "Avis Envoyé!",
        description: "Merci d'avoir partagé votre avis sur ce produit.",
    });
  };

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) {
        toast({
            variant: "destructive",
            title: "Sélection requise",
            description: "Veuillez sélectionner une couleur et une taille.",
        });
        return;
    }
    
    addItem({
        id: product.id!,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images[0],
        hint: product.hint || '',
        category: product.category,
        size: selectedSize,
        color: selectedColor.name,
    });
    
    toast({
      title: "Ajouté au Panier!",
      description: `${quantity} x ${product.name} (${selectedSize}, ${selectedColor.name})`,
    });
  };

  if (isLoading) {
    return <div className="flex flex-col items-center justify-center min-h-[80vh]"><Loader /><p className="mt-4 text-lg">Chargement du produit...</p></div>
  }

  if (!product) {
    return <div className="text-center py-20">Produit non trouvé.</div>;
  }

  return (
    <div className="bg-background rounded-t-3xl min-h-[80vh] shadow-2xl space-y-6 mt-8">
        <div className="flex items-center justify-between p-4 sm:p-0">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="bg-secondary text-foreground rounded-full">
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold truncate px-4">{product.name}</h1>
            <div className="flex items-center gap-2">
                 <span className="text-sm font-medium text-muted-foreground">{likes}</span>
                <Button variant="ghost" size="icon" onClick={handleFavorite} className="bg-secondary text-foreground rounded-full">
                    <Heart className={cn("h-6 w-6 transition-colors", isFavorited ? "fill-red-500 text-red-500" : "text-foreground")} />
                </Button>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start p-4 sm:p-0">
          <Carousel className="w-full">
            <CarouselContent>
              {product.images && product.images.length > 0 ? (
                  product.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <Card className="overflow-hidden aspect-[4/5] relative bg-secondary rounded-2xl">
                        <Image
                          src={image}
                          alt={`${product.name} - vue ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          data-ai-hint={product.hint}
                        />
                      </Card>
                    </CarouselItem>
                  ))
              ) : (
                 <CarouselItem>
                      <Card className="overflow-hidden aspect-[4/5] relative bg-secondary rounded-2xl">
                        <Image
                          src="https://placehold.co/800x1000.png"
                          alt="Image par défaut"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          data-ai-hint={product.hint}
                        />
                      </Card>
                    </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 hidden sm:inline-flex bg-background/50 hover:bg-background/80" />
            <CarouselNext className="absolute right-4 hidden sm:inline-flex bg-background/50 hover:bg-background/80" />
          </Carousel>

          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-primary font-semibold">{product.category}</p>
              <h1 className="text-3xl font-bold lg:text-4xl">{product.name}</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 cursor-pointer" onClick={handleReview} title="Donner un avis">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-5 h-5 transition-colors", i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50 fill-muted-foreground/20 hover:text-yellow-400/50')} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">({reviews} avis)</p>
              </div>
            </div>
            
             <div className="text-right">
                <p className="text-lg text-muted-foreground line-through">FCFA {product.originalPrice?.toLocaleString()}</p>
                <p className="font-bold text-4xl text-primary">FCFA {product.price.toLocaleString()}</p>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium">Couleur: <span className="font-normal text-muted-foreground">{selectedColor?.name}</span></h3>
                  <RadioGroup value={selectedColor?.hex} onValueChange={(hex) => setSelectedColor(product.colors?.find(c => c.hex === hex)!)} className="flex items-center gap-2 mt-2">
                    {product.colors.map((color) => (
                      <div key={color.hex}>
                        <RadioGroupItem value={color.hex} id={color.hex} className="sr-only" />
                        <label htmlFor={color.hex} className={cn(
                          "w-8 h-8 rounded-full border-2 cursor-pointer transition-all flex items-center justify-center",
                          selectedColor?.hex === color.hex ? 'border-primary scale-110' : 'border-transparent hover:border-muted-foreground'
                        )} style={{ backgroundColor: color.hex }}>
                           { selectedColor?.hex === color.hex && <div className="w-3 h-3 rounded-full bg-white mix-blend-difference"/>}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium">Taille</h3>
                  <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex items-center gap-2 mt-2 flex-wrap">
                    {product.sizes.map((size) => (
                       <div key={size}>
                        <RadioGroupItem value={size} id={size} className="sr-only" />
                        <label htmlFor={size} className={cn(
                          "px-4 py-2 rounded-lg border cursor-pointer text-sm font-semibold transition-colors",
                          selectedSize === size ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary hover:bg-muted'
                        )}>
                          {size}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-medium shrink-0">Quantité</h3>
                <div className="flex items-center gap-2 border rounded-full p-1">
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => setQuantity(q => Math.max(1, q-1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => setQuantity(q => q+1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
               <Button size="lg" onClick={handleAddToCart} className="w-full sm:w-auto text-lg">Ajouter au Panier</Button>
            </div>
            
             <Card className="bg-secondary/50 border-border/50">
                 <CardContent className="p-4">
                    <p className="text-muted-foreground font-medium">{product.description}</p>
                 </CardContent>
             </Card>

          </div>
        </div>
    </div>
  );
}
