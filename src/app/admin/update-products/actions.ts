
'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const dataFilePath = path.join(process.cwd(), 'public/products.json');

const ProductSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  duration: z.string().min(1, 'La durée est requise'),
  price: z.coerce.number().positive('Le prix doit être positif'),
  originalPrice: z.coerce.number().positive('Le prix original doit être positif'),
  rating: z.coerce.number().min(0).max(5, 'La note doit être entre 0 et 5'),
  reviews: z.coerce.number().int().nonnegative('Le nombre d\'avis ne peut pas être négatif'),
  image: z.string().url('L\'URL de l\'image est invalide'),
  hint: z.string().max(25, 'L\'indice de l\'image est trop long').optional().default(''),
  bgColor: z.string().optional().default('bg-gray-200'),
  continent: z.string().min(1, 'Le continent est requis'),
});

export type Product = z.infer<typeof ProductSchema>;

// Action to read products
export async function getProducts(): Promise<Product[]> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const products = JSON.parse(fileContent);
    // Validate the array of products
    return z.array(ProductSchema).parse(products);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // If file doesn't exist, create it with an empty array
        await fs.writeFile(dataFilePath, '[]');
        return [];
    }
    console.error('Failed to read or parse products:', error);
    // In case of parsing error or other issues, return an empty array to avoid crashing the app
    return [];
  }
}

// Action to update products
export async function updateProducts(products: Product[]): Promise<{ success: boolean, message: string }> {
  try {
    // Validate the data before writing
    const validatedProducts = z.array(ProductSchema).parse(products);
    const jsonData = JSON.stringify(validatedProducts, null, 2);
    await fs.writeFile(dataFilePath, jsonData);
    
    // Revalidate paths to show the new data
    revalidatePath('/discover');
    revalidatePath('/admin/update-products');
    
    return { success: true, message: 'Produits mis à jour avec succès.' };
  } catch (error) {
    console.error('Failed to update products:', error);
    if (error instanceof z.ZodError) {
        return { success: false, message: `Validation failed: ${error.errors.map(e => e.message).join(', ')}` };
    }
    return { success: false, message: 'Échec de la mise à jour des produits.' };
  }
}
