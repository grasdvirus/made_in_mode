'use client';

import { Home, Heart, User, AppWindow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home },
  { href: '/discover', icon: AppWindow },
  { href: '/cart', icon: Heart },
  { href: '/profile', icon: User },
];

export default function FooterNav() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40">
       <div className="mx-auto max-w-md">
        <div className="bg-background/80 backdrop-blur-xl m-4 rounded-full shadow-lg">
            <nav className="h-20 flex items-center justify-around">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                <Link href={item.href} key={item.href}>
                    <Button variant="ghost" className={cn(
                    "relative flex flex-col h-auto items-center transition-transform active:scale-90 rounded-full w-14 h-14",
                    isActive ? "text-primary-foreground bg-primary" : "text-muted-foreground hover:text-primary"
                    )}>
                    <item.icon className="h-6 w-6" />
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
