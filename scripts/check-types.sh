#!/bin/bash

echo "🔍 Vérification TypeScript en cours..."
echo ""

# Vérification des types
npm run type-check

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Aucune erreur TypeScript détectée !"
  echo ""
  echo "🧹 Vérification ESLint..."
  npm run lint
  
  if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Tout est parfait ! Code prêt pour le commit."
  else
    echo ""
    echo "⚠️  Quelques warnings ESLint à corriger (optionnel)"
  fi
else
  echo ""
  echo "❌ Erreurs TypeScript détectées. Veuillez les corriger."
  exit 1
fi
