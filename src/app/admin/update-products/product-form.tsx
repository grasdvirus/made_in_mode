
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
import { Trash, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';


const ProductFormSchema = z.object({
  name: z.string().min(3, { message: "Le nom doit contenir au moins 3 caractères." }),
  description: z.string().optional(),
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

const ImageUploader = ({ value, onChange, disabled }: { value: string, onChange: (url: string) => void, disabled: boolean }) => {
    const [uploading, setUploading] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const storage = getStorage();
            const storageRef = ref(storage, `products/${new Date().getTime()}_${file.name}`);
            
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            onChange(downloadURL);
            toast({ title: "Succès", description: "Image téléversée avec succès." });

        } catch (error) {
            console.error("Upload error:", error);
            toast({ variant: "destructive", title: "Erreur", description: "Échec du téléversement de l'image." });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden"
                accept="image/png, image/jpeg, image/gif, image/webp"
                disabled={uploading || disabled}
            />
            
            <div className="space-y-2">
                <Label>Image du produit</Label>
                <div 
                    className="aspect-square relative w-full bg-secondary/50 rounded-lg flex items-center justify-center border-2 border-dashed border-border cursor-pointer hover:border-primary transition-colors"
                    onClick={() => !uploading && fileInputRef.current?.click()}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <div className="h-10"><Loader/></div>
                            <span>Téléversement...</span>
                        </div>
                    ) : value ? (
                        <Image src={value} alt="Aperçu du produit" fill className="object-contain rounded-md" />
                    ) : (
                        <div className="text-center text-muted-foreground">
                            <UploadCloud className="mx-auto h-12 w-12" />
                            <p className="mt-2 text-sm">Cliquez pour téléverser</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export function ProductForm({ product, onSave, onDelete, isSaving }: ProductFormProps) {
  const { register, handleSubmit, formState: { errors }, control, watch, setValue } = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
        name: product.name || '',
        category: product.category || '',
        price: product.price || 0,
        image: product.image || '',
        hint: product.hint || '',
        description: (product as any).description || '',
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
            <Card className="bg-secondary/50 border-border/50">
                <CardHeader>
                    <h4 className="font-semibold">Informations sur le produit</h4>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom du produit</Label>
                        <Input id="name" {...register('name')} disabled={isSaving} />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Décrivez votre produit..." rows={4} {...register('description')} disabled={isSaving} />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-secondary/50 border-border/50">
                 <CardHeader>
                    <h4 className="font-semibold">Prix & Catégorie</h4>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Prix (FCFA)</Label>
                            <Input id="price" type="number" step="1" {...register('price')} disabled={isSaving} />
                            {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Catégorie</Label>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSaving}>
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
                </CardContent>
            </Card>

        </div>
        
        {/* Colonne de droite - Image & Mots-clés */}
        <div className="space-y-6">
            <Card className="bg-secondary/50 border-border/50">
                <CardHeader>
                    <h4 className="font-semibold">Média</h4>
                </CardHeader>
                 <CardContent>
                     <Controller
                        name="image"
                        control={control}
                        render={({ field }) => (
                            <ImageUploader 
                                value={field.value}
                                onChange={field.onChange}
                                disabled={isSaving}
                            />
                        )}
                    />
                    {errors.image && <p className="text-sm text-destructive mt-2">{errors.image.message}</p>}
                     <div className="space-y-2 mt-4">
                        <Label htmlFor="hint">Indice pour l'image (max 2 mots)</Label>
                        <Input id="hint" {...register('hint')} placeholder="ex: robe noire" disabled={isSaving}/>
                        {errors.hint && <p className="text-sm text-destructive">{errors.hint.message}</p>}
                    </div>
                 </CardContent>
            </Card>
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
