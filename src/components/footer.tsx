import { Facebook, Twitter, Instagram, Linkedin, Globe } from "lucide-react";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground w-full py-6">
      <div className="container max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-bold">Made in Mode</h3>
        
        <div className="flex space-x-4">
          <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary"><Facebook size={20} /></a>
          <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></a>
          <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary"><Instagram size={20} /></a>
          <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary"><Linkedin size={20} /></a>
        </div>
        
        <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Français</span>
        </Button>
      </div>
       <div className="mt-4 border-t border-border pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Made in Mode. Tous droits réservés.</p>
        </div>
    </footer>
  );
}
