
'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const dataDir = path.join(process.cwd(), 'src/data');
const homepageDataFilePath = path.join(dataDir, 'homepage.json');
const productsDataFilePath = path.join(dataDir, 'products.json');


const CategorySchema = z.object({
  name: z.string(),
  image: z.string(),
  hint: z.string(),
  link: z.string(),
});

const MinimalistProductSchema = z.object({
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

const RecommendedProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  hint: z.string(),
});

const HomepageDataSchema = z.object({
  heroImage: z.string().url().or(z.string().startsWith("data:image/")).optional().default('https://picsum.photos/1200/800'),
  categories: z.array(CategorySchema),
  featuredProducts: z.array(FeaturedProductSchema),
  products: z.array(MinimalistProductSchema),
  recommendedProducts: z.array(RecommendedProductSchema).optional(),
});

const FullProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    price: z.number(),
    images: z.array(z.string()),
    hint: z.string().optional(),
    description: z.string().optional(),
});


export type HomepageData = z.infer<typeof HomepageDataSchema>;
export type FullProduct = z.infer<typeof FullProductSchema>;

async function ensureDataDirExists() {
    try {
        await fs.access(dataDir);
    } catch (e) {
        await fs.mkdir(dataDir, { recursive: true });
    }
}


async function readHomepageData(): Promise<HomepageData> {
    await ensureDataDirExists();
    try {
        const fileContent = await fs.readFile(homepageDataFilePath, 'utf-8');
        const data = HomepageDataSchema.parse(JSON.parse(fileContent));
        // Ensure recommendedProducts is an array
        data.recommendedProducts = data.recommendedProducts || [];
        return data;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            const defaultData = {
                heroImage: 'https://picsum.photos/1200/800',
                categories: [],
                featuredProducts: [],
                products: [],
                recommendedProducts: [],
            };
            await writeHomepageData(defaultData);
            return defaultData;
        }
        console.error('Failed to read or parse homepage data:', error);
        return {
            heroImage: 'https://picsum.photos/1200/800',
            categories: [],
            featuredProducts: [],
            products: [],
            recommendedProducts: [],
        };
    }
}

async function writeHomepageData(data: HomepageData) {
    await ensureDataDirExists();
    const jsonData = JSON.stringify(data, null, 2);
    await fs.writeFile(homepageDataFilePath, jsonData);
    revalidatePath('/');
    revalidatePath('/discover');
    revalidatePath('/admin/home-settings');
}

export async function getHomepageData(): Promise<HomepageData> {
    return await readHomepageData();
}

export async function updateHomepageData(data: HomepageData): Promise<{ success: boolean; message: string }> {
    try {
        // We add a placeholder image URL for validation, as it's not submitted from the form anymore
        const categoriesWithImages = data.categories.map(c => ({
            ...c,
            image: c.image || 'https://placehold.co/200x200.png'
        }));
        
        const validatedData = HomepageDataSchema.parse({
            ...data,
            categories: categoriesWithImages
        });
        
        await writeHomepageData(validatedData);
        return { success: true, message: 'Page d\'accueil mise à jour avec succès.' };
    } catch (error) {
        console.error('Failed to update homepage data:', error);
        if (error instanceof z.ZodError) {
             return { success: false, message: `Erreur de validation: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}` };
        }
        return { success: false, message: 'Échec de la mise à jour de la page d\'accueil.' };
    }
}


export async function getFullProductsForSelect(): Promise<FullProduct[]> {
    await ensureDataDirExists();
    try {
        const fileContent = await fs.readFile(productsDataFilePath, 'utf-8');
        const products: FullProduct[] = JSON.parse(fileContent);
        // Ensure all products conform to the schema, providing defaults if needed
        return products.map(p => FullProductSchema.parse({
            ...p,
            hint: p.hint || '',
            description: p.description || 'Pas de description.',
            images: p.images && p.images.length > 0 ? p.images : ['https://placehold.co/600x400.png']
        }));
    } catch (error) {
         console.error('Failed to read products for select:', error);
         if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return []; // File doesn't exist yet, return empty array
        }
        return [];
    }
}
