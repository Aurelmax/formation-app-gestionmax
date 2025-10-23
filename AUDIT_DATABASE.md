# 🔍 AUDIT COMPLET - MIGRATION VERS BASE DE DONNÉES

## 📋 RÉSUMÉ EXÉCUTIF

**Objectif :** Migrer de services mock vers une vraie base de données MongoDB avec Payload CMS
**Statut actuel :** Mode développement avec données mock (`NEXT_PUBLIC_USE_MOCK_DATA=true`)
**Base de données :** MongoDB (configurée dans `.env.local`)

---

## 🗄️ STRUCTURE DE BASE DE DONNÉES REQUISE

### **Tables/Collections MongoDB identifiées :**

#### 1. **USERS** (Utilisateurs)

- **Source :** `src/types/users.ts`, `src/lib/user-service.ts`
- **Champs principaux :**
  - `id`, `email`, `password` (hashé), `name`, `firstName`, `lastName`
  - `role` (super_admin, admin, formateur, gestionnaire, apprenant)
  - `status` (active, inactive, suspended, pending)
  - `phone`, `address`, `dateOfBirth`, `avatar`
  - `permissions[]`, `lastLoginAt`, `metadata`
  - `createdAt`, `updatedAt`

#### 2. **PROGRAMMES** (Formations)

- **Source :** `src/types/common.ts`, `src/data/mock-data.ts`
- **Champs principaux :**
  - `id`, `codeFormation`, `titre`, `description`
  - `duree` (heures), `niveau` (DEBUTANT, INTERMEDIAIRE, AVANCE)
  - `modalites` (PRESENTIEL, DISTANCIEL, HYBRIDE)
  - `prix`, `statut` (BROUILLON, PUBLIE, ARCHIVE)
  - `image`, `formateurs[]`, `competences[]`
  - `eligibleCPF`, `codeCPF`, `objectifs`, `prerequis`
  - `programme`, `modalitesPedagogiques`, `evaluation`, `certification`
  - `createdAt`, `updatedAt`

#### 3. **APPRENANTS** (Étudiants)

- **Source :** `src/types/common.ts`, `src/data/mock-data.ts`
- **Champs principaux :**
  - `id`, `nom`, `prenom`, `email`, `telephone`
  - `dateNaissance`, `adresse`, `statut` (ACTIF, INACTIF, TERMINE)
  - `programmes[]`, `progression` (0-100), `avatar`
  - `createdAt`, `updatedAt`

#### 4. **RENDEZ_VOUS** (Appointments)

- **Source :** `src/types/rendez-vous.ts`, `src/lib/rendez-vous-service.ts`
- **Champs principaux :**
  - `id`, `programmeId`, `programmeTitre`
  - `client` (nom, prenom, email, telephone, entreprise)
  - `type` (positionnement, information, inscription, suivi)
  - `statut` (en_attente, confirme, annule, termine, reporte)
  - `date`, `heure`, `duree` (minutes)
  - `lieu` (presentiel, visio, telephone)
  - `adresse`, `lienVisio`, `notes`, `rappelEnvoye`
  - `createdBy`, `createdAt`, `updatedAt`

#### 5. **ARTICLES** (Blog)

- **Source :** `src/types/blog.ts`, `src/lib/blog-service.ts`
- **Champs principaux :**
  - `id`, `titre`, `slug`, `contenu`, `resume`
  - `auteur`, `datePublication`, `dateModification`
  - `statut` (brouillon, publie, archive)
  - `categories[]`, `tags[]`, `imagePrincipale`, `images[]`
  - `metaDescription`, `metaKeywords[]`, `vue`, `tempsLecture`
  - `featured`, `createdAt`, `updatedAt`

#### 6. **CATEGORIES** (Blog)

- **Source :** `src/types/blog.ts`
- **Champs principaux :**
  - `id`, `nom`, `slug`, `description`
  - `couleur`, `icone`, `createdAt`, `updatedAt`

#### 7. **TAGS** (Blog)

- **Source :** `src/types/blog.ts`
- **Champs principaux :**
  - `id`, `nom`, `slug`, `couleur`, `createdAt`, `updatedAt`

#### 8. **CONTACTS** (Messages de contact)

