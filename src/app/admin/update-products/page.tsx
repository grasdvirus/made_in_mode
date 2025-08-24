
'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { getProducts, updateProducts, type Product } from "./actions"; 
import { ProductForm, type ProductFormData } from './product-form';
import { useToast } from '@/hooks/use-toast';
import Loader from '@/components/ui/loader';
import '@/components/ui/loader.css';
import { PlusCircle } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | undefined>(undefined);
  
  const { toast } = useToast();

  React.useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
        // On charge le premier produit par défaut pour l'édition
        if (fetchedProducts.length > 0) {
          setEditingProduct(fetchedProducts[0]);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
        toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les produits." });
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, [toast]);

  const handleSaveProduct = async (formData: ProductFormData) => {
    let newProducts: Product[];
    const productExists = products.some(p => p.name === formData.name && p.name !== editingProduct?.name);

    if (productExists && !editingProduct) {
        toast({ variant: "destructive", title: "Erreur", description: "Un produit avec ce nom existe déjà." });
        return;
    }

    if (editingProduct) {
        // Edit existing product
        newProducts = products.map(p => p.name === editingProduct.name ? { ...p, ...formData } : p);
    } else {
        // Add new product
        newProducts = [...products, { ...formData, reviews: 0, rating: 0, originalPrice: formData.price * 1.2, bgColor: 'bg-gray-200'}];
    }
    
    await handleSave(newProducts, editingProduct ? "Produit modifié avec succès." : "Produit ajouté avec succès.");
    if (!editingProduct) {
      setEditingProduct(newProducts[newProducts.length-1]);
    }
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
  
  const handleAddNew = () => {
    setEditingProduct(undefined);
  }

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-[60vh]">
            <Loader />
        </div>
    )
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold">Gestion des Produits</h2>
         <div className="flex gap-2">
            <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4"/> Ajouter un produit</Button>
         </div>
       </div>

        <ProductForm 
            key={editingProduct?.name || 'new'}
            product={editingProduct} 
            onSave={handleSaveProduct} 
            isSaving={isSaving}
        />
        
        {/* Ici vous pourriez lister d'autres produits pour les sélectionner et les éditer */}
    </div>
  )
}
