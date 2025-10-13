#!/bin/bash

# Script pour rendre les propriétés optionnelles dans les composants enfants

echo "🔧 Correction des propriétés optionnelles..."

# Liste des fichiers à corriger
FILES=(
  "src/components/admin/forms/FormationAccessModalities.tsx"
  "src/components/admin/forms/FormationTrainerInfo.tsx"
  "src/components/admin/forms/FormationEvaluation.tsx"
  "src/components/admin/forms/FormationAbandonConditions.tsx"
)

# Fonction pour corriger un fichier
fix_file() {
  local file="$1"
  echo "  📝 Correction de $file"
  
  # Rendre les propriétés optionnelles
  sed -i 's/value={formData\.\([a-zA-Z]*\)\.\([a-zA-Z]*\)}/value={formData.\1?.\2 || '\'''\''}/g' "$file"
  sed -i 's/value={formData\.\([a-zA-Z]*\)\.\([a-zA-Z]*\)\.\([a-zA-Z]*\)}/value={formData.\1?.\2?.\3 || '\'''\''}/g' "$file"
}

# Corriger tous les fichiers
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    fix_file "$file"
  else
    echo "  ⚠️  Fichier non trouvé: $file"
  fi
done

echo "✅ Correction terminée !"
