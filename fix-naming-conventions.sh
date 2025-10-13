#!/bin/bash

# Script pour corriger les conventions de nommage
# snake_case -> camelCase

echo "🔧 Correction des conventions de nommage..."

# Liste des fichiers à corriger
FILES=(
  "src/components/admin/forms/FormationAccessModalities.tsx"
  "src/components/admin/forms/FormationTrainerInfo.tsx"
  "src/components/admin/forms/FormationEvaluation.tsx"
  "src/components/admin/forms/FormationAbandonConditions.tsx"
)

# Corrections à appliquer
declare -A CORRECTIONS=(
  ["modalites_acces"]="modalitesAcces"
  ["public_concerne"]="publicConcerne"
  ["delais_mise_en_place"]="delaisMiseEnPlace"
  ["modalites_reglement"]="modalitesReglement"
  ["contact_formateur"]="contactFormateur"
  ["modalites_pedagogiques"]="modalitesPedagogiques"
  ["ressources_dispo"]="ressourcesDispo"
  ["modalites_evaluation"]="modalitesEvaluation"
  ["types_evaluation"]="typesEvaluation"
  ["plateforme_evaluation"]="plateformeEvaluation"
  ["grille_analyse"]="grilleAnalyse"
  ["sanction_formation"]="sanctionFormation"
  ["niveau_certification"]="niveauCertification"
  ["accessibilite_handicap"]="accessibiliteHandicap"
  ["referent_handicap"]="referentHandicap"
  ["contact_referent"]="contactReferent"
  ["adaptations_proposees"]="adaptationsProposees"
  ["cessation_abandon"]="cessationAbandon"
  ["conditions_renonciation"]="conditionsRenonciation"
  ["facturation_abandon"]="facturationAbandon"
  ["code_formation"]="codeFormation"
  ["programme_detail"]="programmeDetail"
)

# Fonction pour corriger un fichier
fix_file() {
  local file="$1"
  echo "  📝 Correction de $file"
  
  for old_name in "${!CORRECTIONS[@]}"; do
    new_name="${CORRECTIONS[$old_name]}"
    sed -i "s/$old_name/$new_name/g" "$file"
  done
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
echo "🔍 Vérifiez les fichiers modifiés avec git diff"
