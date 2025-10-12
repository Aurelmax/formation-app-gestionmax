#!/bin/bash

echo "🚀 Démarrage de Payload CMS pur (sans Next.js)..."
echo "📍 Port: 3300"
echo "🌐 URL: http://localhost:3300/admin"
echo ""

# Arrêter le conteneur existant
echo "🛑 Arrêt du conteneur existant..."
docker-compose -f docker-compose.payload-only.yml down

# Construire l'image
echo "🔨 Construction de l'image Docker..."
docker-compose -f docker-compose.payload-only.yml build

# Démarrer le service
echo "▶️  Démarrage de Payload CMS..."
docker-compose -f docker-compose.payload-only.yml up -d

echo ""
echo "✅ Payload CMS démarré !"
echo "🔗 Accédez à: http://localhost:3300/admin"
echo ""
echo "📋 Commandes utiles:"
echo "  docker-compose -f docker-compose.payload-only.yml logs -f payload-cms"
echo "  docker-compose -f docker-compose.payload-only.yml stop payload-cms"
echo "  docker-compose -f docker-compose.payload-only.yml restart payload-cms"
