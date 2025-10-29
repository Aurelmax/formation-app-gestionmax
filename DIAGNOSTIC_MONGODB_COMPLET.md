# 🔧 Diagnostic MongoDB Complet - Architecture Payload + Next.js

**Date** : 29 octobre 2025
**Statut** : Problème identifié, solutions proposées

---

## 📋 Résumé Exécutif

### Problème
Erreur récurrente : `MongoServerError: bad auth : authentication failed` (code 8000, AtlasError)

### Cause Racine
**Conflit entre deux implémentations de `getPayloadClient`** :
1. **`src/payload.ts`** (ancien, actuellement utilisé)
2. **`src/lib/getPayloadClient.ts`** (nouveau, inutilisé)

### Impact
- Le serveur fonctionne en mode dégradé
- Les pages publiques se chargent ✅
- Les API Payload échouent (500) ❌
- L'erreur MongoDB apparaît périodiquement

---

## 🏗️ Architecture Actuelle Détectée

### 1. Configuration Payload

**Fichier** : `src/payload.config.ts`

```typescript
export default buildConfig({
  secret: process.env['PAYLOAD_SECRET'],
  db: mongooseAdapter({
    url: process.env['MONGODB_URI'] || '',
    connectOptions: {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // IPv4
      autoIndex: process.env.NODE_ENV !== 'production',
      autoCreate: process.env.NODE_ENV !== 'production',
    },
  }),
  admin: {
    disable: true, // Interface admin désactivée
  },
})
```

**✅ Configuration correcte** : Options MongoDB optimisées ajoutées

### 2. Point d'Entrée Payload

**Fichier** : `src/payload.ts` (31 lignes)

```typescript
import { getPayload } from 'payload'
import config from './payload.config'

let cached = (global as unknown as { payload: { client: any; promise: any } }).payload

if (!cached) {
  cached = (global as unknown as { payload: { client: any; promise: any } }).payload = {
    client: null,
    promise: null,
  }
}

export const getPayloadClient = async () => {
  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = getPayload({ config })
  }

  try {
    cached.client = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.client
}
```

**⚠️ Problème** : Cache basique sans gestion de reconnexion

### 3. Nouveau Client Payload

**Fichier** : `src/lib/getPayloadClient.ts` (111 lignes) - **NON UTILISÉ**

Fonctionnalités :
- ✅ Vérification état connexion (readyState)
- ✅ Gestion reconnexion
- ✅ Évite connexions multiples
- ✅ Logging détaillé
- ✅ Fonctions utilitaires

### 4. Chargement Variables d'Environnement

**Fichier** : `next.config.ts`

```typescript
import { config } from 'dotenv'
config() // ✅ Ajouté
```

**Statut** : ✅ Actif - Visible dans les logs : `[dotenv@17.2.3] injecting env`

### 5. Routes API Utilisant Payload

**Fichiers identifiés** (20+ routes) :
- `src/app/api/auth/me/route.ts`
- `src/app/api/apprenants-payload/route.ts`
- `src/app/api/rendez-vous-payload/route.ts`
- `src/app/api/contacts/route.ts`
- etc.

**Imports utilisés** :
```typescript
// Mélange de :
import { getPayload } from 'payload' // Direct (16 fichiers)
import { getPayloadClient } from '@/payload' // Via src/payload.ts (4 fichiers)
import { getPayloadClient } from '@/lib/getPayloadClient' // Nouveau (0 fichiers) ❌
```

---

## 🔍 Causes Identifiées

### 1. **Conflit de cache** ⚠️
- `src/payload.ts` utilise un cache global simple
- Pas de vérification de l'état de connexion (readyState)
- Ne gère pas les déconnexions

### 2. **Timing du chargement .env** ✅ Résolu
- `dotenv.config()` ajouté dans `next.config.ts`
- Variables chargées avant Payload

### 3. **Multiples instances Payload** ⚠️
- Routes API appellent `getPayload()` directement
- Créent potentiellement plusieurs connexions MongoDB
- Pas de singleton centralisé

