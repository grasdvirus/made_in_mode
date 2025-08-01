'use client';

import { Home, User, AppWindow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home },
  { href: '/discover', icon: AppWindow },
  { href: '/profile', icon: User },
];

export default function FooterNav() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40">
       <div className="mx-auto max-w-md">
        <div className="bg-primary/90 backdrop-blur-xl m-4 rounded-full shadow-lg">
            <nav className="h-20 flex items-center justify-around">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                <Link href={item.href} key={item.href}>
                    <Button variant="ghost" className={cn(
                    "relative flex flex-col h-auto items-center transition-transform active:scale-90 rounded-full w-16 h-16",
                    isActive ? "text-primary bg-primary-foreground" : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                    )}>
                    <item.icon className="h-7 w-7" />
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
