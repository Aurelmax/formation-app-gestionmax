# 🚀 PLAN DE MIGRATION - SERVICES MOCK → BASE DE DONNÉES

## 📋 FICHIERS À MIGRER

### **Services Mock identifiés :**
- `src/lib/mock-service.ts` - Service principal mock
- `src/lib/user-service.ts` - Service utilisateurs
- `src/lib/rendez-vous-service.ts` - Service rendez-vous
- `src/lib/blog-service.ts` - Service blog

### **Fichiers utilisant les services mock :**

#### **Pages utilisant MockService :**
- `src/app/page.tsx`
- `src/app/(public)/catalogue/page.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/programmes/page.tsx`
- `src/app/admin/apprenants/page.tsx`

#### **Pages utilisant les autres services :**
- `src/app/diagnostic/page.tsx`
- `src/app/admin/login/page.tsx`
- `src/app/admin/diagnostic/page.tsx`
- `src/hooks/useAuth.ts`

#### **APIs utilisant les services :**
- `src/app/api/rendez-vous/route.ts`
- `src/app/api/rendez-vous/[id]/route.ts`
- `src/app/api/blog/[slug]/route.ts`
- `src/app/api/blog/categories/route.ts`
- `src/app/api/blog/route.ts`
- `src/app/api/blog/tags/route.ts`

---

## 🗄️ COLLECTIONS PAYLOAD À CRÉER

### **1. Collection `apprenants`**
```typescript
{
  slug: 'apprenants',
  fields: [
    { name: 'nom', type: 'text', required: true },
    { name: 'prenom', type: 'text', required: true },
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'telephone', type: 'text' },
    { name: 'dateNaissance', type: 'date' },
    { name: 'adresse', type: 'textarea' },
    { name: 'statut', type: 'select', options: ['ACTIF', 'INACTIF', 'TERMINE'] },
    { name: 'programmes', type: 'relationship', relationTo: 'programmes', hasMany: true },
    { name: 'progression', type: 'number', min: 0, max: 100 },
    { name: 'avatar', type: 'upload', relationTo: 'media' }
  ]
}
```

### **2. Collection `rendez-vous`**
```typescript
{
  slug: 'rendez-vous',
  fields: [
    { name: 'programme', type: 'relationship', relationTo: 'programmes' },
    { name: 'client', type: 'group', fields: [
      { name: 'nom', type: 'text', required: true },
      { name: 'prenom', type: 'text', required: true },
      { name: 'email', type: 'email', required: true },
      { name: 'telephone', type: 'text' },
      { name: 'entreprise', type: 'text' }
    ]},
    { name: 'type', type: 'select', options: ['positionnement', 'information', 'inscription', 'suivi'] },
    { name: 'statut', type: 'select', options: ['en_attente', 'confirme', 'annule', 'termine', 'reporte'] },
    { name: 'date', type: 'date', required: true },
    { name: 'heure', type: 'text', required: true },
    { name: 'duree', type: 'number', defaultValue: 30 },
    { name: 'lieu', type: 'select', options: ['presentiel', 'visio', 'telephone'] },
    { name: 'adresse', type: 'textarea' },
    { name: 'lienVisio', type: 'text' },
    { name: 'notes', type: 'textarea' },
    { name: 'rappelEnvoye', type: 'checkbox', defaultValue: false },
    { name: 'createdBy', type: 'relationship', relationTo: 'users' }
  ]
}
```

### **3. Collection `articles`**
```typescript
{
  slug: 'articles',
  fields: [
    { name: 'titre', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'contenu', type: 'richText', required: true },
    { name: 'resume', type: 'textarea', required: true },
    { name: 'auteur', type: 'text', required: true },
    { name: 'datePublication', type: 'date' },
    { name: 'statut', type: 'select', options: ['brouillon', 'publie', 'archive'] },
    { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
    { name: 'imagePrincipale', type: 'upload', relationTo: 'media' },
    { name: 'images', type: 'array', fields: [
      { name: 'image', type: 'upload', relationTo: 'media' }
    ]},
    { name: 'metaDescription', type: 'textarea' },
    { name: 'metaKeywords', type: 'array', fields: [
      { name: 'keyword', type: 'text' }
    ]},
    { name: 'vue', type: 'number', defaultValue: 0 },
    { name: 'tempsLecture', type: 'number' },
    { name: 'featured', type: 'checkbox', defaultValue: false }
  ]
}
```

