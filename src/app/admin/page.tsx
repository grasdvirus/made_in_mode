
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Bienvenue, Admin !</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aperçu</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Ici vous pouvez voir un résumé des activités du site.</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Graphiques et données sur les ventes et les utilisateurs.</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Liens pour ajouter un produit, voir les commandes, etc.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
