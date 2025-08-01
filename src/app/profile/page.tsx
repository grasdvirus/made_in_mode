
'use client';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {

  return (
      <div className="bg-background rounded-t-3xl p-6 min-h-[80vh] shadow-2xl">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Paramètres</h2>
          <div className="flex items-center justify-between">
            <Label className="text-lg">
              Section Profil
            </Label>
            <p className="text-muted-foreground">Plus de paramètres à venir.</p>
          </div>
        </div>
      </div>
  );
}
