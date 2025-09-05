
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Target, Users, Mail, Phone } from 'lucide-react';
import Footer from '@/components/footer';
import { type AboutPageData, getAboutPageData } from '../admin/about-settings/actions';
import { Skeleton } from '@/components/ui/skeleton';

function AboutPageContent() {
  const [data, setData] = useState<AboutPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const jsonData = await getAboutPageData();
        setData(jsonData);
      } catch (error) {
        console.error(error);
        setData(null); // Set to null on error
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 space-y-16">
            <Skeleton className="h-96 w-full rounded-b-3xl"/>
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                </div>
                 <Skeleton className="aspect-square rounded-2xl" />
            </div>
        </div>
    )
  }

  if (!data) {
    return <div className="text-center py-20">Impossible de charger le contenu de la page.</div>;
  }
  
  return (
    <div className="bg-background text-foreground -mx-4 -mt-8">
      {/* Hero Section */}
      <header className="relative h-72 md:h-96 flex items-center justify-center text-center text-white rounded-b-3xl overflow-hidden">
        <Image
          src={data.heroImage}
          alt="L'équipe de Aceplace travaillant sur des créations de mode"
          fill
          className="object-cover"
          data-ai-hint="fashion design studio"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{data.heroTitle}</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-white/90">
            {data.heroSubtitle}
          </p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-20 space-y-12">
        {/* Our Story Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary flex items-center gap-3"><Heart className="h-8 w-8"/> {data.storyTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {data.storyParagraph1}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {data.storyParagraph2}
            </p>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
             <Image
                src={data.storyImage}
                alt="Moodboard de mode avec des tissus et des croquis"
                fill
                className="object-cover"
                data-ai-hint="fashion moodboard"
            />
          </div>
        </section>

        {/* Our Commitments Section */}
        <section className="text-center">
            <h2 className="text-3xl font-bold mb-10 text-primary flex items-center justify-center gap-3"><Target className="h-8 w-8"/> {data.commitmentsTitle}</h2>
            <div className="grid md:grid-cols-3 gap-8">
                <Card className="bg-secondary/50 border-border/50 text-center">
                    <CardHeader>
                        <CardTitle>{data.commitment1Title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{data.commitment1Text}</p>
                    </CardContent>
                </Card>
                 <Card className="bg-secondary/50 border-border/50 text-center">
                    <CardHeader>
                        <CardTitle>{data.commitment2Title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{data.commitment2Text}</p>
                    </CardContent>
                </Card>
                 <Card className="bg-secondary/50 border-border/50 text-center">
                    <CardHeader>
                        <CardTitle>{data.commitment3Title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{data.commitment3Text}</p>
                    </CardContent>
                </Card>
            </div>
        </section>

         {/* Team Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg order-last md:order-first">
             <Image
                src={data.teamImage}
                alt="Portrait de la fondatrice de Aceplace"
                fill
                className="object-cover"
                data-ai-hint="female founder portrait"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary flex items-center gap-3"><Users className="h-8 w-8"/> {data.teamTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {data.teamParagraph1}
            </p>
            <p className="text-muted-foreground leading-relaxed">
             {data.teamParagraph2}
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-secondary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold">{data.contactTitle}</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{data.contactSubtitle}</p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-6">
                <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary"/>
                    <a href={`mailto:${data.contactEmail}`} className="hover:underline">{data.contactEmail}</a>
                </div>
                 <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary"/>
                    <a href={`tel:${data.contactPhone.replace(/\s/g, '')}`} className="hover:underline">{data.contactPhone}</a>
                </div>
            </div>
             <Button size="lg" className="mt-8">{data.contactButtonText}</Button>
        </section>

      </main>

       <Footer />
    </div>
  );
}

export default function AboutPage() {
    return <AboutPageContent />;
}