### 4. **IPv6 vs IPv4** ✅ Résolu
- `family: 4` forcé dans `connectOptions`

---

## 💡 Solutions Proposées

### **Option A : Unifier sur `src/payload.ts` (Recommandé)**

**Avantages** :
- ✅ Minimal - Un seul fichier à modifier
- ✅ Toutes les routes utilisent déjà ce fichier
- ✅ Pas de refactoring massif

**Actions** :
1. Améliorer `src/payload.ts` avec le code de `src/lib/getPayloadClient.ts`
2. Supprimer `src/lib/getPayloadClient.ts`
3. Garder l'import `@/payload` partout

**Fichier à modifier** : `src/payload.ts`

```typescript
import { getPayload } from 'payload'
import config from './payload.config'

let cachedPayload: any = null
let isConnecting = false

export const getPayloadClient = async () => {
  // Vérifier si déjà connecté
  if (cachedPayload && !isConnecting) {
    try {
      const db = cachedPayload.db
      if (db && db.connection && db.connection.readyState === 1) {
        return cachedPayload
      }
    } catch (error) {
      console.warn('⚠️ Connexion Payload invalide, reconnexion...')
      cachedPayload = null
    }
  }

  // Éviter connexions multiples
  if (isConnecting) {
    let attempts = 0
    while (isConnecting && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }
    if (cachedPayload) return cachedPayload
  }

  try {
    isConnecting = true
    console.log('🔄 Initialisation Payload CMS...')

    const payload = await getPayload({ config })

    // Vérifier connexion MongoDB
    if (payload.db && payload.db.connection) {
      const state = payload.db.connection.readyState
      console.log('📊 MongoDB:', {
        0: 'Déconnecté',
        1: 'Connecté ✅',
        2: 'Connexion...',
        3: 'Déconnexion...',
      }[state] || state)
    }

    cachedPayload = payload
    console.log('✅ Payload CMS initialisé')
    return payload
  } catch (error) {
    console.error('❌ Erreur Payload:', error)
    cachedPayload = null
    throw error
  } finally {
    isConnecting = false
  }
}

// Utilitaires
export function resetPayloadCache() {
  console.log('🔄 Réinitialisation cache Payload')
  cachedPayload = null
}
```

### **Option B : Unifier sur `src/lib/getPayloadClient.ts`**

**Avantages** :
- ✅ Code plus propre et organisé
- ✅ Fonctions utilitaires (checkConnection, resetCache)
- ✅ Logging détaillé

**Inconvénients** :
- ❌ Refactoring de 20+ routes API
- ❌ Changement de tous les imports

**Actions** :
1. Supprimer `src/payload.ts`
2. Modifier tous les imports dans les routes API
3. Utiliser `src/lib/getPayloadClient.ts`

### **Option C : Architecture Séparée (Avancé)**

**Description** : Séparer Payload en serveur standalone

**Avantages** :
- ✅ Isolation complète
- ✅ Pas d'interférence avec Next.js
- ✅ Meilleure scalabilité

**Inconvénients** :
- ❌ Architecture complexe
- ❌ Deux serveurs à gérer
- ❌ Refactoring complet

---

## 🎯 Plan d'Action Recommandé

### **Phase 1 : Unification (Option A)** ✅ Recommandé

1. **Backup** du fichier actuel
   ```bash
   cp src/payload.ts src/payload.ts.backup
   ```

2. **Remplacer** `src/payload.ts` avec le code amélioré

3. **Supprimer** `src/lib/getPayloadClient.ts` (conflit)

4. **Tester** :
   ```bash
   npm run dev
   curl http://localhost:3010/api/programmes
   ```

5. **Vérifier** les logs - Rechercher : `✅ Payload CMS initialisé`

### **Phase 2 : Validation**

1. **Tester lecture** :
   ```bash
   curl http://localhost:3010/api/articles
   ```

2. **Tester écriture** (optionnel) :
   - Créer une route de test
   - Insérer un document test
   - Vérifier dans MongoDB Atlas

