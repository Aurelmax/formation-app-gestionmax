#!/bin/bash

echo "🔍 VÉRIFICATION DES LOGS DU SYSTÈME"
echo "=================================="

echo ""
echo "📊 État du serveur Next.js:"
ps aux | grep "next-server" | grep -v grep

echo ""
echo "🌐 Test de connectivité:"
curl -s -I http://localhost:3000 | head -3

echo ""
echo "🔐 Test page de login:"
curl -s -I http://localhost:3000/admin/login | head -3

echo ""
echo "🔧 Test page de diagnostic:"
curl -s -I http://localhost:3000/diagnostic | head -3

echo ""
echo "📁 Vérification des fichiers clés:"
ls -la src/lib/user-service.ts
ls -la src/app/admin/login/page.tsx
ls -la src/app/diagnostic/page.tsx

echo ""
echo "💾 Vérification localStorage (simulation):"
echo "Pour voir les logs en temps réel, ouvrez la console du navigateur (F12)"
echo "et allez sur: http://localhost:3000/diagnostic"

echo ""
echo "🚀 Actions recommandées:"
echo "1. Allez sur: http://localhost:3000/diagnostic"
echo "2. Cliquez sur '🔍 Lancer le diagnostic'"
echo "3. Ou cliquez sur '🚀 Connexion Directe'"
echo "4. Vérifiez la console (F12) pour les logs détaillés"
