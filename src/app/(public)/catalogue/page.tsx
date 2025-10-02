import { PublicLayout } from '@/components/layouts/public/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MockService } from '@/lib/mock-service';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

export default async function CataloguePage() {
  const programmes = await MockService.getProgrammes();

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20 overflow-hidden">
        <Image
          src="/formation-wordpress-antibes.webp"
          alt="Formation WordPress Antibes"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Catalogue de Formations</h1>
          <p className="text-xl text-gray-100 max-w-4xl mx-auto">
            Découvrez notre catalogue complet de formations WordPress professionnelles. 
            Formations éligibles CPF, adaptées aux entreprises et particuliers.
          </p>
        </div>
      </section>

      {/* Filtres et programmes */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programmes.map((programme) => (
              <Card key={programme.id} className="hover:shadow-xl transition">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge>{programme.modalites}</Badge>
                    <Badge variant="outline">{programme.niveau}</Badge>
                  </div>
                  <CardTitle className="text-xl">{programme.titre}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {programme.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {programme.competences.slice(0, 4).map((comp) => (
                      <Badge key={comp} variant="secondary" className="text-xs">
                        {comp}
                      </Badge>
                    ))}
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Durée</span>
                      <span className="font-semibold">{programme.duree}h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tarif</span>
                      <span className="font-semibold text-primary">
                        {formatCurrency(programme.prix)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1" asChild>
                      <Link href="/contact">S'inscrire</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/catalogue/${programme.id}`}>Détails</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
