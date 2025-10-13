#!/bin/bash

# Script pour mettre à jour les interfaces des composants enfants

echo "🔧 Mise à jour des interfaces..."

# FormationEvaluation
sed -i 's/modalitesEvaluation: {/modalitesEvaluation?: {/g' src/components/admin/forms/FormationEvaluation.tsx
sed -i 's/typesEvaluation: {/typesEvaluation?: {/g' src/components/admin/forms/FormationEvaluation.tsx
sed -i 's/plateformeEvaluation: string;/plateformeEvaluation?: string;/g' src/components/admin/forms/FormationEvaluation.tsx
sed -i 's/grilleAnalyse: string;/grilleAnalyse?: string;/g' src/components/admin/forms/FormationEvaluation.tsx

# FormationAbandonConditions
sed -i 's/cessationAbandon: {/cessationAbandon?: {/g' src/components/admin/forms/FormationAbandonConditions.tsx
sed -i 's/conditionsRenonciation: string;/conditionsRenonciation?: string;/g' src/components/admin/forms/FormationAbandonConditions.tsx
sed -i 's/facturationAbandon: string;/facturationAbandon?: string;/g' src/components/admin/forms/FormationAbandonConditions.tsx

echo "✅ Interfaces mises à jour !"
