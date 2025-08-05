
'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';
import { Home, ShoppingCart, Users, Settings } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AdminAuthProvider, useAdminAuth } from '@/context/admin-auth-context';
import Loader from '@/components/ui/loader';
import '@/components/ui/loader.css';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  // Do not render layout for the login page itself
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Loader />
        <p className="mt-4 text-lg">Chargement en cours...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage src="https://placehold.co/40x40.png" alt="Admin" data-ai-hint="logo abstract"/>
                    <AvatarFallback>A</AvatarFallback>
                </Avatar>
                 <h2 className="font-bold text-lg">Tableau de bord</h2>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/admin" passHref legacyBehavior>
                    <SidebarMenuButton isActive={pathname === '/admin'}>
                        <Home />
                        Accueil
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/admin/update-products" passHref legacyBehavior>
                    <SidebarMenuButton isActive={pathname.startsWith('/admin/update-products')}>
                        <ShoppingCart />
                        Produits
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Link href="/admin/users" passHref legacyBehavior>
                    <SidebarMenuButton isActive={pathname.startsWith('/admin/users')}>
                        <Users />
                        Utilisateurs
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
             <SidebarMenu>
                <SidebarMenuItem>
                     <Link href="/admin/settings" passHref legacyBehavior>
                        <SidebarMenuButton isActive={pathname.startsWith('/admin/settings')}>
                            <Settings />
                            Paramètres
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
             </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
         <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">Tableau de bord Admin</h1>
            <Button variant="outline" onClick={() => router.push('/')}>Voir le site</Button>
        </header>
        <main className="p-4">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}
