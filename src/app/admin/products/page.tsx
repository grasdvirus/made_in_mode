
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import tours from "@/data/tours.json";
import { PlusCircle } from "lucide-react"
import Image from "next/image"

// This page reads data directly from the local JSON file.
// In a real application, this would fetch data from a database.

export default function AdminProductsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Circuits à venir</CardTitle>
                <CardDescription>Gérez les circuits à venir affichés sur la page Découvrir.</CardDescription>
            </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un circuit
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead className="hidden md:table-cell">
                Avis
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tours.map((tour) => (
              <TableRow key={tour.name}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={tour.name}
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={tour.image}
                    width="64"
                    data-ai-hint={tour.hint}
                  />
                </TableCell>
                <TableCell className="font-medium">{tour.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">FCFA {tour.price.toLocaleString('fr-FR')}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {tour.reviews}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm">Modifier</Button>
                    <Button variant="destructive" size="sm">Supprimer</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
