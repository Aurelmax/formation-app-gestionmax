# 🚂 Guide de diagnostic Railway - Connexion MongoDB

**Date**: 29 octobre 2025
**Problème**: MongoDB se connecte en local mais pas sur Railway

---

## 🔍 Diagnostic pas à pas

### Étape 1: Vérifier les variables d'environnement Railway

#### Dans l'interface Railway, onglet "Variables":

Vérifiez que **`MONGODB_URI`** est exactement:

```bash
mongodb+srv://aurelien_db_user:Formation2025Al@clustergestionmaxformat.a9qrz87.mongodb.net/formation-app-gestionmax?retryWrites=true&w=majority
```

**Points critiques à vérifier**:

| Élément | Valeur attendue | ⚠️ Erreur fréquente |
|---------|----------------|---------------------|
| Utilisateur | `aurelien_db_user` | Ne pas oublier |
| Mot de passe | `Formation2025Al` | ❌ Ancien: `UabCxoHI9J4C75j0` |
| Cluster | `clustergestionmaxformat.a9qrz87.mongodb.net` | Vérifier l'orthographe |
| **Base de données** | `/formation-app-gestionmax` | ⚠️ **OBLIGATOIRE** - Souvent oublié! |
| Options | `?retryWrites=true&w=majority` | Recommandé |

#### Variables obligatoires supplémentaires:

```bash
# Sécurité Payload
PAYLOAD_SECRET=your-secret-key-change-this-in-production-please-use-a-strong-secret

# Environnement
NODE_ENV=production

# URLs publiques (remplacer YOUR-APP par le nom Railway)
NEXT_PUBLIC_SERVER_URL=https://YOUR-APP.railway.app
NEXT_PUBLIC_PAYLOAD_URL=https://YOUR-APP.railway.app
```

---

### Étape 2: Vérifier les autorisations IP MongoDB Atlas

#### Dans MongoDB Atlas:

1. **Allez dans "Network Access"** (Accès réseau)
2. **Vérifiez les IP autorisées**

**Solutions possibles**:

#### Option A: Autoriser toutes les IPs (recommandé pour Railway)
```
IP Address: 0.0.0.0/0
Comment: Allow all IPs (Railway uses dynamic IPs)
```
✅ **Avantage**: Fonctionne toujours, même quand Railway change d'IP
⚠️ **Attention**: Assurez-vous que le mot de passe est fort

#### Option B: Autoriser les IPs Railway spécifiques
Railway utilise des IPs dynamiques, donc cette option est plus complexe.

Vous pouvez obtenir l'IP actuelle dans les logs Railway:
```
Network: http://10.212.181.10:3010
```

Mais cette IP peut changer à chaque déploiement.

---

### Étape 3: Tester la connexion depuis Railway

#### A. Via l'interface Railway

Dans l'onglet **"Deploy Logs"**, cherchez ces lignes:

**✅ Succès - Vous devriez voir**:
```
🔍 [Payload Config] MongoDB URI configurée: ✅
🔄 Initialisation de Payload CMS...
📊 État de connexion MongoDB: Connecté ✅
✅ Payload CMS initialisé avec succès
```

**❌ Échec - Vous verriez**:
```
ERROR: Error: cannot connect to MongoDB. Details: bad auth : authentication failed
```
ou
```
MongoServerError: bad auth : authentication failed
code: 8000
codeName: "AtlasError"
```

#### B. Via l'endpoint health

Une fois déployé, testez l'URL Railway:

```bash
curl https://YOUR-APP.railway.app/api/health
```

**✅ Réponse attendue si tout fonctionne**:
```json
{
  "status": "healthy",
  "mongodb": {
    "connected": true,
    "readyState": 1,
    "readyStateLabel": "Connecté ✅"
  },
  "timestamp": "2025-10-29T12:30:00.000Z",
  "version": "1.0"
}
```

**❌ Réponse si MongoDB échoue**:
```json
{
  "status": "unhealthy",
  "mongodb": {
    "connected": false,
    "readyState": 0,
    "readyStateLabel": "Déconnecté"
  }
}
```

---

### Étape 4: Tester l'API des programmes

```bash
curl https://YOUR-APP.railway.app/api/programmes
```

**✅ Succès**:
```json
{
  "success": true,
  "data": [
    {
      "id": "68ec787878922d65b9a2b3a5",
      "titre": "Formation exemple",
      ...
    }
  ]
}
```

**❌ Échec** (erreur 500 ou 503):
```json
{
  "success": false,
  "error": "Database connection failed"
}
```

---

## 🔧 Solutions aux problèmes courants

### Problème 1: "bad auth : authentication failed"

**Causes possibles**:

1. ❌ **Mauvais mot de passe dans Railway**
   - Solution: Vérifier que c'est bien `Formation2025Al`
   - Attention aux espaces avant/après dans Railway

2. ❌ **Nom de base de données manquant**
   - Solution: Ajouter `/formation-app-gestionmax` dans l'URI
   - Vérifier: L'URI doit contenir `...mongodb.net/formation-app-gestionmax?...`

3. ❌ **Caractères spéciaux non encodés**
   - Le mot de passe `Formation2025Al` ne contient pas de caractères spéciaux
   - Si vous changez le mot de passe, évitez `@`, `/`, `:`, `%`

