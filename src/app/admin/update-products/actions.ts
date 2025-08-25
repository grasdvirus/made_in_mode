
'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const dataFilePath = path.join(process.cwd(), 'public/products.json');

const ColorSchema = z.object({
  name: z.string(),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Le code hexadécimal de la couleur est invalide"),
});

const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  category: z.string().min(1, 'La catégorie est requise'),
  price: z.coerce.number().positive('Le prix doit être positif'),
  originalPrice: z.coerce.number().positive('Le prix original doit être positif').optional(),
  rating: z.coerce.number().min(0).max(5, 'La note doit être entre 0 et 5').optional(),
  reviews: z.coerce.number().int().nonnegative("Le nombre d'avis ne peut pas être négatif").optional(),
  images: z.array(z.string().url("L'URL de l'image est invalide ou l'image n'est pas téléversée").or(z.string().startsWith("data:image/"))).min(1, "Au moins une image est requise.").max(2, "Vous ne pouvez téléverser que 2 images maximum."),
  hint: z.string().max(40, "L'indice de l'image est trop long").optional().default(''),
  bgColor: z.string().optional().default('bg-gray-200'),
  sizes: z.array(z.string()).optional().default(['S', 'M', 'L']),
  colors: z.array(ColorSchema).optional().default([{ name: 'Default', hex: '#000000' }]),
});

const ProductUpdateSchema = ProductSchema.omit({ id: true });
export type Product = z.infer<typeof ProductSchema>;
export type ProductFormData = z.infer<typeof ProductUpdateSchema>;


async function readProductsFromFile(): Promise<Product[]> {
    try {
        const fileContent = await fs.readFile(dataFilePath, 'utf-8');
        const products = JSON.parse(fileContent);
        // We use passthrough to avoid failing on old data with missing fields.
        return z.array(ProductSchema.passthrough()).parse(products);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await fs.writeFile(dataFilePath, '[]');
            return [];
        }
        console.error('Failed to read or parse products:', error);
        return [];
    }
}

async function writeProductsToFile(products: Product[]) {
    const jsonData = JSON.stringify(products, null, 2);
    await fs.writeFile(dataFilePath, jsonData);
    revalidatePath('/discover');
    revalidatePath('/admin/update-products');
    revalidatePath('/discover/[id]', 'page');
}

export async function getProducts(): Promise<Product[]> {
    return await readProductsFromFile();
}

export async function addProduct(productData: ProductFormData): Promise<{ success: boolean; message: string; product?: Product }> {
    try {
        const products = await readProductsFromFile();
        
        const newProduct: Product = {
            ...ProductUpdateSchema.parse(productData),
            id: new Date().getTime().toString(), // Simple unique ID
            originalPrice: productData.price * 1.2,
            rating: 0,
            reviews: 0,
        };

        const updatedProducts = [newProduct, ...products];
        await writeProductsToFile(updatedProducts);

        return { success: true, message: 'Produit ajouté avec succès.', product: newProduct };
    } catch (error) {
        console.error('Failed to add product:', error);
        return { success: false, message: 'Échec de l\'ajout du produit.' };
    }
}

export async function editProduct(productId: string, productData: ProductFormData): Promise<{ success: boolean; message: string }> {
     try {
        const products = await readProductsFromFile();
        const productIndex = products.findIndex(p => p.id === productId);

        if (productIndex === -1) {
            return { success: false, message: 'Produit non trouvé.' };
        }

        const validatedData = ProductUpdateSchema.parse(productData);

        products[productIndex] = {
            ...products[productIndex],
            ...validatedData,
        };
        
        await writeProductsToFile(products);

        return { success: true, message: 'Produit mis à jour avec succès.' };
    } catch (error) {
        console.error('Failed to update product:', error);
        return { success: false, message: 'Échec de la mise à jour du produit.' };
    }
}


export async function deleteProduct(productId: string): Promise<{ success: boolean, message: string }> {
    try {
        const products = await readProductsFromFile();
        const updatedProducts = products.filter(p => p.id !== productId);

        if (products.length === updatedProducts.length) {
            return { success: false, message: 'Produit non trouvé.' };
        }

        await writeProductsToFile(updatedProducts);

        return { success: true, message: 'Produit supprimé avec succès.' };
    } catch (error) {
        console.error('Failed to delete product:', error);
        return { success: false, message: 'Échec de la suppression du produit.' };
    }
}
