'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';

// Import des composants refactorisés
import { FormationBasicInfo } from './forms/FormationBasicInfo';
import { FormationAccessModalities } from './forms/FormationAccessModalities';
import { FormationTrainerInfo } from './forms/FormationTrainerInfo';
import { FormationEvaluation } from './forms/FormationEvaluation';
import { FormationAbandonConditions } from './forms/FormationAbandonConditions';

interface FormationPersonnalisee {
  id?: string;
  title: string;
  code_formation: string;
  statut: 'EN_COURS' | 'FINALISEE' | 'LIVREE' | 'ARCHIVE';
  objectifs: Record<string, unknown>;
  programme_detail: Array<{
    jour: string;
    duree: string;
    modules: Array<{
      titre: string;
      description: string;
      duree: string;
      contenu: Record<string, unknown>;
    }>;
  }>;
  modalites_acces: {
    prerequis: string;
    public_concerne: string;
    duree: string;
    horaires: string;
    delais_mise_en_place: string;
    tarif: number;
    modalites_reglement: string;
  };
  contact_formateur: {
    nom: string;
    email: string;
    telephone: string;
    role: string;
    biographie: string;
  };
  modalites_pedagogiques: Record<string, unknown>;
  ressources_dispo: Array<{
    ressource: string;
    description: string;
  }>;
  modalites_evaluation: {
    types_evaluation: Array<{
      type: string;
      description: string;
    }>;
    plateforme_evaluation: string;
    grille_analyse: string;
  };
  sanction_formation: string;
  niveau_certification: string;
  accessibilite_handicap: {
    referent_handicap: string;
    contact_referent: string;
    adaptations_proposees: string;
  };
  cessation_abandon: {
    conditions_renonciation: string;
    facturation_abandon: string;
  };
}

interface FormationPersonnaliseeFormProps {
  formation?: FormationPersonnalisee;
  onSave: (formation: FormationPersonnalisee) => void;
  onCancel: () => void;
  isLoading?: boolean;
  rdvData?: Record<string, unknown>;
}

export function FormationPersonnaliseeFormRefactored({ 
  formation, 
  onSave, 
  onCancel, 
  isLoading = false, 
  rdvData 
}: FormationPersonnaliseeFormProps) {
  const [formData, setFormData] = useState<FormationPersonnalisee>({
    title: formation?.title || (rdvData ? `${(rdvData['programmeTitre'] as string) || ''} - ${(rdvData['client'] as Record<string, unknown>)?.['prenom']} ${(rdvData['client'] as Record<string, unknown>)?.['nom']}` : ''),
    code_formation: formation?.code_formation || (rdvData ? `A${Date.now().toString().slice(-6)}-${((rdvData['client'] as Record<string, unknown>)?.['nom'] as string)?.toUpperCase()}` : ''),
    statut: formation?.statut || 'EN_COURS',
    objectifs: formation?.objectifs || { root: { type: 'root', children: [] } },
    programme_detail: formation?.programme_detail || [
      {
        jour: 'Jour 1',
        duree: '7 heures',
        modules: [
          {
            titre: 'Introduction',
            description: 'Présentation et objectifs',
            duree: '1h',
            contenu: { root: { type: 'root', children: [] } }
          }
        ]
      }
    ],
    modalites_acces: formation?.modalites_acces || {
      prerequis: '',
      public_concerne: '',
      duree: '',
      horaires: '',
      delais_mise_en_place: '',
      tarif: 0,
      modalites_reglement: ''
    },
    contact_formateur: formation?.contact_formateur || {
      nom: '',
      email: '',
      telephone: '',
      role: '',
      biographie: ''
    },
    modalites_pedagogiques: formation?.modalites_pedagogiques || { root: { type: 'root', children: [] } },
    ressources_dispo: formation?.ressources_dispo || [],
    modalites_evaluation: formation?.modalites_evaluation || {
      types_evaluation: [],
      plateforme_evaluation: '',
      grille_analyse: ''
    },
    sanction_formation: formation?.sanction_formation || '',
    niveau_certification: formation?.niveau_certification || '',
    accessibilite_handicap: formation?.accessibilite_handicap || {
      referent_handicap: '',
      contact_referent: '',
      adaptations_proposees: ''
    },
    cessation_abandon: formation?.cessation_abandon || {
      conditions_renonciation: '',
      facturation_abandon: ''
    }
  });

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof FormationPersonnalisee],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.title.trim()) {
      toast.error('Le nom du programme est requis');
      return;
    }
    
    if (!formData.code_formation.trim()) {
      toast.error('Le code formation est requis');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête avec informations RDV si disponibles */}
      {rdvData && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Informations du RDV de positionnement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Client :</strong> {(rdvData.client as Record<string, unknown>)?.prenom} {(rdvData.client as Record<string, unknown>)?.nom}</p>
              <p><strong>Email :</strong> {(rdvData.client as Record<string, unknown>)?.email}</p>
              <p><strong>Programme d&apos;intérêt :</strong> {rdvData.programmeTitre}</p>
              <p><strong>Date du RDV :</strong> {new Date(rdvData.date as string).toLocaleDateString('fr-FR')} à {rdvData.heure}</p>
              {rdvData.notes && <p><strong>Notes :</strong> {rdvData.notes}</p>}
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <FormationBasicInfo 
          formData={formData} 
          onInputChange={handleInputChange} 
        />

        <Separator />

        {/* Modalités d'accès */}
        <FormationAccessModalities 
          formData={formData} 
          onNestedInputChange={handleNestedInputChange} 
        />

        <Separator />

        {/* Informations formateur */}
        <FormationTrainerInfo 
          formData={formData} 
          onNestedInputChange={handleNestedInputChange} 
        />

        <Separator />

        {/* Évaluation */}
        <FormationEvaluation 
          formData={formData} 
          onNestedInputChange={handleNestedInputChange} 
        />

        <Separator />

        {/* Conditions d'abandon */}
        <FormationAbandonConditions 
          formData={formData} 
          onNestedInputChange={handleNestedInputChange} 
        />

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </div>
  );
}
