import { SlidersHorizontal, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from './ui/input';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40">
       <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="h-20 mt-4 flex items-center justify-between bg-primary/90 backdrop-blur-lg rounded-3xl px-4 shadow-lg">
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar className="h-12 w-12 border-2 border-primary-foreground/50">
              <AvatarImage src="https://placehold.co/80x80.png" alt="Vanessa" data-ai-hint="female portrait"/>
              <AvatarFallback>V</AvatarFallback>
            </Avatar>
            <div className="text-primary-foreground truncate">
              <h1 className="font-bold text-lg truncate">Bonjour, Vanessa</h1>
              <p className="text-sm text-primary-foreground/80 truncate">Bienvenue sur TripGlide</p>
            </div>
          </div>

          <div className="flex-1 max-w-xl hidden md:flex items-center relative mx-8">
             <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
             <Input placeholder="Rechercher une destination..." className="bg-background/20 border-none rounded-full pl-12 h-11 text-primary-foreground placeholder:text-primary-foreground/70 focus:bg-background/30"/>
          </div>

          <Button variant="ghost" size="icon" aria-label="Filters" className="rounded-full bg-black/10 text-primary-foreground hover:bg-black/20 flex-shrink-0">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>
       </div>
    </header>
  );
}
