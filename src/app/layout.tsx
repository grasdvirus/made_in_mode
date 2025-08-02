

'use client';

import { Inter, Poppins } from 'next/font/google';
import { usePathname } from 'next/navigation';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import HeaderParallax from '@/components/header-parallax';
import GlassFooterNav from '@/components/glass-footer-nav';
import Footer from '@/components/footer';
import ScrollToTopButton from '@/components/scroll-to-top-button';


const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '600', '700']
});

function getHeader(pathname: string) {
    if (pathname === '/') return <Header />;
    if (pathname === '/discover') return <HeaderParallax title="Découvrir" />;
    if (pathname === '/cart') return null; // Removed header for cart page
    if (pathname === '/profile') return null; // Removed header for profile page
    return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const CurrentHeader = getHeader(pathname);
  
  const mainMarginTop = pathname === '/' ? 'mt-32' : 'mt-8';
  const showFooter = pathname !== '/login';

  return (
    <html lang="fr" className="dark scroll-smooth">
      <body className={`${poppins.variable} font-sans antialiased bg-gradient-to-b from-gray-900 to-black scroll-hover`}>
        <div className="flex flex-col min-h-screen">
          {CurrentHeader}
          <main className={`flex-1 w-full max-w-7xl mx-auto px-4 ${mainMarginTop} ${showFooter ? 'pb-24 md:pb-8' : ''}`}>
            {children}
          </main>
          {showFooter && (
            <>
              <Footer />
              <GlassFooterNav />
            </>
          )}
          <Toaster />
          <ScrollToTopButton />
        </div>
      </body>
    </html>
  );
}
