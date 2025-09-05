

'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Compass, Star, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { getHomepageData, getProductsForHomepage, type HomepageData } from '../admin/home-settings/actions';
import { Skeleton } from '@/components/ui/skeleton';
import Loader from '@/components/ui/loader';
import '@/components/ui/loader.css';
import { Card, CardContent } from '@/components/ui/card';

function DiscoverContent() {
  const searchParams = useSearchParams();
  const categoryQuery = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

   const [featuredApi, setFeaturedApi] = React.useState<CarouselApi>()
  const [featuredCurrent, setFeaturedCurrent] = React.useState(0)
  const [featuredCount, setFeaturedCount] = React.useState(0)

  useEffect(() => {
    if (!featuredApi) return;
    setFeaturedCount(featuredApi.scrollSnapList().length);
    setFeaturedCurrent(featuredApi.selectedScrollSnap() + 1);
    featuredApi.on("select", () => {
      setFeaturedCurrent(featuredApi.selectedScrollSnap() + 1);
    });
  }, [featuredApi]);

  const handleFavorite = (e: React.MouseEvent, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
        title: "Favoris",
        description: `${productName} a été ajouté à votre liste de souhaits !`,
    });
  };

  useEffect(() => {
     async function loadData() {
        setIsLoading(true);
        try {
            const [data, productsData] = await Promise.all([
                getHomepageData(),
                getProductsForHomepage()
            ]);
            setHomepageData(data);
            setProducts(productsData);
        } catch (err) {
            console.error("Failed to load page data", err);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger le contenu.' });
        } finally {
            setIsLoading(false);
        }
    }
    loadData();
  }, [toast]);
  
  const categories = useMemo(() => {
    if (!homepageData) return ['Tout'];
    return ['Tout', ...homepageData.categories.map(c => c.name)];
  }, [homepageData]);

  useEffect(() => {
    if (categoryQuery) {
        setSelectedCategory(categoryQuery);
    } else {
        setSelectedCategory('Tout');
    }
  }, [categoryQuery]);


  useEffect(() => {
    if (selectedCategory === 'Tout') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);
  
  return (
    <div className="space-y-2">
      <div className="text-center space-y-1 pt-2">
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
           <CarouselPrevious className="hidden sm:flex bg-accent text-accent-foreground hover:bg-accent/80 -left-2 rounded-full" />
           <CarouselNext className="hidden sm:flex bg-accent text-accent-foreground hover:bg-accent/80 -right-2 rounded-full" />
      </Carousel>
      
       {/* Featured Products Section */}
       <section className="relative pt-2">
         <h2 className="text-2xl font-bold text-center mb-2">Produits en Vedette</h2>
         {isLoading ? (
            <div className="px-4"><Skeleton className="w-full h-72 rounded-2xl" /></div>
         ) : (
            <Carousel setApi={featuredApi} opts={{ align: "start" }} className="w-full horizontal-scroll-fade no-scrollbar">
                <CarouselContent className="ml-4">
                {homepageData?.featuredProducts.map((product) => (
                    <CarouselItem key={product.id} className="pl-0 basis-4/5 sm:basis-1/2">
                    <div className="px-2 h-full">
                        <Link href={`/discover/${product.id}`} className="block h-full">
                            <Card className="bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-105 duration-300 h-full">
                            <CardContent className="p-0">
                                <div className="relative">
                                <Image
                                    src={(product.images && product.images.length > 0) ? product.images[0] : 'https://picsum.photos/600/400'}
                                    alt={product.name}
                                    width={600}
                                    height={400}
                                    className="w-full h-48 object-cover"
                                    data-ai-hint={product.hint}
                                />
                                <Button variant="ghost" size="icon" className="absolute top-3 right-3 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm" onClick={(e) => handleFavorite(e, product.name)}>
                                    <Heart className="w-5 h-5" />
                                </Button>
                                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full">
                                    {product.price.toLocaleString('fr-FR')} FCFA
                                </div>
                                </div>
                                <div className="p-3">
                                <h3 className="font-bold text-lg text-foreground">{product.name}</h3>
                                <div className="flex items-center text-muted-foreground text-sm mt-1 gap-4">
                                     <span className="text-sm text-muted-foreground">{product.category}</span>
                                </div>
                                </div>
                            </CardContent>
                            </Card>
                        </Link>
                    </div>
                    </CarouselItem>
                ))}
                </CarouselContent>
            </Carousel>
         )}
      </section>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[...Array(8)].map((_, i) => (
             <div key={i} className="bg-card/50 animate-pulse">
                <Skeleton className="aspect-[4/5] rounded-lg" />
                <Skeleton className="h-4 w-3/4 mt-2" />
                <Skeleton className="h-4 w-1/2 mt-1" />
             </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Link key={product.id} href={`/discover/${product.id}`} className="block group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                    <Image 
                        src={(product.images && product.images.length > 0) ? product.images[0] : 'https://placehold.co/600x800.png'} 
                        alt={product.name} 
                        fill 
                        className="object-cover transition-transform duration-300 group-hover:scale-105" 
                        data-ai-hint={product.hint}
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                        <h3 className="font-semibold uppercase tracking-wide truncate">{product.name}</h3>
                        <p className="font-medium">{product.price.toLocaleString('fr-FR')} FCFA</p>
                    </div>
                </div>
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
      
      <section className="space-y-2 pt-4">
        <h2 className="text-2xl font-bold text-center">Nos Recommandations</h2>
        
         {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-secondary/50 border-none shadow-lg rounded-2xl p-4 animate-pulse">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-24 h-24 rounded-lg" />
                            <div className="flex-grow space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {homepageData?.recommendedProducts?.map((product) => (
                    <Link href={`/discover/${product.id}`} key={product.id} className="block">
                        <div className="bg-secondary/50 border-none shadow-lg rounded-2xl p-3 group transition-all duration-300 hover:shadow-xl hover:bg-secondary h-full">
                            <div className="flex items-center gap-4">
                                <div className="relative w-20 h-20 flex-shrink-0">
                                <Image src={product.image} alt={product.name} fill className="rounded-lg object-cover" data-ai-hint={product.hint} />
                                </div>
                                <div className="flex-grow">
                                <h3 className="font-bold text-lg">{product.name}</h3>
                                <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        )}
      </section>

    </div>
  );
}

export default function DiscoverPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-[60vh]"><Loader /></div>}>
            <DiscoverContent />
        </Suspense>
    )
}
