# Changelog - Migration Payload v3

Date : 24 octobre 2025

## 🔄 Changements de structure

### Dossiers créés
```
✅ src/app/(app)/                    # Nouveau groupe de routes Next.js
✅ src/app/(payload)/admin/          # Nouveau groupe de routes Payload
```

### Dossiers renommés
```
📝 src/app/(site)/ → src/app/(app)/
📝 src/app/(site)/admin/ → src/app/(app)/dashboard/
```

### Dossiers supprimés
```
❌ src/app/payload-cms/
❌ src/app/(site)/
❌ src/app/admin-payload/
```

## 📝 Fichiers modifiés

### Configuration

#### `src/payload.config.ts`
```diff
  routes: {
-   admin: '/payload-cms',
-   api: '/payload-cms/api',
+   admin: '/admin',
+   api: '/api',
  },
```

#### `next.config.ts`
```diff
  async headers() {
    return [
      {
-       source: '/payload-cms/api/:path*',
+       source: '/api/:path*',
        ...
      },
      {
-       source: '/payload-cms/:path*',
+       source: '/admin/:path*',
        ...
      },
    ]
  },
```

### Layouts

#### `src/app/layout.tsx`
```diff
- import type { Metadata } from 'next'
- import './globals.css'
-
- export const metadata: Metadata = {
-   title: 'GestionMax Formation',
-   description: 'Plateforme de gestion de formations professionnelles',
- }
-
- export default function RootLayout({ children }: { children: React.ReactNode }) {
-   return (
-     <html lang="fr" suppressHydrationWarning>
-       <body suppressHydrationWarning>{children}</body>
-     </html>
-   )
- }
+ import './globals.css'
+
+ // Root layout minimal - ne définit PAS <html> ni <body>
+ // Les groupes de routes (app) et (payload) gèrent leurs propres layouts
+ export default function RootLayout({ children }: { children: React.ReactNode }) {
+   return children
+ }
```

#### `src/app/(app)/layout.tsx` (nouveau)
```typescript
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'GestionMax Formation',
  description: 'Plateforme de gestion de formations professionnelles',
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
```

### Services

#### `src/lib/payload-user-service.ts`
```diff
- // Les routes API Payload sont sous /payload-cms/api car admin route = '/payload-cms'
- const API_BASE_URL = '/payload-cms/api'
+ // Les routes API Payload sont sous /api car admin route = '/admin'
+ const API_BASE_URL = '/api'
```

#### `src/lib/payload-auth-service.ts`
```diff
  /**
   * Service d'authentification utilisant Payload CMS natif
-  * L'authentification se fait via /payload-cms/login
+  * L'authentification se fait via /admin/login
   * Les données sont récupérées via Local API côté serveur
   */

  redirectToLogin(returnUrl?: string): void {
    const redirect = returnUrl || window.location.pathname
-   window.location.href = `/payload-cms/login?redirect=${encodeURIComponent(redirect)}`
+   window.location.href = `/admin/login?redirect=${encodeURIComponent(redirect)}`
  }

  async logout(): Promise<void> {
    try {
-     await fetch('/payload-cms/api/users/logout', {
+     await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      })

-     window.location.href = '/admin/login'
+     window.location.href = '/dashboard/login'
    } catch (error) {
      console.error('Erreur logout:', error)
    }
  }

- // Note: login() n'existe pas car l'auth se fait via /payload-cms/login
+ // Note: login() n'existe pas car l'auth se fait via /admin/login
  // Utiliser redirectToLogin() à la place
```

#### `src/middleware.ts`
```diff
  // Routes Payload CMS (ne pas intercepter)
- const payloadRoutes = ['/payload-cms', '/api']
+ const payloadRoutes = ['/admin', '/api']
```

### Composants

