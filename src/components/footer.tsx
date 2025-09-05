import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Globe } from "lucide-react";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground w-full">
      <div className="container max-w-7xl mx-auto px-4 pt-8 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 space-y-4">
                 <h3 className="text-lg font-bold">ACEPLACE</h3>
                 <p className="text-sm text-muted-foreground">Votre destination pour une mode féminine, élégante et audacieuse.</p>
                 <div className="flex space-x-4">
                    <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary"><Facebook size={20} /></a>
                    <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></a>
                    <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary"><Instagram size={20} /></a>
                    <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary"><Linkedin size={20} /></a>
                </div>
            </div>
             <div className="space-y-4">
                <h4 className="font-semibold">Navigation</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><Link href="/" className="hover:text-primary">Accueil</Link></li>
                    <li><Link href="/discover" className="hover:text-primary">Découvrir</Link></li>
                    <li><Link href="/about" className="hover:text-primary">À Propos</Link></li>
                    <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
                </ul>
            </div>
             <div className="space-y-4">
                <h4 className="font-semibold">Aide & Information</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-primary">FAQ</a></li>
                    <li><a href="#" className="hover:text-primary">Suivi de commande</a></li>
                    <li><a href="#" className="hover:text-primary">Politique de retour</a></li>
                    <li><a href="#" className="hover:text-primary">Conditions Générales</a></li>
                </ul>
            </div>
            <div className="space-y-4">
                 <h4 className="font-semibold">Langue</h4>
                <Button variant="outline" size="sm" className="flex items-center gap-2 w-full justify-start">
                    <Globe className="h-4 w-4" />
                    <span>Français</span>
                </Button>
            </div>
        </div>
       <div className="mt-8 border-t border-border pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ACEPLACE. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
