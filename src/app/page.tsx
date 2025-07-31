'use client';

import { useState } from 'react';
import Header from '@/components/header';
import FooterNav from '@/components/footer-nav';
import ProductDetails from '@/components/product-details';
import OutfitSuggester from '@/components/outfit-suggester';
import { type Product } from '@/lib/types';

const mockProduct: Product = {
  id: '1',
  name: 'Urban Explorer Hoodie',
  brand: 'CityFit',
  images: [
    { src: 'https://placehold.co/800x1000.png', alt: 'Front view of the hoodie', hint: 'stylish hoodie' },
    { src: 'https://placehold.co/800x1000.png', alt: 'Back view of the hoodie', hint: 'gray hoodie' },
    { src: 'https://placehold.co/800x1000.png', alt: 'Side view of the hoodie', hint: 'athletic wear' },
  ],
  description: "Experience the perfect blend of style and comfort with the Urban Explorer Hoodie. Crafted for the modern adventurer, this hoodie features a premium cotton blend, an ergonomic fit, and a minimalist design. Whether you're navigating city streets or relaxing at home, do it in style.",
  rating: 4.5,
  reviews: 128,
  price: 89.99,
  sizes: ['S', 'M', 'L', 'XL'],
  colors: [
    { name: 'Onyx Black', hex: '#000000' },
    { name: 'Heather Gray', hex: '#a0a0a0' },
    { name: 'Deep Navy', hex: '#1a202c' },
  ],
};


export default function Home() {
  const [isSuggesterOpen, setIsSuggesterOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-background to-background -z-10" />
      <Header />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-20 pb-28 sm:px-6 lg:px-8">
        <ProductDetails product={mockProduct} />
      </main>
      <FooterNav onSuggestClick={() => setIsSuggesterOpen(true)} />
      <OutfitSuggester isOpen={isSuggesterOpen} onOpenChange={setIsSuggesterOpen} />
    </div>
  );
}
