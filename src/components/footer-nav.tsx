'use client';

import { Home, User, Compass, Search, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Accueil' },
  { href: '/discover', icon: Compass, label: 'Découvrir' },
  { href: '/search', icon: Search, label: 'Recherche' },
  { href: '/cart', icon: ShoppingCart, label: 'Panier' },
  { href: '/profile', icon: User, label: 'Profil' },
];

export default function FooterNav() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border/50 md:hidden">
      <nav className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.href} className="flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors w-full h-full">
              <item.icon className={cn("h-6 w-6", isActive && "text-primary")} />
              <span className={cn("text-xs", isActive && "text-primary")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
