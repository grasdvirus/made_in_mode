
'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Target, Users, Mail, Phone } from 'lucide-react';
import Footer from '@/components/footer';

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground -mx-4 -mt-8">
      {/* Hero Section */}
      <header className="relative h-72 md:h-96 flex items-center justify-center text-center text-white rounded-b-3xl overflow-hidden">
        <Image
          src="https://picsum.photos/1200/800"
          alt="L'équipe de Aceplace travaillant sur des créations de mode"
          fill
          className="object-cover"
          data-ai-hint="fashion design studio"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">À Propos de ACEPLACE</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-white/90">
            Découvrez qui nous sommes, notre passion pour la mode et notre engagement envers vous.
          </p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-20 space-y-16">
        {/* Our Story Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary flex items-center gap-3"><Heart className="h-8 w-8"/> Notre Histoire</h2>
            <p className="text-muted-foreground leading-relaxed">
              ACEPLACE est née d'une passion inébranlable pour l'élégance et l'expression de soi à travers la mode. Fondée en 2023, notre boutique a commencé comme un rêve : celui de créer un espace où chaque femme pourrait trouver des pièces uniques qui non seulement complètent sa garde-robe, mais aussi racontent son histoire.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nous parcourons le monde, virtuellement et physiquement, pour dénicher des trésors cachés et des créateurs talentueux. Chaque article de notre collection est choisi avec soin, non seulement pour sa qualité et son style, mais aussi pour l'émotion qu'il procure. Pour nous, un vêtement est plus qu'un simple tissu ; c'est une armure, une œuvre d'art, une seconde peau.
            </p>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
             <Image
                src="https://picsum.photos/600/600"
                alt="Moodboard de mode avec des tissus et des croquis"
                fill
                className="object-cover"
                data-ai-hint="fashion moodboard"
            />
          </div>
        </section>

        {/* Our Commitments Section */}
        <section className="text-center">
            <h2 className="text-3xl font-bold mb-10 text-primary flex items-center justify-center gap-3"><Target className="h-8 w-8"/> Nos Engagements</h2>
            <div className="grid md:grid-cols-3 gap-8">
                <Card className="bg-secondary/50 border-border/50 text-center">
                    <CardHeader>
                        <CardTitle>Qualité Supérieure</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Nous sélectionnons des matériaux durables et des confections impeccables pour que vos pièces favorites durent dans le temps.</p>
                    </CardContent>
                </Card>
                 <Card className="bg-secondary/50 border-border/50 text-center">
                    <CardHeader>
                        <CardTitle>Style Exclusif</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Nos collections sont soigneusement choisies pour vous offrir des pièces que vous ne trouverez nulle part ailleurs.</p>
                    </CardContent>
                </Card>
                 <Card className="bg-secondary/50 border-border/50 text-center">
                    <CardHeader>
                        <CardTitle>Service Client Dédié</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Votre satisfaction est notre priorité. Notre équipe est toujours là pour vous conseiller et vous assister.</p>
                    </CardContent>
                </Card>
            </div>
        </section>

         {/* Team Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg order-last md:order-first">
             <Image
                src="https://picsum.photos/601/601"
                alt="Portrait de la fondatrice de Aceplace"
                fill
                className="object-cover"
                data-ai-hint="female founder portrait"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary flex items-center gap-3"><Users className="h-8 w-8"/> Notre Équipe</h2>
            <p className="text-muted-foreground leading-relaxed">
              Derrière ACEPLACE, il y a Vanessa, notre fondatrice et directrice artistique. Passionnée par la mode depuis son plus jeune âge, elle a transformé sa vision en une réalité tangible. Son œil pour le détail et son sens inné du style sont le cœur battant de notre boutique.
            </p>
            <p className="text-muted-foreground leading-relaxed">
             Entourée d'une petite équipe de passionnés, elle s'assure que chaque aspect de votre expérience, de la découverte du produit à la réception de votre commande, soit exceptionnel. Nous sommes plus qu'une boutique, nous sommes une famille unie par l'amour du beau.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-secondary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold">Contactez-nous</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Une question ? Une suggestion ? Ou simplement envie de discuter mode ? Nous serions ravis d'échanger avec vous.</p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-6">
                <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary"/>
                    <a href="mailto:contact@aceplace.com" className="hover:underline">contact@aceplace.com</a>
                </div>
                 <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary"/>
                    <a href="tel:+2250708225682" className="hover:underline">+225 07 08 22 56 82</a>
                </div>
            </div>
             <Button size="lg" className="mt-8">Découvrir la collection</Button>
        </section>

      </main>

       <Footer />
    </div>
  );
}
