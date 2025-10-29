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

# Copier les fichiers statiques nécessaires dans le standalone
RUN cp -r public .next/standalone/public || true
RUN cp -r .next/static .next/standalone/.next/static || true

# Créer le répertoire media
RUN mkdir -p media

# Copier le script de démarrage
COPY start-server.sh ./
RUN chmod +x start-server.sh

# Exposer le port
EXPOSE 3000

# Commande de démarrage en production (standalone mode avec script wrapper)
CMD ["./start-server.sh"]
