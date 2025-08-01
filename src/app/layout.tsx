
'use client';

import { Inter, Poppins } from 'next/font/google';
import { usePathname } from 'next/navigation';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import HeaderParallax from '@/components/header-parallax';
import GlassFooterNav from '@/components/glass-footer-nav';


const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '600', '700']
});

function getHeader(pathname: string) {
    if (pathname === '/') return <Header />;
    if (pathname === '/discover') return <HeaderParallax title="Découvrir" />;
    if (pathname === '/cart') return <HeaderParallax title="Mon Panier" />;
    if (pathname === '/profile') return <HeaderParallax title="Mon Profil" />;
    return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const CurrentHeader = getHeader(pathname);
  
  const mainMarginTop = pathname === '/' ? 'mt-28' : '-mt-16';

  return (
    <html lang="fr" className="dark scroll-smooth">
      <body className={`${poppins.variable} font-sans antialiased bg-gradient-to-b from-gray-900 to-black scroll-hover`}>
        <div className="flex flex-col min-h-screen">
          {CurrentHeader}
          <main className={`flex-1 w-full max-w-6xl mx-auto px-4 pb-24 ${mainMarginTop}`}>
            {children}
          </main>
          <GlassFooterNav />
          <Toaster />
        </div>
      </body>
    </html>
  );
}
