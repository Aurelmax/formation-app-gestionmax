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

# Variables d'environnement pour le build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js pour production
RUN npm run build

# Créer le répertoire media
RUN mkdir -p media

# Exposer le port
EXPOSE 3000

# Commande de démarrage en production
CMD ["npm", "start"]
