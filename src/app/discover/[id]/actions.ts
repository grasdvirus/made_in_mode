
'use server';

import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { type Product } from '@/lib/types';

const dataDir = path.join(process.cwd(), 'src/data');
const reviewsDataFilePath = path.join(dataDir, 'reviews.json');
const productsDataFilePath = path.join(dataDir, 'products.json');


const ReviewSchema = z.object({
  id: z.string(),
  productId: z.string(),
  rating: z.number().min(1).max(5),
  text: z.string().optional(),
  author: z.string(),
  date: z.string(),
});

export type Review = z.infer<typeof ReviewSchema>;

type ReviewSubmission = Omit<Review, 'id' | 'date'>;

async function ensureDataDirExists() {
    try {
        await fs.access(dataDir);
    } catch (e) {
        await fs.mkdir(dataDir, { recursive: true });
    }
}

async function readReviews(): Promise<Review[]> {
    await ensureDataDirExists();
    try {
        await fs.access(reviewsDataFilePath);
        const fileContent = await fs.readFile(reviewsDataFilePath, 'utf-8');
        if (!fileContent) return [];
        return ReviewSchema.array().parse(JSON.parse(fileContent));
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await fs.writeFile(reviewsDataFilePath, '[]'); // Create file if it doesn't exist
            return [];
        }
        console.error("Failed to read reviews file:", error);
        return [];
    }
}

async function writeReviews(reviews: Review[]) {
    await ensureDataDirExists();
    await fs.writeFile(reviewsDataFilePath, JSON.stringify(reviews, null, 2));
    reviews.forEach(review => {
        revalidatePath(`/discover/${review.productId}`);
    });
}

export async function getReviews(productId: string): Promise<Review[]> {
    const reviews = await readReviews();
    return reviews
        .filter(r => r.productId === productId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function addReview(reviewData: ReviewSubmission): Promise<{ success: boolean; message?: string; review?: Review }> {
  try {
    const reviews = await readReviews();
    const newReview: Review = {
      ...reviewData,
      id: new Date().getTime().toString(),
      date: new Date().toISOString(),
    };

    ReviewSchema.parse(newReview); // Validate new review

    const updatedReviews = [newReview, ...reviews];
    await writeReviews(updatedReviews);

    return { success: true, review: newReview };
  } catch (error) {
    console.error("Failed to add review:", error);
    if (error instanceof z.ZodError) {
        return { success: false, message: 'Données d\'avis invalides.' };
    }
    return { success: false, message: 'Une erreur est survenue.' };
  }
}

export async function getProductById(productId: string): Promise<Product | null> {
    await ensureDataDirExists();
    try {
        const fileContent = await fs.readFile(productsDataFilePath, 'utf-8');
        const products: Product[] = JSON.parse(fileContent);
        const product = products.find(p => p.id === productId);
        return product || null;
    } catch (error) {
        console.error(`Failed to read or find product with ID ${productId}:`, error);
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return null; // File doesn't exist yet
        }
        return null;
    }
}
