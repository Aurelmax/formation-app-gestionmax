# 📘 Conventions de Typage - Formation App GestionMax

## 🎯 Objectif

Ce document définit les règles strictes de typage TypeScript pour garantir la maintenabilité, la lisibilité et la sécurité du code.

---

## 📏 Règles Générales

### ✅ À FAIRE

- **Toujours** typer explicitement les paramètres de fonction
- **Toujours** typer les retours de fonction
- **Toujours** typer les props des composants React
- **Préférer** les `interface` pour les objets
- **Préférer** les `type` pour les unions/intersections
- **Utiliser** `const` pour les énumérations
- **Éviter** `any` - utiliser `unknown` si vraiment nécessaire

### ❌ À ÉVITER

- ❌ `any` (sauf cas exceptionnel documenté)
- ❌ Types implicites
- ❌ `@ts-ignore` sans commentaire explicatif
- ❌ Type assertions (`as`) abusives
- ❌ Types trop larges (`object`, `Function`)

---

## 🏗️ Structure des Types

### Organisation des fichiers

```
src/types/
├── common.ts          # Types globaux partagés
├── api.ts             # Types API et réponses HTTP
├── database.ts       # Types mappés sur Prisma
├── forms.ts           # Types de formulaires
└── modules/           # Types spécifiques par module
    ├── programmes.ts
    ├── apprenants.ts
    └── ...
```

---

## 📝 Conventions de Nommage

### Interfaces et Types

```typescript
// ✅ CORRECT - PascalCase
interface User {
  id: string
  name: string
}

type UserRole = 'ADMIN' | 'FORMATEUR' | 'BENEFICIAIRE'

// ❌ INCORRECT
interface user {} // Minuscule
type user_role = string // snake_case
```

### Props de Composants

```typescript
// ✅ CORRECT - Suffixe "Props"
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  // ...
}

// ❌ INCORRECT
interface ButtonProperties {} // Trop verbeux
interface IButton {} // Préfixe I déconseillé
```

### Types Utilitaires

```typescript
// ✅ CORRECT - Préfixe descriptif
type Nullable<T> = T | null
type Optional<T> = T | undefined
type ApiResponse<T> = {
  data: T
  error?: string
}

// ❌ INCORRECT
type N<T> = T | null // Trop court
```

### Constantes de Type

```typescript
// ✅ CORRECT - UPPER_SNAKE_CASE pour les valeurs
const USER_ROLES = {
  ADMIN: 'admin',
  FORMATEUR: 'formateur',
  BENEFICIAIRE: 'beneficiaire',
} as const;

type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// ❌ INCORRECT
const userRoles = { ... };  // camelCase
```

---

## 🔧 Patterns de Typage

### 1. Typage des Props React

```typescript
// ✅ EXCELLENT - Props complètement typées
interface UserCardProps {
  user: User
  onEdit?: (user: User) => void
  onDelete?: (id: string) => Promise<void>
  className?: string
  children?: React.ReactNode
}

export function UserCard({ user, onEdit, onDelete, className, children }: UserCardProps) {
  // ...
}

// ❌ MAUVAIS - Props non typées
export function UserCard(props: any) {}
```

### 2. Typage des Fonctions

```typescript
// ✅ EXCELLENT - Paramètres et retour typés
async function getProgramme(id: string): Promise<Programme | null> {
  const programme = await prisma.programme.findUnique({
    where: { id },
  })
  return programme
}

// ⚠️ ACCEPTABLE - Retour inféré mais explicite recommandé
function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ❌ MAUVAIS - Types implicites
async function getProgramme(id) {
  return await prisma.programme.findUnique({ where: { id } })
}
```

### 3. Typage des Événements

```typescript
// ✅ CORRECT - Types d'événements React
interface FormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

// Alternative avec handlers typés
type SubmitHandler = (data: FormData) => void | Promise<void>

interface FormProps {
  onSubmit: SubmitHandler
}
```

### 4. Typage des Hooks Personnalisés

```typescript
// ✅ EXCELLENT - Hook avec retour typé
interface UseProgrammeReturn {
  programme: Programme | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

function useProgramme(id: string): UseProgrammeReturn {
  const [programme, setProgramme] = useState<Programme | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // ...

  return { programme, isLoading, error, refetch }
}
```

---

## 🎨 Types Réutilisables

### Types de Base

```typescript
// types/common.ts

// IDs
export type ID = string
export type UUID = string

// Dates
export type ISODate = string
export type Timestamp = number

// Statuts génériques
export type Status = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'

// Pagination
export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
}

// Réponses API
export interface ApiSuccessResponse<T> {
  success: true
  data: T
}

export interface ApiErrorResponse {
  success: false
  error: {
    message: string
    code: string
    details?: unknown
  }
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
```

### Types Utilitaires Avancés

```typescript
// types/utils.ts

// Rendre tous les champs optionnels sauf certains
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>

// Rendre certains champs requis
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Omettre plusieurs clés
export type OmitMultiple<T, K extends keyof T> = Omit<T, K>

// Extraire les clés d'un type donné
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T]

// Type nullable
export type Nullable<T> = T | null

// Type avec timestamps
export interface Timestamped {
  createdAt: Date
  updatedAt: Date
}

// Type avec soft delete
export interface SoftDeletable {
  deletedAt: Date | null
}
```

