
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star, Compass, PlusCircle, ShoppingCart, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

const allTrips = [
  {
    name: 'Rio de Janeiro',
    country: 'Brésil',
    rating: 5.0,
    reviews: 143,
    image: 'https://placehold.co/600x800.png',
    hint: 'brazil landscape',
    continent: 'Amérique',
  },
  {
    name: 'Chutes d\'Iguazu',
    country: 'Argentine',
    rating: 4.9,
    reviews: 112,
    image: 'https://placehold.co/600x800.png',
    hint: 'argentina waterfall',
    continent: 'Amérique',
  },
  {
    name: 'Machu Picchu',
    country: 'Pérou',
    rating: 4.9,
    reviews: 215,
    image: 'https://placehold.co/600x800.png',
    hint: 'peru mountains',
    continent: 'Amérique',
  },
   {
    name: 'Salar de Uyuni',
    country: 'Bolivie',
    rating: 4.8,
    reviews: 180,
    image: 'https://placehold.co/600x800.png',
    hint: 'bolivia salt flat',
    continent: 'Amérique',
  },
   {
    name: 'Île de Pâques',
    country: 'Chili',
    rating: 4.7,
    reviews: 190,
    image: 'https://placehold.co/600x800.png',
    hint: 'chile easter island',
    continent: 'Amérique',
  },
  {
    name: 'Kyoto',
    country: 'Japon',
    rating: 4.9,
    reviews: 250,
    image: 'https://placehold.co/600x800.png',
    hint: 'japan kyoto',
    continent: 'Asie',
  },
  {
    name: 'Santorin',
    country: 'Grèce',
    rating: 4.8,
    reviews: 310,
    image: 'https://placehold.co/600x800.png',
    hint: 'greece santorini',
    continent: 'Europe',
  },
]

type Tour = {
  name: string;
  duration: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  hint: string;
  bgColor: string;
};


