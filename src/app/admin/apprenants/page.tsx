'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Mail, Phone } from 'lucide-react';
import { MockService } from '@/lib/mock-service';
import { useState, useEffect } from 'react';

export default function ApprenantsPage() {
  const [apprenants, setApprenants] = useState<Array<{
    id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    dateNaissance: string;
    adresse: string;
    statut: string;
    programmes: string[];
    progression: number;
    createdAt: Date;
    updatedAt: Date;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadApprenants = async () => {
      try {
        const data = await MockService.getApprenants();
        setApprenants(data);
      } catch (error) {
        console.error('Erreur lors du chargement des apprenants:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadApprenants();
  }, []);

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
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des apprenants...</p>
          </div>
        ) : (
          apprenants.map((apprenant) => (
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
          ))
        )}
      </div>
    </div>
  );
}
