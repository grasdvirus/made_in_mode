
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Smartphone, LogOut, User, KeyRound, Bell, ShoppingBag, LifeBuoy, FileText, ChevronRight } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();
    const [editMode, setEditMode] = useState(false);

    // Mock user data - replace with actual data from your backend/auth provider
    const user = {
        name: 'Vanessa',
        email: 'vanessa@example.com',
        phone: '+33 6 12 34 56 78',
        authMethod: 'Google',
        avatar: 'https://placehold.co/80x80.png',
        address: '123 Rue de la Mode, 75001 Paris, France'
    };
    
    // Mock payment history
    const paymentHistory = [
        { id: 'TXN123', date: '2023-10-26', status: 'Réussi', amount: '€79.99' },
        { id: 'TXN124', date: '2023-09-15', status: 'Réussi', amount: '€129.50' },
        { id: 'TXN125', date: '2023-08-02', status: 'Refusé', amount: '€45.00' },
    ];

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    return (
        <div className="bg-background rounded-t-3xl p-4 sm:p-6 min-h-[80vh] shadow-2xl space-y-6">
            
            <div className="flex flex-col items-center space-y-2">
                <Avatar className="w-24 h-24 border-4 border-primary">
                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="female portrait" />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Personal Information */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User /> Informations personnelles</CardTitle>
                        <CardDescription>Gérez vos informations personnelles et vos coordonnées.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom complet</Label>
                            <Input id="name" defaultValue={user.name} disabled={!editMode} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Adresse email</Label>
                            <Input id="email" type="email" defaultValue={user.email} disabled />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="phone">Numéro de téléphone</Label>
                            <Input id="phone" type="tel" defaultValue={user.phone} disabled={!editMode} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Adresse de livraison</Label>
                            <Input id="address" defaultValue={user.address} disabled={!editMode} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
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
                            <p className="text-sm text-muted-foreground">{user.authMethod}</p>
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
                                <li key={payment.id} className="flex items-center justify-between">
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
