'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Clock, 
  Euro, 
  Users, 
  Target, 
  FileText, 
  User, 
  Phone, 
  Mail, 
  CheckCircle, 
  AlertTriangle,
  BookOpen,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface Programme {
  _id: string;
  codeFormation: string;
  titre: string;
  description: string;
  objectifs?: string;
  prerequis?: string;
  publicConcerne?: string;
  duree: number;
  horaires?: string;
  delaisMiseEnPlace?: string;
  niveau: string;
  modalites: string;
  prix: number;
  modalitesReglement?: string;
  statut: string;
  competences: string[];
  ressources?: string[];
  modalitesEvaluation?: string;
  sanctionFormation?: string;
  niveauCertification?: string;
  accessibiliteHandicap?: string;
  cessationAbandon?: string;
  formateurNom?: string;
  formateurEmail?: string;
  formateurTelephone?: string;
  formateurRole?: string;
  formateurBiographie?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProgrammeDetailPage() {
  const [programme, setProgramme] = useState<Programme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const programmeId = params.id as string;

  useEffect(() => {
    if (programmeId) {
      loadProgramme();
    }
  }, [programmeId]);

  const loadProgramme = async () => {
    try {
      const response = await fetch(`/api/programmes/${programmeId}`);
      const result = await response.json();
      
      if (result.success) {
        setProgramme(result.data);
      } else {
        toast.error('Erreur lors du chargement du programme');
        router.push('/admin/programmes');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du programme:', error);
      toast.error('Erreur lors du chargement du programme');
      router.push('/admin/programmes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!programme) return;
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le programme "${programme.titre}" ?`)) {
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
      router.push('/admin/programmes');
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast.error(error.message || 'Erreur lors de la suppression du programme');
    }
  };

  const handleDownloadPDF = async () => {
    if (!programme) return;

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
      a.download = `${programme.titre.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Document téléchargé avec succès !');
    } catch (error: any) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error(error.message || 'Erreur lors du téléchargement du document');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement du programme...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!programme) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Programme non trouvé</h1>
          <p className="text-muted-foreground mb-4">Le programme demandé n'existe pas ou a été supprimé.</p>
          <Button onClick={() => router.push('/admin/programmes')}>
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header avec actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/admin/programmes')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{programme.titre}</h1>
            <p className="text-muted-foreground">Code: {programme.codeFormation}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/admin/programmes/${programmeId}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Link>
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground whitespace-pre-line">{programme.description}</p>
              </div>
              
              {programme.objectifs && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Objectifs pédagogiques
                  </h4>
                  <p className="text-muted-foreground whitespace-pre-line">{programme.objectifs}</p>
                </div>
              )}

              {programme.prerequis && (
                <div>
                  <h4 className="font-semibold mb-2">Prérequis</h4>
                  <p className="text-muted-foreground whitespace-pre-line">{programme.prerequis}</p>
                </div>
              )}

              {programme.publicConcerne && (
                <div>
                  <h4 className="font-semibold mb-2">Public concerné</h4>
                  <p className="text-muted-foreground whitespace-pre-line">{programme.publicConcerne}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Compétences */}
          {programme.competences && programme.competences.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Compétences développées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {programme.competences.map((competence) => (
                    <Badge key={competence} variant="secondary">
                      {competence}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ressources */}
          {programme.ressources && programme.ressources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Ressources et matériel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {programme.ressources.map((ressource, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{ressource}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Évaluation et certification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Évaluation et certification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {programme.modalitesEvaluation && (
                <div>
                  <h4 className="font-semibold mb-2">Modalités d'évaluation</h4>
                  <p className="text-muted-foreground whitespace-pre-line">{programme.modalitesEvaluation}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {programme.sanctionFormation && (
                  <div>
                    <h4 className="font-semibold mb-2">Sanction de la formation</h4>
                    <p className="text-muted-foreground">{programme.sanctionFormation}</p>
                  </div>
                )}
                
                {programme.niveauCertification && (
                  <div>
                    <h4 className="font-semibold mb-2">Niveau/Certification</h4>
                    <p className="text-muted-foreground">{programme.niveauCertification}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Accessibilité et conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Accessibilité et conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {programme.accessibiliteHandicap && (
                <div>
                  <h4 className="font-semibold mb-2">Accessibilité handicap</h4>
                  <p className="text-muted-foreground whitespace-pre-line">{programme.accessibiliteHandicap}</p>
                </div>
              )}

              {programme.cessationAbandon && (
                <div>
                  <h4 className="font-semibold mb-2">Cessation anticipée/Abandon</h4>
                  <p className="text-muted-foreground whitespace-pre-line">{programme.cessationAbandon}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statut et caractéristiques */}
          <Card>
            <CardHeader>
              <CardTitle>Caractéristiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Statut</span>
                <Badge variant={programme.statut === 'PUBLIE' ? 'default' : 'secondary'}>
                  {programme.statut}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Durée
                </span>
                <span className="font-semibold">{programme.duree}h</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Euro className="h-4 w-4" />
                  Prix
                </span>
                <span className="font-semibold">{formatCurrency(programme.prix)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Niveau</span>
                <Badge variant="outline">{programme.niveau}</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Modalités</span>
                <Badge variant="outline">{programme.modalites}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Informations pratiques */}
          <Card>
            <CardHeader>
              <CardTitle>Informations pratiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {programme.horaires && (
                <div>
                  <h4 className="font-semibold mb-1">Horaires</h4>
                  <p className="text-sm text-muted-foreground">{programme.horaires}</p>
                </div>
              )}
              
              {programme.delaisMiseEnPlace && (
                <div>
                  <h4 className="font-semibold mb-1">Délais de mise en place</h4>
                  <p className="text-sm text-muted-foreground">{programme.delaisMiseEnPlace}</p>
                </div>
              )}
              
              {programme.modalitesReglement && (
                <div>
                  <h4 className="font-semibold mb-1">Modalités de règlement</h4>
                  <p className="text-sm text-muted-foreground">{programme.modalitesReglement}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact formateur */}
          {programme.formateurNom && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact formateur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold">{programme.formateurNom}</h4>
                  {programme.formateurRole && (
                    <p className="text-sm text-muted-foreground">{programme.formateurRole}</p>
                  )}
                </div>
                
                {programme.formateurEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${programme.formateurEmail}`} className="text-sm text-blue-600 hover:underline">
                      {programme.formateurEmail}
                    </a>
                  </div>
                )}
                
                {programme.formateurTelephone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${programme.formateurTelephone}`} className="text-sm text-blue-600 hover:underline">
                      {programme.formateurTelephone}
                    </a>
                  </div>
                )}
                
                {programme.formateurBiographie && (
                  <div>
                    <h4 className="font-semibold mb-1">Biographie</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{programme.formateurBiographie}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}