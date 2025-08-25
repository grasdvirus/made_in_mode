
'use client';

import * as React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getHomepageData, updateHomepageData, type HomepageData } from "./actions";
import { useToast } from '@/hooks/use-toast';
import Loader from '@/components/ui/loader';
import '@/components/ui/loader.css';
import { PlusCircle, Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
  id: z.string(),
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


export default function HomeSettingsPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const { toast } = useToast();

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<HomepageData>({
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
        const data = await getHomepageData();
        reset(data);
      } catch (error) {
        console.error("Failed to fetch homepage data", error);
        toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les données." });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [reset, toast]);

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
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>ID Produit</Label>
                        <Input {...register(`featuredProducts.${index}.id`)} placeholder="Doit correspondre à un ID de la page produits" />
                    </div>
                     <div className="space-y-1">
                        <Label>Nom</Label>
                        <Input {...register(`featuredProducts.${index}.name`)} />
                    </div>
                     <div className="space-y-1">
                        <Label>Catégorie</Label>
                        <Input {...register(`featuredProducts.${index}.category`)} />
                    </div>
                     <div className="space-y-1">
                        <Label>Prix</Label>
                        <Input type="number" {...register(`featuredProducts.${index}.price`, { valueAsNumber: true })} />
                    </div>
                     <div className="md:col-span-2 space-y-1">
                        <Label>URL Image</Label>
                        <Input {...register(`featuredProducts.${index}.images.0`)} />
                    </div>
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
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>ID Produit</Label>
                        <Input {...register(`products.${index}.id`)} placeholder="Doit correspondre à un ID de la page produits" />
                    </div>
                     <div className="space-y-1">
                        <Label>Nom</Label>
                        <Input {...register(`products.${index}.name`)} />
                    </div>
                     <div className="md:col-span-2 space-y-1">
                        <Label>Description</Label>
                        <Input {...register(`products.${index}.description`)} />
                    </div>
                     <div className="space-y-1">
                        <Label>URL de l'image</Label>
                        <Input {...register(`products.${index}.image`)} />
                    </div>
                     <div className="space-y-1">
                        <Label>Indice IA</Label>
                        <Input {...register(`products.${index}.hint`)} />
                    </div>
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
