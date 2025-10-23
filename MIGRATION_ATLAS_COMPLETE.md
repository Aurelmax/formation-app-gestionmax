# Migration MongoDB vers Atlas - Terminée ✅

## 📊 Résumé de la migration

La migration de MongoDB local vers MongoDB Atlas a été **complétée avec succès** le 23 octobre 2025.

### Données migrées

| Collection                    | Documents migrés |
| ----------------------------- | ---------------- |
| **programmes**                | 8 documents ✅   |
| **formations_personnalisees** | 1 document ✅    |
| **users**                     | 3 documents ✅   |
| **apprenants**                | 2 documents ✅   |
| **Total**                     | **14 documents** |

### Collections vides (créées mais sans données)

- rendez-vous
- formations
- contacts
- articles
- categories
- tags
- media
- payload-preferences
- payload-migrations
- payload-locked-documents

## 🔧 Configuration

### MongoDB Atlas (Cloud - Production)

```
URI: mongodb+srv://aurelien_db_user:***@clustergestionmaxformat.a9qrz87.mongodb.net/formation-app-gestionmax
Base de données: formation-app-gestionmax
Collections: 4 actives (avec données)
```

### MongoDB Local (Docker - Backup)

```
URI: mongodb://localhost:27017/formation-app-gestionmax
Base de données: formation-app-gestionmax
Collections: 14 totales
```

## 📁 Fichiers de configuration

### `.env` - Configuration Atlas (Principal)

```env
MONGODB_URI=mongodb+srv://aurelien_db_user:UabCxoHI9J4C75j0@clustergestionmaxformat.a9qrz87.mongodb.net/formation-app-gestionmax?retryWrites=true&w=majority
```

### `.env.local` - Configuration avec fallback local

```env
# Configuration MongoDB Atlas (Cloud - Production)
MONGODB_URI=mongodb+srv://aurelien_db_user:UabCxoHI9J4C75j0@clustergestionmaxformat.a9qrz87.mongodb.net/formation-app-gestionmax?retryWrites=true&w=majority

# Configuration MongoDB Local (Docker - Développement uniquement)
# MONGODB_URI=mongodb://localhost:27017/formation-app-gestionmax
```

## 🚀 Scripts de migration créés

### 1. `migrate-to-atlas.js`

Script principal de migration qui :

- Connecte aux deux bases (locale et Atlas)
- Migre toutes les collections automatiquement
- Affiche des statistiques détaillées
- Gère les erreurs gracieusement

**Usage:**

```bash
node migrate-to-atlas.js
```

### 2. `verify-atlas-data.js`

Script de vérification qui :

- Vérifie la connexion Atlas
- Liste toutes les collections
- Compte les documents par collection
- Affiche des exemples de structure

**Usage:**

```bash
node verify-atlas-data.js
```

### 3. `test-mongodb-atlas.js`

Script de test rapide de connexion Atlas

**Usage:**

```bash
node test-mongodb-atlas.js
```

## ✅ Vérification post-migration

### Résultats des tests

```
✅ Connexion MongoDB Atlas réussie!
📊 Base de données: formation-app-gestionmax
📦 Collections (4) :
   - apprenants (2 documents)
   - formations_personnalisees (1 document)
   - programmes (8 documents)
   - users (3 documents)
📊 Total: 14 documents dans 4 collections
```

### Intégrité des données

- ✅ Tous les documents ont été migrés avec succès
- ✅ Aucune perte de données
- ✅ Structure des documents préservée
- ✅ Relations entre documents maintenues

## 🔐 Sécurité

### Recommandations

1. ⚠️ **IMPORTANT**: Ne jamais commit les fichiers `.env` et `.env.local` dans Git
2. ✅ Ajouter ces fichiers à `.gitignore`
3. 🔒 Utiliser des variables d'environnement en production
4. 🔑 Changer le `PAYLOAD_SECRET` pour un secret fort en production

### Fichiers `.gitignore`

Vérifier que ces lignes sont présentes :

```gitignore
.env
.env.local
.env.*.local
```

## 📝 Prochaines étapes

### Pour utiliser Atlas en production

1. **Mettre à jour PAYLOAD_SECRET**

   ```env
   PAYLOAD_SECRET=<générer-un-secret-fort-ici>
   ```

2. **Désactiver les données mock**

   ```env
   NEXT_PUBLIC_USE_MOCK_DATA=false
   ```

3. **Tester l'application**

   ```bash
   npm run dev
   ```

4. **Accéder à Payload CMS**
   - URL: http://localhost:3010/payload-cms
   - Vérifier que les données Atlas sont bien accessibles

### Pour revenir à MongoDB local (si nécessaire)

Décommenter la ligne locale dans `.env.local` :

```env
# Commenter Atlas
# MONGODB_URI=mongodb+srv://...

# Décommenter local
MONGODB_URI=mongodb://localhost:27017/formation-app-gestionmax
```

Et redémarrer Docker MongoDB :

```bash
docker start mongodb
```

## 🎯 VS Code - Connexion MongoDB

### String de connexion pour VS Code

```
mongodb+srv://aurelien_db_user:UabCxoHI9J4C75j0@clustergestionmaxformat.a9qrz87.mongodb.net/formation-app-gestionmax
```

### Instructions

1. Installer l'extension "MongoDB for VS Code"
2. Ouvrir la palette de commandes (Ctrl+Shift+P)
3. Chercher "MongoDB: Connect"
4. Coller la string de connexion
5. Explorer la base `formation-app-gestionmax`

## 📊 Monitoring Atlas

### Accès au Dashboard MongoDB Atlas

1. Aller sur https://cloud.mongodb.com
2. Se connecter avec les credentials
3. Sélectionner le cluster `clustergestionmaxformation`
4. Voir les métriques, logs et alertes

## 🆘 Dépannage

### Problème: Connexion refuse

**Solution**: Vérifier que l'IP est autorisée dans Atlas Network Access

### Problème: Authentification échoue

**Solution**: Vérifier le mot de passe de l'utilisateur `aurelien_db_user`

### Problème: Collection vide

**Solution**: Relancer la migration avec `node migrate-to-atlas.js`

---

**Date de migration**: 23 octobre 2025
**Statut**: ✅ Complétée avec succès
**Documents migrés**: 14/14
**Erreurs**: 0
