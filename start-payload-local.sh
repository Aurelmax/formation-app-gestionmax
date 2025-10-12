#!/bin/bash

echo "🚀 Démarrage de Payload CMS local sur le port 3300..."
echo "📍 Port: 3300"
echo "🌐 URL: http://localhost:3300/admin"
echo ""

# Vérifier que le port 3300 est libre
if lsof -Pi :3300 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Le port 3300 est déjà utilisé. Arrêt du processus..."
    lsof -ti:3300 | xargs kill -9
    sleep 2
fi

# Créer le répertoire media s'il n'existe pas
mkdir -p media

# Exporter les variables d'environnement pour le port 3300
export PORT=3300
export NEXT_PUBLIC_SERVER_URL=http://localhost:3300
export NEXTAUTH_URL=http://localhost:3300

echo "🔧 Configuration:"
echo "  - Port: $PORT"
echo "  - Server URL: $NEXT_PUBLIC_SERVER_URL"
echo "  - NextAuth URL: $NEXTAUTH_URL"
echo ""

# Démarrer Payload CMS
echo "▶️  Démarrage de Payload CMS..."
npm run dev -- --port 3300
