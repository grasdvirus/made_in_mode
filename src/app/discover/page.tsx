
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star, Compass, ShoppingCart, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Product = {
  name: string;
  duration: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  hint: string;
  bgColor: string;
  continent: string;
};

const categories = ['Tout', 'Amérique', 'Asie', 'Europe', 'Afrique', 'Océanie'];

const recommendedProducts = [
    {
        name: 'Aventure en Patagonie',
        description: 'Explorez des paysages à couper le souffle.',
        image: 'https://placehold.co/400x200.png',
        hint: 'patagonia landscape',
    },
    {
        name: 'Escapade à Kyoto',
        description: 'Découvrez les temples et jardins ancestraux.',
        image: 'https://placehold.co/400x200.png',
        hint: 'kyoto temple',
    },
    {
        name: 'Safari en Tanzanie',
        description: 'Vivez la magie de la faune africaine.',
        image: 'https://placehold.co/400x200.png',
        hint: 'tanzania safari',
    }
]

export default function DiscoverPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch('/products.json')
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        setFilteredProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load products", err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedCategory === 'Tout') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.continent === selectedCategory));
    }
  }, [selectedCategory, products]);

  return (
    <div className="space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Trouvez votre style de voyage</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Parcourez nos collections par continent et découvrez des aventures qui correspondent à vos envies.
        </p>
      </div>

      <div className="flex justify-center flex-wrap gap-2 md:gap-4">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className="rounded-full px-6 transition-all duration-300"
          >
            {category}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
             <Card key={i} className="rounded-2xl overflow-hidden bg-card/50 animate-pulse">
                <div className="aspect-[4/5] bg-muted/50"></div>
                <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted/50 rounded w-3/4"></div>
                    <div className="h-4 bg-muted/50 rounded w-1/2"></div>
                </div>
             </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <Card 
                key={`${product.name}-${index}`} 
                className="rounded-2xl overflow-hidden shadow-lg border-none bg-card/50 backdrop-blur-sm group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-[4/5]">
                    <Image 
                        src={product.image} 
                        alt={product.name} 
                        fill 
                        className="object-cover transition-transform duration-300 group-hover:scale-105" 
                        data-ai-hint={product.hint} 
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                     <Button variant="ghost" size="icon" className="absolute top-3 right-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm">
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-lg truncate">{product.name}</h3>
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-sm text-muted-foreground">({product.reviews} avis)</span>
                       </div>
                       <Button variant="ghost" size="icon" className="rounded-full bg-primary/20 text-primary hover:bg-primary/30">
                          <ShoppingCart className="w-5 h-5" />
                      </Button>
                    </div>
                     <div className="text-right">
                        <p className="text-sm text-muted-foreground line-through">FCFA {product.originalPrice.toLocaleString()}</p>
                        <p className="font-bold text-xl">FCFA {product.price.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center bg-secondary/50 border-dashed rounded-2xl min-h-[300px]">
                <Compass className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">Aucun voyage trouvé</h3>
                <p className="text-muted-foreground mt-2">Essayez de sélectionner une autre catégorie pour trouver votre bonheur !</p>
            </div>
          )}
        </div>
      )}
      
      {/* Recommended Section */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Nos Recommandations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {recommendedProducts.map((product, index) => (
                <Card key={index} className="bg-secondary/50 border-none shadow-lg rounded-2xl p-4 group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative w-full sm:w-32 h-32 sm:h-20 flex-shrink-0">
                           <Image src={product.image} alt={product.name} fill className="rounded-lg object-cover" data-ai-hint={product.hint} />
                        </div>
                        <div className="flex-grow text-center sm:text-left">
                            <h3 className="font-bold text-lg">{product.name}</h3>
                            <p className="text-muted-foreground text-sm">{product.description}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="bg-primary/20 text-primary rounded-full hover:bg-primary/30 transition-transform group-hover:translate-x-1">
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
      </div>

    </div>
  );
}
