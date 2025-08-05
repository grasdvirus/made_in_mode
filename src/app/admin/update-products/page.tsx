
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts, updateProducts, type Product } from "./actions"; 
import { PlusCircle, Trash2, Edit, Loader2 } from "lucide-react";
import Image from "next/image";
import { ProductForm, type ProductFormData } from './product-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | undefined>(undefined);
  
  const { toast } = useToast();

  React.useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products", error);
        toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les produits." });
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, [toast]);

  const handleOpenAddModal = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };
  
  const handleDeleteProduct = async (productNameToDelete: string) => {
    const newProducts = products.filter(p => p.name !== productNameToDelete);
    await handleSave(newProducts, "Produit supprimé avec succès.");
  };

  const handleSaveProduct = async (formData: ProductFormData) => {
    let newProducts: Product[];
    const productExists = products.some(p => p.name === formData.name && p.name !== editingProduct?.name);

    if (productExists) {
        toast({ variant: "destructive", title: "Erreur", description: "Un produit avec ce nom existe déjà." });
        return;
    }

    if (editingProduct) {
        // Edit existing product
        newProducts = products.map(p => p.name === editingProduct.name ? { ...p, ...formData } : p);
    } else {
        // Add new product
        newProducts = [...products, formData];
    }
    
    await handleSave(newProducts, editingProduct ? "Produit modifié avec succès." : "Produit ajouté avec succès.");
    setIsModalOpen(false);
    setEditingProduct(undefined);
  };

  const handleSave = async (productsToSave: Product[], successMessage: string) => {
    setIsSaving(true);
    try {
        const result = await updateProducts(productsToSave);
        if (result.success) {
            setProducts(productsToSave);
            toast({ title: "Succès", description: successMessage });
        } else {
            throw new Error(result.message);
        }
    } catch (error: any) {
        toast({ variant: "destructive", title: "Erreur", description: error.message || "Échec de la sauvegarde des produits." });
    } finally {
        setIsSaving(false);
    }
  };


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
              <div>
                  <CardTitle>Produits</CardTitle>
                  <CardDescription>Gérez les produits affichés sur le site.</CardDescription>
              </div>
              <Button onClick={handleOpenAddModal} disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                  Ajouter un produit
              </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead className="hidden md:table-cell">
                  Avis
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Chargement des produits...</TableCell>
                </TableRow>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.name}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={product.name}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={product.image.startsWith('https://') ? product.image : `${product.image}`}
                        width="64"
                        data-ai-hint={product.hint}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">FCFA {product.price.toLocaleString('fr-FR')}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {product.reviews}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="icon" onClick={() => handleOpenEditModal(product)} disabled={isSaving}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" disabled={isSaving}>
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Supprimer</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Cette action est irréversible. Le produit sera définitivement supprimé.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteProduct(product.name)}>
                                    Supprimer
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                 <TableRow>
                  <TableCell colSpan={5} className="text-center">Aucun produit trouvé.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
            <DialogTitle>{editingProduct ? "Modifier le produit" : "Ajouter un nouveau produit"}</DialogTitle>
            <DialogDescription>
                Remplissez les détails ci-dessous. Cliquez sur sauvegarder pour appliquer les changements.
            </DialogDescription>
            </DialogHeader>
            <ProductForm 
                product={editingProduct} 
                onSave={handleSaveProduct} 
                onCancel={() => setIsModalOpen(false)} 
                isSaving={isSaving}
            />
        </DialogContent>
      </Dialog>
    </>
  )
}
