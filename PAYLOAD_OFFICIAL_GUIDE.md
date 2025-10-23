# 🚀 Guide Officiel Payload CMS - Intégration Next.js

## 📋 **Basé sur la documentation officielle**

D'après le [dépôt officiel Payload CMS](https://github.com/payloadcms/payload.git), Payload est **natif Next.js** et conçu pour s'intégrer directement dans votre dossier `/app` existant.

## 🎯 **Avantages de l'approche officielle**

✅ **Next.js natif** : Payload s'intègre parfaitement dans votre `/app` folder  
✅ **Pas de Docker complexe** : Utilise votre installation Next.js existante  
✅ **Mode headless** : Payload fonctionne comme CMS backend  
✅ **TypeScript complet** : Types automatiques pour vos données  
✅ **Déploiement simple** : Fonctionne sur Vercel, Cloudflare, etc.

## 🚀 **Démarrage rapide**

### 1. Démarrer Payload CMS sur le port 3300

```bash
./start-payload-integrated.sh
```

### 2. Accéder aux interfaces

- **Payload CMS Admin** : http://localhost:3300/admin
- **Votre application** : http://localhost:3000
- **Dashboard React** : http://localhost:3000/admin

## 📚 **Collections Payload disponibles**

D'après votre configuration `payload.config.ts` :

### 👥 **Users** (Utilisateurs)

- Gestion des utilisateurs avec authentification
- Rôles : Admin, Formateur, Apprenant
- Champs : nom, email, rôles

### 📚 **Formations** (Formations)

- Catalogue des formations
- Champs : titre, description, durée, niveau, modalités, prix
- Compétences associées

### 🎓 **Apprenants** (Stagiaires)

- Gestion des apprenants
- Champs : nom, prénom, email, téléphone, adresse
- Programmes suivis, progression

### 📁 **Media** (Médias)

- Upload d'images et documents
- Gestion des fichiers

## 🔧 **Configuration actuelle**

Votre configuration Payload est déjà optimale :

```typescript
// src/payload.config.ts
export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- GestionMax CMS (Docker)',
    },
  },
  editor: lexicalEditor({}),
  collections: [
    // Users, Formations, Apprenants, Media
  ],
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),
})
```

## 🌐 **Intégration avec votre application**

### API Payload disponible sur :

- **Port 3300** : Interface admin Payload
- **Port 3000** : Votre application Next.js

### Utilisation en mode headless :

```typescript
// Dans vos composants React
import { getPayload } from '@/payload'

// Récupérer des formations
const formations = await payload.find({
  collection: 'formations',
  limit: 10,
})

// Récupérer des apprenants
const apprenants = await payload.find({
  collection: 'apprenants',
  where: {
    statut: { equals: 'Actif' },
  },
})
```

## 🎯 **Prochaines étapes**

1. **Démarrer Payload** : `./start-payload-integrated.sh`
2. **Créer un utilisateur admin** via http://localhost:3300/admin
3. **Configurer vos collections** : Formations, Apprenants, etc.
4. **Intégrer l'API** dans votre application Next.js

## 📖 **Ressources officielles**

- [Documentation Payload](https://payloadcms.com/docs)
- [Dépôt GitHub](https://github.com/payloadcms/payload.git)
- [Exemples officiels](https://github.com/payloadcms/payload/tree/main/examples)
- [Templates](https://github.com/payloadcms/payload/tree/main/templates)

## 🚨 **Dépannage**

### Port 3300 occupé

```bash
lsof -ti:3300 | xargs kill -9
```

### Variables d'environnement

Vérifiez votre `.env.local` :

```env
MONGODB_URI=mongodb+srv://...
PAYLOAD_SECRET=your-secret-key
NEXT_PUBLIC_SERVER_URL=http://localhost:3300
```

### Logs Payload

```bash
# Voir les logs en temps réel
tail -f logs/payload.log
```

---

**🎉 Payload CMS est maintenant parfaitement intégré dans votre application Next.js !**
