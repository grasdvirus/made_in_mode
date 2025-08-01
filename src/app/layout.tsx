
'use client';

import { usePathname } from 'next/navigation';
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import Header from '@/components/header';
import HeaderParallax from '@/components/header-parallax';
import FooterNav from '@/components/footer-nav';

const metadata: Metadata = {
  title: 'TripGlide',
  description: 'Planifiez votre prochaine aventure.',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

function getHeader(pathname: string) {
    if (pathname === '/') return <Header />;
    if (pathname === '/discover') return <HeaderParallax title="Découvrir" />;
    if (pathname === '/cart') return <HeaderParallax title="Mon Panier" />;
    if (pathname === '/profile') return <HeaderParallax title="Mon Profil" />;
    if (pathname === '/search') return <HeaderParallax title="Recherche" />;
    return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const CurrentHeader = getHeader(pathname);
  const mainPaddingTop = pathname === '/' ? 'pt-32' : 'pt-0';
  const mainMarginTop = pathname === '/' ? '0' : '-mt-16';

  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {CurrentHeader}
        <main className={`flex-1 w-full max-w-md mx-auto px-4 pb-32 ${mainPaddingTop} ${mainMarginTop}`}>
          {children}
        </main>
        <FooterNav />
        <Toaster />
      </body>
    </html>
  );
}