### **4. Collection `categories`**
```typescript
{
  slug: 'categories',
  fields: [
    { name: 'nom', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea' },
    { name: 'couleur', type: 'text' },
    { name: 'icone', type: 'text' }
  ]
}
```

### **5. Collection `tags`**
```typescript
{
  slug: 'tags',
  fields: [
    { name: 'nom', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'couleur', type: 'text' }
  ]
}
```

### **6. Collection `contacts`**
```typescript
{
  slug: 'contacts',
  fields: [
    { name: 'nom', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'telephone', type: 'text' },
    { name: 'type', type: 'select', options: ['question', 'reclamation', 'formation', 'devis'] },
    { name: 'sujet', type: 'text', required: true },
    { name: 'message', type: 'textarea', required: true },
    { name: 'statut', type: 'select', options: ['nouveau', 'en_cours', 'traite', 'ferme'] },
    { name: 'priorite', type: 'select', options: ['basse', 'normale', 'haute', 'urgente'] },
    { name: 'reponse', type: 'textarea' },
    { name: 'dateReponse', type: 'date' }
  ]
}
```

---

## 🔄 ÉTAPES DE MIGRATION

### **Étape 1 : Créer les collections Payload**
1. Modifier `src/payload.config.ts`
2. Ajouter les 6 nouvelles collections
3. Configurer les relations entre collections
4. Tester la configuration

### **Étape 2 : Créer les scripts de migration**
1. Script pour migrer les données mock vers MongoDB
2. Script pour valider l'intégrité des données
3. Script de rollback en cas de problème

### **Étape 3 : Remplacer les services**
1. Créer de nouveaux services utilisant Payload API
2. Remplacer progressivement les appels mock
3. Tester chaque service individuellement

### **Étape 4 : Mise à jour des composants**
1. Mettre à jour les hooks (`useAuth`, etc.)
2. Mettre à jour les pages admin
3. Mettre à jour les APIs

### **Étape 5 : Tests et validation**
1. Tests de toutes les fonctionnalités
2. Validation des performances
3. Tests de charge

---

## ⚠️ RISQUES ET MITIGATION

### **Risques identifiés :**
1. **Perte de données** → Sauvegarde complète avant migration
2. **Temps d'arrêt** → Migration progressive par service
3. **Incompatibilité de types** → Tests de validation des types
4. **Performance** → Optimisation des requêtes MongoDB

### **Stratégie de rollback :**
1. Garder les services mock en parallèle
2. Variable d'environnement pour basculer
3. Scripts de restauration automatique

---

## 📊 MÉTRIQUES DE SUCCÈS

- ✅ Toutes les fonctionnalités existantes fonctionnent
- ✅ Performance égale ou meilleure qu'avec les mocks
- ✅ Aucune perte de données
- ✅ Interface admin Payload fonctionnelle
- ✅ APIs REST opérationnelles

---

## 🎯 ORDRE DE PRIORITÉ

1. **Haute priorité :** Collections `apprenants`, `rendez-vous`
2. **Moyenne priorité :** Collections `articles`, `categories`, `tags`
3. **Basse priorité :** Collection `contacts` (déjà fonctionnelle en mock)

---

## 📅 TIMELINE ESTIMÉE

- **Jour 1 :** Configuration des collections Payload
- **Jour 2 :** Migration des données et tests
- **Jour 3 :** Remplacement des services et validation
- **Jour 4 :** Tests finaux et déploiement
