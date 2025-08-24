
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

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [openAccordion, setOpenAccordion] = React.useState<string | undefined>();
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

  const handleAddNew = async () => {
    setIsSaving(true);
    const newProductData: ProductFormData = {
      name: 'Nouveau Produit',
      category: 'Robes',
      price: 10000,
      images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
      hint: 'fashion product',
    };

    const result = await addProduct(newProductData);
    setIsSaving(false);

    if (result.success && result.product) {
      setProducts([result.product, ...products]);
      setOpenAccordion(result.product.id);
      toast({ title: "Succès", description: "Nouveau produit ajouté. Vous pouvez maintenant le modifier." });
    } else {
      toast({ variant: "destructive", title: "Erreur", description: result.message });
    }
  };

  const handleSaveProduct = async (productId: string, formData: ProductFormData) => {
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
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }
    
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Produits</h2>
        <Button onClick={handleAddNew} disabled={isSaving}>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un produit
        </Button>
      </div>

      <Accordion 
        type="single" 
        collapsible 
        className="w-full space-y-2"
        value={openAccordion}
        onValueChange={setOpenAccordion}
      >
        {products.map((product) => (
          <AccordionItem value={product.id!} key={product.id} className="bg-secondary/50 border-border/50 rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-4 w-full">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">{product.name}</span>
                <span className="text-sm text-muted-foreground ml-auto">{product.category} - {product.price} FCFA</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ProductForm
                product={product}
                onSave={(formData) => handleSaveProduct(product.id!, formData)}
                onDelete={() => handleDeleteProduct(product.id!)}
                isSaving={isSaving}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
