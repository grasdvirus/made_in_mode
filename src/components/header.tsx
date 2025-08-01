import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://placehold.co/80x80.png" alt="Vanessa" data-ai-hint="female portrait"/>
            <AvatarFallback>V</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-lg">Hello, Vanessa</h1>
            <p className="text-sm text-muted-foreground">Welcome to TripGlide</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" aria-label="Filters" className="rounded-full bg-secondary">
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
