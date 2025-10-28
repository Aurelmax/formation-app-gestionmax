#!/bin/bash

# Script simple pour lister et supprimer manuellement les déploiements Vercel
# Usage: ./clean-vercel-simple.sh

PROJECT_NAME="${1:-formation-app-gestionmax}"

echo "🔍 Liste des déploiements pour: $PROJECT_NAME"
echo ""

vercel ls "$PROJECT_NAME"

echo ""
echo "Pour supprimer un déploiement, utilisez:"
echo "  vercel rm <deployment-url> --yes"
echo ""
echo "Exemples:"
echo "  vercel rm formation-app-gestionmax-abc123.vercel.app --yes"
echo "  vercel rm dpl_xxxxxxxxxxxxx --yes"
