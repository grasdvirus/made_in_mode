
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Heart, Tag, ArrowRight, X } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { HomepageData } from './admin/home-settings/actions';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const AcePlaceLogo = () => (
    <div className="flex items-center gap-2">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M12 12V22" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M17 4.5L7 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        <div>
            <h1 className="text-white font-bold text-xl leading-none">ACEPLACE</h1>
            <p className="text-white/70 text-xs leading-none">FEMININE FASHION</p>
        </div>
    </div>
)

type EnrichedCategory = HomepageData['categories'][0] & { dynamicImage?: string };

export default function HomePage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = React.useState('');
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const { toast } = useToast();
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [enrichedCategories, setEnrichedCategories] = useState<EnrichedCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        setIsLoading(true);
        try {
            const [homepageRes, productsRes] = await Promise.all([
                fetch('/homepage.json'),
                fetch('/products.json')
            ]);
            
            if (!homepageRes.ok) throw new Error('Failed to fetch homepage data');
            if (!productsRes.ok) throw new Error('Failed to fetch products data');

            const data: HomepageData = await homepageRes.json();
            const products: Product[] = await productsRes.json();
            
            setHomepageData(data);

            // Enrich categories with dynamic images from the latest product in that category
            const categoryMap = new Map<string, string>();
            // The product list is already sorted with the newest first from the admin panel.
            // So we just need to iterate and grab the first image we find for each category.
            for (const product of products) {
                if (product.category && !categoryMap.has(product.category) && product.images && product.images[0]) {
                    categoryMap.set(product.category, product.images[0]);
                }
            }

            const dynamicCategories = data.categories.map(cat => ({
                ...cat,
                dynamicImage: categoryMap.get(cat.name) || cat.image,
            }));
            setEnrichedCategories(dynamicCategories);

        } catch (error) {
            console.error(error);
            setHomepageData({ categories: [], featuredProducts: [], products: [], recommendedProducts: [], heroImage: 'https://picsum.photos/1200/800' }); // Set default empty data on error
            toast({ variant: 'destructive', title: 'Erreur', description: "Impossible de charger le contenu de la page d'accueil." });
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, [toast]);
  

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim() !== '') {
      router.push(`/discover?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleFavorite = (e: React.MouseEvent, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
        title: "Favoris",
        description: `${productName} a été ajouté à votre liste de souhaits !`,
    });
  };

  return (
    <div className="bg-background min-h-screen -mx-4 -mt-8">
      {/* Header with Background Image */}
      <header className="relative h-64 md:h-80 rounded-b-3xl overflow-hidden">
         {isLoading ? (
            <Skeleton className="absolute inset-0 z-0" />
         ) : (
            <Image
                src={homepageData?.heroImage || "https://picsum.photos/1200/800"}
                alt="Boutique de mode"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 z-0"
                data-ai-hint="fashion boutique"
                priority
            />
         )}
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 flex flex-col justify-center items-center h-full text-white p-4">
          <AcePlaceLogo />
          <div className="relative w-full max-w-sm mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
            <Input
              placeholder="Rechercher un article, une marque..."
              className="w-full h-12 pl-12 rounded-full bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
            />
            {searchValue && (
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 text-white/70 hover:bg-white/20"
                    onClick={() => setSearchValue('')}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="space-y-1">
          {/* Categories Section */}
          <section className="p-4 pb-0">
               <Carousel
                  opts={{
                      align: "start",
                      dragFree: true,
                  }}
                  className="w-full no-scrollbar"
              >
                  <CarouselContent>
                      {isLoading ? (
                          [...Array(6)].map((_, index) => (
                             <CarouselItem key={index} className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6">
                                <div className="flex flex-col items-center gap-2 flex-shrink-0 text-center w-24 mx-auto">
                                    <Skeleton className="w-24 h-24 rounded-full" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </CarouselItem>
                          ))
                      ) : (
                        enrichedCategories.map((category, index) => (
                            <CarouselItem key={index} className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6">
                                <Link href={`/discover?category=${encodeURIComponent(category.name)}`} className="flex flex-col items-center gap-2 flex-shrink-0 text-center w-24 mx-auto group">
                                    <div className="relative w-24 h-24">
                                        <Image src={category.dynamicImage || 'https://picsum.photos/100/100'} alt={category.name} fill className="rounded-full object-cover border-2 border-primary/50 group-hover:border-primary transition-colors" data-ai-hint={category.hint} />
                                    </div>
                                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{category.name}</span>
                                </Link>
                            </CarouselItem>
                        ))
                      )}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex bg-accent text-accent-foreground hover:bg-accent/80 -left-2" />
                  <CarouselNext className="hidden sm:flex bg-accent text-accent-foreground hover:bg-accent/80 -right-2" />
              </Carousel>
          </section>

          {/* Featured Products Carousel Section */}
          <section className="relative pt-2">
             {isLoading && !homepageData ? (
                <div className="px-4"><Skeleton className="w-full h-72 rounded-2xl" /></div>
             ) : (
                <>
                <Carousel setApi={setApi} opts={{ align: "start" }} className="w-full horizontal-scroll-fade no-scrollbar">
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
                                        <div className="flex items-center gap-1.5">
                                        <Tag className="w-4 h-4" />
                                        <span>{product.category}</span>
                                        </div>
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
                <div className="flex justify-start gap-2 pt-2 px-4">
                    {Array.from({ length: count }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => api?.scrollTo(i)}
                            className={cn(
                                "h-2 w-2 rounded-full transition-all",
                                i === current -1 ? 'w-4 bg-primary' : 'bg-primary/20'
                            )}
                        />
                    ))}
                </div>
                </>
             )}
          </section>

          {/* Minimalist Products Section */}
          <section className="space-y-2 p-4 pt-2">
               {isLoading && !homepageData ? (
                   [...Array(3)].map((_, index) => (
                       <Card key={index} className="bg-secondary/50 border-none shadow-md rounded-2xl p-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-16 h-16 rounded-lg" />
                                <div className="flex-grow space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                                 <Skeleton className="w-8 h-8 rounded-full" />
                            </div>
                       </Card>
                   ))
               ) : (
                homepageData?.products.map((product) => (
                    <Link href={`/discover/${product.id}`} key={product.id} className="block">
                        <Card className="bg-secondary/50 border-none shadow-md rounded-2xl p-3 group transition-all duration-300 hover:bg-secondary hover:shadow-xl">
                            <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 flex-shrink-0">
                                    <Image src={product.image} alt={product.name} fill className="rounded-lg object-cover" data-ai-hint={product.hint} />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-bold text-lg">{product.name}</h3>
                                    <p className="text-muted-foreground text-sm line-clamp-1">{product.description}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="bg-primary/20 text-primary rounded-full hover:bg-primary/30 transition-transform group-hover:translate-x-1">
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </div>
                        </Card>
                    </Link>
                ))
               )}
          </section>
        </div>
      </main>
    </div>
  );
}
