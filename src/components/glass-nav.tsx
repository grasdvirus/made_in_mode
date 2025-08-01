'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function GlassNav() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <div className="glass-radio-group">
            <input type="radio" name="plan" id="glass-home" checked={pathname === '/'} readOnly />
            <label htmlFor="glass-home">
                <Link href="/">Accueil</Link>
            </label>

            <input type="radio" name="plan" id="glass-discover" checked={pathname === '/discover'} readOnly />
            <label htmlFor="glass-discover">
                 <Link href="/discover">Découvrir</Link>
            </label>

            <input type="radio" name="plan" id="glass-profile" checked={pathname === '/profile'} readOnly />
            <label htmlFor="glass-profile">
                 <Link href="/profile">Profil</Link>
            </label>

            <div className="glass-glider"></div>
        </div>
    </footer>
  );
}
