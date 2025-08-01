
'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { href: '/', id: 'glass-home', label: 'Accueil' },
  { href: '/discover', id: 'glass-discover', label: 'Découvrir' },
  { href: '/search', id: 'glass-search', label: 'Recherche' },
  { href: '/cart', id: 'glass-cart', label: 'Panier' },
  { href: '/profile', id: 'glass-profile', label: 'Profil' },
];

export default function GlassFooterNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavChange = (href: string) => {
    router.push(href);
  };
  
  return (
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
                <label htmlFor={item.id}>{item.label}</label>
            </React.Fragment>
        ))}
        <div className="glass-glider"></div>
      </nav>
    </footer>
  );
}
