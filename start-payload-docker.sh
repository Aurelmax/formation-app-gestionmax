#!/bin/bash

echo "🚀 Démarrage de Payload CMS en mode Docker isolé..."
echo "📍 Port: 3300"
echo "🌐 URL: http://localhost:3300/admin"
echo ""

# Construire l'image si nécessaire
echo "🔨 Construction de l'image Docker..."
docker-compose build payload-cms

# Démarrer le service
echo "▶️  Démarrage du service..."
docker-compose up -d payload-cms

echo ""
echo "✅ Payload CMS démarré !"
echo "🔗 Accédez à: http://localhost:3300/admin"
echo ""
echo "📋 Commandes utiles:"
echo "  docker-compose logs -f payload-cms  # Voir les logs"
echo "  docker-compose stop payload-cms     # Arrêter"
echo "  docker-compose restart payload-cms  # Redémarrer"
