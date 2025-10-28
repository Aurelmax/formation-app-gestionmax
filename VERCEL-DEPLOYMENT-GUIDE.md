# Guide de Déploiement Vercel - Formation App GestionMax

## 📋 Vue d'ensemble

Ce guide vous accompagne pas à pas pour déployer votre application Next.js sur Vercel.

---

## ✅ Prérequis

- [ ] Compte GitHub avec le repository `formation-app-gestionmax`
- [ ] Compte Vercel (gratuit) - https://vercel.com
- [ ] Base de données MongoDB Atlas configurée
- [ ] Variables d'environnement prêtes

---

## 🚀 Étapes de Déploiement

### 1. Connexion à Vercel

1. Allez sur https://vercel.com
2. Cliquez sur **"Sign Up"** ou **"Log In"**
3. Choisissez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à votre compte GitHub

### 2. Importer le Projet

1. Sur le dashboard Vercel, cliquez sur **"Add New..."** → **"Project"**
2. Sélectionnez votre repository : **`Aurelmax/formation-app-gestionmax`**
3. Cliquez sur **"Import"**

### 3. Configuration du Projet

#### Framework Preset
- Vercel détecte automatiquement **Next.js** ✅
- Laissez les paramètres par défaut

#### Build Settings
- **Build Command**: `npm run build` (par défaut)
- **Output Directory**: `.next` (par défaut)
- **Install Command**: `npm install` (par défaut)

### 4. ⚙️ Variables d'Environnement (CRITIQUE)

Cliquez sur **"Environment Variables"** et ajoutez :

#### ✅ Variables obligatoires

| Variable | Valeur | Description |
|----------|--------|-------------|
| `MONGODB_URI` | `mongodb+srv://user:password@cluster.mongodb.net/database` | URL de connexion MongoDB Atlas |
| `PAYLOAD_SECRET` | `votre_secret_aleatoire_32_caracteres` | Clé secrète pour Payload CMS |
| `NEXT_PUBLIC_SERVER_URL` | `https://formation-app-gestionmax.vercel.app` | URL de votre app Vercel |

#### 📝 Comment obtenir ces valeurs ?

