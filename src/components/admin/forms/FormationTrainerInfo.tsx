'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Mail } from 'lucide-react';

interface FormationTrainerInfoProps {
  formData: {
    contact_formateur: {
      nom: string;
      email: string;
      telephone: string;
      role: string;
      biographie: string;
    };
  };
  onNestedInputChange: (parent: string, field: string, value: unknown) => void;
}

export function FormationTrainerInfo({ formData, onNestedInputChange }: FormationTrainerInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Informations formateur
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="formateur_nom">Nom du formateur</Label>
            <Input
              id="formateur_nom"
              value={formData.contact_formateur.nom}
              onChange={(e) => onNestedInputChange('contact_formateur', 'nom', e.target.value)}
              placeholder="Nom complet du formateur"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="formateur_role">Rôle</Label>
            <Input
              id="formateur_role"
              value={formData.contact_formateur.role}
              onChange={(e) => onNestedInputChange('contact_formateur', 'role', e.target.value)}
              placeholder="Ex: Consultant formateur en informatique"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="formateur_email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="formateur_email"
              type="email"
              value={formData.contact_formateur.email}
              onChange={(e) => onNestedInputChange('contact_formateur', 'email', e.target.value)}
              placeholder="email@example.com"
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
              onChange={(e) => onNestedInputChange('contact_formateur', 'telephone', e.target.value)}
              placeholder="06.XX.XX.XX.XX"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="formateur_biographie">Biographie</Label>
          <Textarea
            id="formateur_biographie"
            value={formData.contact_formateur.biographie}
            onChange={(e) => onNestedInputChange('contact_formateur', 'biographie', e.target.value)}
            placeholder="Présentation du formateur, son expérience, ses compétences..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
}
