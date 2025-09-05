
'use client';

import { Inter, Poppins } from 'next/font/google';
import { usePathname } from 'next/navigation';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import HeaderParallax from '@/components/header-parallax';
import GlassFooterNav from '@/components/glass-footer-nav';
import ScrollToTopButton from '@/components/scroll-to-top-button';
import { CartProvider } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '600', '700']
});

function getHeader(pathname: string) {
    if (pathname === '/' || pathname.startsWith('/admin') || pathname.startsWith('/login')) return null;
    if (pathname === '/discover') return <Header />;
    if (pathname === '/cart') return null;
    if (pathname === '/profile') return null;
    return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const CurrentHeader = getHeader(pathname);
  
  const showFooterNav = !pathname.startsWith('/login') && !pathname.startsWith('/admin');

  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return (
      <html lang="fr" className="dark scroll-smooth">
        <body className={`${poppins.variable} font-sans antialiased bg-background text-foreground scroll-hover select-none`}>
          {children}
          <Toaster />
        </body>
      </html>
    )
  }

  return (
    <html lang="fr" className="dark scroll-smooth">
      <body className={`${poppins.variable} font-sans antialiased bg-background text-foreground scroll-hover select-none`}>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            {CurrentHeader}
            <main className={cn(
              'flex-1 w-full max-w-7xl mx-auto px-4',
               pathname.startsWith('/discover/') ? '' : 'mt-8',
               pathname === '/discover' && 'mt-32',
               showFooterNav ? 'pb-24 md:pb-8' : ''
            )}>
              {children}
            </main>
            {showFooterNav && (
              <>
                <GlassFooterNav />
              </>
            )}
            <Toaster />
            <ScrollToTopButton />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
