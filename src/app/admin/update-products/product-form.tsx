
'use client';

import * as React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type ProductFormData, type Product } from './actions';
import Loader from '@/components/ui/loader';
import '@/components/ui/loader.css';
import { Trash, UploadCloud, PlusCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const ColorSchema = z.object({
  name: z.string().min(1, "Le nom de la couleur est requis."),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Le code hexadécimal doit être au format #RRGGBB."),
});

const ProductFormSchema = z.object({
  name: z.string().min(3, { message: "Le nom doit contenir au moins 3 caractères." }),
  description: z.string().optional(),
  category: z.string().min(1, { message: "Veuillez sélectionner une catégorie." }),
  price: z.coerce.number().positive({ message: "Le prix doit être un nombre positif." }),
  images: z.array(z.string().url("L'URL de l'image est invalide ou l'image n'est pas téléversée").or(z.string().startsWith("data:image/"))).min(1, "Au moins une image est requise.").max(2, "Maximum 2 images."),
  hint: z.string().optional().default(''),
  sizes: z.string().min(1, 'Veuillez entrer au moins une taille.').transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
  colors: z.array(ColorSchema).min(1, "Veuillez ajouter au moins une couleur."),
});

const PREDEFINED_COLORS: z.infer<typeof ColorSchema>[] = [
    { name: 'Noir', hex: '#000000' },
    { name: 'Blanc', hex: '#FFFFFF' },
    { name: 'Gris', hex: '#808080' },
    { name: 'Rouge', hex: '#FF0000' },
    { name: 'Vert', hex: '#008000' },
    { name: 'Bleu', hex: '#0000FF' },
    { name: 'Jaune', hex: '#FFFF00' },
    { name: 'Rose', hex: '#FFC0CB' },
    { name: 'Violet', hex: '#800080' },
    { name: 'Orange', hex: '#FFA500' },
    { name: 'Marron', hex: '#A52A2A' },
    { name: 'Beige', hex: '#F5F5DC' },
];

type ProductFormProps = {
  product?: Product;
  onSave: (data: ProductFormData) => void;
  isSaving: boolean;
  isAddForm?: boolean;
  availableCategories: string[];
};

const ImageUploader = ({ value, onChange, disabled }: { value: string, onChange: (url: string) => void, disabled: boolean }) => {
    const [uploading, setUploading] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            toast({ variant: "destructive", title: "Erreur", description: "Le fichier est trop volumineux. La taille maximale est de 10 Mo." });
            return;
        }

        setUploading(true);
        try {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                onChange(base64String);
                toast({ title: "Succès", description: "Image chargée avec succès." });
                setUploading(false);
            };
            reader.onerror = () => {
                 console.error("Reader error");
                 toast({ variant: "destructive", title: "Erreur", description: "Échec de la lecture du fichier." });
                 setUploading(false);
            }
            reader.readAsDataURL(file);

        } catch (error) {
            console.error("Upload error:", error);
            toast({ variant: "destructive", title: "Erreur", description: "Échec du chargement de l'image." });
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
                <div 
                    className="aspect-square relative w-full bg-secondary/50 rounded-lg flex items-center justify-center border-2 border-dashed border-border cursor-pointer hover:border-primary transition-colors"
                    onClick={() => !uploading && fileInputRef.current?.click()}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <div className="h-10"><Loader/></div>
                            <span>Chargement...</span>
                        </div>
                    ) : value ? (
                        <Image src={value} alt="Aperçu du produit" fill className="object-contain rounded-md p-2" />
                    ) : (
                        <div className="text-center text-muted-foreground p-4">
                            <UploadCloud className="mx-auto h-12 w-12" />
                            <p className="mt-2 text-sm font-semibold">Cliquez pour téléverser</p>
                            <p className="text-xs">Taille max: 10MB</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export function ProductForm({ product, onSave, isSaving, isAddForm = false, availableCategories = [] }: ProductFormProps) {
  const { register, handleSubmit, formState: { errors }, control, watch, setValue, reset } = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormSchema as any),
    defaultValues: {
        name: product?.name || '',
        category: product?.category || (availableCategories[0] || ''),
        price: product?.price || 0,
        images: product?.images || ['', ''],
        hint: product?.hint || '',
        description: product?.description || '',
        sizes: (product?.sizes || ['S', 'M', 'L']).join(', '),
        colors: product?.colors || [{ name: 'Noir', hex: '#000000'}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "colors"
  });

  const currentColors = watch('colors');

  const handleColorToggle = (color: z.infer<typeof ColorSchema>) => {
    const colorIndex = currentColors.findIndex(c => c.hex.toLowerCase() === color.hex.toLowerCase());
    if (colorIndex > -1) {
        remove(colorIndex);
    } else {
        append(color);
    }
  };


  const onSubmit = (data: ProductFormData) => {
    onSave(data);
    if(isAddForm) {
        reset(); // Reset form after successful addition
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 pt-4 border-t border-border/50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
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
                    <h4 className="font-semibold">Options du produit</h4>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="sizes">Tailles disponibles (séparées par une virgule)</Label>
                        <Input id="sizes" {...register('sizes')} placeholder="ex: S, M, L, XL" disabled={isSaving} />
                        {errors.sizes && <p className="text-sm text-destructive">{errors.sizes.message}</p>}
                    </div>
                    <div className="space-y-4">
                      <Label>Couleurs disponibles</Label>
                       <div className="flex flex-wrap gap-2 p-2 bg-background/50 rounded-lg">
                           {PREDEFINED_COLORS.map(color => {
                               const isSelected = currentColors.some(c => c.hex.toLowerCase() === color.hex.toLowerCase());
                               return (
                                   <button
                                       type="button"
                                       key={color.hex}
                                       onClick={() => handleColorToggle(color)}
                                       className={cn(
                                           "p-1 rounded-lg border-2 transition-all duration-200",
                                           isSelected ? 'border-primary ring-2 ring-primary' : 'border-transparent hover:border-muted-foreground'
                                       )}
                                       title={color.name}
                                       disabled={isSaving}
                                   >
                                       <div
                                           className="w-6 h-6 rounded-md border"
                                           style={{ backgroundColor: color.hex }}
                                       ></div>
                                   </button>
                               )
                           })}
                       </div>
                      {errors.colors && <p className="text-sm text-destructive mt-2">{errors.colors.message}</p>}
                    </div>
                </CardContent>
             </Card>

        </div>
        
        <div className="space-y-4">
             <Card className="bg-secondary/50 border-border/50">
                 <CardHeader>
                    <h4 className="font-semibold">Prix & Catégorie</h4>
                </CardHeader>
                <CardContent className="space-y-4">
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
                                            {availableCategories.length > 0 ? (
                                                availableCategories.map(cat => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))
                                            ) : (
                                                <p className="p-4 text-sm text-muted-foreground">Aucune catégorie. Créez-en dans "Réglages Accueil".</p>
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                        </div>
                </CardContent>
            </Card>
            <Card className="bg-secondary/50 border-border/50">
                <CardHeader>
                    <h4 className="font-semibold">Média</h4>
                </CardHeader>
                 <CardContent>
                    <Label>Images du produit (2 max)</Label>
                     <div className="grid grid-cols-2 gap-2 mt-2">
                         <Controller
                            name="images.0"
                            control={control}
                            render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} disabled={isSaving} />}
                        />
                         <Controller
                            name="images.1"
                            control={control}
                            render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} disabled={isSaving} />}
                        />
                     </div>
                    {errors.images && <p className="text-sm text-destructive mt-2">{typeof errors.images === 'string' ? errors.images : errors.images.message}</p>}
                     <div className="space-y-2 mt-4">
                        <Label htmlFor="hint">Indice pour l'image (max 2 mots)</Label>
                        <Input id="hint" {...register('hint')} placeholder="ex: robe noire" disabled={isSaving}/>
                        {errors.hint && <p className="text-sm text-destructive">{errors.hint.message}</p>}
                    </div>
                 </CardContent>
            </Card>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <div className="h-6"><Loader /></div> : (isAddForm ? 'Ajouter le produit' : 'Enregistrer les modifications')}
        </Button>
      </div>
    </form>
  );
}
