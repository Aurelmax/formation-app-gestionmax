'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Download } from 'lucide-react';
import { useMainService } from '@/hooks/useApiService';
import { formatCurrency } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function ProgrammesPage() {
  const { service } = useMainService();
  const router = useRouter();
  const [programmes, setProgrammes] = useState<Array<{
    id: string;
    codeFormation: string;
    titre: string;
    description: string;
    duree: number;
    niveau: string;
    modalites: string;
    prix: number;
    statut: string;
    formateurs: string[];
    competences: string[];
    createdAt: Date;
    updatedAt: Date;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgrammes = async () => {
      try {
        const data = await service.getProgrammes();
        setProgrammes(data);
      } catch (error) {
        console.error('Erreur lors du chargement des programmes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProgrammes();
  }, [service]);

  const handleDelete = async (programmeId: string, programmeTitre: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le programme "${programmeTitre}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/programmes/${programmeId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la suppression');
      }

      toast.success('Programme supprimé avec succès !');
      // Recharger la liste
      const data = await service.getProgrammes();
      setProgrammes(data);
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast.error(error.message || 'Erreur lors de la suppression du programme');
    }
  };

  const handleDownloadPDF = async (programmeId: string, programmeTitre: string) => {
    try {
      const response = await fetch(`/api/programmes/${programmeId}/pdf`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du PDF');
      }

      // Créer un blob et télécharger le fichier
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${programmeTitre.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('PDF téléchargé avec succès !');
    } catch (error: any) {
      console.error('Erreur lors du téléchargement du PDF:', error);
      toast.error(error.message || 'Erreur lors du téléchargement du PDF');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Programmes de formation</h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue de formations
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/programmes/nouveau">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau programme
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des programmes...</p>
          </div>
        ) : (
          programmes.map((programme) => (
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
              <p className="text-sm text-muted-foreground overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
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
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/programmes/${programme.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/programmes/${programme.id}/edit`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(programme.id, programme.titre)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => handleDownloadPDF(programme.id, programme.titre)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>
    </div>
  );
}
