

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star, ChevronLeft, ChevronRight, Search, PlusCircle, ShoppingCart, X, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const trips = [
  {
    name: 'Rio de Janeiro',
    country: 'Brésil',
    rating: 5.0,
    reviews: 143,
    image: 'https://placehold.co/600x800.png',
    hint: 'brazil landscape'
  },
    {
    name: 'Chutes d\'Iguazu',
    country: 'Argentine',
    rating: 4.9,
    reviews: 112,
    image: 'https://placehold.co/600x800.png',
    hint: 'argentina waterfall'
    },
    {
    name: 'Machu Picchu',
    country: 'Pérou',
    rating: 4.9,
    reviews: 215,
    image: 'https://placehold.co/600x800.png',
    hint: 'peru mountains'
    },
     {
    name: 'Salar de Uyuni',
    country: 'Bolivie',
    rating: 4.8,
    reviews: 180,
    image: 'https://placehold.co/600x800.png',
    hint: 'bolivia salt flat'
    },
     {
    name: 'Île de Pâques',
    country: 'Chili',
    rating: 4.7,
    reviews: 190,
    image: 'https://placehold.co/600x800.png',
    hint: 'chile easter island'
    },
]

const upcomingTours = [
    {
      name: 'Brésil Iconique',
      duration: '8 jours',
      price: 659,
      originalPrice: 750,
      rating: 4.6,
      reviews: 56,
      image: 'https://placehold.co/400x300.png',
      hint: 'brazil mountains',
      bgColor: 'bg-teal-500/10'
    },
    {
      name: 'Paradis balnéaire',
      duration: '5 jours',
      price: 450,
      originalPrice: 520,
      rating: 4.8,
      reviews: 89,
      image: 'https://placehold.co/400x300.png',
      hint: 'brazil beach',
      bgColor: 'bg-rose-500/10'
    },
    {
      name: 'Aventure en Amazonie',
      duration: '7 jours',
      price: 720,
      originalPrice: 800,
      rating: 4.7,
      reviews: 78,
      image: 'https://placehold.co/400x300.png',
      hint: 'amazon rainforest',
      bgColor: 'bg-orange-500/10'
    },
    {
        name: 'Voyage Patagonie',
        duration: '10 jours',
        price: 950,
        originalPrice: 1050,
        rating: 4.9,
        reviews: 110,
        image: 'https://placehold.co/400x300.png',
        hint: 'patagonia mountains',
        bgColor: 'bg-indigo-500/10'
    }
]

const destinations = [
    {
        name: 'Paris',
        image: 'https://placehold.co/800x600.png',
        hint: 'france eiffel tower'
    },
    {
        name: 'Tokyo',
        image: 'https://placehold.co/800x600.png',
        hint: 'japan city night'
    },
    {
        name: 'New York',
        image: 'https://placehold.co/800x600.png',
        hint: 'new york city skyline'
    },
    {
        name: 'Rome',
        image: 'https://placehold.co/800x600.png',
        hint: 'italy colosseum'
    },
    {
        name: 'Santorin',
        image: 'https://placehold.co/800x600.png',
        hint: 'greece santorini'
    },
    {
        name: 'Bali',
        image: 'https://placehold.co/800x600.png',
        hint: 'indonesia bali'
    }
]

const editorialPicks = [
    {
        title: 'Les 10 meilleures destinations pour les amoureux de la nature',
        author: 'Alexandre Dumas',
        avatar: 'https://placehold.co/40x40.png',
        avatarHint: 'male portrait',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'nature forest'
    },
    {
        title: 'City-guide : un week-end parfait à Kyoto',
        author: 'Juliette Dubois',
        avatar: 'https://placehold.co/40x40.png',
        avatarHint: 'female portrait',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'japan kyoto'
    },
    {
        title: 'Le guide ultime des plages secrètes de la Méditerranée',
        author: 'Marco Polo',
        avatar: 'https://placehold.co/40x40.png',
        avatarHint: 'male portrait',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'mediterranean beach'
    }
];


function PageSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-44 rounded-full" />
                <Skeleton className="h-12 w-12 rounded-full" />
            </div>
            <Skeleton className="h-12 w-full rounded-full" />
            
            <div>
                <Skeleton className="h-6 w-48 mb-3 rounded-md" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24 rounded-full" />
                    <Skeleton className="h-10 w-24 rounded-full" />
                    <Skeleton className="h-10 w-24 rounded-full" />
                </div>
            </div>

            <div className="flex space-x-4 overflow-hidden">
                <Skeleton className="aspect-[3/4] w-72 rounded-3xl" />
                <Skeleton className="aspect-[3/4] w-72 rounded-3xl" />
            </div>

            <div>
                <Skeleton className="h-6 w-40 mb-3 rounded-md" />
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-24 h-24 rounded-2xl" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-3/4 rounded-md" />
                            <Skeleton className="h-4 w-1/2 rounded-md" />
                            <Skeleton className="h-4 w-1/4 rounded-md" />
                        </div>
                        <Skeleton className="w-8 h-8 rounded-full" />
                    </div>
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-24 h-24 rounded-2xl" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-3/4 rounded-md" />
                            <Skeleton className="h-4 w-1/2 rounded-md" />
                            <Skeleton className="h-4 w-1/4 rounded-md" />
                        </div>
                        <Skeleton className="w-8 h-8 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('America');
  const [loading, setLoading] = useState(true);
  
  const [mainCarouselApi, setMainCarouselApi] = useState<CarouselApi>()
  const mainCarouselIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [toursCarouselApi, setToursCarouselApi] = useState<CarouselApi>();
  const [toursCarouselCount, setToursCarouselCount] = useState(0);
  const [toursCarouselCurrent, setToursCarouselCurrent] = useState(0);
  
  const [searchValue, setSearchValue] = React.useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  const startAutoplay = useCallback((api: CarouselApi | undefined, intervalRef: React.MutableRefObject<NodeJS.Timeout | null>) => {
    if (intervalRef.current || !api) return;
    intervalRef.current = setInterval(() => {
        api.scrollNext();
    }, 4000);
  }, []);

  const stopAutoplay = useCallback((intervalRef: React.MutableRefObject<NodeJS.Timeout | null>) => {
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }
  }, []);
  
  const resetAutoplay = useCallback((api: CarouselApi | undefined, intervalRef: React.MutableRefObject<NodeJS.Timeout | null>) => {
    stopAutoplay(intervalRef);
    startAutoplay(api, intervalRef);
  }, [startAutoplay, stopAutoplay]);


  useEffect(() => {
    if (!mainCarouselApi) return;
    startAutoplay(mainCarouselApi, mainCarouselIntervalRef);
    mainCarouselApi.on('pointerDown', () => stopAutoplay(mainCarouselIntervalRef));
    mainCarouselApi.on('select', () => resetAutoplay(mainCarouselApi, mainCarouselIntervalRef));
    return () => stopAutoplay(mainCarouselIntervalRef);
  }, [mainCarouselApi, startAutoplay, stopAutoplay, resetAutoplay]);
  
  useEffect(() => {
    if (!toursCarouselApi) return;
    setToursCarouselCount(toursCarouselApi.scrollSnapList().length);
    setToursCarouselCurrent(toursCarouselApi.selectedScrollSnap() + 1);

    toursCarouselApi.on('select', () => {
      setToursCarouselCurrent(toursCarouselApi.selectedScrollSnap() + 1);
    });
  }, [toursCarouselApi]);


  if (loading) {
      return <PageSkeleton />
  }

  return (
    <div className="space-y-8 md:space-y-12">
       
      <div>
          <h2 className="text-xl font-bold tracking-tight">Choisissez votre prochain voyage</h2>
          <div className="horizontal-scroll-fade">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 mt-3 -mx-4 px-4">
                  <Button variant={activeCategory === 'Asia' ? 'default': 'ghost'} className="rounded-full flex-shrink-0" onClick={() => setActiveCategory('Asia')}>Asie</Button>
                  <Button variant={activeCategory === 'Europe' ? 'default': 'ghost'} className="rounded-full flex-shrink-0" onClick={() => setActiveCategory('Europe')}>Europe</Button>
                  <Button variant={activeCategory === 'America' ? 'primary': 'ghost'} className="rounded-full bg-primary text-primary-foreground flex-shrink-0" onClick={() => setActiveCategory('America')}>Amérique</Button>
                  <Button variant={activeCategory === 'North' ? 'default': 'ghost'} className="rounded-full flex-shrink-0" onClick={() => setActiveCategory('North')}>Nord</Button>
                  <Button variant={activeCategory === 'Africa' ? 'default': 'ghost'} className="rounded-full flex-shrink-0" onClick={() => setActiveCategory('Africa')}>Afrique</Button>
                  <Button variant={activeCategory === 'Oceania' ? 'default': 'ghost'} className="rounded-full flex-shrink-0" onClick={() => setActiveCategory('Oceania')}>Océanie</Button>
                  <Button variant={activeCategory === 'Antarctica' ? 'default': 'ghost'} className="rounded-full flex-shrink-0" onClick={() => setActiveCategory('Antarctica')}>Antarctique</Button>
              </div>
          </div>
      </div>

      <div className="relative -mx-4 sm:mx-0">
          <Carousel setApi={setMainCarouselApi} opts={{ loop: true, align: 'start' }} className="w-full">
              <CarouselContent className="-ml-4">
                  {trips.map((trip, index) => (
                      <CarouselItem key={index} className="basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4">
                          <Card className="border-none shadow-xl rounded-3xl overflow-hidden group w-full bg-card/50 backdrop-blur-sm">
                              <CardContent className="p-0">
                              <div className="relative aspect-[3/4]">
                                  <Image src={trip.image} alt={trip.name} fill className="object-cover" data-ai-hint={trip.hint} />
                                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent" />
                                  <Button variant="ghost" size="icon" className="absolute top-4 right-4 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm">
                                  <Heart className="w-5 h-5" />
                                  </Button>
                                  <div className="absolute bottom-0 left-0 p-5 w-full">
                                  <p className="text-sm text-white/90">{trip.country}</p>
                                  <h3 className="font-bold text-2xl text-white">{trip.name}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                      <p className="text-sm text-white"><span className="font-bold">{trip.rating}</span> ({trip.reviews} avis)</p>
                                  </div>
                                  <Button className="w-full mt-4 bg-white/90 text-black hover:bg-white rounded-full">Voir plus</Button>
                                  </div>
                              </div>
                              </CardContent>
                          </Card>
                      </CarouselItem>
                  ))}
              </CarouselContent>
          </Carousel>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold tracking-tight">Circuits à venir</h2>
        </div>
        <div className="relative -mx-4 sm:mx-0">
            <Carousel setApi={setToursCarouselApi} opts={{ align: "start" }} className="w-full">
                <CarouselContent className="-ml-4">
                    {upcomingTours.map((tour, index) => (
                        <CarouselItem key={index} className="pl-4 basis-4/5 sm:basis-2/3 md:basis-1/2 lg:basis-2/5 xl:basis-1/3">
                            <Card className="flex-shrink-0 w-full border-none shadow-lg rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm flex flex-row">
                                <div className="bg-secondary p-2 flex items-center justify-center rounded-l-2xl">
                                    <h3 className="font-bold text-sm text-secondary-foreground [writing-mode:vertical-rl] rotate-180 whitespace-nowrap text-center">{tour.name}</h3>
                                </div>
                                <div className={cn("flex flex-col flex-1", tour.bgColor)}>
                                    <div className="relative w-full aspect-square">
                                        <Image src={tour.image} alt={tour.name} fill className="object-cover" data-ai-hint={tour.hint} />
                                    </div>
                                    <div className="p-4 flex items-center justify-between">
                                        <Button variant="ghost" size="icon" className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm glass-button">
                                            <Heart className="w-5 h-5" />
                                        </Button>
                                        <div className='text-right'>
                                            <p className="text-sm text-muted-foreground line-through">${tour.originalPrice}</p>
                                            <p className="font-bold text-lg">${tour.price}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm glass-button">
                                            <ShoppingCart className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex left-2" />
                <CarouselNext className="hidden sm:flex right-2" />
            </Carousel>
             <div className="flex justify-start gap-2 pt-4 px-4">
                {Array.from({ length: toursCarouselCount }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => toursCarouselApi?.scrollTo(i)}
                        className={cn(
                            "h-2 w-2 rounded-full transition-all glass-indicator",
                            i === toursCarouselCurrent -1 ? 'w-4 bg-primary' : 'bg-primary/20'
                        )}
                    />
                ))}
            </div>
        </div>
      </div>

      <div>
          <h2 className="text-xl font-bold tracking-tight mb-4">Destinations populaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {destinations.map((dest, index) => (
                <div key={index} className="relative aspect-square group">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary/20 relative">
                        <Image src={dest.image} alt={dest.name} fill className="object-cover group-hover:scale-110 transition-transform duration-300" data-ai-hint={dest.hint} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-3">
                           <h3 className="text-white text-sm font-bold text-center px-1">{dest.name}</h3>
                        </div>
                    </div>
                     <Button size="icon" className="absolute bottom-0 right-0 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 h-8 w-8">
                        <PlusCircle className="h-4 w-4"/>
                    </Button>
                </div>
            ))}
          </div>
      </div>
      
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Notre sélection éditoriale</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {editorialPicks.map((pick, index) => (
            <Card key={index} className="border-none shadow-lg rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm group">
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <Image src={pick.image} alt={pick.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" data-ai-hint={pick.imageHint} />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg leading-tight mb-2">{pick.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={pick.avatar} alt={pick.author} data-ai-hint={pick.avatarHint}/>
                      <AvatarFallback>{pick.author.slice(0,1)}</AvatarFallback>
                    </Avatar>
                    <span>{pick.author}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden">
        <Image src="https://placehold.co/1200x400.png" alt="Préparez votre voyage" fill className="object-cover" data-ai-hint="travel planning map" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative p-8 md:p-12 flex flex-col items-start text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Préparez votre voyage</h2>
          <p className="text-lg md:text-xl mb-4 max-w-lg">Nos outils et guides sont là pour vous aider à planifier l'aventure de vos rêves.</p>
          <Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
            Commencer à planifier <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
