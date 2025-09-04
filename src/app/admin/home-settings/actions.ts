
'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const homepageDataFilePath = path.join(process.cwd(), 'public/homepage.json');
const productsDataFilePath = path.join(process.cwd(), 'public/products.json');

const CategorySchema = z.object({
  name: z.string(),
  image: z.string(),
  hint: z.string(),
  link: z.string(),
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

const HomepageDataSchema = z.object({
  categories: z.array(CategorySchema),
  featuredProducts: z.array(FeaturedProductSchema),
  products: z.array(ProductSchema),
});

const SelectProductSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const FullProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    price: z.number(),
    images: z.array(z.string()),
    hint: z.string(),
    description: z.string(),
    image: z.string()
});


export type HomepageData = z.infer<typeof HomepageDataSchema>;
type SelectProduct = z.infer<typeof SelectProductSchema>;
type FullProduct = z.infer<typeof FullProductSchema>;


async function readHomepageData(): Promise<HomepageData> {
    try {
        const fileContent = await fs.readFile(homepageDataFilePath, 'utf-8');
        return HomepageDataSchema.parse(JSON.parse(fileContent));
    } catch (error) {
        console.error('Failed to read or parse homepage data:', error);
        // Return a default structure if the file doesn't exist or is invalid
        return {
            categories: [],
            featuredProducts: [],
            products: [],
        };
    }
}

async function writeHomepageData(data: HomepageData) {
    const jsonData = JSON.stringify(data, null, 2);
    await fs.writeFile(homepageDataFilePath, jsonData);
    revalidatePath('/');
    revalidatePath('/admin/home-settings');
}

export async function getHomepageData(): Promise<HomepageData> {
    return await readHomepageData();
}

export async function updateHomepageData(data: HomepageData): Promise<{ success: boolean; message: string }> {
    try {
        const productsList = await getProducts();
        
        // Auto-fill details for featured products
        const updatedFeatured = data.featuredProducts.map(fp => {
            const productDetails = productsList.find(p => p.id === fp.id);
            return productDetails ? {
                id: productDetails.id,
                name: productDetails.name,
                category: productDetails.category,
                price: productDetails.price,
                images: productDetails.images,
                hint: productDetails.hint || '',
            } : fp;
        });

        // Auto-fill details for minimalist products
        const updatedMinimalist = data.products.map(mp => {
            const productDetails = productsList.find(p => p.id === mp.id);
            return productDetails ? {
                id: productDetails.id,
                name: productDetails.name,
                description: productDetails.description || '',
                image: productDetails.images[0] || '',
                hint: productDetails.hint || '',
            } : mp;
        });
        
        const validatedData = HomepageDataSchema.parse({
            ...data,
            featuredProducts: updatedFeatured,
            products: updatedMinimalist,
        });

        await writeHomepageData(validatedData);
        return { success: true, message: 'Page d\'accueil mise à jour avec succès.' };
    } catch (error) {
        console.error('Failed to update homepage data:', error);
        return { success: false, message: 'Échec de la mise à jour de la page d\'accueil.' };
    }
}


export async function getProductsForSelect(): Promise<SelectProduct[]> {
    try {
        const fileContent = await fs.readFile(productsDataFilePath, 'utf-8');
        const products: FullProduct[] = JSON.parse(fileContent);
        return products.map(p => ({ id: p.id, name: p.name }));
    } catch (error) {
         console.error('Failed to read products for select:', error);
        return [];
    }
}

async function getProducts() {
    try {
        const fileContent = await fs.readFile(productsDataFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}
