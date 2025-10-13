'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Plus, X } from 'lucide-react';

interface FormationEvaluationProps {
  formData: {
    modalites_evaluation: {
      types_evaluation: Array<{
        type: string;
        description: string;
      }>;
      plateforme_evaluation: string;
      grille_analyse: string;
    };
  };
  onNestedInputChange: (parent: string, field: string, value: unknown) => void;
}

export function FormationEvaluation({ formData, onNestedInputChange }: FormationEvaluationProps) {
  const [newEvaluationType, setNewEvaluationType] = useState('');

  const handleAddEvaluationType = () => {
    if (newEvaluationType.trim()) {
      const newType = {
        type: newEvaluationType.trim(),
        description: ''
      };
      const updatedTypes = [...formData.modalites_evaluation.types_evaluation, newType];
      onNestedInputChange('modalites_evaluation', 'types_evaluation', updatedTypes);
      setNewEvaluationType('');
    }
  };

  const handleRemoveEvaluationType = (index: number) => {
    const updatedTypes = formData.modalites_evaluation.types_evaluation.filter((_, i) => i !== index);
    onNestedInputChange('modalites_evaluation', 'types_evaluation', updatedTypes);
  };

  const handleUpdateEvaluationType = (index: number, field: string, value: string) => {
    const updatedTypes = formData.modalites_evaluation.types_evaluation.map((type, i) => 
      i === index ? { ...type, [field]: value } : type
    );
    onNestedInputChange('modalites_evaluation', 'types_evaluation', updatedTypes);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Modalités d&apos;évaluation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newEvaluationType}
            onChange={(e) => setNewEvaluationType(e.target.value)}
            placeholder="Ajouter un type d&apos;évaluation..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEvaluationType())}
          />
          <Button type="button" onClick={handleAddEvaluationType} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {formData.modalites_evaluation.types_evaluation.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Types d&apos;évaluation</h4>
            {formData.modalites_evaluation.types_evaluation.map((evaluation, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <Input
                    value={evaluation.type}
                    onChange={(e) => handleUpdateEvaluationType(index, 'type', e.target.value)}
                    placeholder="Type d'évaluation"
                  />
                  <Input
                    value={evaluation.description}
                    onChange={(e) => handleUpdateEvaluationType(index, 'description', e.target.value)}
                    placeholder="Description"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveEvaluationType(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="plateforme_evaluation">Plateforme d&apos;évaluation</Label>
            <Input
              id="plateforme_evaluation"
              value={formData.modalites_evaluation.plateforme_evaluation}
              onChange={(e) => onNestedInputChange('modalites_evaluation', 'plateforme_evaluation', e.target.value)}
              placeholder="Ex: EVALBOX"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="grille_analyse">Grille d&apos;analyse</Label>
            <Input
              id="grille_analyse"
              value={formData.modalites_evaluation.grille_analyse}
              onChange={(e) => onNestedInputChange('modalites_evaluation', 'grille_analyse', e.target.value)}
              placeholder="Ex: Grille d&apos;analyse des compétences"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
