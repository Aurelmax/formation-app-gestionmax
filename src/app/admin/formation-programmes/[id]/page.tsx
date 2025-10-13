'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Clock, 
  Euro, 
  Target, 
  FileText, 
  User, 
  Phone, 
  Mail, 
  CheckCircle, 
  AlertTriangle,
  BookOpen,
  Download,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface FormationPersonnalisee {
  _id: string;
  title: string;
  code_formation: string;
  statut: string;
  objectifs?: Record<string, unknown>;
  programme_detail?: Array<{
    jour: string;
    duree: string;
    modules: Array<{
      titre: string;
      description?: string;
      duree?: string;
      contenu?: Record<string, unknown>;
    }>;
  }>;
  modalites_acces?: {
    prerequis?: string;
    public_concerne?: string;
    duree?: string;
    horaires?: string;
    delais_mise_en_place?: string;
    tarif?: number;
    modalites_reglement?: string;
  };
  contact_formateur?: {
    nom: string;
    email: string;
    telephone?: string;
    role?: string;
    biographie?: string;
  };
  modalites_pedagogiques?: Record<string, unknown>;
  ressources_dispo?: Array<{
    ressource: string;
    description?: string;
  }>;
  modalites_evaluation?: {
    types_evaluation: Array<{
      type: string;
      description?: string;
    }>;
    plateforme_evaluation?: string;
    grille_analyse?: string;
  };
  sanction_formation?: string;
  niveau_certification?: string;
  accessibilite_handicap?: {
    referent_handicap?: string;
    contact_referent?: string;
    adaptations_proposees?: string;
  };
  cessation_abandon?: {
    conditions_renonciation?: string;
    facturation_abandon?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function FormationPersonnaliseeDetailPage() {
  const [formation, setFormation] = useState<FormationPersonnalisee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const formationId = params.id as string;

  const loadFormation = useCallback(async () => {
    try {
      const response = await fetch(`/api/formation-programmes/${formationId}`);
      const result = await response.json();
      
      if (result.success) {
        setFormation(result.data);
      } else {
        toast.error('Erreur lors du chargement de la formation');
        router.push('/admin/formation-programmes');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la formation:', error);
      toast.error('Erreur lors du chargement de la formation');
      router.push('/admin/formation-programmes');
    } finally {
      setIsLoading(false);
    }
  }, [formationId, router]);

  useEffect(() => {
    if (formationId) {
      loadFormation();
    }
  }, [formationId, loadFormation]);

  const handleDelete = async () => {
    if (!formation) return;
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la formation "${formation.title}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/formation-programmes/${formationId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la suppression');
      }

      toast.success('Formation supprimée avec succès !');
      router.push('/admin/formation-programmes');
    } catch (error: unknown) {
      console.error('Erreur lors de la suppression:', error);
      toast.error((error as Error).message || 'Erreur lors de la suppression de la formation');
    }
  };

  const handleDownloadPDF = async () => {
    if (!formation) return;

    try {
      const response = await fetch(`/api/formation-programmes/${formationId}/pdf`, {
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
      a.download = `${formation.title.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Document téléchargé avec succès !');
    } catch (error: unknown) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error(error.message || 'Erreur lors du téléchargement du document');
    }
  };

  const formatRichText = (richText: Record<string, unknown>): string => {
    if (!richText || !richText.root || !richText.root.children) {
      return '';
    }
    
    return (richText.root.children as unknown[]).map((child: unknown) => {
      const childObj = child as { type: string; children?: unknown[] };
      if (childObj.type === 'p') {
        return (childObj.children || []).map((textChild: unknown) => {
          const textObj = textChild as { text?: string };
          return textObj.text || '';
        }).join('');
      }
      return '';
    }).join('\n');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement de la formation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!formation) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Formation non trouvée</h1>
          <p className="text-muted-foreground mb-4">La formation demandée n&apos;existe pas ou a été supprimée.</p>
          <Button onClick={() => router.push('/admin/formation-programmes')}>
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
          <Button variant="outline" onClick={() => router.push('/admin/formation-programmes')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{formation.title}</h1>
            <p className="text-muted-foreground">Code: {formation.code_formation}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/admin/formation-programmes/${formationId}/edit`}>
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
          {/* Objectifs */}
          {formation.objectifs && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Objectifs pédagogiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{formatRichText(formation.objectifs)}</p>
              </CardContent>
            </Card>
          )}

          {/* Programme détaillé */}
          {formation.programme_detail && formation.programme_detail.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Programme détaillé
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formation.programme_detail.map((jour, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-blue-50">
                    <h3 className="font-semibold text-blue-900 mb-3">{jour.jour} - {jour.duree}</h3>
                    {jour.modules && jour.modules.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="ml-4 mb-3">
                        <h4 className="font-medium text-blue-800">{module.titre}{module.duree && ` (${module.duree})`}</h4>
                        {module.description && (
                          <p className="text-sm text-blue-700 mt-1">{module.description}</p>
                        )}
                        {module.contenu && (
                          <div className="text-sm text-blue-700 mt-2 whitespace-pre-line">
                            {formatRichText(module.contenu)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Modalités pédagogiques */}
          {formation.modalites_pedagogiques && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Modalités pédagogiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{formatRichText(formation.modalites_pedagogiques)}</p>
              </CardContent>
            </Card>
          )}

          {/* Ressources */}
          {formation.ressources_dispo && formation.ressources_dispo.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Ressources disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {formation.ressources_dispo.map((ressource, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <div>
                        <span className="font-medium">{ressource.ressource}</span>
                        {ressource.description && (
                          <span className="text-muted-foreground"> - {ressource.description}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Évaluation */}
          {formation.modalites_evaluation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Modalités d&apos;évaluation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formation.modalites_evaluation.types_evaluation && formation.modalites_evaluation.types_evaluation.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Types d&apos;évaluation</h4>
                    <ul className="space-y-1">
                      {formation.modalites_evaluation.types_evaluation.map((evaluation, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <div>
                            <span className="font-medium">{evaluation.type}</span>
                            {evaluation.description && (
                              <span className="text-muted-foreground"> - {evaluation.description}</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {formation.modalites_evaluation.plateforme_evaluation && (
                  <div>
                    <h4 className="font-semibold mb-1">Plateforme d&apos;évaluation</h4>
                    <p className="text-muted-foreground">{formation.modalites_evaluation.plateforme_evaluation}</p>
                  </div>
                )}
                {formation.modalites_evaluation.grille_analyse && (
                  <div>
                    <h4 className="font-semibold mb-1">Grille d&apos;analyse</h4>
                    <p className="text-muted-foreground">{formation.modalites_evaluation.grille_analyse}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Accessibilité et conditions */}
          {(formation.accessibilite_handicap || formation.cessation_abandon) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Accessibilité et conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formation.accessibilite_handicap && (
                  <div>
                    <h4 className="font-semibold mb-2">Accessibilité handicap</h4>
                    {formation.accessibilite_handicap.referent_handicap && (
                      <p><strong>Référent:</strong> {formation.accessibilite_handicap.referent_handicap}</p>
                    )}
                    {formation.accessibilite_handicap.contact_referent && (
                      <p><strong>Contact:</strong> {formation.accessibilite_handicap.contact_referent}</p>
                    )}
                    {formation.accessibilite_handicap.adaptations_proposees && (
                      <p className="whitespace-pre-line">{formation.accessibilite_handicap.adaptations_proposees}</p>
                    )}
                  </div>
                )}
                {formation.cessation_abandon && (
                  <div>
                    <h4 className="font-semibold mb-2">Conditions d&apos;abandon</h4>
                    {formation.cessation_abandon.conditions_renonciation && (
                      <p><strong>Conditions de renonciation:</strong> {formation.cessation_abandon.conditions_renonciation}</p>
                    )}
                    {formation.cessation_abandon.facturation_abandon && (
                      <p><strong>Facturation:</strong> {formation.cessation_abandon.facturation_abandon}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
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
                <Badge variant={
                  formation.statut === 'FINALISEE' ? 'default' :
                  formation.statut === 'LIVREE' ? 'outline' :
                  formation.statut === 'ARCHIVE' ? 'destructive' :
                  'secondary'
                }>
                  {formation.statut === 'EN_COURS' ? 'En cours' :
                   formation.statut === 'FINALISEE' ? 'Finalisée' :
                   formation.statut === 'LIVREE' ? 'Livrée' :
                   formation.statut === 'ARCHIVE' ? 'Archivée' :
                   formation.statut}
                </Badge>
              </div>
              
              {formation.modalites_acces?.duree && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Durée
                  </span>
                  <span className="font-semibold">{formation.modalites_acces.duree}</span>
                </div>
              )}
              
              {formation.modalites_acces?.tarif && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Euro className="h-4 w-4" />
                    Tarif
                  </span>
                  <span className="font-semibold">{formation.modalites_acces.tarif}€</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations pratiques */}
          <Card>
            <CardHeader>
              <CardTitle>Informations pratiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formation.modalites_acces?.horaires && (
                <div>
                  <h4 className="font-semibold mb-1">Horaires</h4>
                  <p className="text-sm text-muted-foreground">{formation.modalites_acces.horaires}</p>
                </div>
              )}
              
              {formation.modalites_acces?.delais_mise_en_place && (
                <div>
                  <h4 className="font-semibold mb-1">Délais de mise en place</h4>
                  <p className="text-sm text-muted-foreground">{formation.modalites_acces.delais_mise_en_place}</p>
                </div>
              )}
              
              {formation.modalites_acces?.modalites_reglement && (
                <div>
                  <h4 className="font-semibold mb-1">Modalités de règlement</h4>
                  <p className="text-sm text-muted-foreground">{formation.modalites_acces.modalites_reglement}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact formateur */}
          {formation.contact_formateur && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact formateur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold">{formation.contact_formateur.nom}</h4>
                  {formation.contact_formateur.role && (
                    <p className="text-sm text-muted-foreground">{formation.contact_formateur.role}</p>
                  )}
                </div>
                
                {formation.contact_formateur.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${formation.contact_formateur.email}`} className="text-sm text-blue-600 hover:underline">
                      {formation.contact_formateur.email}
                    </a>
                  </div>
                )}
                
                {formation.contact_formateur.telephone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${formation.contact_formateur.telephone}`} className="text-sm text-blue-600 hover:underline">
                      {formation.contact_formateur.telephone}
                    </a>
                  </div>
                )}
                
                {formation.contact_formateur.biographie && (
                  <div>
                    <h4 className="font-semibold mb-1">Biographie</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{formation.contact_formateur.biographie}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Certification */}
          {(formation.sanction_formation || formation.niveau_certification) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Certification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {formation.sanction_formation && (
                  <div>
                    <h4 className="font-semibold mb-1">Sanction</h4>
                    <p className="text-sm text-muted-foreground">{formation.sanction_formation}</p>
                  </div>
                )}
                {formation.niveau_certification && (
                  <div>
                    <h4 className="font-semibold mb-1">Niveau</h4>
                    <p className="text-sm text-muted-foreground">{formation.niveau_certification}</p>
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
