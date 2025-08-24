
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Heart, Tag, ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const featuredProducts = [
  {
    name: 'Robe de Soirée Élégante',
    category: 'Robes',
    price: 75000,
    image: 'https://placehold.co/600x400.png',
    hint: 'evening dress',
  },
  {
    name: 'Sac à Main Cuir Bordeaux',
    category: 'Sacs',
    price: 55000,
    image: 'https://placehold.co/600x400.png',
    hint: 'leather handbag',
  },
  {
    name: 'Escarpins Noirs Classiques',
    category: 'Chaussures',
    price: 62000,
    image: 'https://placehold.co/600x400.png',
    hint: 'black heels',
  },
  {
    name: 'Trench-Coat Beige Iconique',
    category: 'Manteaux',
    price: 120000,
    image: 'https://placehold.co/600x400.png',
    hint: 'beige trench coat',
  },
   {
    name: 'Jupe Plissée Rose Poudré',
    category: 'Jupes',
    price: 42000,
    image: 'https://placehold.co/600x400.png',
    hint: 'pink skirt',
  },
  {
    name: 'Blouse en Soie Ivoire',
    category: 'Hauts',
    price: 48000,
    image: 'https://placehold.co/600x400.png',
    hint: 'silk blouse',
  },
];

const categories = [
    { name: 'Nouveautés', image: 'https://placehold.co/200x200.png', hint: 'new fashion' },
    { name: 'Vêtements', image: 'https://placehold.co/200x200.png', hint: 'clothing rack' },
    { name: 'Chaussures', image: 'https://placehold.co/200x200.png', hint: 'stylish shoes' },
    { name: 'Accessoires', image: 'https://placehold.co/200x200.png', hint: 'fashion accessories' },
    { name: 'Robes', image: 'https://placehold.co/200x200.png', hint: 'elegant dress' },
    { name: 'Sacs', image: 'https://placehold.co/200x200.png', hint: 'handbag collection' },
    { name: 'Manteaux', image: 'https://placehold.co/200x200.png', hint: 'winter coat' },
    { name: 'Bijoux', image: 'https://placehold.co/200x200.png', hint: 'luxury jewelry' }
]

const products = [
    { name: 'Veste en cuir', description: 'Style intemporel, qualité exceptionnelle.', image: 'https://placehold.co/100x100.png', hint: 'leather jacket' },
    { name: 'Baskets Urbaines', description: 'Confort et design pour la ville.', image: 'https://placehold.co/100x100.png', hint: 'urban sneakers' },
    { name: 'Sac à main Chic', description: 'L\'accessoire parfait pour toute occasion.', image: 'https://placehold.co/100x100.png', hint: 'chic handbag' }
]

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

export default function HomePage() {
  const [searchValue, setSearchValue] = React.useState('');
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

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


  return (
    <div className="bg-background min-h-screen -mx-4 -mt-8">
      {/* Header with Background Image */}
      <header className="relative h-64 md:h-80 rounded-b-3xl overflow-hidden">
        <Image
          src="https://placehold.co/1200x800.png"
          alt="Boutique de mode"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
          data-ai-hint="fashion boutique"
        />
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
        <div className="space-y-8">
          {/* Categories Section */}
          <section className="p-4 md:p-6 pb-0">
               <Carousel
                  opts={{
                      align: "start",
                      dragFree: true,
                  }}
                  className="w-full no-scrollbar"
              >
                  <CarouselContent>
                      {categories.map((category, index) => (
                          <CarouselItem key={index} className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6">
                              <div className="flex flex-col items-center gap-2 flex-shrink-0 text-center w-24 mx-auto">
                                  <div className="relative w-24 h-24">
                                      <Image src={category.image} alt={category.name} fill className="rounded-full object-cover border-2 border-primary/50" data-ai-hint={category.hint} />
                                  </div>
                                  <span className="text-sm font-medium">{category.name}</span>
                              </div>
                          </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious className="flex bg-accent text-accent-foreground hover:bg-accent/80 -left-2" />
                  <CarouselNext className="flex bg-accent text-accent-foreground hover:bg-accent/80 -right-2" />
              </Carousel>
          </section>

          {/* Featured Products Carousel Section */}
          <section className="relative">
            <Carousel setApi={setApi} opts={{ align: "start" }} className="w-full horizontal-scroll-fade no-scrollbar">
                <CarouselContent className="ml-4">
                  {featuredProducts.map((product, index) => (
                    <CarouselItem key={index} className="pl-0 basis-4/5 sm:basis-1/2">
                      <div className="px-2">
                        <Card className="bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-105 duration-300 h-full">
                          <CardContent className="p-0">
                            <div className="relative">
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={600}
                                height={400}
                                className="w-full h-48 object-cover"
                                data-ai-hint={product.hint}
                              />
                              <Button variant="ghost" size="icon" className="absolute top-3 right-3 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm">
                                <Heart className="w-5 h-5" />
                              </Button>
                              <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full">
                                {product.price.toLocaleString('fr-FR')} FCFA
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold text-lg text-foreground">{product.name}</h3>
                              <div className="flex items-center text-muted-foreground text-sm mt-2 gap-4">
                                <div className="flex items-center gap-1.5">
                                  <Tag className="w-4 h-4" />
                                  <span>{product.category}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
            </Carousel>
            <div className="flex justify-start gap-2 pt-4 px-4">
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
          </section>

          {/* Minimalist Products Section */}
          <section className="space-y-4 p-4 md:p-6 pt-0">
              {products.map((product, index) => (
                   <Card key={index} className="bg-secondary/50 border-none shadow-md rounded-2xl p-4">
                      <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 flex-shrink-0">
                             <Image src={product.image} alt={product.name} fill className="rounded-full object-cover" data-ai-hint={product.hint} />
                          </div>
                          <div className="flex-grow">
                              <h3 className="font-bold text-lg">{product.name}</h3>
                              <p className="text-muted-foreground text-sm">{product.description}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="bg-primary/20 text-primary rounded-full hover:bg-primary/30">
                              <ArrowRight className="w-5 h-5" />
                          </Button>
                      </div>
                  </Card>
              ))}
          </section>
        </div>
      </main>
    </div>
  );
}
