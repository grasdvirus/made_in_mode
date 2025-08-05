
'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type Product } from './actions';
import { Loader2 } from 'lucide-react';

const ProductFormSchema = z.object({
  name: z.string().min(3, { message: "Le nom doit contenir au moins 3 caractères." }),
  duration: z.string().min(1, { message: "La durée est requise." }),
  price: z.coerce.number().positive({ message: "Le prix doit être un nombre positif." }),
  originalPrice: z.coerce.number().positive({ message: "Le prix original doit être un nombre positif." }),
  rating: z.coerce.number().min(0).max(5, { message: "La note doit être entre 0 et 5." }),
  reviews: z.coerce.number().int().nonnegative({ message: "Le nombre d'avis doit être un entier positif." }),
  image: z.string().url({ message: "Veuillez entrer une URL d'image valide." }),
  hint: z.string().optional().default(''),
  bgColor: z.string().optional().default('bg-gray-200'),
});

export type ProductFormData = z.infer<typeof ProductFormSchema>;

type ProductFormProps = {
  product?: Product;
  onSave: (data: ProductFormData) => void;
  onCancel: () => void;
  isSaving: boolean;
};

export function ProductForm({ product, onSave, onCancel, isSaving }: ProductFormProps) {
  const { register, handleSubmit, formState: { errors }, control } = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: product || {
      name: '',
      duration: '',
      price: 0,
      originalPrice: 0,
      rating: 0,
      reviews: 0,
      image: 'https://placehold.co/600x400.png',
      hint: '',
      bgColor: 'bg-gray-200',
    },
  });

  const onSubmit = (data: ProductFormData) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du produit</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Durée</Label>
          <Input id="duration" {...register('duration')} />
          {errors.duration && <p className="text-sm text-destructive">{errors.duration.message}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Prix</Label>
          <Input id="price" type="number" step="0.01" {...register('price')} />
          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="originalPrice">Prix Original</Label>
          <Input id="originalPrice" type="number" step="0.01" {...register('originalPrice')} />
          {errors.originalPrice && <p className="text-sm text-destructive">{errors.originalPrice.message}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rating">Note (0-5)</Label>
          <Input id="rating" type="number" step="0.1" {...register('rating')} />
          {errors.rating && <p className="text-sm text-destructive">{errors.rating.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="reviews">Nombre d'avis</Label>
          <Input id="reviews" type="number" {...register('reviews')} />
          {errors.reviews && <p className="text-sm text-destructive">{errors.reviews.message}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image">URL de l'image</Label>
        <Input id="image" {...register('image')} />
        {errors.image && <p className="text-sm text-destructive">{errors.image.message}</p>}
      </div>

       <div className="space-y-2">
        <Label htmlFor="hint">Indice pour IA (max 2 mots)</Label>
        <Input id="hint" {...register('hint')} placeholder="ex: 'nature forest'"/>
        {errors.hint && <p className="text-sm text-destructive">{errors.hint.message}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sauvegarder
        </Button>
      </div>
    </form>
  );
}
