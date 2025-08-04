
'use client';

import * as React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';
import { Home, ShoppingCart, Users, Settings } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (loading) return; // Ne rien faire pendant le chargement

    // Rediriger si l'utilisateur n'est pas connecté ou n'est pas l'admin
    if (!user || user.email?.toLowerCase() !== 'grasdvirus@gmail.com') {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Affiche un état de chargement ou rien en attendant la vérification
  if (loading || !user || user.email?.toLowerCase() !== 'grasdvirus@gmail.com') {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <p>Chargement ou redirection en cours...</p>
            </div>
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
