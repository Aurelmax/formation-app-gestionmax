#!/bin/bash

# Script pour nettoyer les déploiements Vercel échoués
# Usage: ./clean-vercel-deployments.sh [project-name]

PROJECT_NAME="${1:-formation-app-gestionmax}"

echo "🔍 Recherche des déploiements échoués pour le projet: $PROJECT_NAME"
echo ""

# Récupérer tous les déploiements
DEPLOYMENTS=$(vercel ls "$PROJECT_NAME" --json 2>/dev/null)

if [ $? -ne 0 ]; then
  echo "❌ Erreur: Impossible de récupérer les déploiements."
  echo "Assurez-vous d'être connecté avec: vercel login"
  exit 1
fi

# Filtrer et supprimer les déploiements échoués
echo "$DEPLOYMENTS" | jq -r '.deployments[] | select(.state == "ERROR" or .state == "FAILED" or .state == "CANCELED") | .uid' | while read -r deployment_id; do
  if [ -n "$deployment_id" ]; then
    echo "🗑️  Suppression du déploiement échoué: $deployment_id"
    vercel rm "$deployment_id" --yes --token "$VERCEL_TOKEN"

    if [ $? -eq 0 ]; then
      echo "   ✅ Supprimé avec succès"
    else
      echo "   ❌ Échec de la suppression"
    fi
  fi
done

echo ""
echo "✨ Nettoyage terminé !"
echo ""
echo "📊 Déploiements restants:"
vercel ls "$PROJECT_NAME"
