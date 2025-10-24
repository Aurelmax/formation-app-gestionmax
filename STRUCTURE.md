# Structure du projet après migration Payload v3

## 📁 Architecture des dossiers

```
formation-app-gestionmax/
├── src/
│   ├── app/
│   │   ├── (app)/                      # 🎯 Ton application Next.js
│   │   │   ├── layout.tsx              # Layout avec <html>/<body>
│   │   │   ├── page.tsx                # Page d'accueil
│   │   │   ├── (public)/               # Pages publiques
│   │   │   │   ├── apropos/
│   │   │   │   ├── blog/
│   │   │   │   ├── catalogue/
│   │   │   │   ├── contact/
│   │   │   │   └── ...
│   │   │   └── dashboard/              # 📊 Admin custom (ancien /admin)
│   │   │       ├── apprenants/
│   │   │       ├── blog/
│   │   │       ├── contacts/
│   │   │       ├── formation-programmes/
│   │   │       ├── login/
│   │   │       ├── logout/
│   │   │       ├── programmes/
│   │   │       ├── rendez-vous/
│   │   │       └── utilisateurs/
│   │   ├── (payload)/                  # 🔧 Payload CMS isolé
│   │   │   └── admin/
│   │   │       ├── [[...segments]]/
│   │   │       │   ├── page.tsx
│   │   │       │   └── not-found.tsx
│   │   │       ├── layout.tsx          # RootLayout Payload
│   │   │       └── importMap.js
│   │   ├── api/                        # 🌐 Routes API
│   │   │   ├── apprenants/
│   │   │   ├── blog/
│   │   │   ├── contacts/
│   │   │   ├── programmes/
│   │   │   ├── rendez-vous/
│   │   │   └── users/
│   │   ├── layout.tsx                  # Root minimal (return children)
│   │   └── globals.css
│   ├── collections/                    # Collections Payload
│   ├── components/                     # Composants React
│   ├── lib/                            # Utilitaires
│   ├── hooks/                          # React hooks
│   └── payload.config.ts               # Config Payload
├── next.config.ts
├── package.json
└── tsconfig.json
```

## 🔗 Routes de l'application

### Routes publiques (site vitrine)
```
http://localhost:3010/                  → Page d'accueil
http://localhost:3010/apropos           → À propos
http://localhost:3010/catalogue         → Catalogue de formations
http://localhost:3010/blog              → Blog
http://localhost:3010/contact           → Contact
```

### Dashboard custom (admin de l'app)
```
http://localhost:3010/dashboard         → Dashboard principal
http://localhost:3010/dashboard/apprenants
http://localhost:3010/dashboard/programmes
http://localhost:3010/dashboard/blog
http://localhost:3010/dashboard/contacts
http://localhost:3010/dashboard/login   → Login du dashboard
```

### Payload CMS (admin système)
```
http://localhost:3010/admin             → Interface Payload
http://localhost:3010/admin/login       → Login Payload
http://localhost:3010/admin/collections/users
http://localhost:3010/admin/collections/formations
```

### API Payload
```
http://localhost:3010/api/users         → API Users
http://localhost:3010/api/formations    → API Formations
http://localhost:3010/api/articles      → API Articles
http://localhost:3010/api/programmes    → API Programmes
```

## 🎨 Layouts et isolation

### Root Layout (`src/app/layout.tsx`)
```typescript
// Minimal - ne définit PAS <html> ni <body>
export default function RootLayout({ children }) {
  return children
}
```

### App Layout (`src/app/(app)/layout.tsx`)
```typescript
// Définit <html> et <body> pour l'application
export default function AppLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
```

### Payload Layout (`src/app/(payload)/admin/layout.tsx`)
```typescript
// Utilise RootLayout de Payload (génère son propre <html>/<body>)
const Layout = ({ children }) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)
```

## 🔐 Authentification

### Payload CMS (admin système)
- **Route de login** : `/admin/login`
- **API** : `/api/users/login`
- **Cookie** : `payload-token` (préfixe configuré)

### Dashboard custom (admin app)
- **Route de login** : `/dashboard/login`
- **API** : Utilise l'API Payload en backend
- **Cookie** : Partage les cookies Payload

## 📝 Fichiers de configuration

### `payload.config.ts`
```typescript
routes: {
  admin: '/admin',  // Interface admin Payload
  api: '/api',      // API Payload
}
```

### `next.config.ts`
```typescript
export default withPayload(nextConfig)
```

## 🚀 Commandes

```bash
# Développement
npm run dev                 # Port 3010

# Build
npm run build

# Production
npm run start:3010

# Payload
npm run payload             # CLI Payload
```

## 📊 Flux de données

```
┌─────────────────────────────────────────────────────────┐
│                    UTILISATEUR                          │
└─────────────────┬───────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌───────────────┐   ┌───────────────────┐
│   Site Public │   │   Dashboard       │
│   (app)       │   │   /dashboard      │
└───────┬───────┘   └────────┬──────────┘
        │                    │
        │            ┌───────┴────────┐
        │            │                │
        │            ▼                ▼
        │     ┌──────────────┐  ┌──────────────┐
        │     │  Payload CMS │  │   API Routes │
        │     │   /admin     │  │   /api/*     │
        │     └──────┬───────┘  └──────┬───────┘
        │            │                 │
        └────────────┴─────────────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  MongoDB Atlas  │
            └─────────────────┘
```

## 🎯 Séparation des responsabilités

### (app) - Application Next.js
- Pages publiques du site
- Dashboard administratif custom
- Logique métier spécifique

### (payload) - Payload CMS
- Interface d'administration système
- Gestion des collections
- Authentification centralisée
- API REST/GraphQL

### api/ - Routes API
- Endpoints Payload automatiques
- Routes API custom
- Webhooks

## ✅ Avantages de cette structure

1. **Isolation complète** : Aucun conflit HTML/CSS entre Next.js et Payload
2. **Maintenance facile** : Séparation claire des responsabilités
3. **Évolutivité** : Facile d'ajouter de nouvelles features
4. **Conforme** : Architecture recommandée par Payload v3
5. **Performance** : Pas de overhead de double rendering
