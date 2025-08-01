
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';


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
]

const upcomingTours = [
    {
      name: 'Brésil Iconique',
      duration: '8 jours',
      price: 659,
      rating: 4.6,
      reviews: 56,
      image: 'https://placehold.co/400x300.png',
      hint: 'brazil mountains'
    },
    {
      name: 'Paradis balnéaire',
      duration: '5 jours',
      price: 450,
      rating: 4.8,
      reviews: 89,
      image: 'https://placehold.co/400x300.png',
      hint: 'brazil beach'
    }
]

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

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // This effect should only run on the client side
    const style = document.createElement('style');
    style.innerHTML = `.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`;
    document.head.appendChild(style);

    return () => {
       if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  if (loading) {
      return <PageSkeleton />
  }

  return (
    <div className="flex flex-col min-h-screen text-foreground font-sans">
      <div className="space-y-8">
        <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"><path d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"/></svg>
            <Input placeholder="Rechercher" className="pl-10 h-12 rounded-full bg-secondary border-none" />
        </div>

        <div>
            <h2 className="text-xl font-bold tracking-tight">Choisissez votre prochain voyage</h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mt-3 -mx-4 px-4">
                <Button variant={activeCategory === 'Asia' ? 'default': 'ghost'} className="rounded-full" onClick={() => setActiveCategory('Asia')}>Asie</Button>
                <Button variant={activeCategory === 'Europe' ? 'default': 'ghost'} className="rounded-full" onClick={() => setActiveCategory('Europe')}>Europe</Button>
                <Button variant={activeCategory === 'America' ? 'primary': 'ghost'} className="rounded-full bg-primary text-primary-foreground" onClick={() => setActiveCategory('America')}>Amérique</Button>
                <Button variant={activeCategory === 'North' ? 'default': 'ghost'} className="rounded-full" onClick={() => setActiveCategory('North')}>Nord</Button>
                <Button variant={activeCategory === 'Africa' ? 'default': 'ghost'} className="rounded-full" onClick={() => setActiveCategory('Africa')}>Afrique</Button>
            </div>
        </div>

        <div className="relative">
            <div className="overflow-x-auto -mx-4 px-4 pb-4 no-scrollbar" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
                <div className="flex space-x-4">
                    {trips.map((trip) => (
                    <div key={trip.name} className="flex-shrink-0 w-[85%] sm:w-80 snap-center">
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
                    </div>
                    ))}
                </div>
            </div>
        </div>
        
        <div>
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold tracking-tight">Circuits à venir</h2>
                <Button variant="link" className="text-sm">Voir tout</Button>
            </div>
            <div className="space-y-4">
            {upcomingTours.map((tour) => (
                <Card key={tour.name} className="border-none shadow-lg rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 shrink-0">
                    <Image src={tour.image} alt={tour.name} fill className="object-cover" data-ai-hint={tour.hint} />
                    </div>
                    <div className="flex-1 py-2 pr-4">
                    <h3 className="font-bold">{tour.name}</h3>
                    <p className="text-sm text-muted-foreground">{tour.duration} • dès ${tour.price}/personne</p>
                    <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">{tour.rating}</span> ({tour.reviews} avis)</p>
                    </div>
                    </div>
                    <Button variant="secondary" size="icon" className="shrink-0 mr-4 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </Button>
                </div>
                </Card>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
}
