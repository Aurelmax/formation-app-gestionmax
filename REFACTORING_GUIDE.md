# 🚀 Guide de Refactorisation - Phase 1

## 📋 Vue d'ensemble

Ce guide présente les nouveaux composants, hooks et services créés pour améliorer la maintenabilité et la réutilisabilité du code.

## 🎯 Objectifs de la refactorisation

- ✅ **Séparation des préoccupations** : Logique métier séparée de l'UI
- ✅ **Réutilisabilité** : Composants et hooks réutilisables
- ✅ **Maintenabilité** : Code plus facile à maintenir et tester
- ✅ **Performance** : Optimisation des re-renders et de la gestion d'état
- ✅ **Validation centralisée** : Système de validation unifié

## 🛠️ Nouveaux Hooks Personnalisés

### `useFormState<T>`
Gère l'état complexe des formulaires avec validation intégrée.

```typescript
import { useFormState } from '@/hooks';

const { data, errors, updateField, validateForm } = useFormState(
  initialData,
  validationRules
);
```

**Fonctionnalités :**
- Gestion d'état complexe avec objets imbriqués
- Validation en temps réel
- Gestion des tableaux dynamiques
- États de chargement et de modification

### `useAsyncOperation`
Gère les opérations asynchrones avec gestion d'erreurs.

```typescript
import { useAsyncOperation } from '@/hooks';

const { execute, isLoading, error, isSuccess } = useAsyncOperation();

await execute(
  async () => await apiCall(),
  {
    onSuccess: (result) => console.log(result),
    successMessage: 'Opération réussie'
  }
);
```

### `useDialog<T>`
Gère l'état des dialogs/modals.

```typescript
import { useDialog } from '@/hooks';

const dialog = useDialog<User>();

dialog.open(user); // Ouvrir avec des données
dialog.close();    // Fermer
```

### `useListManagement<T>`
Gère les listes avec recherche, filtrage et tri.

```typescript
import { useListManagement } from '@/hooks';

const {
  items,
  filteredItems,
  searchTerm,
  filters,
  setSearchTerm,
  setFilter,
  updateItem,
  removeItem
} = useListManagement({
  initialItems: users,
  searchFields: ['name', 'email']
});
```

## 🧩 Nouveaux Composants de Formulaire

### `FormField`
Wrapper pour les champs de formulaire avec label et gestion d'erreurs.

```typescript
import { FormField } from '@/components/forms';

<FormField label="Nom" error={errors.name} required>
  <Input value={data.name} onChange={...} />
</FormField>
```

### `FormSection`
Section de formulaire avec titre et description.

```typescript
import { FormSection } from '@/components/forms';

<FormSection title="Informations personnelles" description="Renseignez vos coordonnées">
  {/* Champs du formulaire */}
</FormSection>
```

### `FormActions`
Actions de formulaire standardisées (Enregistrer, Annuler, Réinitialiser).

```typescript
import { FormActions } from '@/components/forms';

<FormActions
  onSave={handleSave}
  onCancel={handleCancel}
  isLoading={isLoading}
  isDirty={isDirty}
/>
```

### `ArrayField<T>`
Gestion des champs de type tableau avec ajout/suppression d'éléments.

```typescript
import { ArrayField } from '@/components/forms';

<ArrayField
  items={data.modules}
  onAdd={() => addModule()}
  onRemove={(index) => removeModule(index)}
  renderItem={(module, index) => <ModuleForm module={module} />}
/>
```

### `FormLayout`
Layout responsive pour les formulaires.

```typescript
import { FormLayout } from '@/components/forms';

<FormLayout columns={2} gap="md">
  <FormField>...</FormField>
  <FormField>...</FormField>
</FormLayout>
```

## 🔍 Système de Validation

### Règles de validation prédéfinies

```typescript
import { 
  required, 
  email, 
  minLength, 
  maxLength,
  phone,
  positive,
  formationCode,
  duration
} from '@/lib/validation';

const validationRules = {
  email: [required(), email()],
  name: [required(), minLength(2)],
  phone: [phone()],
  price: [required(), positive()]
};
```

### Validation personnalisée

```typescript
const customRule = (value: string) => {
  if (value.length < 5) {
    return 'Minimum 5 caractères requis';
  }
  return null;
};
```

## 🏗️ Logique Métier

### `FormationBusinessLogic`
Logique métier pour les formations personnalisées.

```typescript
import { FormationBusinessLogic } from '@/lib/business-logic';

// Validation
const errors = FormationBusinessLogic.validateFormation(formation);

// Génération de code
const code = FormationBusinessLogic.generateFormationCode('ClientName');

// Vérification de finalisation
const { canFinalize, reasons } = FormationBusinessLogic.canFinalizeFormation(formation);
```

### `UserBusinessLogic`
Logique métier pour la gestion des utilisateurs.

```typescript
import { UserBusinessLogic } from '@/lib/business-logic';

// Vérification des permissions
const { canDelete, reason } = UserBusinessLogic.canDeleteUser(user, currentUser);

// Génération de mot de passe
const password = UserBusinessLogic.generateTemporaryPassword(12);
```

### `ContactBusinessLogic`
Logique métier pour la gestion des contacts.

```typescript
import { ContactBusinessLogic } from '@/lib/business-logic';

// Filtrage des messages
const filtered = ContactBusinessLogic.filterMessages(messages, filters);

// Statistiques
const stats = ContactBusinessLogic.calculateMessageStats(messages);
```

## 📝 Exemple de Migration

### Avant (ContactManagement.tsx)
```typescript
// Gestion d'état complexe dans le composant
const [messages, setMessages] = useState<ContactMessage[]>(mockMessages);
const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
const [searchTerm, setSearchTerm] = useState('');
const [filterStatut, setFilterStatut] = useState<string>('all');

// Logique de filtrage dans le composant
const filteredMessages = messages.filter(message => {
  const matchesSearch = message.nom.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesStatut = filterStatut === 'all' || message.statut === filterStatut;
  return matchesSearch && matchesStatut;
});
```

### Après (ContactManagementRefactored.tsx)
```typescript
// Utilisation des hooks personnalisés
const {
  items: messages,
  filteredItems,
  searchTerm,
  filters,
  setSearchTerm,
  setFilter,
  updateItem,
  removeItem
} = useListManagement<ContactMessage>({
  initialItems: mockMessages,
  searchFields: ['nom', 'email', 'sujet', 'message']
});

// Utilisation de la logique métier
const filteredMessages = ContactBusinessLogic.filterMessages(messages, {
  searchTerm,
  statut: filters.statut,
  type: filters.type
});
```

## 🎯 Prochaines Étapes

### Phase 2 - Refactorisation des composants prioritaires
1. **FormationPersonnaliseeForm.tsx** (766 lignes)
2. **ProgrammeFormComplet.tsx** (624 lignes)
3. **UserManagementSimple.tsx** (617 lignes)
4. **UserManagement.tsx** (610 lignes)

### Phase 3 - Optimisations
1. **React.memo** pour les composants lourds
2. **Tests unitaires** pour les hooks et la logique métier
3. **Documentation** des composants
4. **Performance monitoring**

## 📚 Ressources

- [Documentation React Hooks](https://react.dev/reference/react)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 🤝 Contribution

Pour contribuer à la refactorisation :

1. Utilisez les nouveaux hooks et composants
2. Séparez la logique métier de l'UI
3. Ajoutez des tests pour les nouvelles fonctionnalités
4. Documentez les changements importants
5. Respectez les conventions de nommage établies
