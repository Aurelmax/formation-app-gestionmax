'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  GraduationCap,
  Clock,
  Euro,
  Users,
  Target,
  FileText,
  BookOpen,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface FormationPersonnalisee {
  id?: string;
  title: string;
  code_formation: string;
  statut: 'EN_COURS' | 'FINALISEE' | 'LIVREE' | 'ARCHIVE';
  objectifs: any; // RichText structure
  programme_detail: Array<{
    jour: string;
    duree: string;
    modules: Array<{
      titre: string;
      description: string;
      duree: string;
      contenu: any; // RichText structure
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
  modalites_pedagogiques: any; // RichText structure
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
  rdvData?: any;
}

export function FormationPersonnaliseeForm({ formation, onSave, onCancel, isLoading = false, rdvData }: FormationPersonnaliseeFormProps) {
  const [formData, setFormData] = useState<FormationPersonnalisee>({
    title: formation?.title || (rdvData ? `${rdvData.programmeTitre} - ${rdvData.client?.prenom} ${rdvData.client?.nom}` : ''),
    code_formation: formation?.code_formation || (rdvData ? `A${Date.now().toString().slice(-6)}-${rdvData.client?.nom?.toUpperCase()}` : ''),
    statut: formation?.statut || 'EN_COURS',
    objectifs: formation?.objectifs || { root: { type: 'root', children: [] } },
    programme_detail: formation?.programme_detail || [
      {
        jour: 'Jour 1',
        duree: '7 heures',
        modules: [
          {
            titre: 'Introduction',
            description: 'Introduction à la formation',
            duree: '2h',
            contenu: { root: { type: 'root', children: [] } }
          }
        ]
      }
    ],
    modalites_acces: {
      prerequis: formation?.modalites_acces?.prerequis || '',
      public_concerne: formation?.modalites_acces?.public_concerne || '',
      duree: formation?.modalites_acces?.duree || '',
      horaires: formation?.modalites_acces?.horaires || '',
      delais_mise_en_place: formation?.modalites_acces?.delais_mise_en_place || '',
      tarif: formation?.modalites_acces?.tarif || 0,
      modalites_reglement: formation?.modalites_acces?.modalites_reglement || ''
    },
    contact_formateur: {
      nom: formation?.contact_formateur?.nom || 'Aurélien LAVAYSSIERE',
      email: formation?.contact_formateur?.email || 'aurelien@gestionmax.fr',
      telephone: formation?.contact_formateur?.telephone || '06.46.02.24.68',
      role: formation?.contact_formateur?.role || 'Consultant formateur en informatique de gestion',
      biographie: formation?.contact_formateur?.biographie || 'Aurélien LAVAYSSIERE est un consultant formateur en informatique de gestion, spécialisé dans la formation des adultes. Doté d\'une solide expérience dans le domaine de la formation, Aurélien possède une expertise approfondie en matière de technologies web et de gestion d\'entreprise.'
    },
    modalites_pedagogiques: formation?.modalites_pedagogiques || { root: { type: 'root', children: [] } },
    ressources_dispo: formation?.ressources_dispo || [],
    modalites_evaluation: {
      types_evaluation: formation?.modalites_evaluation?.types_evaluation || [],
      plateforme_evaluation: formation?.modalites_evaluation?.plateforme_evaluation || '',
      grille_analyse: formation?.modalites_evaluation?.grille_analyse || ''
    },
    sanction_formation: formation?.sanction_formation || '',
    niveau_certification: formation?.niveau_certification || '',
    accessibilite_handicap: {
      referent_handicap: formation?.accessibilite_handicap?.referent_handicap || '',
      contact_referent: formation?.accessibilite_handicap?.contact_referent || '',
      adaptations_proposees: formation?.accessibilite_handicap?.adaptations_proposees || ''
    },
    cessation_abandon: {
      conditions_renonciation: formation?.cessation_abandon?.conditions_renonciation || '',
      facturation_abandon: formation?.cessation_abandon?.facturation_abandon || ''
    }
  });

  const [newRessource, setNewRessource] = useState('');
  const [newEvaluationType, setNewEvaluationType] = useState('');

  const statuts = [
    { value: 'EN_COURS', label: 'En cours' },
    { value: 'FINALISEE', label: 'Finalisée' },
    { value: 'LIVREE', label: 'Livrée' },
    { value: 'ARCHIVE', label: 'Archivée' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof FormationPersonnalisee],
        [field]: value
      }
    }));
  };

  const handleAddRessource = () => {
    if (newRessource.trim()) {
      setFormData(prev => ({
        ...prev,
        ressources_dispo: [
          ...prev.ressources_dispo,
          { ressource: newRessource.trim(), description: '' }
        ]
      }));
      setNewRessource('');
    }
  };

  const handleRemoveRessource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ressources_dispo: prev.ressources_dispo.filter((_, i) => i !== index)
    }));
  };

  const handleAddEvaluationType = () => {
    if (newEvaluationType.trim()) {
      setFormData(prev => ({
        ...prev,
        modalites_evaluation: {
          ...prev.modalites_evaluation,
          types_evaluation: [
            ...prev.modalites_evaluation.types_evaluation,
            { type: newEvaluationType.trim(), description: '' }
          ]
        }
      }));
      setNewEvaluationType('');
    }
  };

  const handleRemoveEvaluationType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      modalites_evaluation: {
        ...prev.modalites_evaluation,
        types_evaluation: prev.modalites_evaluation.types_evaluation.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.code_formation.trim()) {
      toast.error('Le code formation est obligatoire');
      return;
    }
    
    if (!formData.title.trim()) {
      toast.error('Le titre est obligatoire');
      return;
    }
    
    if (!formData.contact_formateur.nom.trim()) {
      toast.error('Le nom du formateur est obligatoire');
      return;
    }
    
    if (!formData.contact_formateur.email.trim()) {
      toast.error('L\'email du formateur est obligatoire');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            {formation ? 'Modifier la formation personnalisée' : 'Nouvelle formation personnalisée'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informations générales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Informations générales
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code_formation">Code formation *</Label>
                  <Input
                    id="code_formation"
                    value={formData.code_formation}
                    onChange={(e) => handleInputChange('code_formation', e.target.value)}
                    placeholder="Ex: A001-WP-DD"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="statut">Statut</Label>
                  <Select value={formData.statut} onValueChange={(value: any) => handleInputChange('statut', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuts.map((statut) => (
                        <SelectItem key={statut.value} value={statut.value}>
                          {statut.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Titre de la formation *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Création de site WordPress"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objectifs">Objectifs pédagogiques</Label>
                <Textarea
                  id="objectifs"
                  value={JSON.stringify(formData.objectifs)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      handleInputChange('objectifs', parsed);
                    } catch {
                      // Ignore invalid JSON
                    }
                  }}
                  placeholder="Objectifs pédagogiques (format JSON)..."
                  rows={4}
                />
              </div>
            </div>

            <Separator />

            {/* Modalités d'accès */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-4 w-4" />
                Modalités d'accès
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prerequis">Prérequis</Label>
                  <Textarea
                    id="prerequis"
                    value={formData.modalites_acces.prerequis}
                    onChange={(e) => handleNestedInputChange('modalites_acces', 'prerequis', e.target.value)}
                    placeholder="Prérequis nécessaires..."
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="public_concerne">Public concerné</Label>
                  <Textarea
                    id="public_concerne"
                    value={formData.modalites_acces.public_concerne}
                    onChange={(e) => handleNestedInputChange('modalites_acces', 'public_concerne', e.target.value)}
                    placeholder="Public cible..."
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duree">Durée</Label>
                  <Input
                    id="duree"
                    value={formData.modalites_acces.duree}
                    onChange={(e) => handleNestedInputChange('modalites_acces', 'duree', e.target.value)}
                    placeholder="Ex: 14 heures"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="horaires">Horaires</Label>
                  <Input
                    id="horaires"
                    value={formData.modalites_acces.horaires}
                    onChange={(e) => handleNestedInputChange('modalites_acces', 'horaires', e.target.value)}
                    placeholder="Ex: 9h à 13h et 14h à 17h"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tarif" className="flex items-center gap-2">
                    <Euro className="h-4 w-4" />
                    Tarif (€)
                  </Label>
                  <Input
                    id="tarif"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.modalites_acces.tarif}
                    onChange={(e) => handleNestedInputChange('modalites_acces', 'tarif', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delais_mise_en_place">Délais de mise en place</Label>
                <Input
                  id="delais_mise_en_place"
                  value={formData.modalites_acces.delais_mise_en_place}
                  onChange={(e) => handleNestedInputChange('modalites_acces', 'delais_mise_en_place', e.target.value)}
                  placeholder="Ex: À réception de l'accord de prise en charge"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modalites_reglement">Modalités de règlement</Label>
                <Textarea
                  id="modalites_reglement"
                  value={formData.modalites_acces.modalites_reglement}
                  onChange={(e) => handleNestedInputChange('modalites_acces', 'modalites_reglement', e.target.value)}
                  placeholder="Modalités de règlement..."
                  rows={2}
                />
              </div>
            </div>

            <Separator />

            {/* Contact formateur */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Contact formateur
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="formateur_nom">Nom du formateur *</Label>
                  <Input
                    id="formateur_nom"
                    value={formData.contact_formateur.nom}
                    onChange={(e) => handleNestedInputChange('contact_formateur', 'nom', e.target.value)}
                    placeholder="Ex: Aurélien LAVAYSSIERE"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="formateur_role">Rôle/Fonction</Label>
                  <Input
                    id="formateur_role"
                    value={formData.contact_formateur.role}
                    onChange={(e) => handleNestedInputChange('contact_formateur', 'role', e.target.value)}
                    placeholder="Ex: Consultant formateur"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="formateur_email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email *
                  </Label>
                  <Input
                    id="formateur_email"
                    type="email"
                    value={formData.contact_formateur.email}
                    onChange={(e) => handleNestedInputChange('contact_formateur', 'email', e.target.value)}
                    placeholder="aurelien@gestionmax.fr"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="formateur_telephone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone
                  </Label>
                  <Input
                    id="formateur_telephone"
                    value={formData.contact_formateur.telephone}
                    onChange={(e) => handleNestedInputChange('contact_formateur', 'telephone', e.target.value)}
                    placeholder="06.46.02.24.68"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="formateur_biographie">Biographie</Label>
                <Textarea
                  id="formateur_biographie"
                  value={formData.contact_formateur.biographie}
                  onChange={(e) => handleNestedInputChange('contact_formateur', 'biographie', e.target.value)}
                  placeholder="Biographie du formateur..."
                  rows={3}
                />
              </div>
            </div>

            <Separator />

            {/* Ressources disponibles */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Ressources disponibles
              </h3>
              
              <div className="flex gap-2">
                <Input
                  value={newRessource}
                  onChange={(e) => setNewRessource(e.target.value)}
                  placeholder="Ajouter une ressource..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRessource())}
                />
                <Button type="button" onClick={handleAddRessource} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.ressources_dispo.length > 0 && (
                <div className="space-y-3">
                  {formData.ressources_dispo.map((ressource, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-2">
                        <Input
                          value={ressource.ressource}
                          onChange={(e) => {
                            const newRessources = [...formData.ressources_dispo];
                            newRessources[index].ressource = e.target.value;
                            setFormData(prev => ({ ...prev, ressources_dispo: newRessources }));
                          }}
                          placeholder="Nom de la ressource"
                        />
                        <Input
                          value={ressource.description}
                          onChange={(e) => {
                            const newRessources = [...formData.ressources_dispo];
                            newRessources[index].description = e.target.value;
                            setFormData(prev => ({ ...prev, ressources_dispo: newRessources }));
                          }}
                          placeholder="Description"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveRessource(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Évaluation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Modalités d'évaluation
              </h3>
              
              <div className="flex gap-2">
                <Input
                  value={newEvaluationType}
                  onChange={(e) => setNewEvaluationType(e.target.value)}
                  placeholder="Ajouter un type d'évaluation..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEvaluationType())}
                />
                <Button type="button" onClick={handleAddEvaluationType} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.modalites_evaluation.types_evaluation.length > 0 && (
                <div className="space-y-3">
                  {formData.modalites_evaluation.types_evaluation.map((evalType, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-2">
                        <Input
                          value={evalType.type}
                          onChange={(e) => {
                            const newTypes = [...formData.modalites_evaluation.types_evaluation];
                            newTypes[index].type = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              modalites_evaluation: {
                                ...prev.modalites_evaluation,
                                types_evaluation: newTypes
                              }
                            }));
                          }}
                          placeholder="Type d'évaluation"
                        />
                        <Input
                          value={evalType.description}
                          onChange={(e) => {
                            const newTypes = [...formData.modalites_evaluation.types_evaluation];
                            newTypes[index].description = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              modalites_evaluation: {
                                ...prev.modalites_evaluation,
                                types_evaluation: newTypes
                              }
                            }));
                          }}
                          placeholder="Description"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveEvaluationType(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plateforme_evaluation">Plateforme d'évaluation</Label>
                  <Input
                    id="plateforme_evaluation"
                    value={formData.modalites_evaluation.plateforme_evaluation}
                    onChange={(e) => handleNestedInputChange('modalites_evaluation', 'plateforme_evaluation', e.target.value)}
                    placeholder="Ex: EVALBOX"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="grille_analyse">Grille d'analyse</Label>
                  <Input
                    id="grille_analyse"
                    value={formData.modalites_evaluation.grille_analyse}
                    onChange={(e) => handleNestedInputChange('modalites_evaluation', 'grille_analyse', e.target.value)}
                    placeholder="Ex: Grille d'analyse des compétences"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Certification et accessibilité */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Certification et accessibilité
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sanction_formation">Sanction de la formation</Label>
                  <Input
                    id="sanction_formation"
                    value={formData.sanction_formation}
                    onChange={(e) => handleInputChange('sanction_formation', e.target.value)}
                    placeholder="Ex: Certificat de réalisation"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="niveau_certification">Niveau/Certification</Label>
                  <Input
                    id="niveau_certification"
                    value={formData.niveau_certification}
                    onChange={(e) => handleInputChange('niveau_certification', e.target.value)}
                    placeholder="Ex: Aucune"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Accessibilité handicap</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="referent_handicap">Référent handicap</Label>
                    <Input
                      id="referent_handicap"
                      value={formData.accessibilite_handicap.referent_handicap}
                      onChange={(e) => handleNestedInputChange('accessibilite_handicap', 'referent_handicap', e.target.value)}
                      placeholder="Nom du référent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact_referent">Contact référent</Label>
                    <Input
                      id="contact_referent"
                      value={formData.accessibilite_handicap.contact_referent}
                      onChange={(e) => handleNestedInputChange('accessibilite_handicap', 'contact_referent', e.target.value)}
                      placeholder="Email et téléphone"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adaptations_proposees">Adaptations proposées</Label>
                  <Textarea
                    id="adaptations_proposees"
                    value={formData.accessibilite_handicap.adaptations_proposees}
                    onChange={(e) => handleNestedInputChange('accessibilite_handicap', 'adaptations_proposees', e.target.value)}
                    placeholder="Décrivez les adaptations proposées..."
                    rows={2}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Cessation anticipée/Abandon</h4>
                <div className="space-y-2">
                  <Label htmlFor="conditions_renonciation">Conditions de renonciation</Label>
                  <Textarea
                    id="conditions_renonciation"
                    value={formData.cessation_abandon.conditions_renonciation}
                    onChange={(e) => handleNestedInputChange('cessation_abandon', 'conditions_renonciation', e.target.value)}
                    placeholder="Conditions avant le début de formation..."
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="facturation_abandon">Facturation en cas d'abandon</Label>
                  <Textarea
                    id="facturation_abandon"
                    value={formData.cessation_abandon.facturation_abandon}
                    onChange={(e) => handleNestedInputChange('cessation_abandon', 'facturation_abandon', e.target.value)}
                    placeholder="Modalités de facturation en cours de formation..."
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Enregistrement...' : formation ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
