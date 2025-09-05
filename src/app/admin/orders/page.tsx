
'use client';

import * as React from 'react';
import { getOrders, updateOrderStatus, deleteOrder, type Order, type OrderStatus } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Package, CheckCircle, Clock, XCircle, Loader2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const statusConfig = {
    "En attente": {
        icon: Clock,
        color: "bg-blue-500",
    },
    "Traitée": {
        icon: CheckCircle,
        color: "bg-green-500",
    },
    "Annulée": {
        icon: XCircle,
        color: "bg-red-500",
    },
} as const;


export default function AdminOrdersPage() {
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const { toast } = useToast();

    React.useEffect(() => {
        async function loadOrders() {
            setIsLoading(true);
            const fetchedOrders = await getOrders();
            // Sort orders by date descending
            fetchedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setOrders(fetchedOrders);
            setIsLoading(false);
        }
        loadOrders();
    }, []);

    const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
        const result = await updateOrderStatus(orderId, status);
        if (result.success) {
            setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
            toast({ title: "Succès", description: "Le statut de la commande a été mis à jour." });
        } else {
            toast({ variant: 'destructive', title: "Erreur", description: result.message });
        }
    };
    
    const handleDeleteOrder = async (orderId: string) => {
        const result = await deleteOrder(orderId);
        if (result.success) {
            setOrders(orders.filter(o => o.id !== orderId));
            toast({ title: "Succès", description: "La commande a été supprimée." });
        } else {
            toast({ variant: 'destructive', title: "Erreur", description: result.message });
        }
    }

    return (
        <div className="space-y-6">
            <CardHeader className="px-0">
                <CardTitle className="flex items-center gap-3"><Package className="h-6 w-6"/> Gestion des Commandes</CardTitle>
                <CardDescription>Consultez et gérez les commandes passées par vos clients.</CardDescription>
            </CardHeader>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-center">Statut</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                       <Loader2 className="h-6 w-6 animate-spin mx-auto"/>
                                    </TableCell>
                                </TableRow>
                            ) : orders.length > 0 ? (
                                orders.map(order => (
                                    <React.Fragment key={order.id}>
                                    <TableRow>
                                        <TableCell>
                                             <div className="font-medium">{new Date(order.date).toLocaleDateString('fr-FR')}</div>
                                             <div className="text-xs text-muted-foreground">{new Date(order.date).toLocaleTimeString('fr-FR')}</div>
                                        </TableCell>
                                        <TableCell>
                                             <div className="font-semibold">{order.fullName}</div>
                                             <div className="text-sm text-muted-foreground">{order.phone}</div>
                                             <div className="text-xs text-muted-foreground">{order.address}</div>
                                        </TableCell>
                                        <TableCell className="text-right font-bold">
                                            {order.total.toLocaleString('fr-FR')} FCFA
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={cn("text-white", statusConfig[order.status].color)}>{order.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    {Object.keys(statusConfig).map(status => (
                                                         <DropdownMenuItem key={status} onClick={() => handleUpdateStatus(order.id, status as OrderStatus)}>
                                                            Marquer comme "{status}"
                                                         </DropdownMenuItem>
                                                    ))}
                                                    <DropdownMenuSeparator />
                                                     <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Cette action est irréversible et supprimera définitivement la commande.
                                                            </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteOrder(order.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Oui, supprimer</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                       <TableCell colSpan={5} className="p-2 bg-secondary/30">
                                            <div className="p-2 space-y-2">
                                                <h4 className="font-semibold text-sm">Détails de la commande:</h4>
                                                <p className="text-xs text-muted-foreground">ID Transaction: <span className="font-mono text-foreground">{order.transactionId}</span></p>
                                                <div className="space-y-1">
                                                    {order.cartItems.map(item => (
                                                        <div key={item.id + item.size + item.color} className="flex justify-between items-center text-xs p-1 bg-background/50 rounded">
                                                            <span>{item.quantity} x {item.name} ({item.size}, {item.color})</span>
                                                            <span>{(item.price * item.quantity).toLocaleString()} FCFA</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                       </TableCell>
                                    </TableRow>
                                    </React.Fragment>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">Aucune commande pour le moment.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
