
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Star, Sun, Mountain, Building, Ship } from 'lucide-react';
import { cn } from '@/lib/utils';

const allDestinations = [
  {
    name: 'Santorin, Grèce',
    category: 'Plage',
    rating: 4.9,
    image: 'https://placehold.co/600x800.png',
    hint: 'greece santorini',
  },
  {
    name: 'Kyoto, Japon',
    category: 'Ville',
    rating: 4.8,
    image: 'https://placehold.co/600x800.png',
    hint: 'japan kyoto',
  },
  {
    name: 'Parc national de Banff, Canada',
    category: 'Montagne',
    rating: 4.9,
    image: 'https://placehold.co/600x800.png',
    hint: 'canada mountains',
  },
  {
    name: 'Bora Bora, Polynésie française',
    category: 'Plage',
    rating: 4.9,
    image: 'https://placehold.co/600x800.png',
    hint: 'bora bora beach',
  },
  {
    name: 'Rome, Italie',
    category: 'Ville',
    rating: 4.7,
    image: 'https://placehold.co/600x800.png',
    hint: 'italy rome',
  },
  {
    name: 'Mont Everest, Népal',
    category: 'Montagne',
    rating: 4.8,
    image: 'https://placehold.co/600x800.png',
    hint: 'mount everest',
  },
  {
    name: 'Maldives',
    category: 'Plage',
    rating: 4.9,
    image: 'https://placehold.co/600x800.png',
    hint: 'maldives beach',
  },
  {
    name: 'New York, USA',
    category: 'Ville',
    rating: 4.6,
    image: 'https://placehold.co/600x800.png',
    hint: 'new york city',
  },
  {
    name: 'Croisière en Alaska',
    category: 'Croisière',
    rating: 4.7,
    image: 'https://placehold.co/600x800.png',
    hint: 'alaska cruise',
  },
    {
    name: 'Paris, France',
    category: 'Ville',
    rating: 4.7,
    image: 'https://placehold.co/600x800.png',
    hint: 'paris france',
    },
    {
    name: 'Zermatt, Suisse',
    category: 'Montagne',
    rating: 4.9,
    image: 'https://placehold.co/600x800.png',
    hint: 'switzerland mountains',
    },
    {
    name: 'Phuket, Thaïlande',
    category: 'Plage',
    rating: 4.6,
    image: 'https://placehold.co/600x800.png',
    hint: 'thailand beach',
    },
];

const filters = [
  { name: 'Tous', icon: Star, category: 'Tous' },
  { name: 'Plage', icon: Sun, category: 'Plage' },
  { name: 'Montagne', icon: Mountain, category: 'Montagne' },
  { name: 'Ville', icon: Building, category: 'Ville' },
  { name: 'Croisière', icon: Ship, category: 'Croisière' },
];


export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger entrance animation for the grid
    setAnimate(true);
  }, []);

  const filteredDestinations = useMemo(() => {
    return allDestinations.filter(dest => {
      const matchesFilter = activeFilter === 'Tous' || dest.category === activeFilter;
      const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [searchTerm, activeFilter]);
  
  return (
    <div className="bg-background rounded-t-3xl min-h-[80vh] shadow-2xl">
        {/* Search and Filter */}
        <div className="p-4 sm:p-6 sticky top-0 bg-background/80 backdrop-blur-lg z-10 rounded-t-3xl">
            <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Rechercher une destination..." 
                    className="pl-12 h-12 text-lg rounded-full bg-secondary border-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 horizontal-scroll-fade">
                {filters.map(filter => (
                    <Button 
                        key={filter.name} 
                        variant={activeFilter === filter.category ? 'primary' : 'ghost'}
                        className={cn(
                          "rounded-full flex-shrink-0 transition-all duration-300",
                          activeFilter === filter.category && 'text-primary-foreground'
                        )}
                        onClick={() => setActiveFilter(filter.category)}
                    >
                        <filter.icon className="mr-2 h-4 w-4" />
                        {filter.name}
                    </Button>
                ))}
            </div>
        </div>
        
        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 sm:p-6">
            {filteredDestinations.map((dest, index) => (
                <Card 
                  key={`${dest.name}-${index}`}
                  className={cn(
                    "border-none shadow-xl rounded-3xl overflow-hidden group w-full bg-card/50 backdrop-blur-sm transition-all duration-500 ease-out",
                     animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                  )}
                  style={{ transitionDelay: `${index * 50}ms`}}
                >
                    <CardContent className="p-0">
                        <div className="relative aspect-[4/5]">
                            <Image 
                                src={dest.image} 
                                alt={dest.name} 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-300" 
                                data-ai-hint={dest.hint} 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                               <div className="flex items-center gap-1.5 text-yellow-400 mb-1">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-white font-bold text-sm">{dest.rating}</span>
                                </div>
                                <h3 className="font-bold text-lg text-white leading-tight">{dest.name}</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
        
        {filteredDestinations.length === 0 && (
            <div className="text-center py-20">
                <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Aucune destination trouvée</h3>
                <p className="mt-1 text-sm text-muted-foreground">Essayez de modifier votre recherche ou vos filtres.</p>
            </div>
        )}
    </div>
  );
}
