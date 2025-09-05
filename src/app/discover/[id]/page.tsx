
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ShoppingBag, Bookmark } from 'lucide-react';
import { type Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { useRouter, useParams } from 'next/navigation';
import Loader from '@/components/ui/loader';
import '@/components/ui/loader.css';
import { useCart } from '@/hooks/use-cart';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const productId = params.id as string;
  
  const [isFavorited, setIsFavorited] = useState(false);
  
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [api, setApi] = useState<any>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])


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
           if (hydratedProduct.sizes && hydratedProduct.sizes.length > 0) {
            setSelectedSize(hydratedProduct.sizes[0]);
          }
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
  
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    toast({
        title: !isFavorited ? "Ajouté aux favoris!" : "Retiré des favoris",
        description: `${product?.name} a été ${!isFavorited ? 'ajouté à' : 'retiré de'} votre liste de souhaits !`,
    });
  };

  const handleAddToCart = () => {
    if (!product || !selectedSize) {
        toast({
            variant: "destructive",
            title: "Sélection requise",
            description: "Veuillez sélectionner une taille.",
        });
        return;
    }
    
    addItem({
        id: product.id!,
        name: product.name,
        price: product.price,
        quantity: 1, // Quantity is fixed to 1 in this design
        image: product.images[0],
        hint: product.hint || '',
        category: product.category,
        size: selectedSize,
        color: product.colors[0].name, // Color is not selectable in this design
    });
    
    toast({
      title: "Ajouté au Panier!",
      description: `1 x ${product.name} (${selectedSize})`,
    });
  };

  if (isLoading) {
    return <div className="flex flex-col items-center justify-center min-h-[80vh] bg-background"><Loader /><p className="mt-4 text-lg">Chargement du produit...</p></div>
  }

  if (!product) {
    return <div className="text-center py-20 bg-background">Produit non trouvé.</div>;
  }

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col -mx-4 -my-8">
        {/* Header */}
        <header className="flex items-center justify-between p-4 z-10 w-full max-w-4xl mx-auto">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="bg-card text-card-foreground rounded-full shadow-md">
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <span className="font-bold text-lg">ACEPLACE</span>
            <Button variant="ghost" size="icon" onClick={() => router.push('/cart')} className="bg-card text-card-foreground rounded-full shadow-md">
                <ShoppingBag className="h-6 w-6" />
            </Button>
        </header>
        
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 pb-32">
            {/* Image Carousel */}
            <section className="mb-4">
                <Carousel setApi={setApi} className="w-full">
                    <CarouselContent>
                    {product.images.map((image, index) => (
                        <CarouselItem key={index}>
                            <Card className="bg-card aspect-square overflow-hidden rounded-3xl border-none">
                                <Image
                                src={image}
                                alt={`${product.name} - vue ${index + 1}`}
                                fill
                                className="object-contain p-4"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                data-ai-hint={product.hint}
                                />
                            </Card>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                </Carousel>
                 <div className="flex justify-center gap-2 pt-4">
                    {Array.from({ length: count }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => api?.scrollTo(i)}
                            className={cn(
                                "h-2 w-2 rounded-full transition-all duration-300",
                                i === current - 1 ? 'w-4 bg-primary' : 'bg-muted-foreground/50'
                            )}
                        />
                    ))}
                </div>
            </section>

            {/* Product Info */}
            <section className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-muted-foreground">{product.category}</p>
                        <h1 className="text-3xl font-bold">{product.name}</h1>
                    </div>
                    <div className="text-right">
                         <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <p className="font-bold">({product.rating.toFixed(1)})</p>
                        </div>
                        <p className="text-2xl font-bold text-primary">FCFA {product.price.toLocaleString()}</p>
                    </div>
                </div>

                {/* Size Selector */}
                 <div>
                  <h3 className="text-lg font-medium mb-2">Taille</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.sizes.map((size) => (
                       <div key={size}>
                        <input type="radio" id={size} name="size" value={size} className="sr-only" onChange={() => setSelectedSize(size)} checked={selectedSize === size} />
                        <label htmlFor={size} className={cn(
                          "px-6 py-3 rounded-xl border-2 cursor-pointer text-base font-semibold transition-colors duration-200",
                          selectedSize === size ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-card hover:border-primary/50'
                        )}>
                          {size}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                 {/* Accordions */}
                <Accordion type="single" collapsible className="w-full space-y-3">
                    <AccordionItem value="description" className="bg-card border-none rounded-xl">
                        <AccordionTrigger className="px-4 text-base font-medium hover:no-underline">Description</AccordionTrigger>
                        <AccordionContent className="px-4 text-muted-foreground">{product.description}</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="delivery" className="bg-card border-none rounded-xl">
                        <AccordionTrigger className="px-4 text-base font-medium hover:no-underline">Livraison & Retours</AccordionTrigger>
                        <AccordionContent className="px-4 text-muted-foreground">Livraison gratuite pour les commandes de plus de 50 000 FCFA. Retours acceptés sous 7 jours.</AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </main>
        
        {/* Footer Action Bar */}
        <footer className="fixed bottom-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-lg border-t border-border">
             <div className="max-w-4xl mx-auto p-4 flex items-center justify-between gap-4">
                <Button variant="outline" size="lg" onClick={handleFavorite} className="bg-card border-card h-14 w-16">
                    <Bookmark className={cn("h-7 w-7 transition-colors", isFavorited ? "fill-primary text-primary" : "text-muted-foreground")} />
                </Button>
                <Button size="lg" onClick={handleAddToCart} className="w-full text-lg h-14 rounded-2xl">
                    Ajouter au Panier
                </Button>
            </div>
        </footer>
    </div>
  );
}

    