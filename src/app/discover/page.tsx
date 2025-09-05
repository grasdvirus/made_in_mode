
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Compass } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {[...Array(8)].map((_, i) => (
             <div key={i} className="bg-card/50 animate-pulse">
                <Skeleton className="aspect-[4/5] rounded-lg" />
                <Skeleton className="h-4 w-3/4 mt-2" />
                <Skeleton className="h-4 w-1/2 mt-1" />
             </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
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
      
      {/* Recommended Section */}
       <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Nos Recommandations</h2>
        
         {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {homepageData?.recommendedProducts?.map((product) => (
                    <Link href={`/discover/${product.id}`} key={product.id} className="block">
                        <div className="bg-secondary/50 border-none shadow-lg rounded-2xl p-4 group transition-all duration-300 hover:shadow-xl hover:bg-secondary h-full">
                            <div className="flex items-center gap-4">
                                <div className="relative w-24 h-24 flex-shrink-0">
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

    
