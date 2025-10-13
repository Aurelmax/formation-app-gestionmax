#!/bin/bash

# Script de démarrage pour l'application Formation GestionMax
# Port fixe : 3010

echo "🚀 Démarrage de l'application Formation GestionMax sur le port 3010..."

# Vérifier si le port 3010 est libre
if lsof -Pi :3010 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Le port 3010 est déjà utilisé !"
    echo "Processus utilisant le port 3010 :"
    lsof -Pi :3010 -sTCP:LISTEN
    echo ""
    echo "💡 Solutions :"
    echo "1. Arrêter le processus : kill \$(lsof -Pi :3010 -sTCP:LISTEN -t)"
    echo "2. Ou utiliser un autre port : PORT=3012 npm run dev"
    exit 1
fi

# Définir les variables d'environnement
export PORT=3010
export PAYLOAD_PORT=3011
export MONGODB_URI=mongodb://localhost:27017/formation-app-gestionmax
export PAYLOAD_SECRET=your-secret-key-change-this-in-production-formation-app
export NEXT_PUBLIC_SERVER_URL=http://localhost:3010
export NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3011

echo "✅ Port 3010 libre"
echo "🌐 Application accessible sur : http://localhost:3010"
echo "📊 Payload CMS sur : http://localhost:3011"
echo ""

# Démarrer l'application en mode production
echo "🏗️  Mode production activé"
npm run start:3010
