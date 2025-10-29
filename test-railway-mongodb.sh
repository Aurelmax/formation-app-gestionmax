#!/bin/bash

# Script de test de connexion MongoDB pour Railway
# Usage: ./test-railway-mongodb.sh https://votre-app.railway.app

if [ -z "$1" ]; then
    echo "❌ Erreur: URL Railway manquante"
    echo "Usage: ./test-railway-mongodb.sh https://votre-app.railway.app"
    exit 1
fi

RAILWAY_URL="$1"

echo "🔍 Test de connexion MongoDB sur Railway"
echo "URL: $RAILWAY_URL"
echo ""
echo "=" | awk '{s=sprintf("%80s","");gsub(/ /,"=",$0);print}'
echo ""

# Test 1: Health endpoint
echo "1️⃣  Test endpoint /api/health"
echo "---"
HEALTH_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$RAILWAY_URL/api/health" 2>&1)
HTTP_STATUS=$(echo "$HEALTH_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$HEALTH_RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Status: $HTTP_STATUS OK"
    echo ""
    echo "Réponse:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"

    # Vérifier si MongoDB est connecté
    if echo "$BODY" | grep -q '"connected":true'; then
        echo ""
        echo "✅ MongoDB: CONNECTÉ"
    else
        echo ""
        echo "❌ MongoDB: DÉCONNECTÉ"
    fi
else
    echo "❌ Status: $HTTP_STATUS"
    echo ""
    echo "Réponse:"
    echo "$BODY"
fi

echo ""
echo "=" | awk '{s=sprintf("%80s","");gsub(/ /,"=",$0);print}'
echo ""

# Test 2: API programmes
echo "2️⃣  Test endpoint /api/programmes"
echo "---"
PROGRAMMES_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$RAILWAY_URL/api/programmes?limit=3" 2>&1)
HTTP_STATUS=$(echo "$PROGRAMMES_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$PROGRAMMES_RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Status: $HTTP_STATUS OK"
    echo ""
    echo "Réponse (premier programme):"
    echo "$BODY" | jq '.data[0] | {id, titre, dureeHeures, niveau}' 2>/dev/null || echo "$BODY" | head -20

    # Compter les programmes
    COUNT=$(echo "$BODY" | jq '.data | length' 2>/dev/null)
    if [ ! -z "$COUNT" ] && [ "$COUNT" -gt 0 ]; then
        echo ""
        echo "✅ Données: $COUNT programme(s) récupéré(s)"
    else
        echo ""
        echo "⚠️  Aucun programme trouvé (base vide ou erreur)"
    fi
else
    echo "❌ Status: $HTTP_STATUS"
    echo ""
    echo "Réponse:"
    echo "$BODY" | head -20
fi

echo ""
echo "=" | awk '{s=sprintf("%80s","");gsub(/ /,"=",$0);print}'
echo ""

# Test 3: Page d'accueil
echo "3️⃣  Test page d'accueil /"
echo "---"
HOME_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$RAILWAY_URL/" 2>&1)
HTTP_STATUS=$(echo "$HOME_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Status: $HTTP_STATUS OK"
    echo "✅ Application accessible"
else
    echo "❌ Status: $HTTP_STATUS"
    echo "❌ Application non accessible"
fi

echo ""
echo "=" | awk '{s=sprintf("%80s","");gsub(/ /,"=",$0);print}'
echo ""

# Résumé
echo "📊 RÉSUMÉ"
echo "---"

HEALTH_OK=false
MONGO_OK=false
PROGRAMMES_OK=false
HOME_OK=false

# Retester rapidement pour le résumé
HEALTH_TEST=$(curl -s "$RAILWAY_URL/api/health" 2>&1)
if echo "$HEALTH_TEST" | grep -q '"status":"healthy"'; then
    HEALTH_OK=true
fi
if echo "$HEALTH_TEST" | grep -q '"connected":true'; then
    MONGO_OK=true
fi

PROGRAMMES_TEST=$(curl -s "$RAILWAY_URL/api/programmes?limit=1" 2>&1)
if echo "$PROGRAMMES_TEST" | grep -q '"success":true'; then
    PROGRAMMES_OK=true
fi

HOME_TEST=$(curl -s -o /dev/null -w "%{http_code}" "$RAILWAY_URL/" 2>&1)
if [ "$HOME_TEST" = "200" ]; then
    HOME_OK=true
fi

if $HEALTH_OK; then
    echo "✅ Health endpoint: OK"
else
    echo "❌ Health endpoint: ÉCHEC"
fi

if $MONGO_OK; then
    echo "✅ MongoDB: CONNECTÉ"
else
    echo "❌ MongoDB: DÉCONNECTÉ"
fi

if $PROGRAMMES_OK; then
    echo "✅ API programmes: OK"
else
    echo "❌ API programmes: ÉCHEC"
fi

if $HOME_OK; then
    echo "✅ Page d'accueil: OK"
else
    echo "❌ Page d'accueil: ÉCHEC"
fi

echo ""

# Verdict final
if $HEALTH_OK && $MONGO_OK && $PROGRAMMES_OK && $HOME_OK; then
    echo "🎉 VERDICT: Tout fonctionne parfaitement!"
    exit 0
elif $MONGO_OK; then
    echo "⚠️  VERDICT: MongoDB connecté mais problèmes sur l'API ou l'UI"
    echo ""
    echo "Suggestions:"
    echo "- Vérifier les logs Railway pour les erreurs"
    echo "- Vérifier que toutes les variables d'environnement sont définies"
    exit 1
else
    echo "❌ VERDICT: Problème de connexion MongoDB"
    echo ""
    echo "Actions à faire:"
    echo "1. Vérifier MONGODB_URI sur Railway (voir GUIDE_RAILWAY_MONGODB.md)"
    echo "2. Vérifier que l'IP est autorisée dans MongoDB Atlas (0.0.0.0/0)"
    echo "3. Vérifier le mot de passe: Formation2025Al"
    echo "4. Vérifier le nom de base: /formation-app-gestionmax"
    exit 1
fi
