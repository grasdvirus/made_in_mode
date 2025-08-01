'use client';

import { Home, Compass, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home },
  { href: '/discover', icon: Compass },
  { href: '/profile', icon: User },
];

export default function FooterNav() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4">
      <div className="bg-card/60 backdrop-blur-xl border border-white/10 rounded-2xl">
        <nav className="h-20 flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link href={item.href} key={item.href}>
                <Button variant="ghost" className={cn(
                  "relative flex flex-col h-auto items-center transition-transform active:scale-90",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}>
                  <item.icon className="h-6 w-6" />
                  {isActive && (
                    <div className="absolute -top-1.5 -bottom-1.5 -left-1.5 -right-1.5 rounded-full border-2 border-primary" />
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
