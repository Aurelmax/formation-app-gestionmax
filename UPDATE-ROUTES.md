# Guide de mise à jour des routes après migration

## Changements de routes

### ✅ Fait automatiquement

Les fichiers suivants ont été mis à jour automatiquement :

1. **Services backend**
   - `src/lib/payload-user-service.ts` : `/payload-cms/api` → `/api`
   - `src/lib/payload-auth-service.ts` : `/payload-cms` → `/admin`
   - `src/middleware.ts` : Routes Payload mises à jour

2. **Pages du dashboard**
   - `src/app/(app)/dashboard/login/page.tsx`
   - `src/app/(app)/dashboard/payload/page.tsx`
   - `src/app/(app)/dashboard/reset-password/page.tsx`
   - `src/app/(app)/dashboard/rendez-vous/nouveau/page.tsx`
   - `src/app/(app)/dashboard/forgot-password/page.tsx`
   - `src/app/(app)/diagnostic/page.tsx`
   - `src/app/(app)/cms/page.tsx`

3. **Composants**
   - `src/components/layouts/Sidebar.tsx` : Navigation mise à jour

## Table de correspondance des routes

| Ancienne route | Nouvelle route | Description |
|----------------|----------------|-------------|
| `/payload-cms` | `/admin` | Interface admin Payload CMS |
| `/payload-cms/api/*` | `/api/*` | API Payload |
| `/admin` | `/dashboard` | Dashboard custom de l'application |
| `/admin/*` | `/dashboard/*` | Toutes les pages du dashboard custom |

## Actions à faire manuellement

### 1. Vérifier les routes dans les liens externes

Si tu as des liens externes (emails, documentation, etc.) qui pointent vers l'ancien admin, mets-les à jour :

```
Ancien: http://localhost:3010/admin
Nouveau: http://localhost:3010/dashboard

Ancien: http://localhost:3010/payload-cms
Nouveau: http://localhost:3010/admin
```

### 2. Mettre à jour les favoris/signets

Si tu as des favoris dans ton navigateur qui pointent vers :
- `/admin` → change pour `/dashboard`
- `/payload-cms` → change pour `/admin`

### 3. Variables d'environnement (si applicable)

Aucune modification nécessaire des variables d'environnement.

## Commandes de vérification

### Vérifier qu'il ne reste pas de références à `/payload-cms`

```bash
grep -r "payload-cms" src/ --include="*.tsx" --include="*.ts" --exclude-dir=node_modules
```

### Vérifier les redirections `/admin` qui devraient être `/dashboard`

```bash
grep -r "href.*['\"]\/admin['\"]" src/app/\(app\) --include="*.tsx" | grep -v "/dashboard"
```

## Test de la migration

1. **Tester l'accès au dashboard custom**
   ```
   http://localhost:3010/dashboard
   ```

2. **Tester l'accès à Payload CMS**
   ```
   http://localhost:3010/admin
   ```

3. **Tester l'API Payload**
   ```
   http://localhost:3010/api/users
   http://localhost:3010/api/formations
   ```

4. **Tester l'authentification**
   - Se connecter via `/admin/login` (Payload)
   - Vérifier que les cookies sont bien définis
   - Tester l'accès aux ressources protégées

## Notes importantes

- **Cookies** : Les cookies Payload sont maintenant sous le préfixe `payload-` (configuré dans `payload.config.ts`)
- **Sessions** : L'authentification Payload se fait via `/admin/login`
- **API** : Toutes les routes API Payload sont maintenant sous `/api/*`

## En cas de problème

Si tu rencontres des erreurs 404 :

1. Vérifie que le serveur est bien redémarré
2. Vide le cache du navigateur
3. Vérifie la console pour les erreurs de routes
4. Consulte le fichier de migration : `MIGRATION-PAYLOAD-V3.md`
