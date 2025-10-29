#!/bin/bash

echo "🧹 Nettoyage complet du frontend Next.js + Payload intégré..."
echo ""

# Se placer dans le bon répertoire
cd "$(dirname "$0")"

# 1. Tuer tous les processus Node
echo "🛑 Arrêt de tous les processus Node..."
killall -9 node 2>/dev/null || true
pkill -9 -f "next dev" 2>/dev/null || true
pkill -9 -f "npm run dev" 2>/dev/null || true
sleep 2

# 2. Supprimer les caches
echo "🗑️  Suppression des caches..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo
rm -rf dist

# 3. Vérifier les variables d'environnement
echo ""
echo "🔍 Vérification des variables d'environnement..."
if grep -q "Formation2025Al" .env.development.local 2>/dev/null; then
    echo "✅ .env.development.local: Mot de passe correct"
else
    echo "❌ .env.development.local: ATTENTION - Mot de passe incorrect!"
fi

if grep -q "Formation2025Al" .env.local 2>/dev/null; then
    echo "✅ .env.local: Mot de passe correct"
else
    echo "❌ .env.local: ATTENTION - Mot de passe incorrect!"
fi

# 4. Afficher l'URI MongoDB (masquée)
echo ""
echo "🔐 MongoDB URI (masquée):"
grep "MONGODB_URI" .env.development.local | sed 's/:[^@]*@/:***@/' | head -1

echo ""
echo "🚀 Démarrage du serveur Next.js sur le port 3010..."
echo ""
npm run dev
