
'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

// IMPORTANT: Note that the path is now in the `public` directory.
const dataFilePath = path.join(process.cwd(), 'public/products.json');

export type Product = {
  name: string;
  duration: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  hint: string;
  bgColor: string;
};

// Action to read products
export async function getProducts(): Promise<Product[]> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const products = JSON.parse(fileContent);
    return products;
  } catch (error) {
    console.error('Failed to read products:', error);
    // If the file doesn't exist or is empty, return an empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
    }
    throw error;
  }
}

// Action to update products
export async function updateProducts(products: Product[]) {
  try {
    const jsonData = JSON.stringify(products, null, 2);
    // This is where we would write to the file system.
    await fs.writeFile(dataFilePath, jsonData);
    
    // Revalidate the discover page to show the new data
    revalidatePath('/discover');
    // Also revalidate the admin page itself
    revalidatePath('/admin/update-products');
    return { success: true, message: 'Produits mis à jour avec succès.' };
  } catch (error) {
    console.error('Failed to update products:', error);
    return { success: false, message: 'Échec de la mise à jour des produits.' };
  }
}
