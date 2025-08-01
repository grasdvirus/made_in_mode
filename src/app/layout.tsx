
'use client';

import { usePathname } from 'next/navigation';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import Header from '@/components/header';
import HeaderParallax from '@/components/header-parallax';
import FooterNav from '@/components/footer-nav';

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
        <div className="md:hidden">
          {CurrentHeader}
        </div>
        <main className={`flex-1 w-full max-w-6xl mx-auto px-4 pb-32 md:pt-8 ${mainPaddingTop} ${mainMarginTop}`}>
          {children}
        </main>
        <div className="md:hidden">
         <FooterNav />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
