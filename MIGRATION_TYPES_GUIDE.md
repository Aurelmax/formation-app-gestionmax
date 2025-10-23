# 🚀 Guide de Migration des Types Payload

Ce guide explique comment migrer progressivement votre codebase pour utiliser les types générés Payload et maintenir la cohérence entre le backend et le frontend.

## 📋 Vue d'ensemble

### Problème résolu

- **Avant** : Types manuels dispersés, incohérences entre frontend/backend, violations de camelCase
- **Après** : Types centralisés, synchronisation automatique, mapping cohérent

### Architecture

```
payload.config.ts → payload-generated.ts → mappers → composants frontend
```

## 🔧 Installation et Configuration

### 1. Scripts disponibles

```bash
# Générer les types Payload (si le problème undici est résolu)
npm run generate:types

# Synchroniser les types manuellement
npm run sync:types

# Vérifier les types
npm run type-check
```

### 2. Fichiers créés

- `src/types/payload-generated.ts` - Types générés depuis Payload
- `src/lib/payload-mappers.ts` - Fonctions de mapping
- `scripts/sync-payload-types.ts` - Script de synchronisation

## 📝 Migration par Étapes

### Étape 1 : Importer les nouveaux types

**Avant :**

```typescript
// types/payload.ts (ancien)
export interface User {
  role: 'super_admin' | 'admin' | 'formateur'
  // ...
}
```

**Après :**

```typescript
// Utiliser les types générés
import type { User, UserRole } from '@/types/payload-generated'
import { mapUserToFrontend, mapUserToPayload } from '@/lib/payload-mappers'
```

### Étape 2 : Mettre à jour les interfaces

**Avant :**

```typescript
interface ContactMessage {
  statut: 'nouveau' | 'en_cours' | 'traite' | 'ferme'
  // ...
}
```

**Après :**

```typescript
import type { Contact, ContactStatut } from '@/types/payload-generated'

// Utiliser directement les types générés
const contact: Contact = {
  statut: 'enCours', // camelCase
  // ...
}
```

### Étape 3 : Utiliser les mappers

**Avant :**

```typescript
// Données reçues de l'API Payload (snake_case)
const payloadData = {
  statut: 'en_cours',
  code_formation: 'A001-WP',
  // ...
}

// Conversion manuelle
const frontendData = {
  statut: payloadData.statut === 'en_cours' ? 'enCours' : payloadData.statut,
  codeFormation: payloadData.code_formation,
  // ...
}
```

**Après :**

```typescript
import { mapFormationToFrontend } from '@/lib/payload-mappers'

// Conversion automatique
const frontendData = mapFormationToFrontend(payloadData)
```

### Étape 4 : Mettre à jour les composants

**Avant :**

```typescript
// ContactManagement.tsx
const statutLabels = {
  nouveau: 'Nouveau',
  en_cours: 'En cours', // ❌ snake_case
  traite: 'Traité',
  ferme: 'Fermé',
}
```

**Après :**

```typescript
// ContactManagement.tsx
import type { ContactStatut } from '@/types/payload-generated'

const statutLabels: Record<ContactStatut, string> = {
  nouveau: 'Nouveau',
  enCours: 'En cours', // ✅ camelCase
  traite: 'Traité',
  ferme: 'Fermé',
}
```

## 🔄 Workflow de Développement

### 1. Modification du schéma Payload

```bash
# 1. Modifier payload.config.ts
# 2. Synchroniser les types
npm run sync:types

# 3. Vérifier les types
npm run type-check

# 4. Mettre à jour les mappers si nécessaire
# 5. Tester les composants
```

### 2. Ajout d'une nouvelle collection

```typescript
// payload.config.ts
{
  slug: 'nouvelle-collection',
  fields: [
    { name: 'titre', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    // ...
  ]
}
```

```bash
# Synchroniser les types
npm run sync:types

# Les types sont automatiquement générés dans payload-generated.ts
```

## 🎯 Bonnes Pratiques

### 1. Utilisation des types

```typescript
// ✅ Bon : Utiliser les types générés
import type { User, UserRole } from '@/types/payload-generated'

// ❌ Éviter : Créer des types manuels
interface User {
  role: string
}
```

### 2. Mapping des données

```typescript
// ✅ Bon : Utiliser les mappers
const user = mapUserToFrontend(payloadUser)

// ❌ Éviter : Conversion manuelle
const user = {
  role: payloadUser.role === 'super_admin' ? 'superAdmin' : payloadUser.role,
}
```

### 3. Validation des données

```typescript
import { validateFrontendObject, REQUIRED_USER_FIELDS } from '@/lib/payload-mappers'

// Valider avant l'envoi
if (!validateFrontendObject(userData, REQUIRED_USER_FIELDS)) {
  throw new Error('Données utilisateur invalides')
}
```

## 🐛 Résolution des Problèmes

### Problème : Types non synchronisés

```bash
# Solution : Forcer la synchronisation
npm run sync:types
npm run type-check
```

### Problème : Erreurs de mapping

```typescript
// Vérifier les mappings dans payload-mappers.ts
// Ajouter de nouveaux mappings si nécessaire
```

### Problème : Violations ESLint

```typescript
// Les patterns snake_case sont ignorés dans eslint.config.mjs
// Si de nouvelles violations apparaissent, les ajouter au ignorePattern
```

## 📊 État de la Migration

### ✅ Fichiers migrés

- [x] `src/types/payload-generated.ts` - Types générés
- [x] `src/lib/payload-mappers.ts` - Mappers
- [x] `src/components/admin/ContactManagement.tsx` - Exemple de migration
- [x] `eslint.config.mjs` - Configuration mise à jour

### 🔄 Fichiers en cours de migration

- [ ] `src/types/rendez-vous.ts`
- [ ] `src/types/payload.ts`
- [ ] `src/components/admin/RendezVousManagement.tsx`
- [ ] `src/components/admin/UserManagement.tsx`
- [ ] `src/lib/rendez-vous-api-service.ts`

### 📋 Fichiers à migrer

- [ ] Tous les composants admin
- [ ] Tous les services API
- [ ] Tous les types personnalisés
- [ ] Tous les formulaires

## 🚀 Prochaines Étapes

1. **Résoudre le problème undici** pour utiliser `npm run generate:types`
2. **Migrer progressivement** les composants existants
3. **Tester** la cohérence des types
4. **Documenter** les nouveaux patterns
5. **Former** l'équipe sur les nouveaux workflows

## 📚 Ressources

- [Documentation Payload CMS](https://payloadcms.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/rules/)

---

**Note** : Ce guide sera mis à jour au fur et à mesure de la migration. N'hésitez pas à contribuer aux améliorations !
