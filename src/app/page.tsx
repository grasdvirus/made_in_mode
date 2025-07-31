'use client';

import { useState } from 'react';
import Header from '@/components/header';
import FooterNav from '@/components/footer-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import Image from 'next/image';

const products = [
  {
    name: 'Obsidian Pulse',
    style: 'Arctic Veil',
    price: 189.00,
    image: 'https://placehold.co/500x600.png',
    hint: 'red jacket'
  },
  {
    name: 'Another Product',
    style: 'Future Tech',
    price: 249.00,
    image: 'https://placehold.co/500x600.png',
    hint: 'purple jacket'
  }
]

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('Outerwear');
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent -z-10" />
      <Header />
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-28 pb-32">
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tighter leading-tight font-headline uppercase">
            Glow Hard. <br />
            Run The Future.
          </h1>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Button variant={activeCategory === 'Outerwear' ? 'secondary': 'ghost'} onClick={() => setActiveCategory('Outerwear')}>Outerwear</Button>
            <Button variant={activeCategory === 'Jackets & Puffers' ? 'secondary': 'ghost'} onClick={() => setActiveCategory('Jackets & Puffers')}>Jackets & Puffers</Button>
            <Button variant={activeCategory === 'T-Shirts' ? 'secondary': 'ghost'} onClick={() => setActiveCategory('T-Shirts')}>T-Shirts</Button>
          </div>

          <div className="space-y-4">
            {products.map(product => (
               <Card key={product.name} className="bg-card/80 backdrop-blur-sm border-white/10 rounded-2xl overflow-hidden group">
                <CardContent className="p-0">
                  <div className="relative aspect-[5/6]">
                    <Image src={product.image} alt={product.name} fill className="object-cover" data-ai-hint={product.hint}/>
                    <Button variant="ghost" size="icon" className="absolute top-3 right-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm">
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.style}</p>
                      </div>
                      <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <FooterNav />
    </div>
  );
}
