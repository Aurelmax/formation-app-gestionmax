#!/bin/bash

# Script de build et démarrage en production pour Formation GestionMax
# Port fixe : 3010

echo "🚀 Build et démarrage de l'application Formation GestionMax en mode production..."

# Vérifier si le port 3010 est libre
if lsof -Pi :3010 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Le port 3010 est déjà utilisé !"
    echo "Processus utilisant le port 3010 :"
    lsof -Pi :3010 -sTCP:LISTEN
    echo ""
    echo "💡 Solutions :"
    echo "1. Arrêter le processus : kill \$(lsof -Pi :3010 -sTCP:LISTEN -t)"
    echo "2. Ou utiliser un autre port : PORT=3012 npm run start:3012"
    exit 1
fi

echo "✅ Port 3010 libre"

# Nettoyer le cache
echo "🧹 Nettoyage du cache..."
rm -rf .next
rm -rf node_modules/.cache

# Build de production
echo "🏗️  Build de production en cours..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi !"
    
    # Définir les variables d'environnement
    export PORT=3010
    export PAYLOAD_PORT=3011
    export MONGODB_URI=mongodb://localhost:27017/formation-app-gestionmax
    export PAYLOAD_SECRET=your-secret-key-change-this-in-production-formation-app
    export NEXT_PUBLIC_SERVER_URL=http://localhost:3010
    export NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3011
    
    echo "🌐 Application accessible sur : http://localhost:3010"
    echo "📊 Payload CMS sur : http://localhost:3011"
    echo "🏗️  Mode production activé"
    echo ""
    
    # Démarrer l'application en production
    npm run start:3010
else
    echo "❌ Erreur lors du build !"
    exit 1
fi