4. ❌ **Utilisateur supprimé ou modifié dans Atlas**
   - Solution: Vérifier que `aurelien_db_user` existe dans "Database Access"
   - Vérifier les permissions: doit avoir `readWrite` sur `formation-app-gestionmax`

### Problème 2: "connection timeout" ou "server selection timeout"

**Causes possibles**:

1. ❌ **IP Railway non autorisée dans Atlas**
   - Solution: Ajouter `0.0.0.0/0` dans "Network Access"

2. ❌ **Cluster MongoDB Atlas en veille**
   - Les clusters gratuits se mettent en veille après inactivité
   - Solution: Se connecter une fois manuellement pour réveiller le cluster

3. ❌ **Problème réseau Railway**
   - Rare mais possible
   - Solution: Redéployer sur Railway

### Problème 3: Variables d'environnement non prises en compte

**Symptômes**: Les logs Railway montrent `undefined` ou des valeurs vides

**Solutions**:

1. **Redéployer après modification des variables**
   - Railway ne recharge pas automatiquement les variables
   - Cliquez sur "Deploy" → "Redeploy"

2. **Vérifier qu'il n'y a pas d'espaces**
   - ❌ Mauvais: `MONGODB_URI = mongodb+srv://...`
   - ✅ Bon: `MONGODB_URI=mongodb+srv://...`

3. **Vérifier les guillemets**
   - Railway n'a PAS besoin de guillemets
   - ❌ Mauvais: `MONGODB_URI="mongodb+srv://..."`
   - ✅ Bon: `MONGODB_URI=mongodb+srv://...`

---

## 📋 Checklist de vérification complète

Avant de demander de l'aide, vérifiez ces points:

### Dans MongoDB Atlas:

- [ ] Le cluster est actif (pas en veille)
- [ ] L'utilisateur `aurelien_db_user` existe
- [ ] Le mot de passe est `Formation2025Al`
- [ ] L'utilisateur a les droits `readWrite` sur `formation-app-gestionmax`
- [ ] L'IP `0.0.0.0/0` est autorisée dans "Network Access"
- [ ] Le nom du cluster est bien `clustergestionmaxformat`

### Dans Railway:

- [ ] `MONGODB_URI` contient le bon mot de passe
- [ ] `MONGODB_URI` contient `/formation-app-gestionmax`
- [ ] `PAYLOAD_SECRET` est défini
- [ ] `NODE_ENV=production`
- [ ] Les variables ont été redéployées (redeploy après modification)
- [ ] Aucun espace avant/après les valeurs
- [ ] Pas de guillemets autour des valeurs

### Tests:

- [ ] `/api/health` retourne `{"status": "healthy"}`
- [ ] `/api/programmes` retourne des données
- [ ] Les logs Railway montrent "Connecté ✅"
- [ ] Pas d'erreur "bad auth" dans les logs

---

## 🆘 Commandes de diagnostic

### 1. Tester la connexion MongoDB depuis un terminal

```bash
# Installer mongosh si nécessaire
npm install -g mongosh

# Tester la connexion
mongosh "mongodb+srv://aurelien_db_user:Formation2025Al@clustergestionmaxformat.a9qrz87.mongodb.net/formation-app-gestionmax"

# Une fois connecté, vérifier les collections
show collections

# Compter les documents
db.programmes.countDocuments()
db.apprenants.countDocuments()
```

### 2. Vérifier les variables Railway depuis les logs

Dans les "Deploy Logs" Railway, cherchez:
```
🔍 MongoDB URI length: 143
```

Si vous voyez un nombre différent, l'URI n'est pas complète.

**Longueur attendue**: ~140-150 caractères

### 3. Forcer un rebuild propre sur Railway

```bash
# Dans l'interface Railway
Settings → "Clear Build Cache"
Puis: Deploy → "Redeploy"
```

---

## 📞 Support

Si après avoir vérifié tous ces points le problème persiste:

1. **Copiez les logs Railway complets** (onglet "Deploy Logs")
2. **Faites une capture d'écran** de vos variables d'environnement (masquez les mots de passe)
3. **Testez l'endpoint health** et copiez la réponse

---

## ✅ Configuration qui fonctionne en local

**Pour référence**, voici la configuration qui fonctionne en développement local:

```bash
# .env.development.local
MONGODB_URI=mongodb+srv://aurelien_db_user:Formation2025Al@clustergestionmaxformat.a9qrz87.mongodb.net/formation-app-gestionmax?retryWrites=true&w=majority
PAYLOAD_SECRET=your-secret-key-change-this-in-production-please-use-a-strong-secret
NODE_ENV=development
```

**La configuration Railway doit être identique**, sauf:
- `NODE_ENV=production`
- `NEXT_PUBLIC_SERVER_URL` et `NEXT_PUBLIC_PAYLOAD_URL` pointent vers Railway

---

**Dernière mise à jour**: 29 octobre 2025 - 13:30 UTC
**Statut local**: ✅ Fonctionnel - MongoDB connecté, données accessibles
**Statut Railway**: 🔍 En cours de diagnostic
