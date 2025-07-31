import { Home, Compass, Search, ShoppingBag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FooterNav() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4">
      <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl">
        <nav className="h-20 flex items-center justify-around">
          <Button variant="ghost" className="flex flex-col h-auto items-center text-primary">
            <Home className="h-6 w-6" />
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto items-center text-muted-foreground hover:text-primary">
            <Compass className="h-6 w-6" />
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto items-center text-muted-foreground hover:text-primary">
            <Search className="h-6 w-6" />
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto items-center text-muted-foreground hover:text-primary">
            <ShoppingBag className="h-6 w-6" />
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto items-center text-muted-foreground hover:text-primary">
            <User className="h-6 w-6" />
          </Button>
        </nav>
      </div>
    </footer>
  );
}