3. **Redémarrer serveur** :
   ```bash
   # Simuler hot reload
   pkill -9 -f "next dev"
   npm run dev
   ```

4. **Vérifier stabilité** :
   - Pas d'erreur "bad auth"
   - Connexion stable
   - readyState = 1

### **Phase 3 : Monitoring**

1. **Ajouter endpoint de santé** :
   ```typescript
   // src/app/api/health/route.ts
   import { getPayloadClient } from '@/payload'

   export async function GET() {
     try {
       const payload = await getPayloadClient()
       const state = payload.db?.connection?.readyState

       return Response.json({
         status: state === 1 ? 'healthy' : 'unhealthy',
         mongodb: {
           connected: state === 1,
           readyState: state,
         },
         timestamp: new Date().toISOString(),
       })
     } catch (error) {
       return Response.json(
         { status: 'error', message: error.message },
         { status: 500 }
       )
     }
   }
   ```

2. **Tester** :
   ```bash
   curl http://localhost:3010/api/health
   ```

---

## 📊 Checklist de Validation

### Avant Correction
- [x] Erreur "bad auth" présente
- [x] Deux fichiers `getPayloadClient` en conflit
- [x] Routes API utilisent des imports différents
- [x] Pas de vérification readyState

### Après Correction
- [ ] Un seul fichier `getPayloadClient`
- [ ] Vérification readyState active
- [ ] Logging détaillé activé
- [ ] Pas d'erreur "bad auth" au démarrage
- [ ] API `/api/programmes` retourne 200
- [ ] API `/api/health` retourne "healthy"
- [ ] Serveur stable après redémarrage

---

## 🔗 Fichiers à Modifier

### Obligatoires
1. `src/payload.ts` - Remplacer par code amélioré
2. `src/lib/getPayloadClient.ts` - Supprimer (conflit)

### Optionnels
3. `src/app/api/health/route.ts` - Créer (monitoring)
4. Routes API utilisant direct `getPayload()` - Migrer vers `getPayloadClient()` (20+ fichiers)

---

## 🚀 Commandes Utiles

### Test Connexion MongoDB
```bash
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://aurelien_db_user:Test123456@clustergestionmaxformat.a9qrz87.mongodb.net/formation-app-gestionmax')
  .then(() => { console.log('✅ OK'); process.exit(0); })
  .catch(err => { console.log('❌', err.message); process.exit(1); });
"
```

### Vérifier État Serveurs
```bash
lsof -i :3010  # Voir processus sur port 3010
ps aux | grep "next dev"  # Voir tous les serveurs Next.js
```

### Nettoyer Tout
```bash
pkill -9 -f "next dev"  # Tuer tous les serveurs
rm -rf .next  # Supprimer cache Next.js
npm run dev  # Redémarrer proprement
```

---

## 📝 Notes Importantes

1. **Test MongoDB standalone réussi** ✅
   - Le mot de passe `Test123456` est correct
   - L'IP est autorisée sur Atlas
   - La connexion fonctionne hors Next.js

2. **dotenv actif** ✅
   - Variables chargées : `[dotenv@17.2.3] injecting env`
   - Pas de problème de timing

3. **Serveurs background multiples** ⚠️
   - 5 serveurs détectés (176767, 267596, 928679, a49c32, af847b)
   - Tous arrêtés maintenant
   - Possibilité de conflits de port

---

## ✅ Prochaine Étape

**Décision requise** : Quelle option choisir ?

- **Option A** : Unifier sur `src/payload.ts` (rapide, minimal) ← **Recommandé**
- **Option B** : Unifier sur `src/lib/getPayloadClient.ts` (propre, refactoring)
- **Option C** : Séparer Payload standalone (avancé, complexe)

**Recommandation** : **Option A** pour corriger rapidement et durablement.

---

**Créé par** : Claude Code
**Version** : 1.0
**Dernière mise à jour** : 29 octobre 2025, 10:00
