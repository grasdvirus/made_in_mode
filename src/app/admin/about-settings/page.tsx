
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAboutPageData, updateAboutPageData, type AboutPageData } from "./actions";
import { useToast } from '@/hooks/use-toast';
import Loader from '@/components/ui/loader';
import '@/components/ui/loader.css';
import { Separator } from '@/components/ui/separator';

// Schema for client-side validation
const AboutFormSchema = z.object({
  heroImage: z.string().url("URL invalide"),
  heroTitle: z.string().min(1, "Titre requis"),
  heroSubtitle: z.string().min(1, "Sous-titre requis"),
  storyTitle: z.string().min(1, "Titre requis"),
  storyParagraph1: z.string().min(1, "Paragraphe requis"),
  storyParagraph2: z.string().min(1, "Paragraphe requis"),
  storyImage: z.string().url("URL invalide"),
  commitmentsTitle: z.string().min(1, "Titre requis"),
  commitment1Title: z.string().min(1, "Titre requis"),
  commitment1Text: z.string().min(1, "Texte requis"),
  commitment2Title: z.string().min(1, "Titre requis"),
  commitment2Text: z.string().min(1, "Texte requis"),
  commitment3Title: z.string().min(1, "Titre requis"),
  commitment3Text: z.string().min(1, "Texte requis"),
  teamTitle: z.string().min(1, "Titre requis"),
  teamParagraph1: z.string().min(1, "Paragraphe requis"),
  teamParagraph2: z.string().min(1, "Paragraphe requis"),
  teamImage: z.string().url("URL invalide"),
  contactTitle: z.string().min(1, "Titre requis"),
  contactSubtitle: z.string().min(1, "Sous-titre requis"),
  contactEmail: z.string().email("Email invalide"),
  contactPhone: z.string().min(1, "Téléphone requis"),
  contactButtonText: z.string().min(1, "Texte du bouton requis"),
});


export default function AboutSettingsPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const { toast } = useToast();

  const { control, register, handleSubmit, reset } = useForm<AboutPageData>({
    resolver: zodResolver(AboutFormSchema),
    defaultValues: {
        heroImage: '',
        heroTitle: '',
        heroSubtitle: '',
        storyTitle: '',
        storyParagraph1: '',
        storyParagraph2: '',
        storyImage: '',
        commitmentsTitle: '',
        commitment1Title: '',
        commitment1Text: '',
        commitment2Title: '',
        commitment2Text: '',
        commitment3Title: '',
        commitment3Text: '',
        teamTitle: '',
        teamParagraph1: '',
        teamParagraph2: '',
        teamImage: '',
        contactTitle: '',
        contactSubtitle: '',
        contactEmail: '',
        contactPhone: '',
        contactButtonText: '',
    },
  });
  
  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await getAboutPageData();
        reset(data);
      } catch (error) {
        console.error("Failed to fetch page data", error);
        toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les données de la page À Propos." });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [reset, toast]);

  const onSubmit = async (data: AboutPageData) => {
    setIsSaving(true);
    const result = await updateAboutPageData(data);
    setIsSaving(false);

    if (result.success) {
      toast({ title: "Succès", description: result.message });
    } else {
      toast({ variant: "destructive", title: "Erreur", description: result.message });
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-[60vh]"><Loader /></div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
            <h2 className="text-2xl font-bold">Réglages Page "À Propos"</h2>
            <p className="text-muted-foreground">Modifiez ici le contenu de votre page "À Propos".</p>
        </div>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <div className="h-6"><Loader /></div> : 'Enregistrer les modifications'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Section Hero</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1"><Label>Image de fond</Label><Input {...register('heroImage')} placeholder="https://..." /></div>
              <div className="space-y-1"><Label>Titre principal</Label><Input {...register('heroTitle')} /></div>
              <div className="space-y-1"><Label>Sous-titre</Label><Textarea {...register('heroSubtitle')} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Section "Notre Histoire"</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1"><Label>Titre de la section</Label><Input {...register('storyTitle')} /></div>
              <div className="space-y-1"><Label>Paragraphe 1</Label><Textarea {...register('storyParagraph1')} rows={4} /></div>
              <div className="space-y-1"><Label>Paragraphe 2</Label><Textarea {...register('storyParagraph2')} rows={4} /></div>
              <div className="space-y-1"><Label>Image de l'histoire</Label><Input {...register('storyImage')} placeholder="https://..." /></div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader><CardTitle>Section "Notre Équipe"</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1"><Label>Titre de la section</Label><Input {...register('teamTitle')} /></div>
              <div className="space-y-1"><Label>Paragraphe 1</Label><Textarea {...register('teamParagraph1')} rows={3} /></div>
              <div className="space-y-1"><Label>Paragraphe 2</Label><Textarea {...register('teamParagraph2')} rows={3} /></div>
              <div className="space-y-1"><Label>Image de l'équipe</Label><Input {...register('teamImage')} placeholder="https://..." /></div>
            </CardContent>
          </Card>

        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader><CardTitle>Section "Nos Engagements"</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1"><Label>Titre de la section</Label><Input {...register('commitmentsTitle')} /></div>
                <Separator />
                <div className="space-y-1"><Label>Engagement 1 - Titre</Label><Input {...register('commitment1Title')} /></div>
                <div className="space-y-1"><Label>Engagement 1 - Texte</Label><Textarea {...register('commitment1Text')} /></div>
                <Separator />
                <div className="space-y-1"><Label>Engagement 2 - Titre</Label><Input {...register('commitment2Title')} /></div>
                <div className="space-y-1"><Label>Engagement 2 - Texte</Label><Textarea {...register('commitment2Text')} /></div>
                <Separator />
                <div className="space-y-1"><Label>Engagement 3 - Titre</Label><Input {...register('commitment3Title')} /></div>
                <div className="space-y-1"><Label>Engagement 3 - Texte</Label><Textarea {...register('commitment3Text')} /></div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Section Contact</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1"><Label>Titre</Label><Input {...register('contactTitle')} /></div>
                <div className="space-y-1"><Label>Sous-titre</Label><Textarea {...register('contactSubtitle')} /></div>
                <div className="space-y-1"><Label>Email</Label><Input {...register('contactEmail')} /></div>
                <div className="space-y-1"><Label>Téléphone</Label><Input {...register('contactPhone')} /></div>
                <div className="space-y-1"><Label>Texte du bouton</Label><Input {...register('contactButtonText')} /></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
