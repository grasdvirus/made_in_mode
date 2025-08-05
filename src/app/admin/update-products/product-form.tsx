
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type Product } from './actions';
import Loader from '@/components/ui/loader';
import '@/components/ui/loader.css';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';


const ProductFormSchema = z.object({
  name: z.string().min(3, { message: "Le nom doit contenir au moins 3 caractères." }),
  duration: z.string().min(1, { message: "La durée est requise." }).default(''),
  price: z.coerce.number().positive({ message: "Le prix doit être un nombre positif." }),
  image: z.string().url({ message: "Veuillez entrer une URL d'image valide." }),
  hint: z.string().optional().default(''),
});

export type ProductFormData = z.infer<typeof ProductFormSchema>;

type ProductFormProps = {
  product?: Omit<Product, 'originalPrice' | 'rating' | 'reviews' | 'bgColor'>;
  onSave: (data: ProductFormData) => void;
  isSaving: boolean;
};

export function ProductForm({ product, onSave, isSaving }: ProductFormProps) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: product || {
      name: 'Nouveau Produit',
      duration: '1h',
      price: 0,
      image: '',
      hint: '',
    },
  });

  const onSubmit = (data: ProductFormData) => {
    onSave(data);
  };
  
  const imageUrl = watch('image');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="text-xl font-semibold">{product ? 'Modifier le Produit' : 'Nouveau Produit'}</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne de gauche: Images et détails */}
        <div className="lg:col-span-2 space-y-6">
            
            <Card className="bg-secondary/50 border-border/50">
                <CardContent className="p-4">
                    <Label>Image du produit</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <div className="aspect-video w-full border-2 border-dashed rounded-lg flex flex-col justify-center items-center text-muted-foreground p-4">
                            {imageUrl ? (
                                <Image src={imageUrl} alt="Aperçu produit" width={300} height={150} className="object-cover rounded-md"/>
                            ) : (
                                <>
                                    <Upload className="h-8 w-8 mb-2" />
                                    <span>Glissez-déposez ou cliquez</span>
                                    <span className="text-xs">Taille max: 10MB</span>
                                </>
                            )}
                        </div>
                         <div className="aspect-video w-full border-2 border-dashed rounded-lg flex flex-col justify-center items-center text-muted-foreground p-4">
                            <Upload className="h-8 w-8 mb-2" />
                            <span>Glissez-déposez ou cliquez</span>
                            <span className="text-xs">Taille max: 10MB</span>
                        </div>
                    </div>
                     <div className="relative mt-4">
                        <Input 
                            id="image" 
                            placeholder="Ou collez une URL d'image ici"
                            {...register('image')} 
                            className="pr-10"
                        />
                        {imageUrl && (
                             <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => setValue('image', '')}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    {errors.image && <p className="text-sm text-destructive mt-2">{errors.image.message}</p>}
                </CardContent>
            </Card>

            <Card className="bg-secondary/50 border-border/50">
                <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom du produit</Label>
                        <Input id="name" {...register('name')} />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Décrivez votre produit..." rows={4} />
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Colonne de droite: Variantes et Inventaire */}
        <div className="space-y-6">
            <Card className="bg-secondary/50 border-border/50">
                 <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="variants">Activer les variantes</Label>
                        <Switch id="variants" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Permet de gérer taille, couleur, etc.</p>
                 </CardContent>
            </Card>
            <Card className="bg-secondary/50 border-border/50">
                <CardHeader>
                    <h4 className="font-semibold">Inventaire Simple</h4>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="price">Prix</Label>
                        <Input id="price" type="number" step="1" {...register('price')} />
                        {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="stock">Stock</Label>
                        <Input id="stock" type="number" placeholder="0" />
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg" disabled={isSaving}>
          {isSaving ? <div className="h-6"><Loader /></div> : 'Enregistrer les modifications'}
        </Button>
      </div>
    </form>
  );
}
