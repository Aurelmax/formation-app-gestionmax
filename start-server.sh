#!/bin/sh
# Script de démarrage pour Railway avec Next.js standalone
# Charge les variables d'environnement Railway et démarre le serveur

echo "🚀 Démarrage du serveur Next.js standalone..."
echo "📍 Variables d'environnement Railway:"
echo "  - NODE_ENV: ${NODE_ENV}"
echo "  - MONGODB_URI: $(echo $MONGODB_URI | cut -c1-50)..."
echo "  - PAYLOAD_SECRET: $(if [ -n "$PAYLOAD_SECRET" ]; then echo "✅ Défini"; else echo "❌ Manquant"; fi)"

# Démarrer le serveur standalone avec les variables d'environnement
exec node .next/standalone/server.js