**MONGODB_URI** :
1. Connectez-vous à MongoDB Atlas (https://cloud.mongodb.com)
2. Allez dans **Database** → **Connect**
3. Choisissez **"Connect your application"**
4. Copiez la chaîne de connexion
5. Remplacez `<password>` par votre mot de passe MongoDB
6. Remplacez `<database>` par le nom de votre base (ex: `gestionmax`)

**PAYLOAD_SECRET** :
- Générez une clé aléatoire : `openssl rand -base64 32`
- Ou utilisez : https://generate-secret.vercel.app/32

**NEXT_PUBLIC_SERVER_URL** :
- Format : `https://VOTRE-PROJET.vercel.app`
- Vous obtiendrez l'URL exacte après le premier déploiement
- Vous pourrez la mettre à jour ensuite

#### 🎯 Environnements

Pour chaque variable, sélectionnez :
- ✅ **Production**
- ✅ **Preview** (optionnel)
- ✅ **Development** (optionnel)

### 5. 🚀 Lancer le Déploiement

1. Vérifiez que toutes les variables sont ajoutées
2. Cliquez sur **"Deploy"**
3. Attendez 2-5 minutes ⏱️

---

## 🔍 Vérification du Déploiement

### Statut du Build

Vous verrez les étapes suivantes :
```
✓ Building...
✓ Deploying...
✓ Assigning domains...
✓ Ready!
```

### Tests à Effectuer

Une fois déployé, testez ces pages :

#### Pages Publiques (doivent fonctionner)
- ✅ `https://votre-app.vercel.app/` - Page d'accueil
- ✅ `https://votre-app.vercel.app/catalogue` - Catalogue
- ✅ `https://votre-app.vercel.app/apropos` - À propos
- ✅ `https://votre-app.vercel.app/blog` - Blog
- ✅ `https://votre-app.vercel.app/contact` - Contact

#### Routes API (nécessitent MongoDB configuré)
- ⚠️ `https://votre-app.vercel.app/api/programmes` - Liste des programmes
- ⚠️ `https://votre-app.vercel.app/admin` - Dashboard admin

---

## ❌ Problèmes Courants

### 1. Erreur 500 sur les routes API

**Symptôme** : Les pages publiques fonctionnent, mais `/api/programmes` retourne une erreur 500

**Solution** :
```bash
# Vérifiez que MONGODB_URI est correctement configuré
1. Allez dans Settings → Environment Variables
2. Vérifiez que MONGODB_URI existe
3. Testez la connexion MongoDB Atlas :
   - IP autorisée ? (0.0.0.0/0 pour autoriser toutes les IPs)
   - Mot de passe correct ?
   - Nom de la base correct ?
```

### 2. Variables d'environnement non prises en compte

**Solution** :
1. Allez dans **Deployments**
2. Cliquez sur les **3 points** à droite du dernier déploiement
3. Sélectionnez **"Redeploy"**
4. Cochez **"Use existing Build Cache"** = **OFF**
5. Cliquez sur **"Redeploy"**

### 3. Erreur "Module not found"

**Solution** :
```bash
# Dans votre terminal local
npm install
git add package-lock.json
git commit -m "fix: update dependencies"
git push origin main
# Vercel redéploiera automatiquement
```

### 4. Images ne s'affichent pas

**Solution** :
Vérifiez que vos images sont bien dans le dossier `public/` :
```
public/
  ├── formation-wordpress-antibes.webp
  └── visuel-formation-gestionmax-antibes.png
```

---

## 🔄 Mises à Jour après Déploiement

### Déploiement Automatique

Chaque fois que vous pushez sur GitHub, Vercel redéploie automatiquement :

```bash
git add .
git commit -m "votre message"
git push origin main
# ✨ Vercel déploie automatiquement en 2-3 min
```

### Déploiement Manuel

Si vous voulez forcer un nouveau déploiement :
1. Allez dans **Deployments**
2. Cliquez sur **"Redeploy"**

---

## 📊 Monitoring et Logs

### Voir les Logs de Build

1. Allez dans **Deployments**
2. Cliquez sur un déploiement
3. Consultez les logs dans **"Building"** et **"Functions"**

### Logs d'Exécution (Runtime)

Pour voir les logs des routes API :
1. **Deployments** → Dernier déploiement
2. Cliquez sur **"Functions"** en bas
3. Sélectionnez une route API (ex: `/api/programmes`)
4. Consultez les logs en temps réel

---

## 🌐 Configuration du Domaine Personnalisé (Optionnel)

### Ajouter votre Propre Domaine

1. Allez dans **Settings** → **Domains**
2. Cliquez sur **"Add"**
3. Entrez votre domaine : `formation.gestionmax.fr`
4. Suivez les instructions DNS :
   - Type : **CNAME**
   - Name : `formation` ou `@`
   - Value : `cname.vercel-dns.com`

5. Mettez à jour la variable d'environnement :
   ```
   NEXT_PUBLIC_SERVER_URL=https://formation.gestionmax.fr
   ```

---

## 📋 Checklist Finale

Avant de considérer le déploiement comme terminé :

### Configuration Vercel
- [ ] Projet importé depuis GitHub
- [ ] Build réussi (statut vert ✅)
- [ ] URL de production fonctionnelle

### Variables d'Environnement
- [ ] `MONGODB_URI` configurée
- [ ] `PAYLOAD_SECRET` configurée
- [ ] `NEXT_PUBLIC_SERVER_URL` configurée
- [ ] Toutes les variables appliquées à **Production**

### Tests Fonctionnels
- [ ] Page d'accueil charge correctement
- [ ] Logo s'affiche
- [ ] Images de hero s'affichent
- [ ] Navigation fonctionne (catalogue, blog, etc.)
- [ ] `/api/programmes` retourne des données (si MongoDB configuré)

### MongoDB Atlas
- [ ] Base de données créée
- [ ] Adresse IP autorisée : `0.0.0.0/0` (pour Vercel)
- [ ] Utilisateur avec droits lecture/écriture
- [ ] Collections créées (programmes, apprenants, etc.)

---

## 🆘 Support

### Si rien ne fonctionne

1. **Vérifiez les logs Vercel** :
   - Deployments → Dernier déploiement → Logs

2. **Vérifiez MongoDB** :
   ```bash
   # Testez la connexion depuis votre machine locale
   npm run dev
   # Si ça marche en local mais pas sur Vercel = problème de variables d'env
   ```

3. **Redéployez from scratch** :
   - Supprimez le projet sur Vercel
   - Ré-importez depuis GitHub
   - Reconfigurez les variables d'environnement

### Ressources Utiles

- Documentation Vercel : https://vercel.com/docs
- Documentation Next.js : https://nextjs.org/docs
- MongoDB Atlas : https://docs.atlas.mongodb.com/

---

## 📝 Notes Importantes

### Limitations du Plan Gratuit Vercel

- ✅ Déploiements illimités
- ✅ 100 GB de bande passante/mois
- ✅ Support des variables d'environnement
- ⚠️ Timeout des fonctions : 10 secondes
- ⚠️ Pas de cron jobs

### Sécurité

- ⚠️ Ne commitez **JAMAIS** vos `.env` files dans Git
- ✅ Utilisez les variables d'environnement Vercel
- ✅ Activez l'IP Whitelist sur MongoDB en production (après les tests)

---

## ✅ Votre Déploiement est Prêt !

Une fois cette checklist complétée, votre application est en production et accessible au monde entier ! 🎉

URL de production : **https://formation-app-gestionmax.vercel.app**
