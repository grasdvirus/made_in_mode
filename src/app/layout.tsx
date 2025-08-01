
'use client';

import { Inter, Poppins } from 'next/font/google';
import { usePathname } from 'next/navigation';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import HeaderParallax from '@/components/header-parallax';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Home, Compass, User, Search, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

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
  
  const mainPaddingTop = pathname === '/' ? 'pt-28' : 'pt-0';
  const mainMarginTop = pathname === '/' ? 'mt-0' : '-mt-16';

  return (
    <html lang="fr" className="dark scroll-smooth">
      <body className={`${poppins.variable} font-sans antialiased bg-gradient-to-b from-gray-900 to-black scroll-hover`}>
        <SidebarProvider>
          <Sidebar collapsible="icon" className="bg-gradient-to-b from-gray-900 to-black border-r border-gray-800">
             <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Accueil" isActive={pathname === '/'} asChild>
                        <Link href="/"> <Home /> <span>Accueil</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Découvrir" isActive={pathname === '/discover'} asChild>
                        <Link href="/discover"> <Compass /> <span>Découvrir</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Recherche" isActive={pathname === '/search'} asChild>
                        <Link href="/search"> <Search /> <span>Recherche</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Panier" isActive={pathname === '/cart'} asChild>
                        <Link href="/cart"> <ShoppingCart /> <span>Panier</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Profil" isActive={pathname === '/profile'} asChild>
                        <Link href="/profile"> <User /> <span>Profil</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarMenu>
          </Sidebar>
          <SidebarInset className="bg-transparent">
            <div className="md:hidden">
              {CurrentHeader}
            </div>
             <header className="hidden md:flex items-center justify-between p-4">
                <SidebarTrigger />
                <div>{/* Other header content can go here */}</div>
            </header>
            <main className={`flex-1 w-full max-w-6xl mx-auto px-4 pb-8 md:pb-16 md:pt-8 ${mainPaddingTop} ${mainMarginTop}`}>
              {children}
            </main>
            <Toaster />
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
