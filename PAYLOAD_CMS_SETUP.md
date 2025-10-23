# 🚀 Guide d'installation Payload CMS Headless dans Next.js

## 📋 Prérequis

### Système

- **Node.js** : ≥18.0.0 (recommandé : v20.x)
- **npm** : ≥8.0.0
- **MongoDB Atlas** : Compte et cluster créé

### Projet Next.js

- **Next.js** : ≥13.0.0 (App Router)
- **React** : ≥18.0.0
- **TypeScript** : ≥4.9.0

## 🛠️ Installation

### 1. Installation des packages

```bash
# Installation des packages Payload CMS
npm install payload@latest @payloadcms/db-mongodb@latest @payloadcms/richtext-lexical@latest @payloadcms/next@latest --legacy-peer-deps

# Packages de développement
npm install tsx dotenv --save-dev --legacy-peer-deps
```

> **Note** : `--legacy-peer-deps` nécessaire pour éviter les conflits avec React 19

### 2. Configuration MongoDB Atlas

#### Créer un cluster MongoDB Atlas

1. Aller sur [MongoDB Atlas](https://cloud.mongodb.com/)
2. Créer un nouveau cluster
3. Créer un utilisateur avec permissions de lecture/écriture
4. Obtenir la connection string

#### Variables d'environnement (.env.local)

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority&appName=AppName

# Payload CMS Configuration
PAYLOAD_SECRET=your-secret-key-change-this-in-production
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Next.js Configuration (optionnel)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-this-in-production
```

## ⚙️ Configuration

### 1. Configuration Payload (src/payload.config.ts)

```typescript
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'

export default buildConfig({
  admin: {
    user: 'users',
  },
  editor: lexicalEditor({}),
  collections: [
    {
      slug: 'users',
      auth: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Formateur', value: 'formateur' },
            { label: 'Apprenant', value: 'apprenant' },
          ],
          defaultValue: 'apprenant',
          required: true,
        },
      ],
    },
    {
      slug: 'formations',
      fields: [
        {
          name: 'titre',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
        },
        {
          name: 'duree',
          type: 'number',
          required: true,
        },
        {
          name: 'niveau',
          type: 'select',
          options: [
            { label: 'Débutant', value: 'Débutant' },
            { label: 'Intermédiaire', value: 'Intermédiaire' },
            { label: 'Avancé', value: 'Avancé' },
          ],
          required: true,
        },
        {
          name: 'modalites',
          type: 'select',
          options: [
            { label: 'Présentiel', value: 'Présentiel' },
            { label: 'Distanciel', value: 'Distanciel' },
            { label: 'Hybride', value: 'Hybride' },
          ],
          required: true,
        },
        {
          name: 'prix',
          type: 'number',
          required: true,
        },
        {
          name: 'competences',
          type: 'array',
          fields: [
            {
              name: 'competence',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'codeFormation',
          type: 'text',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      slug: 'apprenants',
      fields: [
        {
          name: 'nom',
          type: 'text',
          required: true,
        },
        {
          name: 'prenom',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          unique: true,
        },
        {
          name: 'telephone',
          type: 'text',
        },
        {
          name: 'statut',
          type: 'select',
          options: [
            { label: 'Inscrit', value: 'inscrit' },
            { label: 'En cours', value: 'en_cours' },
            { label: 'Terminé', value: 'termine' },
            { label: 'Abandonné', value: 'abandonne' },
          ],
          defaultValue: 'inscrit',
          required: true,
        },
        {
          name: 'formations',
          type: 'relationship',
          relationTo: 'formations',
          hasMany: true,
        },
        {
          name: 'dateInscription',
          type: 'date',
          required: true,
        },
      ],
    },
    {
      slug: 'media',
      upload: {
        staticDir: 'media',
        imageSizes: [
          {
            name: 'thumbnail',
            width: 400,
            height: 300,
            position: 'centre',
          },
          {
            name: 'card',
            width: 768,
            height: 1024,
            position: 'centre',
          },
        ],
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/*'],
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [],
  db: mongooseAdapter({
    url: process.env.MONGODB_URI!,
  }),
})
```

### 2. Client Payload (src/payload.ts)

```typescript
import { getPayload } from 'payload'
import config from './payload.config'

let cached = (global as any).payload

if (!cached) {
  cached = (global as any).payload = { client: null, promise: null }
}

export const getPayloadClient = async () => {
  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = getPayload({ config })
  }

  try {
    cached.client = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.client
}
```

### 3. Configuration Next.js (next.config.ts)

```typescript
import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  serverExternalPackages: ['mongoose'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('mongoose')
    }
    return config
  },
}

export default withPayload(nextConfig)
```

> **Note** : Évitez Turbopack avec Payload CMS pour éviter les erreurs HMR

### 4. Route API (src/app/api/[...slug]/route.ts)

```typescript
import { getPayload } from 'payload'
import config from '../../../payload.config'
import { NextRequest } from 'next/server'

export const GET = async (req: NextRequest) => {
  const payload = await getPayload({ config })
  return payload(req)
}

export const POST = async (req: NextRequest) => {
  const payload = await getPayload({ config })
  return payload(req)
}
```

### 5. Scripts package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:turbo": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "payload": "payload",
    "generate:types": "payload generate:types",
    "generate:importmap": "payload generate:importmap",
    "seed": "tsx src/scripts/seed.ts"
  }
}
```

> **Note** : Utilisez `npm run dev` (sans Turbopack) pour éviter les erreurs HMR avec Payload

### 6. Script de seed (src/scripts/seed.ts)

```typescript
import { config } from 'dotenv'
import { getPayload } from 'payload'
import payloadConfig from '../payload.config'

// Charger les variables d'environnement
config({ path: '.env.local' })

// Vérifier que PAYLOAD_SECRET est défini
if (!process.env.PAYLOAD_SECRET) {
  console.error("❌ PAYLOAD_SECRET n'est pas défini dans .env.local")
  process.exit(1)
}

const seed = async () => {
  console.log('🔑 PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET ? '✅ Défini' : '❌ Manquant')
  console.log('🗄️ MONGODB_URI:', process.env.MONGODB_URI ? '✅ Défini' : '❌ Manquant')

  const payload = await getPayload({ config: payloadConfig })

  try {
    // Créer un utilisateur admin
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@gestionmax.fr',
        password: 'admin123',
        name: 'Administrateur GestionMax',
        role: 'admin',
      },
    })

    console.log('✅ Utilisateur admin créé avec succès!')
    console.log('📧 Email: admin@gestionmax.fr')
    console.log('🔑 Mot de passe: admin123')
    console.log('🌐 Accès: http://localhost:3000/admin')
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'utilisateur:", error)
  }
}

seed()
```

## 🚀 Démarrage

### Option 1 : Démarrage local

#### 1. Créer le répertoire media

```bash
mkdir -p media
```

#### 2. Démarrer le serveur

```bash
npm run dev
```

#### 3. Accéder à l'interface d'administration

- **URL** : http://localhost:3000/admin
- **Premier utilisateur** : Créer via l'interface web

### Option 2 : Démarrage avec Docker (Recommandé)

#### 1. Construire l'image Docker

```bash
./docker-scripts.sh build
```

#### 2. Démarrer Payload CMS

```bash
./docker-scripts.sh up
```

#### 3. Accéder à l'interface d'administration

- **URL** : http://localhost:3300/admin
- **Premier utilisateur** : Créer via l'interface web

#### 4. Commandes Docker utiles

```bash
# Voir les logs
./docker-scripts.sh logs

# Redémarrer
./docker-scripts.sh restart

# Arrêter
./docker-scripts.sh down

# Accéder au shell
./docker-scripts.sh shell

# Nettoyer
./docker-scripts.sh clean
```

> **Note** : Docker isole Payload CMS sur le port 3300, évitant les conflits avec d'autres projets.

## 📚 Utilisation

### 1. Interface d'administration

- **Collections** : Gérer les données (formations, apprenants, etc.)
- **Media** : Upload d'images et documents
- **Users** : Gestion des utilisateurs et rôles

### 2. API REST

```typescript
// Récupérer toutes les formations
const formations = await fetch('/api/formations').then(res => res.json())

// Récupérer une formation par ID
const formation = await fetch('/api/formations/123').then(res => res.json())

// Créer une nouvelle formation
const newFormation = await fetch('/api/formations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    titre: 'Nouvelle formation',
    description: 'Description...',
    duree: 40,
    niveau: 'Débutant',
    modalites: 'Présentiel',
    prix: 1500,
  }),
})
```

### 3. Intégration dans les composants

```typescript
// src/components/FormationsList.tsx
'use client'

import { useEffect, useState } from 'react'

interface Formation {
  id: string
  titre: string
  description: string
  duree: number
  niveau: string
  modalites: string
  prix: number
}

export function FormationsList() {
  const [formations, setFormations] = useState<Formation[]>([])

  useEffect(() => {
    fetch('/api/formations')
      .then(res => res.json())
      .then(data => setFormations(data.docs))
  }, [])

  return (
    <div>
      {formations.map(formation => (
        <div key={formation.id}>
          <h3>{formation.titre}</h3>
          <p>{formation.description}</p>
          <p>Durée: {formation.duree}h - Niveau: {formation.niveau}</p>
          <p>Modalités: {formation.modalites} - Prix: {formation.prix}€</p>
        </div>
      ))}
    </div>
  )
}
```

## 🔧 Dépannage

### Problèmes courants

1. **Erreur "missing secret key"**
   - Vérifier que `PAYLOAD_SECRET` est défini dans `.env.local`
   - Redémarrer le serveur après modification

2. **Conflits de dépendances**
   - Utiliser `--legacy-peer-deps` pour l'installation
   - Vérifier la compatibilité des versions

3. **Problèmes de connexion MongoDB**
   - Vérifier la connection string
   - S'assurer que l'IP est autorisée dans MongoDB Atlas

4. **Erreurs TypeScript**
   - Générer les types : `npm run generate:types`
   - Vérifier la configuration TypeScript

5. **Erreurs HMR avec Turbopack**
   - Utiliser `npm run dev` au lieu de `npm run dev:turbo`
   - Supprimer le dossier `.next` et redémarrer
   - Éviter Turbopack avec Payload CMS

6. **Erreurs JavaScript webpack**
   - Supprimer le dossier `.next` et `node_modules/.cache`
   - Redémarrer le serveur proprement
   - Vérifier la configuration Next.js

7. **Erreurs d'hydratation React**
   - Utiliser `useState` et `useEffect` pour éviter les différences serveur/client
   - Ajouter un état de montage pour les composants dynamiques
   - Vérifier l'ordre des éléments dans les listes

### Commandes utiles

```bash
# Générer les types TypeScript
npm run generate:types

# Générer l'import map
npm run generate:importmap

# Exécuter le script de seed
npm run seed

# Vérifier la configuration
npm run type-check

# Nettoyer le cache en cas d'erreurs
rm -rf .next node_modules/.cache
npm run dev
```

## 📖 Ressources

- [Documentation Payload CMS](https://payloadcms.com/docs)
- [Configuration MongoDB](https://payloadcms.com/docs/database/mongodb)
- [API REST](https://payloadcms.com/docs/rest-api/overview)
- [Collections](https://payloadcms.com/docs/configuration/collections)

## 🎯 Avantages

- ✅ **CMS Headless** : Séparation frontend/backend
- ✅ **TypeScript** : Typage fort et autocomplétion
- ✅ **API REST/GraphQL** : Flexibilité d'intégration
- ✅ **Interface Admin** : Gestion intuitive du contenu
- ✅ **Upload de fichiers** : Gestion des médias
- ✅ **Authentification** : Système d'utilisateurs intégré
- ✅ **Extensible** : Plugins et personnalisations

---

**Créé pour GestionMax Formation - 2024** 🚀
