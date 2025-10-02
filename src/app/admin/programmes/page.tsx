import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { MockService } from '@/lib/mock-service';
import { formatCurrency } from '@/lib/utils';

export default async function ProgrammesPage() {
  const programmes = await MockService.getProgrammes();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Programmes de formation</h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue de formations
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau programme
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programmes.map((programme) => (
          <Card key={programme.id} className="hover:shadow-lg transition">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{programme.titre}</CardTitle>
                <Badge variant={programme.statut === 'PUBLIE' ? 'default' : 'secondary'}>
                  {programme.statut}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {programme.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {programme.competences.slice(0, 3).map((comp) => (
                  <Badge key={comp} variant="outline">
                    {comp}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Durée</p>
                  <p className="font-semibold">{programme.duree}h</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Prix</p>
                  <p className="font-semibold">
                    {formatCurrency(programme.prix)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Niveau</p>
                  <p className="font-semibold">{programme.niveau}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/admin/programmes/${programme.id}`}>
                  Voir détails
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
