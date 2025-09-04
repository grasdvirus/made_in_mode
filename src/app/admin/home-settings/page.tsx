
'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getHomepageData, updateHomepageData, getProductsForSelect, type HomepageData } from "./actions";
import { useToast } from '@/hooks/use-toast';
import Loader from '@/components/ui/loader';
import '@/components/ui/loader.css';
import { PlusCircle, Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CategorySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  image: z.string().url('URL d\'image invalide'),
  hint: z.string(),
  link: z.string().min(1, 'Le lien est requis'),
});

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  hint: z.string(),
});

const FeaturedProductSchema = z.object({
  id: z.string().min(1, 'Veuillez sélectionner un produit.'),
  name: z.string(),
  category: z.string(),
  price: z.number(),
  images: z.array(z.string()),
  hint: z.string(),
});

const HomepageFormSchema = z.object({
  categories: z.array(CategorySchema),
  featuredProducts: z.array(FeaturedProductSchema),
  products: z.array(ProductSchema),
});

type SelectProduct = {
    id: string;
    name: string;
};

export default function HomeSettingsPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [availableProducts, setAvailableProducts] = React.useState<SelectProduct[]>([]);
  const { toast } = useToast();

  const { control, register, handleSubmit, reset, watch, setValue } = useForm<HomepageData>({
    resolver: zodResolver(HomepageFormSchema),
    defaultValues: {
      categories: [],
      featuredProducts: [],
      products: [],
    },
  });

  const { fields: categoryFields, append: appendCategory, remove: removeCategory } = useFieldArray({
    control,
    name: "categories",
  });
  
  const { fields: featuredFields, append: appendFeatured, remove: removeFeatured } = useFieldArray({
    control,
    name: "featuredProducts",
  });
  
  const { fields: productFields, append: appendProduct, remove: removeProduct } = useFieldArray({
    control,
    name: "products",
  });


  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [data, products] = await Promise.all([
          getHomepageData(),
          getProductsForSelect()
        ]);
        reset(data);
        setAvailableProducts(products);
      } catch (error) {
        console.error("Failed to fetch page data", error);
        toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les données." });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [reset, toast]);
  
  const handleSelectProduct = (index: number, productId: string, type: 'featured' | 'minimalist') => {
      const product = availableProducts.find(p => p.id === productId);
      if (product) {
          if (type === 'featured') {
             const fullProduct = { ...product, category: 'N/A', price: 0, images: [''], hint: ''};
             setValue(`featuredProducts.${index}`, fullProduct);
          } else {
             const fullProduct = { ...product, description: 'N/A', image: '', hint: ''};
             setValue(`products.${index}`, fullProduct);
          }
      }
  }


  const onSubmit = async (data: HomepageData) => {
    setIsSaving(true);
    const result = await updateHomepageData(data);
    setIsSaving(false);

    if (result.success) {
      toast({ title: "Succès", description: result.message });
    } else {
      toast({ variant: "destructive", title: "Erreur", description: result.message });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-[60vh]"><Loader /></div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
            <h2 className="text-2xl font-bold">Réglages de la Page d'Accueil</h2>
            <p className="text-muted-foreground">Modifiez ici le contenu des différentes sections de votre page d'accueil.</p>
        </div>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <div className="h-6"><Loader /></div> : 'Enregistrer les modifications'}
        </Button>
      </div>

      {/* Categories Section */}
      <Card>
        <CardHeader>
          <CardTitle>Section Catégories</CardTitle>
          <CardDescription>Gérez les catégories affichées en haut de la page d'accueil.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {categoryFields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg space-y-2 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>Nom</Label>
                        <Input {...register(`categories.${index}.name`)} />
                    </div>
                     <div className="space-y-1">
                        <Label>Lien</Label>
                        <Input {...register(`categories.${index}.link`)} />
                    </div>
                     <div className="space-y-1">
                        <Label>URL de l'image</Label>
                        <Input {...register(`categories.${index}.image`)} />
                    </div>
                     <div className="space-y-1">
                        <Label>Indice IA</Label>
                        <Input {...register(`categories.${index}.hint`)} />
                    </div>
                </div>
                 <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeCategory(index)}>
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => appendCategory({ name: 'Nouvelle Catégorie', image: 'https://placehold.co/200x200.png', hint: 'new category', link: '/discover' })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une catégorie
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Featured Products Section */}
      <Card>
        <CardHeader>
          <CardTitle>Section "Produits en Vedette"</CardTitle>
          <CardDescription>Gérez les produits qui apparaissent dans le carrousel principal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {featuredFields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg space-y-2 relative">
                 <div className="space-y-1">
                    <Label>Produit</Label>
                    <Select onValueChange={(value) => handleSelectProduct(index, value, 'featured')} value={watch(`featuredProducts.${index}.id`)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un produit" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="" disabled>-- Sélectionner --</SelectItem>
                            {availableProducts.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Les détails (prix, image, etc.) sont tirés du produit sélectionné.</p>
                </div>
                 <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeFeatured(index)}>
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => appendFeatured({ id: '', name: 'Nouveau Produit', category: 'Robes', price: 50000, images: ['https://placehold.co/600x400.png'], hint: 'fashion' })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un produit en vedette
          </Button>
        </CardContent>
      </Card>
      
       <Separator />

      {/* Minimalist Products Section */}
      <Card>
        <CardHeader>
          <CardTitle>Section "Produits Minimalistes"</CardTitle>
          <CardDescription>Gérez la liste de produits qui apparaît en bas de la page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {productFields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg space-y-2 relative">
                <div className="space-y-1">
                    <Label>Produit</Label>
                     <Select onValueChange={(value) => handleSelectProduct(index, value, 'minimalist')} value={watch(`products.${index}.id`)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un produit" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="" disabled>-- Sélectionner --</SelectItem>
                            {availableProducts.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Les détails (description, image, etc.) sont tirés du produit sélectionné.</p>
                </div>
                 <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeProduct(index)}>
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => appendProduct({ id: '', name: 'Nouveau Produit', description: 'Description...', image: 'https://placehold.co/100x100.png', hint: 'fashion' })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un produit minimaliste
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <div className="h-6"><Loader /></div> : 'Enregistrer les modifications'}
        </Button>
      </div>
    </form>
  );
}
