import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Mail, Phone } from 'lucide-react';
import { MockService } from '@/lib/mock-service';

export default async function ApprenantsPage() {
  const apprenants = await MockService.getApprenants();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Apprenants</h1>
          <p className="text-muted-foreground">
            Gérez vos apprenants et leur progression
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel apprenant
        </Button>
      </div>

      <div className="space-y-4">
        {apprenants.map((apprenant) => (
          <Card key={apprenant.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {apprenant.prenom[0]}
                    {apprenant.nom[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {apprenant.prenom} {apprenant.nom}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {apprenant.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {apprenant.telephone}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{apprenant.progression}%</p>
                  <p className="text-xs text-muted-foreground">Progression</p>
                </div>
                <Badge
                  variant={apprenant.statut === 'ACTIF' ? 'default' : 'secondary'}
                >
                  {apprenant.statut}
                </Badge>
                <Button variant="outline">Voir profil</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
