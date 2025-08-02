

'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronUp, ChevronDown, Compass, Search, ShoppingCart, User } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', id: 'glass-home', label: 'Explorer', icon: Compass },
  { href: '/discover', id: 'glass-discover', label: 'Découvrir', icon: Search },
  { href: '/cart', id: 'glass-cart', label: 'Panier', icon: ShoppingCart },
  { href: '/profile', id: 'glass-profile', label: 'Profil', icon: User },
];

export default function GlassFooterNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNavChange = (href: string) => {
    router.push(href);
  };
  
  return (
    <>
      {/* Mobile Footer */}
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <nav className="glass-radio-group">
          {navItems.map((item) => (
              <React.Fragment key={item.id}>
                  <input 
                      type="radio" 
                      name="plan" 
                      id={item.id} 
                      checked={pathname === item.href}
                      onChange={() => handleNavChange(item.href)}
                  />
                  <label htmlFor={item.id} className="!p-3">
                    {item.label}
                  </label>
              </React.Fragment>
          ))}
          <div className="glass-glider"></div>
        </nav>
      </footer>

      {/* Desktop Floating Menu */}
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <div className="relative">
          <Button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="w-48 h-14 rounded-full bg-primary/90 backdrop-blur-xl text-primary-foreground hover:bg-primary text-lg shadow-lg flex items-center justify-center gap-2"
          >
            Navigation
            {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
          </Button>
          <div className={cn(
            "absolute bottom-full mb-3 left-1/2 -translate-x-1/2 transition-all duration-300 ease-in-out origin-bottom",
            isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          )}>
            <nav className="glass-radio-group">
              {navItems.map((item) => (
                  <React.Fragment key={`desktop-${item.id}`}>
                      <input 
                          type="radio" 
                          name="desktop_plan" 
                          id={`desktop-${item.id}`}
                          checked={pathname === item.href}
                          onChange={() => handleNavChange(item.href)}
                      />
                      <label htmlFor={`desktop-${item.id}`}>{item.label}</label>
                  </React.Fragment>
              ))}
               <div className="glass-glider"></div>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}
