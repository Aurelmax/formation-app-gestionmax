# Guide de connexion MongoDB dans VS Code

## 📋 Étapes pour se connecter à MongoDB Atlas

### 1️⃣ Se connecter à MongoDB Atlas

1. Dans VS Code, ouvrez le panneau MongoDB (icône avec une feuille dans la barre latérale gauche)
2. Cliquez sur **"CONNECTIONS"** → **"Add Connection"** (ou le bouton "+")
3. Collez cette chaîne de connexion :
   ```
   mongodb+srv://aurelien_db_user:UabCxoHI9J4C75j0@clustergestionmaxformat.a9qrz87.mongodb.net/formation-app-gestionmax
   ```
4. Appuyez sur **Entrée**
5. VS Code va se connecter à votre cluster Atlas

### 2️⃣ Explorer la base de données

Une fois connecté, vous verrez :

```
📁 clustergestionmaxformat.a9qrz87.mongodb.net
  └─ 📁 formation-app-gestionmax
      ├─ 📄 apprenants (2 documents)
      ├─ 📄 formations_personnalisees (1 document)
      ├─ 📄 programmes (8 documents)
      └─ 📄 users (3 documents)
```

### 3️⃣ Créer un Playground

1. Cliquez sur **"Create New Playground"**
2. Un fichier `playground-1.mongodb.js` sera créé avec ce contenu :

```javascript
// MongoDB Playground
// Sélectionner la base de données à utiliser.
use('formation-app-gestionmax')

// Insérer quelques documents dans la collection programmes
db.getCollection('programmes').find({}).limit(10)
```

### 4️⃣ Exécuter des requêtes

#### Exemple 1 : Lister tous les programmes

```javascript
use('formation-app-gestionmax')

db.programmes.find({})
```

#### Exemple 2 : Trouver un programme par code

```javascript
use('formation-app-gestionmax')

db.programmes.findOne({ codeFormation: 'WPDIGITAL' })
```

#### Exemple 3 : Compter les utilisateurs

```javascript
use('formation-app-gestionmax')

db.users.countDocuments()
```

#### Exemple 4 : Lister les apprenants avec leur email

```javascript
use('formation-app-gestionmax')

db.apprenants.find({}, { nom: 1, prenom: 1, email: 1 })
```

### 5️⃣ Exécuter le Playground

Pour exécuter les requêtes :

- **Bouton Play** : Cliquez sur le bouton ▶️ en haut à droite
- **Raccourci** : `Ctrl+Alt+P` (Windows/Linux) ou `Cmd+Alt+P` (Mac)

## 🎯 Commandes MongoDB utiles

### Lister toutes les bases de données

```javascript
show dbs
```

### Lister toutes les collections

```javascript
use('formation-app-gestionmax');
show collections
```

### Compter les documents dans une collection

```javascript
use('formation-app-gestionmax')
db.programmes.countDocuments()
```

### Trouver avec filtres

```javascript
use('formation-app-gestionmax')

// Trouver les programmes WordPress
db.programmes.find({
  titre: /WordPress/i,
})

// Trouver les utilisateurs admin
db.users.find({
  role: 'admin',
})
```

### Insérer un nouveau document

```javascript
use('formation-app-gestionmax')

db.programmes.insertOne({
  codeFormation: 'TEST123',
  titre: 'Formation Test',
  description: 'Description test',
  duree: 14,
  niveau: 'DEBUTANT',
  modalites: 'DISTANCIEL',
  prix: 1500,
})
```

### Mettre à jour un document

```javascript
use('formation-app-gestionmax')

db.programmes.updateOne({ codeFormation: 'WPDIGITAL' }, { $set: { prix: 2000 } })
```

### Supprimer un document

```javascript
use('formation-app-gestionmax')

db.programmes.deleteOne({
  codeFormation: 'TEST123',
})
```

## 🔍 Requêtes avancées

### Aggregation : Grouper par niveau

```javascript
use('formation-app-gestionmax')

db.programmes.aggregate([
  {
    $group: {
      _id: '$niveau',
      count: { $sum: 1 },
      prixMoyen: { $avg: '$prix' },
    },
  },
])
```

### Recherche avec regex

```javascript
use('formation-app-gestionmax')

db.programmes.find({
  titre: { $regex: 'wordpress', $options: 'i' },
})
```

### Trier par prix

```javascript
use('formation-app-gestionmax')

db.programmes.find({}).sort({ prix: -1 })
```

## 📊 Playground par défaut

Créez un fichier `playground-default.mongodb.js` avec vos requêtes fréquentes :

```javascript
// MongoDB Playground - Formation App GestionMax
// Base de données : formation-app-gestionmax

use('formation-app-gestionmax')

// ============================================
// STATISTIQUES GÉNÉRALES
// ============================================

print('📊 STATISTIQUES')
print('───────────────────────────────────────')
print('Programmes:', db.programmes.countDocuments())
print('Formations personnalisées:', db.formations_personnalisees.countDocuments())
print('Utilisateurs:', db.users.countDocuments())
print('Apprenants:', db.apprenants.countDocuments())

// ============================================
// DERNIERS PROGRAMMES CRÉÉS
// ============================================

print('\n📚 DERNIERS PROGRAMMES')
print('───────────────────────────────────────')
db.programmes
  .find({})
  .sort({ _id: -1 })
  .limit(5)
  .forEach(prog => {
    print(`- ${prog.titre} (${prog.codeFormation}) - ${prog.prix}€`)
  })

// ============================================
// UTILISATEURS PAR RÔLE
// ============================================

print('\n👥 UTILISATEURS PAR RÔLE')
print('───────────────────────────────────────')
db.users
  .aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
      },
    },
  ])
  .forEach(result => {
    print(`${result._id}: ${result.count}`)
  })
```

## 🆘 Dépannage

### Erreur : "Authentication failed"

- Vérifier que le mot de passe est correct
- Vérifier que l'utilisateur existe dans Atlas

### Erreur : "Connection timeout"

- Vérifier votre connexion Internet
- Vérifier que votre IP est autorisée dans Atlas Network Access

### Erreur : "Database not found"

- Vérifier le nom de la base : `formation-app-gestionmax`
- La base sera créée automatiquement lors de la première insertion

## 🔐 Sécurité

⚠️ **IMPORTANT** : Ne partagez jamais vos Playgrounds contenant des credentials !

Pour une utilisation sécurisée :

1. Utilisez des variables d'environnement
2. Ne commitez pas les Playgrounds avec credentials
3. Ajoutez `*.mongodb.js` à `.gitignore` si nécessaire

---

**Date**: 23 octobre 2025
**Base de données**: formation-app-gestionmax
**Cluster**: clustergestionmaxformat.a9qrz87.mongodb.net
