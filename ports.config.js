// Configuration des ports pour ce projet
module.exports = {
  // Port principal de l'application Next.js
  APP_PORT: 3010,

  // Port pour Payload CMS (si séparé)
  PAYLOAD_PORT: 3011,

  // Port pour MongoDB (par défaut)
  MONGODB_PORT: 27017,

  // URLs de base
  APP_URL: 'http://localhost:3010',
  PAYLOAD_URL: 'http://localhost:3011',

  // Configuration pour les scripts
  getEnvVars: () => ({
    PORT: 3010,
    PAYLOAD_PORT: 3011,
    MONGODB_URI: 'mongodb://localhost:27017/formation-app-gestionmax',
    PAYLOAD_SECRET: 'your-secret-key-change-this-in-production-formation-app',
    NEXT_PUBLIC_SERVER_URL: 'http://localhost:3010',
    NEXT_PUBLIC_PAYLOAD_URL: 'http://localhost:3011',
  }),
}