#### `src/components/layouts/Sidebar.tsx`
```diff
  const navigation = [
-   { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
-   { name: 'Programmes', href: '/admin/programmes', icon: BookOpen },
+   { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
+   { name: 'Programmes', href: '/dashboard/programmes', icon: BookOpen },
    ...
  ]

  {/* Lien vers l'interface CMS */}
  <a
-   href="/payload-cms"
+   href="/admin"
    target="_blank"
    rel="noopener noreferrer"
  >
    Interface Payload CMS
  </a>

  <Button
    onClick={() => {
-     window.location.href = '/admin/logout'
+     window.location.href = '/dashboard/logout'
    }}
  >
    Se déconnecter
  </Button>
```

### Pages du dashboard

#### Tous les fichiers dans `src/app/(app)/dashboard/`
```diff
- '/payload-cms'
+ '/admin'

- '/payload-cms/api'
+ '/api'
```

Fichiers concernés :
- `dashboard/login/page.tsx`
- `dashboard/payload/page.tsx`
- `dashboard/reset-password/page.tsx`
- `dashboard/rendez-vous/nouveau/page.tsx`
- `dashboard/forgot-password/page.tsx`

#### `src/app/(app)/diagnostic/page.tsx`
```diff
- window.location.href = '/admin'
+ window.location.href = '/dashboard'
```

#### `src/app/(app)/cms/page.tsx`
```diff
- window.location.href = '/admin'
+ window.location.href = '/dashboard'
```

## 📦 Fichiers supprimés

```
❌ src/app/layout-wrapper.tsx
❌ src/app/payload-cms/layout.tsx
❌ src/app/payload-cms/importMap.js
❌ src/app/payload-cms/[[...segments]]/page.tsx
❌ src/app/payload-cms/[[...segments]]/not-found.tsx
❌ src/app/(site)/layout.tsx
❌ src/app/(site)/page.tsx
❌ src/app/(site)/not-found.tsx
```

## ➕ Fichiers créés

```
✅ src/app/(app)/layout.tsx
✅ src/app/(payload)/admin/layout.tsx
✅ src/app/(payload)/admin/importMap.js
✅ src/app/(payload)/admin/[[...segments]]/page.tsx
✅ src/app/(payload)/admin/[[...segments]]/not-found.tsx
✅ MIGRATION-PAYLOAD-V3.md
✅ UPDATE-ROUTES.md
✅ STRUCTURE.md
✅ RESUME-MIGRATION.md
✅ CHANGELOG-MIGRATION.md (ce fichier)
```

## 🔄 Routes changées

| Avant | Après | Type |
|-------|-------|------|
| `/payload-cms` | `/admin` | Payload UI |
| `/payload-cms/login` | `/admin/login` | Payload Login |
| `/payload-cms/api/*` | `/api/*` | Payload API |
| `/admin` | `/dashboard` | Dashboard custom |
| `/admin/*` | `/dashboard/*` | Dashboard pages |

## ✅ Vérifications effectuées

- [x] Serveur démarre sans erreur
- [x] Page d'accueil accessible (`/`)
- [x] Payload admin accessible (`/admin`)
- [x] Pas de double HTML dans les pages
- [x] Structure conforme au template officiel
- [x] Documentation complète créée

## 📚 Documentation

4 fichiers de documentation ont été créés :

1. **MIGRATION-PAYLOAD-V3.md** - Guide détaillé de migration
2. **UPDATE-ROUTES.md** - Guide de mise à jour des routes
3. **STRUCTURE.md** - Architecture du projet
4. **RESUME-MIGRATION.md** - Résumé visuel de la migration

## 🎯 Résultat

✅ Architecture 100% conforme au template officiel Payload v3
✅ Séparation propre entre Next.js et Payload CMS
✅ Plus de problème de double HTML
✅ Cookies et sessions correctement isolés
✅ Code maintenable et évolutif

---

*Migration effectuée le 24 octobre 2025*
*Temps estimé : 2 heures*
*Fichiers modifiés : 15+*
*Fichiers créés : 5+*
*Fichiers supprimés : 8+*
