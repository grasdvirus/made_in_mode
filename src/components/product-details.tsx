'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Minus, Plus } from 'lucide-react';
import { type Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

type ProductDetailsProps = {
  product: Product;
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart!",
      description: `${quantity} x ${product.name} (${selectedSize}, ${selectedColor.name})`,
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
      <Carousel className="w-full">
        <CarouselContent>
          {product.images.map((image, index) => (
            <CarouselItem key={index}>
              <Card className="overflow-hidden aspect-[4/5] relative bg-transparent border-none shadow-none">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  data-ai-hint={image.hint}
                />
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 hidden sm:inline-flex" />
        <CarouselNext className="absolute right-4 hidden sm:inline-flex" />
      </Carousel>

      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          <h1 className="text-3xl font-bold font-headline lg:text-4xl">{product.name}</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn("w-5 h-5", i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50 fill-muted-foreground/20')} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">({product.reviews} reviews)</p>
          </div>
        </div>
        <p className="text-muted-foreground">{product.description}</p>
        
        <Separator />
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Color: <span className="font-normal text-muted-foreground">{selectedColor.name}</span></h3>
            <RadioGroup value={selectedColor.hex} onValueChange={(hex) => setSelectedColor(product.colors.find(c => c.hex === hex)!)} className="flex items-center gap-2 mt-2">
              {product.colors.map((color) => (
                <div key={color.hex}>
                  <RadioGroupItem value={color.hex} id={color.hex} className="sr-only" />
                  <label htmlFor={color.hex} className={cn(
                    "w-8 h-8 rounded-full border-2 cursor-pointer transition-all flex items-center justify-center",
                    selectedColor.hex === color.hex ? 'border-primary' : 'border-transparent hover:border-muted-foreground'
                  )} style={{ backgroundColor: color.hex }}>
                     { selectedColor.hex === color.hex && <div className="w-3 h-3 rounded-full bg-white mix-blend-difference"/>}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <h3 className="text-lg font-medium">Size</h3>
            <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex items-center gap-2 mt-2 flex-wrap">
              {product.sizes.map((size) => (
                 <div key={size}>
                  <RadioGroupItem value={size} id={size} className="sr-only" />
                  <label htmlFor={size} className={cn(
                    "px-4 py-2 rounded-md border cursor-pointer text-sm",
                    selectedSize === size ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary hover:bg-muted'
                  )}>
                    {size}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium shrink-0">Quantity</h3>
            <div className="flex items-center gap-2 border rounded-md">
              <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q-1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => setQuantity(q => q+1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-3xl font-bold text-right">
            ${(product.price * quantity).toFixed(2)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button size="lg" onClick={handleAddToCart}>Add to Cart</Button>
          <Button size="lg" variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90">Buy Now</Button>
        </div>
      </div>
    </div>
  );
}
