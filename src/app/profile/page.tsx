
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Smartphone, LogOut, User, KeyRound, Bell, ShoppingBag, LifeBuoy, FileText, ChevronRight, ChevronLeft, Shield } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '@/components/ui/loader';
import '@/components/ui/loader.css';


export default function ProfilePage() {
    const router = useRouter();
    const [editMode, setEditMode] = useState(false);
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };
    
    const paymentHistory = [
        { id: 'TXN123', date: '2023-10-26', status: 'Réussi', amount: '45000 FCFA' },
        { id: 'TXN124', date: '2023-09-15', status: 'Réussi', amount: '75000 FCFA' },
        { id: 'TXN125', date: '2023-08-02', status: 'Refusé', amount: '25000 FCFA' },
    ];

    if (loading) {
        return <div className="flex flex-col items-center justify-center min-h-[80vh]"><Loader /><p className="mt-4 text-lg">Chargement du profil...</p></div>
    }

    if (!user) {
         return null; 
    }
    
    const displayName = user.displayName || 'Utilisateur';
    const displayEmail = user.email || 'Non connecté';
    const displayAvatar = user.photoURL || 'https://placehold.co/80x80.png';
    const avatarFallback = displayName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

    return (
        <div className="bg-background rounded-t-3xl p-4 sm:p-0 min-h-[80vh] shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="bg-secondary text-foreground rounded-full">
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <h1 className="text-2xl font-bold">Mon Profil</h1>
                <div className="w-10"></div> {/* Spacer */}
            </div>
            
            <div className="flex flex-col items-center space-y-2">
                <Avatar className="w-24 h-24 border-4 border-primary">
                    <AvatarImage src={displayAvatar} alt={displayName} data-ai-hint="female portrait" />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{displayName}</h2>
                <p className="text-muted-foreground">{displayEmail}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <Card className="lg:col-span-3 bg-secondary border-primary/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Shield /> Administration</CardTitle>
                        <CardDescription>Accédez au panneau de contrôle pour gérer le site.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button asChild className="w-full">
                           <Link href="/admin">Accéder au tableau de bord</Link>
                        </Button>
                    </CardFooter>
                </Card>

                {/* Personal Information */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User /> Informations personnelles</CardTitle>
                        <CardDescription>Gérez vos informations personnelles et vos coordonnées.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom complet</Label>
                            <Input id="name" defaultValue={displayName} disabled={!editMode} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Adresse email</Label>
                            <Input id="email" type="email" defaultValue={displayEmail} disabled />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="phone">Numéro de téléphone</Label>
                            <Input id="phone" type="tel" defaultValue={user.phoneNumber || '+33 6 12 34 56 78'} disabled={!editMode} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Adresse de livraison</Label>
                            <Input id="address" defaultValue="123 Rue de la Mode, 75001 Paris, France" disabled={!editMode} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-wrap justify-between gap-2">
                         <Button variant="outline" onClick={() => { /* Logic for managing addresses */ }}>Gérer mes adresses</Button>
                         <Button onClick={() => setEditMode(!editMode)}>
                            {editMode ? 'Sauvegarder' : 'Modifier mes informations'}
                        </Button>
                    </CardFooter>
                </Card>
                
                {/* Security */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><KeyRound /> Sécurité</CardTitle>
                        <CardDescription>Gérez vos paramètres de sécurité.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium">Méthode d’authentification</p>
                            <p className="text-sm text-muted-foreground">{user.providerData[0]?.providerId || 'Email/Password'}</p>
                        </div>
                        <Button className="w-full">Changer mon mot de passe</Button>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bell /> Notifications</CardTitle>
                        <CardDescription>Choisissez comment nous vous contactons.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="email-offers" className="flex items-center gap-2 cursor-pointer"><Mail /> Offres par email</Label>
                            <Switch id="email-offers" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="sms-offers" className="flex items-center gap-2 cursor-pointer"><Smartphone /> Offres par SMS</Label>
                            <Switch id="sms-offers" />
                        </div>
                    </CardContent>
                     <CardFooter>
                        <Button variant="outline" className="w-full">Gérer les catégories préférées</Button>
                     </CardFooter>
                </Card>

                {/* Payment History */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ShoppingBag/> Historique des paiements</CardTitle>
                        <CardDescription>Consultez vos transactions passées.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {paymentHistory.map(payment => (
                                <li key={payment.id} className="flex items-center justify-between flex-wrap gap-2">
                                    <div >
                                        <p className="font-medium">{payment.amount} - {payment.date}</p>
                                        <p className={`text-sm ${payment.status === 'Réussi' ? 'text-green-500' : 'text-red-500'}`}>{payment.status}</p>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        <FileText className="h-4 w-4" />
                                        <span className="sr-only">Télécharger facture</span>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Support & Actions */}
                <div className="lg:col-span-3 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><LifeBuoy /> Support</CardTitle>
                        </CardHeader>
                         <CardContent className="space-y-4">
                            <form className="space-y-2">
                                <Label htmlFor="question">Envoyer une question</Label>
                                <Input id="question" placeholder="Votre question..." />
                                <Button type="submit" className="w-full sm:w-auto">Envoyer</Button>
                            </form>
                             <Separator />
                            <Button variant="outline" className="w-full justify-between">
                                Contacter le support
                                <ChevronRight className="h-4 w-4"/>
                            </Button>
                        </CardContent>
                    </Card>

                    <Button variant="destructive" onClick={handleSignOut} className="w-full">
                      <LogOut className="mr-2 h-4 w-4" /> Se déconnecter
                    </Button>
                </div>
            </div>
        </div>
    );
}