const destinations = [
    { name: 'Paris', image: 'https://placehold.co/400x400.png', hint: 'france eiffel tower' },
    { name: 'Tokyo', image: 'https://placehold.co/400x400.png', hint: 'japan city night' },
    { name: 'New York', image: 'https://placehold.co/400x400.png', hint: 'new york city skyline' },
    { name: 'Rome', image: 'https://placehold.co/400x400.png', hint: 'italy colosseum' },
    { name: 'Santorin', image: 'https://placehold.co/400x400.png', hint: 'greece santorini' },
    { name: 'Bali', image: 'https://placehold.co/400x400.png', hint: 'indonesia bali' },
    { name: 'Sydney', image: 'https://placehold.co/400x400.png', hint: 'australia opera house' },
    { name: 'Le Caire', image: 'https://placehold.co/400x400.png', hint: 'egypt pyramids' }
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

const DestinationCard = ({ dest }: { dest: typeof destinations[0] }) => (
    <div className="relative aspect-square w-40 md:w-52 lg:w-64 flex-shrink-0 group">
        <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary/20 relative">
            <Image 
                src={dest.image} 
                alt={dest.name} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-300" 
                data-ai-hint={dest.hint} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-3">
               <h3 className="text-white text-sm font-bold text-center px-1">{dest.name}</h3>
            </div>
        </div>
         <Button size="icon" className="absolute bottom-0 right-0 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 h-8 w-8">
            <PlusCircle className="h-4 w-4"/>
        </Button>
    </div>
);

const AnimatedDestinations = () => {
    const destinationsColumn1 = [...destinations, ...destinations, ...destinations];
    const destinationsColumn2 = [...destinations, ...destinations, ...destinations].reverse();

    return (
        <div className="relative h-[500px] overflow-hidden scroller flex justify-center gap-4" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' }}>
            <div className="animate-scroll-down space-y-4">
                {destinationsColumn1.map((dest, index) => (
                    <DestinationCard key={`col1-vert-${index}`} dest={dest} />
                ))}
            </div>
            <div className="animate-scroll-up space-y-4">
                {destinationsColumn2.map((dest, index) => (
                    <DestinationCard key={`col2-vert-${index}`} dest={dest} />
                ))}
            </div>
        </div>
    );
};

const AnimatedDestinationsLarge = () => {
    const destinationsRow1 = [...destinations, ...destinations, ...destinations];
    const destinationsRow2 = [...destinations, ...destinations, ...destinations].reverse();

    return (
        <div className="hidden md:flex flex-col gap-4 scroller w-full overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'}}>
             <div className="flex w-max animate-scroll-left space-x-4">
                {destinationsRow1.map((dest, index) => (
                    <DestinationCard key={`row1-horz-${index}`} dest={dest} />
                ))}
            </div>
            <div className="flex w-max animate-scroll-right space-x-4">
                {destinationsRow2.map((dest, index) => (
                     <DestinationCard key={`row2-horz-${index}`} dest={dest} />
                ))}
            </div>
        </div>
    );
};


export default function DiscoverPage() {
  const [toursCarouselApi, setToursCarouselApi] = useState<CarouselApi>();
  const [toursCarouselCount, setToursCarouselCount] = useState(0);
  const [toursCarouselCurrent, setToursCarouselCurrent] = useState(0);
  const [upcomingTours, setUpcomingTours] = useState<Tour[]>([]);

  useEffect(() => {
    fetch('/products.json')
      .then((res) => res.json())
      .then((data) => setUpcomingTours(data));
  }, []);
  
  useEffect(() => {
    if (!toursCarouselApi) return;
    setToursCarouselCount(toursCarouselApi.scrollSnapList().length);
    setToursCarouselCurrent(toursCarouselApi.selectedScrollSnap() + 1);

    const onSelect = () => {
      setToursCarouselCurrent(toursCarouselApi.selectedScrollSnap() + 1);
    };

    toursCarouselApi.on('select', onSelect);
    
    return () => {
        toursCarouselApi.off('select', onSelect);
    }
  }, [toursCarouselApi]);


  return (
    <div className="space-y-8 md:space-y-12">
       
      <div>
          <h2 className="text-xl font-bold tracking-tight">Choisissez votre prochain voyage</h2>
      </div>

      <div className="relative -mx-4 sm:mx-0 no-scrollbar">
          {allTrips.length > 0 ? (
            <Carousel opts={{ loop: allTrips.length > 1, align: 'start' }} className="w-full">
                <CarouselContent className="-ml-4">
                    {allTrips.map((trip, index) => (
                        <CarouselItem key={index} className="pl-4 basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
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
                                    <Link href="/discover" passHref>
                                        <Button asChild className="w-full mt-4 bg-white/90 text-black hover:bg-white rounded-full">
                                            <span>Voir plus</span>
                                        </Button>
                                    </Link>
                                    </div>
                                </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
          ) : (
             <Card className="flex flex-col items-center justify-center p-12 text-center bg-secondary/50 border-dashed min-h-[300px]">
                <Compass className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">Aucun voyage trouvé</h3>
                <p className="text-muted-foreground mt-2">Essayez de sélectionner une autre catégorie pour trouver votre bonheur !</p>
            </Card>
          )}
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
                                            <p className="text-sm text-muted-foreground line-through">FCFA {tour.originalPrice.toLocaleString()}</p>
                                            <p className="font-bold text-lg">FCFA {tour.price.toLocaleString()}</p>
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

      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold tracking-tight mb-4">Destinations populaires</h2>
        <AnimatedDestinations />
        <AnimatedDestinationsLarge />
      </div>
      
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Notre sélection éditoriale</h2>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
            {editorialPicks.map((pick, index) => (
                <Card key={index} className="border-none shadow-lg rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm group h-full flex flex-col md:flex-row">
                    <CardContent className="p-0 flex-1 flex flex-col md:w-1/2">
                        <div className="relative aspect-video w-full md:h-full">
                            <Image src={pick.image} alt={pick.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" data-ai-hint={pick.imageHint} />
                        </div>
                    </CardContent>
                     <div className="p-6 flex flex-col flex-1 md:w-1/2 justify-center">
                        <h3 className="font-bold text-2xl leading-tight mb-3">{pick.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                            <Avatar className="w-8 h-8">
                            <AvatarImage src={pick.avatar} alt={pick.author} data-ai-hint={pick.avatarHint}/>
                            <AvatarFallback>{pick.author.slice(0,1)}</AvatarFallback>
                            </Avatar>
                            <span>{pick.author}</span>
                        </div>
                        <div className="mt-auto md:mt-4">
                            <Button className="rounded-full w-full">
                                Lire l'article <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
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
          <Link href="/discover" passHref>
            <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <span>Commencer à planifier <ArrowRight className="ml-2 h-5 w-5" /></span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
