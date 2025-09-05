
'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const aboutDataFilePath = path.join(process.cwd(), 'public/about.json');

// This type is now defined here and exported for use in the component.
// The Zod schema itself is NOT exported.
export type AboutPageData = {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  storyTitle: string;
  storyParagraph1: string;
  storyParagraph2: string;
  storyImage: string;
  commitmentsTitle: string;
  commitment1Title: string;
  commitment1Text: string;
  commitment2Title: string;
  commitment2Text: string;
  commitment3Title: string;
  commitment3Text: string;
  teamTitle: string;
  teamParagraph1: string;
  teamParagraph2: string;
  teamImage: string;
  contactTitle: string;
  contactSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  contactButtonText: string;
};


const defaultData: AboutPageData = {
    heroImage: "https://picsum.photos/1200/800",
    heroTitle: "À Propos de ACEPLACE",
    heroSubtitle: "Découvrez qui nous sommes, notre passion pour la mode et notre engagement envers vous.",
    storyTitle: "Notre Histoire",
    storyParagraph1: "ACEPLACE est née d'une passion inébranlable pour l'élégance et l'expression de soi à travers la mode. Fondée en 2023, notre boutique a commencé comme un rêve : celui de créer un espace où chaque femme pourrait trouver des pièces uniques qui non seulement complètent sa garde-robe, mais aussi racontent son histoire.",
    storyParagraph2: "Nous parcourons le monde, virtuellement et physiquement, pour dénicher des trésors cachés et des créateurs talentueux. Chaque article de notre collection est choisi avec soin, non seulement pour sa qualité et son style, mais aussi pour l'émotion qu'il procure. Pour nous, un vêtement est plus qu'un simple tissu ; c'est une armure, une œuvre d'art, une seconde peau.",
    storyImage: "https://picsum.photos/600/600",
    commitmentsTitle: "Nos Engagements",
    commitment1Title: "Qualité Supérieure",
    commitment1Text: "Nous sélectionnons des matériaux durables et des confections impeccables pour que vos pièces favorites durent dans le temps.",
    commitment2Title: "Style Exclusif",
    commitment2Text: "Nos collections sont soigneusement choisies pour vous offrir des pièces que vous ne trouverez nulle part ailleurs.",
    commitment3Title: "Service Client Dédié",
    commitment3Text: "Votre satisfaction est notre priorité. Notre équipe est toujours là pour vous conseiller et vous assister.",
    teamTitle: "Notre Équipe",
    teamParagraph1: "Derrière ACEPLACE, il y a Vanessa, notre fondatrice et directrice artistique. Passionnée par la mode depuis son plus jeune âge, elle a transformé sa vision en une réalité tangible. Son œil pour le détail et son sens inné du style sont le cœur battant de notre boutique.",
    teamParagraph2: "Entourée d'une petite équipe de passionnés, elle s'assure que chaque aspect de votre expérience, de la découverte du produit à la réception de votre commande, soit exceptionnel. Nous sommes plus qu'une boutique, nous sommes une famille unie par l'amour du beau.",
    teamImage: "https://picsum.photos/601/601",
    contactTitle: "Contactez-nous",
    contactSubtitle: "Une question ? Une suggestion ? Ou simplement envie de discuter mode ? Nous serions ravis d'échanger avec vous.",
    contactEmail: "contact@aceplace.com",
    contactPhone: "+225 07 08 22 56 82",
    contactButtonText: "Découvrir la collection",
};


async function readAboutData(): Promise<AboutPageData> {
    const AboutPageDataSchema = z.object({
        heroImage: z.string().url().or(z.string().startsWith("data:image/")),
        heroTitle: z.string(),
        heroSubtitle: z.string(),
        storyTitle: z.string(),
        storyParagraph1: z.string(),
        storyParagraph2: z.string(),
        storyImage: z.string().url().or(z.string().startsWith("data:image/")),
        commitmentsTitle: z.string(),
        commitment1Title: z.string(),
        commitment1Text: z.string(),
        commitment2Title: z.string(),
        commitment2Text: z.string(),
        commitment3Title: z.string(),
        commitment3Text: z.string(),
        teamTitle: z.string(),
        teamParagraph1: z.string(),
        teamParagraph2: z.string(),
        teamImage: z.string().url().or(z.string().startsWith("data:image/")),
        contactTitle: z.string(),
        contactSubtitle: z.string(),
        contactEmail: z.string().email(),
        contactPhone: z.string(),
        contactButtonText: z.string(),
    });
    try {
        await fs.access(aboutDataFilePath);
        const fileContent = await fs.readFile(aboutDataFilePath, 'utf-8');
        return AboutPageDataSchema.parse(JSON.parse(fileContent));
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            // No need to call writeAboutData here, as that would cause an infinite loop
            // if writing fails. Just return the default data.
            return defaultData;
        }
        console.error('Failed to read or parse about page data:', error);
        return defaultData;
    }
}

async function writeAboutData(data: AboutPageData) {
    const jsonData = JSON.stringify(data, null, 2);
    await fs.writeFile(aboutDataFilePath, jsonData);
    revalidatePath('/about');
    revalidatePath('/admin/about-settings');
}

export async function getAboutPageData(): Promise<AboutPageData> {
    return await readAboutData();
}

export async function updateAboutPageData(data: AboutPageData): Promise<{ success: boolean; message: string }> {
     const AboutPageDataSchema = z.object({
        heroImage: z.string().url("URL de l'image du héros invalide").or(z.string().startsWith("data:image/")),
        heroTitle: z.string(),
        heroSubtitle: z.string(),
        storyTitle: z.string(),
        storyParagraph1: z.string(),
        storyParagraph2: z.string(),
        storyImage: z.string().url("URL de l'image de l'histoire invalide").or(z.string().startsWith("data:image/")),
        commitmentsTitle: z.string(),
        commitment1Title: z.string(),
        commitment1Text: z.string(),
        commitment2Title: z.string(),
        commitment2Text: z.string(),
        commitment3Title: z.string(),
        commitment3Text: z.string(),
        teamTitle: z.string(),
        teamParagraph1: z.string(),
        teamParagraph2: z.string(),
        teamImage: z.string().url("URL de l'image de l'équipe invalide").or(z.string().startsWith("data:image/")),
        contactTitle: z.string(),
        contactSubtitle: z.string(),
        contactEmail: z.string().email(),
        contactPhone: z.string(),
        contactButtonText: z.string(),
    });
    try {
        const validatedData = AboutPageDataSchema.parse(data);
        await writeAboutData(validatedData);
        return { success: true, message: 'Page "À Propos" mise à jour avec succès.' };
    } catch (error) {
        console.error('Failed to update about page data:', error);
        if (error instanceof z.ZodError) {
             return { success: false, message: `Erreur de validation: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}` };
        }
        return { success: false, message: 'Échec de la mise à jour de la page "À Propos".' };
    }
}
