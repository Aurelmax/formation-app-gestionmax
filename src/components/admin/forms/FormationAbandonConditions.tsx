'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface FormationAbandonConditionsProps {
  formData: {
    cessation_abandon: {
      conditions_renonciation: string;
      facturation_abandon: string;
    };
  };
  onNestedInputChange: (parent: string, field: string, value: unknown) => void;
}

export function FormationAbandonConditions({ formData, onNestedInputChange }: FormationAbandonConditionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Conditions d&apos;abandon
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="conditions_renonciation">Conditions de renonciation</Label>
          <Textarea
            id="conditions_renonciation"
            value={formData.cessation_abandon.conditions_renonciation}
            onChange={(e) => onNestedInputChange('cessation_abandon', 'conditions_renonciation', e.target.value)}
            placeholder="Conditions en cas de renonciation avant le début de formation..."
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="facturation_abandon">Facturation en cas d&apos;abandon</Label>
          <Textarea
            id="facturation_abandon"
            value={formData.cessation_abandon.facturation_abandon}
            onChange={(e) => onNestedInputChange('cessation_abandon', 'facturation_abandon', e.target.value)}
            placeholder="Modalités de facturation en cours de formation..."
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
}
