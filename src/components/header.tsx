import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40">
       <div className="mx-auto max-w-md">
        <div className="bg-primary/90 backdrop-blur-xl m-4 rounded-full shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary-foreground/50">
                <AvatarImage src="https://placehold.co/80x80.png" alt="Vanessa" data-ai-hint="female portrait"/>
                <AvatarFallback>V</AvatarFallback>
              </Avatar>
              <div className="text-primary-foreground">
                <h1 className="font-bold text-lg">Bonjour, Vanessa</h1>
                <p className="text-sm text-primary-foreground/80">Bienvenue sur TripGlide</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" aria-label="Filters" className="rounded-full bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
       </div>
    </header>
  );
}
