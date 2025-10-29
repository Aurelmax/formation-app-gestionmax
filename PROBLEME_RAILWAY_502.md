# 🔍 Analyse du problème 502 Railway

**Date**: 29 octobre 2025
**Problème**: Railway retourne 502 "Application failed to respond" malgré un build réussi

---

## ✅ Ce qui fonctionne

### En local (http://localhost:3010)
- ✅ MongoDB connecté (readyState: 1)
- ✅ Payload CMS initialisé
- ✅ Toutes les API fonctionnent (/api/health, /api/programmes, etc.)
- ✅ Toutes les pages fonctionnent (/, /catalogue, /manifeste, /contact)
- ✅ Données accessibles

### Build Railway
- ✅ Dockerfile build réussi
- ✅ `npm ci --legacy-peer-deps` OK
- ✅ `npm run build` OK (production build)
- ✅ Image Docker créée

---

## ❌ Ce qui ne fonctionne PAS

### Runtime Railway
- ❌ Application démarre ("Ready in ~1000ms")
- ❌ Mais retourne 502 sur toutes les requêtes
- ❌ Pas d'erreur visible dans les logs
- ❌ Logs s'arrêtent à "📁 Côté serveur - Utilisation des utilisateurs par défaut"

---

## 🔧 Corrections appliquées

### 1. Variables d'environnement Railway
```
✅ MONGODB_URI = mongodb+srv://...formation-app-gestionmax?retryWrites=true&w=majority
✅ PAYLOAD_SECRET = nw*T/y@_yVjkS?Q-...
✅ NODE_ENV = production
✅ NEXT_PUBLIC_SERVER_URL = https://formation-app-gestionmax-production.up.railway.app
✅ NEXT_PUBLIC_PAYLOAD_URL = https://formation-app-gestionmax-production.up.railway.app
✅ PAYLOAD_PUBLIC_SERVER_URL = https://formation-app-gestionmax-production.up.railway.app
```

### 2. MongoDB Atlas
```
✅ Network Access: 0.0.0.0/0 (toutes IPs autorisées)
✅ User: aurelien_db_user avec atlasAdmin
✅ Password: Formation2025Al
✅ Database: formation-app-gestionmax
```

### 3. Dockerfile
```dockerfile
✅ ENV NODE_ENV=production
✅ RUN npm run build (build production)
✅ CMD ["npm", "start"] (pas npm run dev)
```

### 4. Package.json
```json
✅ "start": "next start -H 0.0.0.0" (écoute sur toutes interfaces)
✅ "postinstall": "echo '...'" (désactivé pour éviter erreurs build)
```

### 5. Code
```
✅ Import CSS Leaflet déplacé dans le composant (pas dans globals.css)
✅ Pas d'erreur TypeScript
✅ Build local réussit
```

---

## 🔍 Hypothèses sur la cause du 502

### Hypothèse 1: Timeout d'initialisation Payload ❓
**Symptôme**: Logs s'arrêtent après "Utilisation des utilisateurs par défaut"
**Cause possible**: Payload prend trop de temps à se connecter à MongoDB
**Test**: Augmenter le timeout Railway ou simplifier l'init Payload

### Hypothèse 2: Crash silencieux après démarrage ❓
**Symptôme**: "Ready in 1028ms" mais ensuite plus rien
**Cause possible**: Une erreur non catchée fait crasher Node.js
**Test**: Ajouter des try/catch et logs dans payload.config.ts

### Hypothèse 3: Port/Network binding ❓
**Symptôme**: 502 même avec -H 0.0.0.0
**Cause possible**: Railway ne route pas correctement vers le container
**Test**: Vérifier les logs Railway "Internal" ou "System"

### Hypothèse 4: Health check Railway ❓
**Symptôme**: Railway considère l'app unhealthy
**Cause possible**: Railway fait un health check qui échoue
**Test**: Configurer un health check endpoint dans Railway Settings

