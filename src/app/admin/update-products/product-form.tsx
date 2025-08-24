
'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type ProductFormData, type Product } from './actions';
import Loader from '@/components/ui/loader';
import '@/components/ui/loader.css';
import { Trash, Image as ImageIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

const ProductFormSchema = z.object({
  name: z.string().min(3, { message: "Le nom doit contenir au moins 3 caractères." }),
  category: z.string().min(1, { message: "Veuillez sélectionner une catégorie." }),
  price: z.coerce.number().positive({ message: "Le prix doit être un nombre positif." }),
  image: z.string().url({ message: "Veuillez entrer une URL d'image valide." }),
  hint: z.string().optional().default(''),
});

type ProductFormProps = {
  product: Product;
  onSave: (data: ProductFormData) => void;
  onDelete: () => void;
  isSaving: boolean;
};

export function ProductForm({ product, onSave, onDelete, isSaving }: ProductFormProps) {
  const { register, handleSubmit, formState: { errors }, control, watch } = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        hint: product.hint,
    },
  });

  const onSubmit = (data: ProductFormData) => {
    onSave(data);
  };
  
  const currentImageUrl = watch('image');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4 border-t border-border/50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Colonne de gauche - Infos principales */}
        <div className="md:col-span-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du produit</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optionnel)</Label>
            <Textarea id="description" placeholder="Décrivez votre produit..." rows={4} />
          </div>
           <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Prix (FCFA)</Label>
                    <Input id="price" type="number" step="1" {...register('price')} />
                    {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner une catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Robes">Robes</SelectItem>
                                    <SelectItem value="Hauts">Hauts</SelectItem>
                                    <SelectItem value="Pantalons">Pantalons</SelectItem>
                                    <SelectItem value="Chaussures">Chaussures</SelectItem>
                                    <SelectItem value="Sacs">Sacs</SelectItem>
                                    <SelectItem value="Accessoires">Accessoires</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                     {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                </div>
            </div>
        </div>
        
        {/* Colonne de droite - Image & Mots-clés */}
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Image du produit</Label>
                <div className="aspect-square relative w-full bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                    {currentImageUrl && (
                        <Image src={currentImageUrl} alt="Aperçu du produit" fill className="object-contain rounded-md" />
                    )}
                    {!currentImageUrl && (
                        <div className="text-center text-muted-foreground">
                            <ImageIcon className="mx-auto h-12 w-12" />
                            <p className="mt-2 text-sm">Collez une URL pour voir l'aperçu</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="image">URL de l'image</Label>
                <Input id="image" {...register('image')} placeholder="https://..."/>
                {errors.image && <p className="text-sm text-destructive">{errors.image.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="hint">Indice pour l'image (max 2 mots)</Label>
                <Input id="hint" {...register('hint')} placeholder="ex: robe noire"/>
                {errors.hint && <p className="text-sm text-destructive">{errors.hint.message}</p>}
            </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4">
        <Button type="button" variant="destructive" size="sm" onClick={onDelete} disabled={isSaving}>
          <Trash className="mr-2 h-4 w-4" />
          Supprimer
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <div className="h-6"><Loader /></div> : 'Enregistrer les modifications'}
        </Button>
      </div>
    </form>
  );
}
