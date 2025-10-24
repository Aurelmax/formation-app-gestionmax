# Migration vers la structure officielle Payload v3

## Date de migration
24 octobre 2025

## Contexte
Migration de l'architecture monolithique Next.js + Payload v3 vers la structure officielle recommandée par l'équipe Payload pour éviter les problèmes de double HTML et de conflits de cookies.

## Changements majeurs

### 1. Structure des dossiers

#### Avant
```
src/app/
├── (site)/          # Application Next.js
├── payload-cms/     # Admin Payload
└── layout.tsx       # Layout avec <html>/<body>
```

#### Après
```
src/app/
├── (app)/           # Application Next.js
│   ├── layout.tsx   # Layout avec <html>/<body>
│   └── ...
├── (payload)/       # Payload CMS isolé
│   └── admin/
│       ├── layout.tsx
│       └── [[...segments]]/
└── layout.tsx       # Root minimal (retourne children)
```

### 2. Routes modifiées

| Avant | Après | Description |
|-------|-------|-------------|
| `/payload-cms` | `/admin` | Interface admin Payload |
| `/payload-cms/api/*` | `/api/*` | API Payload |
| `/admin` | `/dashboard` | Dashboard custom de l'application |

### 3. Fichiers de configuration mis à jour

#### payload.config.ts
```typescript
routes: {
  admin: '/admin',  // au lieu de '/payload-cms'
  api: '/api',      // au lieu de '/payload-cms/api'
}
```

#### next.config.ts
- Headers CORS mis à jour pour `/api/*` et `/admin/*`
- Suppression des références à `/payload-cms/*`

#### src/app/layout.tsx
```typescript
// Root layout minimal - ne définit PAS <html> ni <body>
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
```

### 4. Fichiers supprimés
- ✅ `src/app/layout-wrapper.tsx` (causait le double HTML)
- ✅ `src/app/payload-cms/` (ancien emplacement Payload)
- ✅ `src/app/(site)/` (ancien groupe de routes)
- ✅ `src/app/admin-payload/` (dossier obsolète)

### 5. Dossiers renommés
- `src/app/(site)/admin/` → `src/app/(app)/dashboard/`

## Résultats

### ✅ Problèmes résolus
1. **Double HTML** : Plus de duplication des balises `<html>` et `<body>`
2. **Conflits de cookies** : Séparation propre entre Next.js et Payload
3. **Conformité** : Structure 100% alignée avec le template officiel Payload v3

### 🔍 Vérification
```bash
# Test page d'accueil
curl -s http://localhost:3010 | grep -c "<html"  # Retourne: 1

# Test admin Payload
curl -s http://localhost:3010/admin | grep -c "<html"  # Retourne: 1
```

## URLs à mettre à jour dans le code

### Dans le code frontend
Rechercher et remplacer :
- `/payload-cms` → `/admin`
- `/payload-cms/api` → `/api`
- `/admin` (routes de ton dashboard custom) → `/dashboard`

### Exemples de fichiers potentiellement affectés
```bash
# Rechercher les références à l'ancien chemin
grep -r "payload-cms" src/
grep -r '"/admin"' src/app/(app)/  # Vérifier les liens vers l'ancien admin
```

## Variables d'environnement

Aucune modification nécessaire pour les variables d'environnement. Les valeurs suivantes restent identiques :
- `NEXT_PUBLIC_SERVER_URL`
- `MONGODB_URI`
- `PAYLOAD_SECRET`
- `RESEND_API_KEY`

## Commandes utiles

```bash
# Démarrer le serveur de développement
npm run dev

# Accéder à l'admin Payload
http://localhost:3010/admin

# Accéder au dashboard custom
http://localhost:3010/dashboard

# API Payload
http://localhost:3010/api/users
http://localhost:3010/api/formations
```

## Documentation officielle

- [Payload v3 Website Template](https://github.com/payloadcms/payload/tree/main/templates/website)
- [Payload + Next.js Integration](https://payloadcms.com/docs/getting-started/installation#nextjs)

## Notes importantes

1. **Groupes de routes** : Les groupes `(app)` et `(payload)` permettent à chacun de définir son propre layout avec `<html>` et `<body>` sans conflit
2. **Root layout minimal** : Le layout racine ne doit contenir que `return children` pour laisser les groupes de routes gérer leur propre structure HTML
3. **Import map** : Le fichier `importMap.js` dans `(payload)/admin/` est généré automatiquement par Payload, ne pas le modifier manuellement

## Prochaines étapes

- [ ] Tester l'authentification Payload à `/admin`
- [ ] Vérifier le fonctionnement de toutes les collections
- [ ] Mettre à jour les liens dans le code vers les nouvelles routes
- [ ] Mettre à jour la documentation utilisateur avec les nouvelles URLs
- [ ] Tester le déploiement en production
