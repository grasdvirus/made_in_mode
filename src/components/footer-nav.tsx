import { Home, ShoppingBag, BotMessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

type FooterNavProps = {
  onSuggestClick: () => void;
};

export default function FooterNav({ onSuggestClick }: FooterNavProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-background/50 backdrop-blur-lg border-t border-white/20">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-around">
        <Button variant="ghost" className="flex flex-col h-auto items-center text-muted-foreground hover:text-primary">
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Button>
        <Button variant="ghost" className="flex flex-col h-auto items-center text-muted-foreground hover:text-primary">
          <ShoppingBag className="h-6 w-6" />
          <span className="text-xs mt-1">Bag</span>
        </Button>
        <Button variant="ghost" onClick={onSuggestClick} className="flex flex-col h-auto items-center text-muted-foreground hover:text-primary">
          <BotMessageSquare className="h-6 w-6" />
          <span className="text-xs mt-1">AI Stylist</span>
        </Button>
        <Button variant="ghost" className="flex flex-col h-auto items-center text-muted-foreground hover:text-primary">
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Button>
      </nav>
    </footer>
  );
}
