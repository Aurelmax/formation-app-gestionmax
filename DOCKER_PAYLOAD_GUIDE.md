# 🐳 Guide Docker pour Payload CMS

## 🎯 Objectif

Isoler Payload CMS sur le port **3300** pour éviter les conflits avec votre application Next.js principale (port 3000).

## 🚀 Démarrage rapide

### 1. Démarrer Payload CMS en Docker

```bash
./start-payload-docker.sh
```

### 2. Accéder à l'interface

- **URL Payload CMS** : http://localhost:3300/admin
- **URL Application principale** : http://localhost:3000

## 📋 Commandes utiles

### Gestion du conteneur

```bash
# Voir les logs en temps réel
docker-compose logs -f payload-cms

# Arrêter Payload CMS
docker-compose stop payload-cms

# Redémarrer Payload CMS
docker-compose restart payload-cms

# Arrêter et supprimer le conteneur
docker-compose down
```

### Accès au conteneur

```bash
# Accéder au shell du conteneur
docker-compose exec payload-cms sh

# Exécuter des commandes npm dans le conteneur
docker-compose exec payload-cms npm run generate:types
```

## 🔧 Configuration

### Variables d'environnement

Les variables sont définies dans `docker-compose.yml` :

- `MONGODB_URI` : Connexion à MongoDB Atlas
- `PAYLOAD_SECRET` : Clé secrète Payload
- `NEXT_PUBLIC_SERVER_URL` : URL publique (port 3300)
- `NEXTAUTH_URL` : URL NextAuth (port 3300)

### Volumes montés

- `./src` : Code source
- `./public` : Fichiers publics
- `./media` : Uploads Payload
- Fichiers de configuration (next.config.ts, etc.)

## 🎯 Avantages

✅ **Isolation complète** : Payload CMS sur port 3300  
✅ **Pas de conflit** : Application principale sur port 3000  
✅ **Environnement reproductible** : Docker garantit la cohérence  
✅ **Facilité de déploiement** : Un seul conteneur à gérer  
✅ **Sauvegarde simple** : Volume `media` persistant  

## 🚨 Dépannage

### Le conteneur ne démarre pas

```bash
# Vérifier les logs
docker-compose logs payload-cms

# Reconstruire l'image
docker-compose build --no-cache payload-cms
```

### Problème de permissions

```bash
# Vérifier les permissions du dossier media
ls -la media/

# Corriger les permissions si nécessaire
sudo chown -R $USER:$USER media/
```

### Conflit de ports

```bash
# Vérifier les ports utilisés
netstat -tulpn | grep :3300

# Arrêter le conteneur
docker-compose down
```

## 📚 Collections Payload disponibles

- **Users** : Gestion des utilisateurs
- **Formations** : Catalogue des formations  
- **Apprenants** : Gestion des stagiaires
- **Media** : Upload d'images et documents

## 🔗 Liens utiles

- **Payload CMS** : http://localhost:3300/admin
- **Application principale** : http://localhost:3000
- **Dashboard React** : http://localhost:3000/admin
- **Documentation Payload** : https://payloadcms.com/docs
