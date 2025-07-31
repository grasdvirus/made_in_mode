import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://placehold.co/40x40.png" alt="Steven Clark" data-ai-hint="male portrait"/>
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs text-muted-foreground">Good morning!</p>
            <p className="font-semibold">Steven Clark</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="rounded-full bg-card/80 backdrop-blur-sm border border-white/10">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
