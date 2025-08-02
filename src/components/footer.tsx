import { Facebook, Twitter, Instagram, Linkedin, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground w-full mt-12 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold mb-2">TripGlide</h3>
            <p className="text-muted-foreground mb-4">
              Explorez le monde avec nous. Votre prochaine aventure commence ici.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary"><Facebook /></a>
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary"><Twitter /></a>
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary"><Instagram /></a>
              <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary"><Linkedin /></a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Liens rapides</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Accueil</a></li>
              <li><a href="#" className="hover:text-primary">Destinations</a></li>
              <li><a href="#" className="hover:text-primary">À propos</a></li>
              <li><a href="#" className="hover:text-primary">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Newsletter</h4>
            <p className="text-muted-foreground mb-2">
              Abonnez-vous pour recevoir les dernières offres et nouvelles.
            </p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Votre email" className="bg-muted border-none" />
              <Button type="submit" className="bg-primary text-primary-foreground">S'abonner</Button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TripGlide. Tous droits réservés.</p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-primary">Politique de confidentialité</a>
            <a href="#" className="hover:text-primary">Termes d'utilisation</a>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Français</span>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
