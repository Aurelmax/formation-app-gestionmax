# 📚 Guide d'Utilisation des Types Payload

## 🎯 Principe Fondamental

**Les types Payload sont générés automatiquement à partir des slugs des collections définis dans `payload.config.ts`.**

### 📋 Convention de Nommage

| Slug Collection | Interface Générée | Exemple |
|----------------|-------------------|---------|
| `users` | `Users` | `export interface Users` |
| `contacts` | `Contacts` | `export interface Contacts` |
| `formation-programmes` | `FormationProgrammes` | `export interface FormationProgrammes` |
| `rendez-vous` | `RendezVous` | `export interface RendezVous` |

## ✅ Bonnes Pratiques

### **1. Import des Types**

```typescript
// ✅ Correct : Utiliser le nom exact de l'interface
import type { Contacts } from '@/types/payload-generated'

// ❌ Incorrect : Ne pas supposer le nom
import type { Contact } from '@/types/payload-generated' // N'existe pas !
```

### **2. Extraction des Types d'Union**

```typescript
// ✅ Correct : Extraire les types d'union depuis l'interface
import type { Contacts } from '@/types/payload-generated'

type ContactType = Contacts['type']        // 'question' | 'reclamation' | 'formation' | 'devis'
type ContactStatut = Contacts['statut']    // 'nouveau' | 'enCours' | 'traite' | 'ferme'
type ContactPriorite = Contacts['priorite'] // 'basse' | 'normale' | 'haute' | 'urgente'
```

### **3. Interface Locale pour les Données Mock**

```typescript
// ✅ Correct : Étendre l'interface Payload pour les besoins locaux
interface ContactMessage extends Omit<Contacts, 'dateReception' | 'dateReponse'> {
  dateReception: Date    // Convertir string → Date pour les mocks
  dateReponse?: Date
}
```

### **4. Données Mock Complètes**

```typescript
// ✅ Correct : Inclure toutes les propriétés requises
const mockMessage: ContactMessage = {
  id: '1',
  nom: 'Jean Dupont',
  email: 'jean@email.com',
  // ... autres propriétés
  createdAt: '2024-10-10T10:00:00Z',  // ✅ Requis par Timestamped
  updatedAt: '2024-10-10T10:00:00Z',  // ✅ Requis par Timestamped
  reponse: undefined,                 // ✅ Propriété optionnelle
}
```

## 🔍 Dépannage

### **Erreur : "has no exported member"**

```typescript
// ❌ Erreur
import type { Contact } from '@/types/payload-generated'
// Module '"@/types/payload-generated"' has no exported member 'Contact'

// ✅ Solution
import type { Contacts } from '@/types/payload-generated'
```

### **Erreur : "missing properties"**

```typescript
// ❌ Erreur
const contact = {
  id: '1',
  nom: 'Jean',
  email: 'jean@email.com'
  // Manque createdAt, updatedAt
}

// ✅ Solution
const contact = {
  id: '1',
  nom: 'Jean',
  email: 'jean@email.com',
  createdAt: '2024-10-10T10:00:00Z',
  updatedAt: '2024-10-10T10:00:00Z'
}
```

## 📊 Types Disponibles

### **Collections Générées**

```typescript
// Interfaces principales
export interface Users extends Timestamped { ... }
export interface Contacts extends Timestamped { ... }
export interface FormationProgrammes extends Timestamped { ... }

// Types d'union (extraits manuellement)
type UserRole = Users['role']
type UserStatus = Users['status']
type ContactType = Contacts['type']
type ContactStatut = Contacts['statut']
type ContactPriorite = Contacts['priorite']
```

### **Types de Base**

```typescript
export interface Timestamped {
  id: string
  createdAt: string
  updatedAt: string
}
```

## 🚀 Workflow de Développement

### **1. Modification de la Configuration**

```bash
# Éditer src/payload.config.ts
# Ajouter/modifier une collection

# Régénérer les types
npm run sync:types
```

### **2. Utilisation dans les Composants**

```typescript
// 1. Importer l'interface générée
import type { Contacts } from '@/types/payload-generated'

// 2. Extraire les types d'union
type ContactType = Contacts['type']
type ContactStatut = Contacts['statut']

// 3. Utiliser dans le composant
const [contacts, setContacts] = useState<Contacts[]>([])
const [selectedType, setSelectedType] = useState<ContactType>('question')
```

### **3. Validation des Données**

```typescript
// Utiliser les types pour la validation
function validateContact(contact: Partial<Contacts>): contact is Contacts {
  return !!(
    contact.nom &&
    contact.email &&
    contact.type &&
    contact.sujet &&
    contact.message &&
    contact.statut &&
    contact.priorite
  )
}
```

## 🔄 Synchronisation

### **Scripts Disponibles**

```bash
# Génération manuelle
npm run generate:types

# Surveillance automatique
npm run watch:payload

# Script de fallback
npm run generate:types:simple
```

### **Automatisation**

- ✅ Types générés après `npm install`
- ✅ Types générés après `npm run build`
- ✅ Surveillance automatique en développement

## 📝 Exemple Complet

```typescript
// ContactManagement.tsx
import type { Contacts } from '@/types/payload-generated'

// Types dérivés
type ContactType = Contacts['type']
type ContactStatut = Contacts['statut']
type ContactPriorite = Contacts['priorite']

// Interface locale pour les mocks
interface ContactMessage extends Omit<Contacts, 'dateReception' | 'dateReponse'> {
  dateReception: Date
  dateReponse?: Date
}

// Utilisation
const [messages, setMessages] = useState<ContactMessage[]>([])
const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

// Labels typés
const typeLabels: Record<ContactType, string> = {
  question: 'Question générale',
  reclamation: 'Réclamation',
  formation: 'Demande de formation',
  devis: 'Demande de devis',
}
```

## 🎉 Résultat

- ✅ **Types cohérents** avec la configuration Payload
- ✅ **Synchronisation automatique** des modifications
- ✅ **Validation TypeScript** stricte
- ✅ **IntelliSense** complet dans l'IDE
- ✅ **Maintenabilité** améliorée

---

**Rappel** : Les types sont générés automatiquement. Ne jamais modifier manuellement `src/types/payload-generated.ts` !
