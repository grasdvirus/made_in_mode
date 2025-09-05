
'use client';

import * as React from 'react';
import { UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import Loader from '@/components/ui/loader';
import '@/components/ui/loader.css';

type ImageUploaderProps = {
    value: string;
    onChange: (url: string) => void;
    disabled: boolean;
};

export function ImageUploader({ value, onChange, disabled }: ImageUploaderProps) {
    const [uploading, setUploading] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 1 * 1024 * 1024) { // 1MB limit
            toast({ variant: "destructive", title: "Erreur", description: "Le fichier est trop volumineux. La taille maximale est de 1 Mo." });
            return;
        }

        setUploading(true);
        try {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                onChange(base64String);
                toast({ title: "Succès", description: "Image chargée avec succès." });
                setUploading(false);
            };
            reader.onerror = () => {
                 console.error("Reader error");
                 toast({ variant: "destructive", title: "Erreur", description: "Échec de la lecture du fichier." });
                 setUploading(false);
            }
            reader.readAsDataURL(file);

        } catch (error) {
            console.error("Upload error:", error);
            toast({ variant: "destructive", title: "Erreur", description: "Échec du chargement de l'image." });
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden"
                accept="image/png, image/jpeg, image/gif, image/webp"
                disabled={uploading || disabled}
            />
            
            <div className="space-y-2">
                <div 
                    className="aspect-square relative w-full bg-secondary/50 rounded-lg flex items-center justify-center border-2 border-dashed border-border cursor-pointer hover:border-primary transition-colors"
                    onClick={() => !uploading && fileInputRef.current?.click()}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <div className="h-10"><Loader/></div>
                            <span>Chargement...</span>
                        </div>
                    ) : value ? (
                        <Image src={value} alt="Aperçu du produit" fill className="object-contain rounded-md p-2" />
                    ) : (
                        <div className="text-center text-muted-foreground p-4">
                            <UploadCloud className="mx-auto h-12 w-12" />
                            <p className="mt-2 text-sm font-semibold">Cliquez pour téléverser</p>
                            <p className="text-xs">Taille max: 1MB</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
