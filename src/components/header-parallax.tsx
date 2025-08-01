'use client';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type HeaderParallaxProps = {
  title: string;
  backgroundImage?: string;
  children?: React.ReactNode;
};

export default function HeaderParallax({ title, backgroundImage }: HeaderParallaxProps) {
    const router = useRouter();

  return (
    <div className="relative h-64">
        <div className="absolute inset-0 w-full h-full">
            <Image 
                src={backgroundImage || 'https://placehold.co/1200x400.png'} 
                alt={title} 
                fill 
                className="object-cover"
                data-ai-hint="landscape"
            />
            <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between absolute top-4 left-0 right-0 z-10">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="bg-white/80 hover:bg-white text-foreground rounded-full">
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
                 {/* Placeholder for potential actions */}
            </div>
        </div>
        <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-4xl font-bold text-white tracking-tight">{title}</h1>
        </div>
    </div>
  );
}