- **Source :** `src/components/admin/ContactManagement.tsx`
- **Champs principaux :**
  - `id`, `nom`, `email`, `telephone`
  - `type` (question, reclamation, formation, devis)
  - `sujet`, `message`, `statut` (nouveau, en_cours, traite, ferme)
  - `priorite` (basse, normale, haute, urgente)
  - `reponse`, `dateReception`, `dateReponse`
  - `createdAt`, `updatedAt`

#### 9. **MEDIA** (Fichiers)

- **Source :** Payload CMS (déjà configuré)
- **Champs principaux :**
  - `id`, `filename`, `mimeType`, `filesize`
  - `url`, `alt`, `createdAt`, `updatedAt`

---

## 🔧 CONFIGURATION ACTUELLE

### **Variables d'environnement (.env.local) :**

```bash
# ✅ Configuration Payload CMS
PAYLOAD_SECRET=your-secret-key-change-this-in-production-please-use-a-strong-secret

# ✅ Configuration MongoDB
MONGODB_URI=mongodb://localhost:27017/formation-app-gestionmax

# ✅ Application
NEXT_PUBLIC_APP_NAME=Formation App GestionMax
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ⚠️ Mode développement (à changer)
NEXT_PUBLIC_USE_MOCK_DATA=true

# ✅ Configuration pour le développement
NODE_ENV=development
```

### **Payload CMS Collections existantes :**

- ✅ `users` - Configuré avec auth
- ✅ `programmes` - Configuré avec tous les champs
- ✅ `media` - Configuré pour les fichiers

---

## 📊 SERVICES MOCK À MIGRER

### **1. MockService** (`src/lib/mock-service.ts`)

- ❌ `getProgrammes()` → Payload API
- ❌ `getApprenants()` → Nouvelle collection
- ❌ `getRendezVous()` → Nouvelle collection
- ❌ `getStats()` → Calculs en temps réel

### **2. UserService** (`src/lib/user-service.ts`)

- ❌ `getUsers()` → Payload API
- ❌ `createUser()` → Payload API
- ❌ `updateUser()` → Payload API
- ❌ `deleteUser()` → Payload API
- ❌ `changePassword()` → Payload API

### **3. RendezVousService** (`src/lib/rendez-vous-service.ts`)

- ❌ Toutes les méthodes → Nouvelle collection

### **4. BlogService** (`src/lib/blog-service.ts`)

- ❌ Toutes les méthodes → Nouvelles collections

---

## 🚀 PLAN DE MIGRATION

### **Phase 1 : Configuration Payload CMS**

1. ✅ Ajouter les collections manquantes dans `payload.config.ts`
2. ✅ Configurer les relations entre collections
3. ✅ Ajouter les validations et contraintes

### **Phase 2 : Migration des données**

1. 🔄 Créer des scripts de migration des données mock
2. 🔄 Importer les données existantes dans MongoDB
3. 🔄 Vérifier l'intégrité des données

### **Phase 3 : Remplacement des services**

1. 🔄 Remplacer `MockService` par des appels Payload API
2. 🔄 Remplacer `UserService` par des appels Payload API
3. 🔄 Remplacer `RendezVousService` par des appels Payload API
4. 🔄 Remplacer `BlogService` par des appels Payload API

### **Phase 4 : Tests et validation**

1. 🔄 Tests de toutes les fonctionnalités
2. 🔄 Validation des performances
3. 🔄 Mise à jour de la documentation

---

## ⚠️ POINTS D'ATTENTION

### **1. Conflits de types**

- Types dans `src/types/common.ts` vs `src/types/users.ts`
- Harmonisation nécessaire des interfaces

### **2. Authentification**

- Migration du système d'auth mock vers Payload
- Gestion des sessions et tokens

### **3. Permissions**

- Système de permissions complexe à migrer
- Rôles et permissions par utilisateur

### **4. Relations**

- Relations entre programmes et formateurs
- Relations entre apprenants et programmes
- Relations entre rendez-vous et programmes

---

## 📈 ESTIMATION

- **Collections à créer :** 6 nouvelles collections
- **Services à migrer :** 4 services principaux
- **Temps estimé :** 2-3 jours de développement
- **Complexité :** Moyenne à élevée

---

## 🎯 PROCHAINES ÉTAPES

1. **Créer les collections Payload manquantes**
2. **Migrer les données mock vers MongoDB**
3. **Remplacer progressivement les services mock**
4. **Tester et valider chaque étape**
5. **Désactiver le mode mock (`NEXT_PUBLIC_USE_MOCK_DATA=false`)**
