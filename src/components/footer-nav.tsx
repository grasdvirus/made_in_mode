'use client';

import { Home, User, AppWindow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Accueil' },
  { href: '/discover', icon: AppWindow, label: 'Découvrir' },
  { href: '/profile', icon: User, label: 'Profil' },
];

export default function FooterNav() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
       <div className="mx-auto max-w-md">
        <div className="bg-primary/90 backdrop-blur-xl m-4 rounded-full shadow-lg">
            <nav className="h-16 flex items-center justify-around px-2">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                <Link href={item.href} key={item.href} className="flex-1 h-full">
                    <Button variant="ghost" className={cn(
                        "relative flex flex-col h-full items-center justify-center transition-transform active:scale-95 rounded-full w-full py-3 text-primary-foreground/80 hover:text-primary-foreground",
                         isActive && "text-primary-foreground"
                    )}>
                    <item.icon className="h-7 w-7" />
                     {isActive && <div className="absolute -bottom-1 h-1 w-full bg-primary-foreground rounded-full" />}
                    </Button>
                </Link>
                );
            })}
            </nav>
        </div>
       </div>
    </footer>
  );
}
