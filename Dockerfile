# Dockerfile pour Payload CMS
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Copier le dossier scripts nécessaire pour le postinstall
COPY scripts ./scripts

# Installer les dépendances avec legacy peer deps
RUN npm ci --legacy-peer-deps

# Copier le code source
COPY . .

# Créer le répertoire media
RUN mkdir -p media

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "run", "dev"]
