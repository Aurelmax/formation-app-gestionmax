'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface FormationAccessModalitiesProps {
  formData: {
    modalites_acces: {
      prerequis: string;
      public_concerne: string;
      duree: string;
      horaires: string;
      delais_mise_en_place: string;
      tarif: number;
      modalites_reglement: string;
    };
  };
  onNestedInputChange: (parent: string, field: string, value: unknown) => void;
}

export function FormationAccessModalities({ formData, onNestedInputChange }: FormationAccessModalitiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Modalités d&apos;accès
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="prerequis">Prérequis</Label>
            <Textarea
              id="prerequis"
              value={formData.modalites_acces.prerequis}
              onChange={(e) => onNestedInputChange('modalites_acces', 'prerequis', e.target.value)}
              placeholder="Prérequis nécessaires..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="public_concerne">Public concerné</Label>
            <Textarea
              id="public_concerne"
              value={formData.modalites_acces.public_concerne}
              onChange={(e) => onNestedInputChange('modalites_acces', 'public_concerne', e.target.value)}
              placeholder="Description du public cible..."
              rows={3}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duree">Durée</Label>
            <Input
              id="duree"
              value={formData.modalites_acces.duree}
              onChange={(e) => onNestedInputChange('modalites_acces', 'duree', e.target.value)}
              placeholder="Ex: 14 heures"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="horaires">Horaires</Label>
            <Input
              id="horaires"
              value={formData.modalites_acces.horaires}
              onChange={(e) => onNestedInputChange('modalites_acces', 'horaires', e.target.value)}
              placeholder="Ex: 9h à 13h et de 14h à 17h"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="delais_mise_en_place">Délais de mise en place</Label>
            <Input
              id="delais_mise_en_place"
              value={formData.modalites_acces.delais_mise_en_place}
              onChange={(e) => onNestedInputChange('modalites_acces', 'delais_mise_en_place', e.target.value)}
              placeholder="Ex: À réception de l'accord de prise en charge"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tarif">Tarif (€)</Label>
            <Input
              id="tarif"
              type="number"
              value={formData.modalites_acces.tarif}
              onChange={(e) => onNestedInputChange('modalites_acces', 'tarif', Number(e.target.value))}
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="modalites_reglement">Modalités de règlement</Label>
          <Textarea
            id="modalites_reglement"
            value={formData.modalites_acces.modalites_reglement}
            onChange={(e) => onNestedInputChange('modalites_acces', 'modalites_reglement', e.target.value)}
            placeholder="Modalités de paiement..."
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
}
