# 🗄️ GUIDE D'INSTALLATION MONGODB

## 📋 PRÉREQUIS

Pour que la migration des services mock vers la base de données fonctionne, MongoDB doit être installé et configuré.

---

## 🚀 INSTALLATION MONGODB

### **Option 1 : Installation via Docker (Recommandé)**

```bash
# Créer un conteneur MongoDB
docker run --name mongodb-formation \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -e MONGO_INITDB_DATABASE=formation-app-gestionmax \
  -d mongo:latest

# Vérifier que le conteneur fonctionne
docker ps | grep mongodb-formation
```

### **Option 2 : Installation native Ubuntu/Debian**

```bash
# Importer la clé publique MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Ajouter le repository MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Mettre à jour les packages
sudo apt-get update

# Installer MongoDB
sudo apt-get install -y mongodb-org

# Démarrer MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Vérifier le statut
sudo systemctl status mongod
```

### **Option 3 : Installation via Snap**

```bash
# Installer MongoDB via snap
sudo snap install mongodb

# Démarrer MongoDB
sudo snap start mongodb
```

---

## 🔧 CONFIGURATION

### **1. Vérifier la connexion**

```bash
# Se connecter à MongoDB
mongosh

# Ou avec authentification
mongosh -u admin -p password
```

### **2. Créer la base de données**

```javascript
// Dans mongosh
use formation-app-gestionmax

// Créer un utilisateur pour l'application
db.createUser({
  user: "formation-user",
  pwd: "formation-password",
  roles: [
    { role: "readWrite", db: "formation-app-gestionmax" }
  ]
})
```

### **3. Mettre à jour .env.local (si nécessaire)**

```bash
# Si vous utilisez l'authentification
MONGODB_URI=mongodb://formation-user:formation-password@localhost:27017/formation-app-gestionmax

# Si pas d'authentification (développement uniquement)
MONGODB_URI=mongodb://localhost:27017/formation-app-gestionmax
```

---

## 🧪 TEST DE CONNEXION

### **1. Tester avec le script de vérification**

```bash
cd /home/gestionmax-aur-lien/CascadeProjects/formation-app-gestionmax
npx tsx src/scripts/check-collections.ts
```

### **2. Tester via l'interface Payload**

```bash
# Démarrer l'application
npm run dev

# Accéder à l'interface Payload
# http://localhost:3000/admin/payload
```

---

## 📊 COLLECTIONS CONFIGURÉES

Les collections suivantes sont maintenant configurées dans Payload CMS :

### **✅ Collections existantes :**
- **`users`** - Utilisateurs et authentification
- **`programmes`** - Formations et programmes
- **`media`** - Fichiers et images

### **✅ Collections ajoutées :**
- **`apprenants`** - Étudiants et apprenants
- **`rendez-vous`** - Rendez-vous et appointments
- **`articles`** - Articles de blog
- **`categories`** - Catégories d'articles
- **`tags`** - Tags d'articles
- **`contacts`** - Messages de contact

### **✅ Collections déjà présentes :**
- **`formations`** - (alias pour programmes)

---

## 🚀 MIGRATION DES DONNÉES

Une fois MongoDB installé et configuré :

### **1. Exécuter le script de migration**

```bash
npx tsx src/scripts/migrate-mock-data.ts
```

### **2. Vérifier les données importées**

```bash
npx tsx src/scripts/check-collections.ts
```

### **3. Tester l'interface admin**

- Accéder à `http://localhost:3000/admin/payload`
- Vérifier que toutes les collections sont visibles
- Tester la création/modification de documents

---

## ⚠️ DÉPANNAGE

### **Erreur de connexion MongoDB**

```bash
# Vérifier que MongoDB fonctionne
sudo systemctl status mongod

# Vérifier les logs
sudo journalctl -u mongod

# Redémarrer MongoDB
sudo systemctl restart mongod
```

### **Erreur de permissions**

```bash
# Vérifier les permissions du répertoire de données
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown -R mongodb:mongodb /var/log/mongodb
```

### **Port déjà utilisé**

```bash
# Vérifier quel processus utilise le port 27017
sudo lsof -i :27017

# Arrêter le processus si nécessaire
sudo kill -9 <PID>
```

---

## 📈 PROCHAINES ÉTAPES

1. **✅ Installer MongoDB** (ce guide)
2. **🔄 Migrer les données mock** (`migrate-mock-data.ts`)
3. **🔄 Remplacer les services mock** par des appels Payload API
4. **🔄 Tester toutes les fonctionnalités**
5. **🔄 Désactiver le mode mock** (`NEXT_PUBLIC_USE_MOCK_DATA=false`)

---

## 🎯 RÉSULTAT ATTENDU

Après installation et configuration :

- ✅ MongoDB fonctionne sur le port 27017
- ✅ Base de données `formation-app-gestionmax` créée
- ✅ 10 collections Payload configurées
- ✅ Interface admin Payload accessible
- ✅ Données mock migrées vers MongoDB
- ✅ Services mock remplacés par des APIs réelles
