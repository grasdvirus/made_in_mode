
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star, Compass, ShoppingCart, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import type { HomepageData } from '../admin/home-settings/actions';
import { Skeleton } from '@/components/ui/skeleton';

export default function DiscoverPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [productsRes, homepageRes] = await Promise.all([
          fetch('/products.json'),
          fetch('/homepage.json')
        ]);
        const productsData: Product[] = await productsRes.json();
        const homepageContent: HomepageData = await homepageRes.json();
        
        setProducts(productsData);
        setFilteredProducts(productsData);
        setHomepageData(homepageContent);
      } catch (err) {
        console.error("Failed to load page data", err);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger le contenu.' });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [toast]);
  
  const categories = useMemo(() => {
    if (!homepageData) return ['Tout'];
    return ['Tout', ...homepageData.categories.map(c => c.name)];
  }, [homepageData]);

  useEffect(() => {
    if (selectedCategory === 'Tout') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);
  
  const handleFavorite = (e: React.MouseEvent, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
        title: "Favoris",
        description: `${productName} a été ajouté à votre liste de souhaits !`,
    });
  };

  const handleAddToCart = (e: React.MouseEvent, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
        title: "Panier",
        description: `Veuillez sélectionner taille/couleur sur la page du produit.`,
    });
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Découvrir</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explorez nos collections et trouvez les pièces qui expriment votre style unique.
        </p>
      </div>

       <Carousel
          opts={{
              align: "start",
              dragFree: true,
          }}
          className="w-full no-scrollbar horizontal-scroll-fade"
      >
          <CarouselContent className="-ml-2 md:-ml-4">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <CarouselItem key={i} className="pl-2 md:pl-4 basis-auto">
                     <Skeleton className="h-10 w-24 rounded-full" />
                  </CarouselItem>
                ))
              ) : (
                categories.map((category) => (
                  <CarouselItem key={category} className="pl-2 md:pl-4 basis-auto">
                    <Button
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(category)}
                      className="rounded-full px-6"
                    >
                      {category}
                    </Button>
                  </CarouselItem>
                ))
              )}
          </CarouselContent>
      </Carousel>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[...Array(6)].map((_, i) => (
             <Card key={i} className="rounded-2xl overflow-hidden bg-card/50 animate-pulse">
                <div className="aspect-[4/5] bg-muted/50"></div>
                <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted/50 rounded w-3/4"></div>
                    <div className="h-4 bg-muted/50 rounded w-1/2"></div>
                </div>
             </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Link key={product.id} href={`/discover/${product.id}`} className="block">
                <Card 
                  className="rounded-2xl overflow-hidden shadow-lg border-none bg-card/50 backdrop-blur-sm group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full"
                >
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="relative aspect-[4/5]">
                      <Image 
                          src={(product.images && product.images.length > 0) ? product.images[0] : 'https://placehold.co/600x800.png'} 
                          alt={product.name} 
                          fill 
                          className="object-cover transition-transform duration-300 group-hover:scale-105" 
                          data-ai-hint={product.hint}
                          sizes="(max-width: 1024px) 50vw, 33vw" 
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                       <Button variant="ghost" size="icon" className="absolute top-3 right-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm" onClick={(e) => handleFavorite(e, product.name)}>
                        <Heart className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="p-4 space-y-2 flex flex-col flex-grow">
                      <h3 className="font-bold text-lg truncate">{product.name}</h3>
                      <div className="flex justify-between items-center mt-auto">
                         <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-medium">{product.rating}</span>
                            <span className="text-sm text-muted-foreground">({product.reviews} avis)</span>
                         </div>
                         <Button variant="ghost" size="icon" className="rounded-full bg-primary/20 text-primary hover:bg-primary/30" onClick={(e) => handleAddToCart(e, product.name)}>
                            <ShoppingCart className="w-5 h-5" />
                        </Button>
                      </div>
                       <div className="text-right">
                          <p className="text-sm text-muted-foreground line-through">FCFA {product.originalPrice?.toLocaleString()}</p>
                          <p className="font-bold text-xl">FCFA {product.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center bg-secondary/50 border-dashed rounded-2xl min-h-[300px]">
                <Compass className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">Aucun article trouvé</h3>
                <p className="text-muted-foreground mt-2">Essayez de sélectionner une autre catégorie pour trouver votre bonheur !</p>
            </div>
          )}
        </div>
      )}
      
      {/* Recommended Section */}
       <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Nos Recommandations</h2>
        
         {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="bg-secondary/50 border-none shadow-lg rounded-2xl p-4 animate-pulse">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-24 h-24 rounded-lg" />
                            <div className="flex-grow space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {homepageData?.recommendedProducts?.map((product) => (
                    <Link href={`/discover/${product.id}`} key={product.id} className="block">
                        <Card className="bg-secondary/50 border-none shadow-lg rounded-2xl p-4 group transition-all duration-300 hover:shadow-xl hover:bg-secondary h-full">
                            <div className="flex items-center gap-4">
                                <div className="relative w-24 h-24 flex-shrink-0">
                                <Image src={product.image} alt={product.name} fill className="rounded-lg object-cover" data-ai-hint={product.hint} />
                                </div>
                                <div className="flex-grow">
                                <h3 className="font-bold text-lg">{product.name}</h3>
                                <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        )}
      </section>

    </div>
  );
}

    