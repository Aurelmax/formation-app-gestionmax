# 🚀 Gestion des Ports - Formation GestionMax

## 📋 **Ports assignés à ce projet**

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **Application Next.js** | **3010** | http://localhost:3010 | Interface principale |
| **Payload CMS** | **3011** | http://localhost:3011 | Back office CMS |
| **MongoDB** | **27017** | mongodb://localhost:27017 | Base de données |

## 🎯 **Commandes de démarrage**

### Option 1 : Production (recommandé)
```bash
# Build et démarrage en production
npm run build:production

# Ou en une commande
npm run production
```

### Option 2 : Script automatique
```bash
npm run start:formation
```

### Option 3 : Commandes manuelles
```bash
# Développement sur port 3010
npm run dev:3010

# Production sur port 3010
npm run start:3010

# Payload CMS sur port 3011
npm run payload:3011
```

## 🔧 **Résolution des conflits de ports**

### Vérifier les ports utilisés
```bash
# Voir tous les ports utilisés
netstat -tulpn | grep LISTEN

# Voir spécifiquement les ports 3000-3020
netstat -tulpn | grep LISTEN | grep -E ":(300[0-9]|301[0-9]|302[0-9])"
```

### Libérer un port
```bash
# Trouver le processus utilisant le port
lsof -Pi :3010 -sTCP:LISTEN

# Arrêter le processus (remplacer PID par l'ID du processus)
kill PID
```

## 📁 **Configuration par projet**

Chaque projet a ses propres ports :

| Projet | Port App | Port CMS | Port DB |
|--------|----------|----------|---------|
| **Formation GestionMax** | 3010 | 3011 | 27017 |
| **Autre projet 1** | 3000 | 3001 | 27017 |
| **Autre projet 2** | 3002 | 3003 | 27017 |
| **Autre projet 3** | 3004 | 3005 | 27017 |

## 🚨 **En cas de conflit**

1. **Vérifiez les ports** : `netstat -tulpn | grep LISTEN`
2. **Arrêtez les processus** : `kill $(lsof -Pi :PORT -sTCP:LISTEN -t)`
3. **Redémarrez** : `npm run start:formation`

## 💡 **Astuces**

- **Bookmark** : Sauvegardez http://localhost:3010 dans vos favoris
- **Scripts** : Utilisez `npm run start:formation` pour démarrer facilement
- **Variables d'environnement** : Les ports sont définis dans `ports.config.js`