### Hypothèse 5: Mémoire insuffisante ❓
**Symptôme**: Crash silencieux après démarrage
**Cause possible**: Next.js + Payload + MongoDB = trop de RAM
**Test**: Augmenter la RAM du service Railway

---

## 📊 Comparaison Local vs Railway

| Aspect | Local | Railway | Fonctionnel? |
|--------|-------|---------|--------------|
| Build | ✅ Réussit | ✅ Réussit | ✅ Oui |
| Démarrage Next.js | ✅ Ready in 1578ms | ✅ Ready in 1028ms | ✅ Oui |
| Init Payload | ✅ Connecté | ❓ Logs s'arrêtent | ❌ Non |
| MongoDB readyState | ✅ 1 (connecté) | ❓ Inconnu | ❌ Non |
| API /health | ✅ 200 OK | ❌ 502 | ❌ Non |
| Pages / | ✅ 200 OK | ❌ 502 | ❌ Non |

---

## 🧪 Tests de diagnostic à faire

### 1. Vérifier les logs Railway complets
```
Railway → Deployments → Latest → Deploy Logs
Chercher après "📁 Côté serveur"
Y a-t-il une erreur cachée?
```

### 2. Tester avec un endpoint minimal
Créer un endpoint simple qui ne dépend pas de Payload:
```typescript
// src/app/api/ping/route.ts
export async function GET() {
  return Response.json({ ping: 'pong', timestamp: Date.now() })
}
```

### 3. Ajouter des logs debug dans payload.config.ts
```typescript
export default buildConfig({
  onInit: async (payload) => {
    console.log('🎯 Payload initialized successfully!')
    console.log('📊 MongoDB state:', payload.db?.connection?.readyState)
  },
  // ...
})
```

### 4. Vérifier les métriques Railway
```
Railway → Metrics
CPU: Est-ce que ça spike puis crash?
Memory: Est-ce qu'on atteint la limite?
```

### 5. Tester sans Payload temporairement
Commenter temporairement l'init Payload pour voir si Next.js seul fonctionne.

---

## 🎯 Solutions possibles à essayer

### Solution A: Augmenter les timeouts MongoDB
```typescript
// src/payload.config.ts
db: mongooseAdapter({
  url: process.env.MONGODB_URI!,
  connectOptions: {
    serverSelectionTimeoutMS: 30000, // 30s au lieu de 5s
    socketTimeoutMS: 90000, // 90s au lieu de 45s
    connectTimeoutMS: 30000, // Ajouter
  },
}),
```

### Solution B: Simplifier pour Railway
Créer un payload.config.railway.ts minimal sans toutes les collections.

### Solution C: Utiliser Railway Database
Au lieu de MongoDB Atlas, utiliser Railway PostgreSQL + Prisma.

### Solution D: Déployer sur Vercel
Vercel est optimisé pour Next.js, pourrait mieux fonctionner.

### Solution E: Déployer seulement le frontend sur Vercel
- Frontend sur Vercel
- Backend Payload standalone sur Railway (déjà créé dans payload-backend/)

---

## 📝 Prochaines actions recommandées

1. **Copier les Deploy Logs complets** après "Ready in XXXms"
2. **Vérifier les métriques Railway** (CPU, RAM)
3. **Créer un endpoint /api/ping** simple pour tester sans Payload
4. **Essayer Solution A** (augmenter timeouts MongoDB)
5. **Si rien ne marche**: Déployer frontend sur Vercel, utiliser payload-backend sur Railway

---

## 🔗 Ressources

- [Railway Troubleshooting](https://docs.railway.app/guides/troubleshooting)
- [Next.js Production Deployment](https://nextjs.org/docs/deployment)
- [Payload CMS Production](https://payloadcms.com/docs/production/deployment)

---

**Dernière mise à jour**: 29 octobre 2025 - 14:20 UTC
**Commits appliqués**: 976b082, 50c6c68, c3dbba3, 1b33177, 2285195, 89734f4
**Statut**: 🔴 Railway 502 - Diagnostic en cours