---

## 🔒 Validation avec Zod

### Pattern Recommandé

```typescript
// schemas/programme.schema.ts
import { z } from 'zod'

// 1. Définir le schéma Zod
export const programmeSchema = z.object({
  titre: z.string().min(3).max(200),
  description: z.string().min(10),
  duree: z.number().positive(),
  niveau: z.enum(['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE']),
  prix: z.number().nonnegative(),
})

// 2. Inférer le type depuis Zod
export type ProgrammeInput = z.infer<typeof programmeSchema>

// 3. Utiliser dans les composants
interface ProgrammeFormProps {
  onSubmit: (data: ProgrammeInput) => void
  defaultValues?: Partial<ProgrammeInput>
}
```

---

## 🗄️ Typage des Données Prisma

### Types de Base

```typescript
// types/database.ts
import { Prisma } from '@prisma/client'

// Utiliser les types générés par Prisma
export type Programme = Prisma.ProgrammeGetPayload<{
  include: {
    formateurs: true
    competences: true
  }
}>

export type ProgrammeWithStats = Prisma.ProgrammeGetPayload<{
  include: {
    _count: {
      select: {
        apprenants: true
        sessions: true
      }
    }
  }
}>

// Types pour les opérations CRUD
export type ProgrammeCreateInput = Prisma.ProgrammeCreateInput
export type ProgrammeUpdateInput = Prisma.ProgrammeUpdateInput
export type ProgrammeWhereInput = Prisma.ProgrammeWhereInput
```

---

## 🧪 Typage des Tests

### Mocks Typés

```typescript
// __tests__/programme.test.ts

// ✅ CORRECT - Mocks typés
const mockProgramme: Programme = {
  id: '1',
  titre: 'Test Programme',
  description: 'Description test',
  duree: 40,
  niveau: 'INTERMEDIAIRE',
  prix: 1000,
  statut: 'PUBLIE',
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Mock de service
const mockService: jest.Mocked<typeof ProgrammeService> = {
  findAll: jest.fn().mockResolvedValue([mockProgramme]),
  findById: jest.fn().mockResolvedValue(mockProgramme),
  create: jest.fn().mockResolvedValue(mockProgramme),
  update: jest.fn().mockResolvedValue(mockProgramme),
  delete: jest.fn().mockResolvedValue(undefined),
}
```

---

## 🚨 Gestion des Erreurs

### Classes d'Erreurs Personnalisées

```typescript
// types/errors.ts

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

// Utilisation
function getProgramme(id: string): Programme {
  const programme = await prisma.programme.findUnique({ where: { id } })

  if (!programme) {
    throw new NotFoundError('Programme', id)
  }

  return programme
}
```

---

## ✅ Checklist Avant Commit

### Vérifications Obligatoires

```typescript
// ✅ Tous les paramètres de fonction sont typés
function getUserById(id: string): Promise<User | null> {
  // ...
}

// ✅ Tous les retours de fonction sont typés explicitement
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ✅ Aucun any sans justification documentée
// ❌ MAUVAIS
function processData(data: any) {
  // ...
}

// ✅ CORRECT
function processData(data: unknown) {
  // ...
}

// ✅ Les props React sont dans une interface dédiée
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  // ...
}

// ✅ Les types complexes sont extraits dans types/
// types/programme.ts
export interface Programme {
  id: string
  titre: string
  description: string
  // ...
}

// ✅ Les schémas Zod sont utilisés pour la validation
import { z } from 'zod'

export const programmeSchema = z.object({
  titre: z.string().min(3).max(200),
  description: z.string().min(10),
  duree: z.number().positive(),
  niveau: z.enum(['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE']),
  prix: z.number().nonnegative(),
})

export type ProgrammeInput = z.infer<typeof programmeSchema>
```

### Commandes de Vérification

```bash
# Vérification TypeScript
npm run type-check

# Vérification ESLint
npm run lint

# Vérification des types
npx tsc --noEmit

# Vérification complète
npm run build
```

### Checklist Rapide

```markdown
## ✅ Checklist Avant Commit

- [ ] Tous les paramètres de fonction sont typés
- [ ] Tous les retours de fonction sont typés explicitement
- [ ] Aucun `any` sans justification documentée
- [ ] Les props React sont dans une interface dédiée
- [ ] Les types complexes sont extraits dans `types/`
- [ ] Les schémas Zod sont utilisés pour la validation
- [ ] `npm run type-check` passe sans erreur
- [ ] Pas de `@ts-ignore` sans commentaire
- [ ] Tous les imports sont typés
- [ ] Les hooks personnalisés sont typés
- [ ] Les services sont typés
- [ ] Les composants sont typés
- [ ] Les tests sont typés
- [ ] La documentation est à jour
```

---

**Date de création :** Octobre 2025  
**Version :** 1.0.0  
**Prochaine révision :** Janvier 2026
