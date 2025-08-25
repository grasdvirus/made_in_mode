
'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const dataFilePath = path.join(process.cwd(), 'public/homepage.json');

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

export type HomepageData = z.infer<typeof HomepageDataSchema>;

async function readHomepageData(): Promise<HomepageData> {
    try {
        const fileContent = await fs.readFile(dataFilePath, 'utf-8');
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
    await fs.writeFile(dataFilePath, jsonData);
    revalidatePath('/');
    revalidatePath('/admin/home-settings');
}

export async function getHomepageData(): Promise<HomepageData> {
    return await readHomepageData();
}

export async function updateHomepageData(data: HomepageData): Promise<{ success: boolean; message: string }> {
    try {
        const validatedData = HomepageDataSchema.parse(data);
        await writeHomepageData(validatedData);
        return { success: true, message: 'Page d\'accueil mise à jour avec succès.' };
    } catch (error) {
        console.error('Failed to update homepage data:', error);
        return { success: false, message: 'Échec de la mise à jour de la page d\'accueil.' };
    }
}
