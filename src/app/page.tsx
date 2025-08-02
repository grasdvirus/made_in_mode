
'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Heart, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const yachtData = [
  {
    name: 'Manhattan - Elegant Sea South',
    location: 'Monaco',
    duration: '1h 30m',
    type: 'Private',
    price: 350,
    image: 'https://placehold.co/600x400.png',
    hint: 'luxury yacht',
  },
  {
    name: 'Azure Spirit - Ocean Voyager',
    location: 'St. Tropez',
    duration: '2h',
    type: 'Group',
    price: 150,
    image: 'https://placehold.co/600x400.png',
    hint: 'modern yacht',
  },
  {
    name: 'Serenity - Coastal Cruiser',
    location: 'Cannes',
    duration: '1h',
    type: 'Private',
    price: 280,
    image: 'https://placehold.co/600x400.png',
    hint: 'sleek yacht',
  },
  {
    name: 'Neptune’s Chariot',
    location: 'Nice',
    duration: '2h 30m',
    type: 'Private',
    price: 550,
    image: 'https://placehold.co/600x400.png',
    hint: 'large yacht',
  },
];

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
            <p className="text-white/70 text-xs leading-none">YACHTING EXPERIENCE</p>
        </div>
    </div>
)

export default function HomePage() {
  return (
    <div className="bg-background min-h-screen -mx-4 -mt-8">
      {/* Header with Background Image */}
      <header className="relative h-64 md:h-80 rounded-b-3xl overflow-hidden">
        <Image
          src="https://placehold.co/1200x800.png"
          alt="Yachting experience"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
          data-ai-hint="yacht ocean"
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 flex flex-col justify-center items-center h-full text-white p-4">
          <AcePlaceLogo />
          <div className="relative w-full max-w-sm mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
            <Input
              placeholder="Discover yachts & experiences"
              className="w-full h-12 pl-12 rounded-full bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {yachtData.map((yacht, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-105 duration-300">
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={yacht.image}
                    alt={yacht.name}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                    data-ai-hint={yacht.hint}
                  />
                  <Button variant="ghost" size="icon" className="absolute top-3 right-3 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm">
                    <Heart className="w-5 h-5" />
                  </Button>
                   <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full">
                    ${yacht.price}/h
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-foreground">{yacht.name}</h3>
                  <div className="flex items-center text-muted-foreground text-sm mt-2 gap-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{yacht.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{yacht.duration}</span>
                    </div>
                  </div>
                   <p className="text-sm text-primary font-semibold mt-1">{yacht.type}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
