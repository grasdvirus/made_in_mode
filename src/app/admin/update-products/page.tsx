
'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { getProducts, addProduct, editProduct, deleteProduct, type Product, type ProductFormData } from "./actions";
import { ProductForm } from './product-form';
import { useToast } from '@/hooks/use-toast';
import Loader from '@/components/ui/loader';
import '@/components/ui/loader.css';
import { PlusCircle, Trash, GripVertical } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [openAccordion, setOpenAccordion] = React.useState<string | undefined>();
  const [isAddFormVisible, setIsAddFormVisible] = React.useState(false);
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

  const handleAddProduct = async (formData: ProductFormData) => {
    setIsSaving(true);
    const result = await addProduct(formData);
    setIsSaving(false);

    if (result.success && result.product) {
      setProducts([result.product, ...products]);
      setIsAddFormVisible(false);
      toast({ title: "Succès", description: "Nouveau produit ajouté." });
      setOpenAccordion(result.product.id); // Open the new product for inspection
    } else {
      toast({ variant: "destructive", title: "Erreur", description: result.message });
    }
  };

  const handleEditProduct = async (productId: string, formData: ProductFormData) => {
    setIsSaving(true);
    const result = await editProduct(productId, formData);
    setIsSaving(false);

    if (result.success) {
      setProducts(products.map(p => p.id === productId ? { ...p, ...formData, id: p.id } : p));
      toast({ title: "Succès", description: "Produit mis à jour." });
      setOpenAccordion(undefined); // Close accordion on save
    } else {
      toast({ variant: "destructive", title: "Erreur", description: result.message });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setIsSaving(true);
    const result = await deleteProduct(productId);
    setIsSaving(false);

    if (result.success) {
      setProducts(products.filter(p => p.id !== productId));
      toast({ title: "Succès", description: "Produit supprimé." });
    } else {
      toast({ variant: "destructive", title: "Erreur", description: result.message });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader />
      </div>
    );
  }
  
  const defaultNewProduct: Product = {
      id: '', name: 'Nouveau Produit', category: 'Robes', price: 10000,
      images: ['', ''], hint: 'fashion product',
      originalPrice: 12000, rating: 0, reviews: 0,
      description: '', sizes: ['S','M','L'], colors: [{name: 'Black', hex: '#000000'}]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Produits</h2>
         <Button onClick={() => setIsAddFormVisible(!isAddFormVisible)} variant={isAddFormVisible ? "destructive" : "default"}>
          <PlusCircle className="mr-2 h-4 w-4" /> {isAddFormVisible ? "Annuler" : "Ajouter un produit"}
        </Button>
      </div>

       {isAddFormVisible && (
         <Card className="bg-secondary/30 border border-primary/50">
           <CardHeader>
                <CardTitle>Ajouter un nouveau produit</CardTitle>
                <CardDescription>Remplissez les informations ci-dessous pour créer un nouveau produit.</CardDescription>
           </CardHeader>
           <CardContent>
            <ProductForm
                product={defaultNewProduct}
                onSave={(formData) => handleAddProduct(formData)}
                isSaving={isSaving}
                isAddForm
              />
           </CardContent>
         </Card>
       )}

      <Separator />

      <h3 className="text-xl font-semibold">Liste des produits ({products.length})</h3>
      <Accordion 
        type="single" 
        collapsible 
        className="w-full space-y-2"
        value={openAccordion}
        onValueChange={setOpenAccordion}
      >
        {products.map((product, index) => (
          <AccordionItem value={product.id!} key={product.id} className="bg-secondary/50 border-border/50 rounded-lg px-4">
            <div className="flex items-center w-full">
                <AccordionTrigger className="hover:no-underline flex-grow">
                  <div className="flex items-center gap-4 w-full">
                    <span className="text-sm font-bold text-primary w-6 text-center">{index + 1}.</span>
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold">{product.name}</span>
                    <span className="text-sm text-muted-foreground ml-auto">{product.category} - {product.price} FCFA</span>
                  </div>
                </AccordionTrigger>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full h-8 w-8 ml-2">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous absolument sûr?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Le produit "{product.name}" sera définitivement supprimé.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteProduct(product.id!)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                        Oui, supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
            <AccordionContent>
              <ProductForm
                product={product}
                onSave={(formData) => handleEditProduct(product.id!, formData)}
                isSaving={isSaving}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
