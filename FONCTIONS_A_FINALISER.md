# Fonctions à Finaliser - Formation App GestionMax

**Date d'analyse** : 23 octobre 2025
**Projet** : formation-app-gestionmax

---

## 🔴 PRIORITÉ CRITIQUE - À faire immédiatement

### 1. **Gestion des Utilisateurs Complète**
**Fichier** : `src/lib/unified-service.ts`
**Lignes** : 55-95

**Problèmes** :
- ❌ `createUser()` retourne des données mock (ligne 55-56)
- ❌ `updateUser()` non implémenté (ligne 72-73)
- ❌ `deleteUser()` non implémenté (ligne 88-90)
- ❌ `changePassword()` non implémenté (ligne 93-95)

**Solution** :
```typescript
// Implémenter ces fonctions avec Payload CMS
async createUser(userData: CreateUserData): Promise<User> {
  return await payload.create({
    collection: 'users',
    data: userData
  })
}
```

**Impact** : 🔥 Les opérations utilisateurs ne persistent pas en base !

---

### 2. **API Routes Contacts Manquantes**
**Localisation** : `src/app/api/contacts/` (n'existe pas !)

**Problème** :
- ❌ Collection Payload existe (`payload.config.ts` lignes 921-991)
- ❌ Interface admin existe (`src/app/admin/contacts/page.tsx`)
- ❌ Component ContactManagement utilise des données mock
- ❌ Aucune API pour CRUD contacts

**À créer** :
```
src/app/api/contacts/
  ├── route.ts           (GET, POST)
  └── [id]/
      └── route.ts       (GET, PUT, DELETE)
```

**Impact** : 🔥 Le formulaire de contact ne fonctionne pas !

---

### 3. **Authentification & Sécurité**
**Fichier** : `src/hooks/useAuth.ts` et `src/lib/user-service.ts`

**Problèmes** :
- ❌ Auth stockée uniquement en localStorage (client-side)
- ❌ Pas de JWT ou sessions serveur
- ❌ Pas de protection CSRF
- ❌ Pas de rate limiting
- ❌ Routes API non protégées

**À implémenter** :
1. NextAuth.js ou système JWT serveur
2. Middleware de protection des routes API
3. Tokens CSRF pour les formulaires
4. Rate limiting avec `express-rate-limit` ou similaire

**Impact** : 🔥 Sécurité compromise !

---

## 🟠 PRIORITÉ HAUTE - À faire rapidement

### 4. **Système d'Emails**
**Localisation** : Aucun service email n'existe

**Manque** :
- ❌ Pas de librairie email (nodemailer, resend)
- ❌ Pas de templates d'emails
- ❌ Confirmations rendez-vous non envoyées
- ❌ Réponses aux contacts non envoyées
- ❌ Reset mot de passe impossible

**À implémenter** :
```bash
npm install resend
# ou
npm install nodemailer
```

**Templates nécessaires** :
- Confirmation de rendez-vous
- Réponse au contact
- Création de compte
- Réinitialisation mot de passe
- Notification nouvel apprenant

---

### 5. **Upload Média Réel**
**Fichier** : `src/components/admin/MediaManager.tsx`

**Problème** :
- ❌ Utilise localStorage pour stocker les fichiers (lignes 62-71)
- ❌ Pas d'intégration avec Payload CMS Media
- ❌ Pas d'API `/api/media/upload`

**Solution** :
```typescript
// Créer src/app/api/media/upload/route.ts
import { getPayload } from 'payload'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file')

  const result = await payload.create({
    collection: 'media',
    data: { alt: formData.get('alt') },
    file: file
  })

  return Response.json(result)
}
```

---

### 6. **Gestion Catégories & Tags Blog**
**Localisation** : Interface admin manquante

**Situation** :
- ✅ API routes existent (`/api/blog/categories`, `/api/blog/tags`)
- ✅ Collections Payload existent
- ❌ Pas d'interface admin pour gérer
- ❌ Impossible de créer/modifier/supprimer

**À créer** :
```
src/app/admin/blog/
  ├── categories/
  │   ├── page.tsx         (Liste)
  │   └── nouveau/page.tsx (Création)
  └── tags/
      ├── page.tsx         (Liste)
      └── nouveau/page.tsx (Création)
```

---

### 7. **Relations Payload Incomplètes**
**Fichier** : `src/lib/payload-service.ts`

**Problèmes** :
- ❌ Ligne 122 : `formateurs: []` - Relations formateurs non chargées
- ❌ Ligne 150 : `programmeTitre: ''` - Titre programme non récupéré

**Solution** :
```typescript
// Utiliser depth pour charger les relations
const programme = await payload.findByID({
  collection: 'programmes',
  id: programmeId,
  depth: 2  // Charger les relations
})
```

---

## 🟡 PRIORITÉ MOYENNE - Améliorer l'expérience

### 8. **Endpoints API Manquants**

**À créer** :

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| PUT | `/api/apprenants/[id]` | Modifier apprenant |
| DELETE | `/api/apprenants/[id]` | Supprimer apprenant |
| POST | `/api/contacts` | Créer contact |
| PUT | `/api/contacts/[id]` | Modifier contact |
| DELETE | `/api/contacts/[id]` | Supprimer contact |
| GET | `/api/categories` | Lister catégories |
| POST | `/api/categories` | Créer catégorie |
| GET | `/api/tags` | Lister tags |
| POST | `/api/tags` | Créer tag |

---

### 9. **Nettoyage Console.log**
**Localisation** : Partout dans le code (100+ occurrences)

**Fichiers principaux** :
- `src/lib/user-service.ts` - lignes 48, 56, 61, 66, 246, 261, 270
- `src/components/layouts/Sidebar.tsx` - ligne 100
- `src/lib/blog-api-service.ts` - Multiple erreurs
- Tous les services ont des `console.error`

**Action** :
1. Remplacer par un système de logging (Winston, Pino)
2. Ou supprimer en production
3. Garder uniquement en mode développement

---

### 10. **Système de Rendez-vous Avancé**

**Fonctionnalités manquantes** :
- ❌ Notifications email automatiques
- ❌ Export iCal/Google Calendar
- ❌ Système de rappels (flag `rappelEnvoye` existe mais pas implémenté)
- ❌ SMS notifications
- ❌ Vérification disponibilité formateur

**À ajouter** :
```typescript
// Fonction d'envoi de rappel
async function sendReminder(rdvId: string) {
  const rdv = await getRendezVous(rdvId)
  if (!rdv.rappelEnvoye && isOneDayBefore(rdv.date)) {
    await sendEmail({
      to: rdv.client.email,
      subject: 'Rappel - Rendez-vous demain',
      template: 'reminder',
      data: rdv
    })
    await updateRendezVous(rdvId, { rappelEnvoye: true })
  }
}
```

---

### 11. **Système de Tests**

**Situation actuelle** :
- ❌ 0% de couverture de tests
- ❌ Aucun test unitaire (*.test.ts)
- ❌ Aucun test d'intégration
- ❌ Aucun test E2E

**À implémenter** :
```bash
npm install --save-dev vitest @testing-library/react
```

**Tests prioritaires** :
1. Services (user-service, programme-service)
2. Hooks (useAuth, useApiService)
3. Composants critiques (formulaires)
4. Routes API principales

---

## 🟢 PRIORITÉ BASSE - Optimisations futures

### 12. **Documentation Projet**

**Fichier** : `README.md`

**Manque** :
- Architecture du projet
- Liste des endpoints API
- Variables d'environnement requises
- Instructions setup MongoDB/Payload
- Guide de déploiement
- Guide de contribution

---

### 13. **Fonctionnalités Blog Avancées**

**À ajouter** :
- Système de commentaires
- Articles liés/recommandés
- Indicateur de progression lecture
- Boutons partage social
- Flux RSS
- Newsletter (UI existe ligne 248 de blog/page.tsx mais pas de backend)

---

### 14. **Analytics & Reporting**

**Manque** :
- Dashboard statistiques basique seulement
- Pas de rapports détaillés
- Pas d'export CSV/Excel
- Pas de graphiques de progression
- Pas de reporting financier

---

### 15. **Pages de Debug à Supprimer**

**À nettoyer** :
```
src/app/admin/
  ├── debug-users/      (❌ À supprimer)
  ├── quick-test/       (❌ À supprimer)
  └── test-login/       (❌ À supprimer)
```

**Aussi** :
- `src/components/layouts/Sidebar.tsx.backup` - Fichier backup à supprimer

---

## 📊 Résumé Statistique

| Catégorie | Nombre |
|-----------|--------|
| **TODOs critiques** | 6 items |
| **Console.log** | 100+ |
| **API routes manquantes** | ~10 endpoints |
| **Composants avec mock data** | 3 |
| **Collections sans UI complète** | 3 |
| **Problèmes sécurité** | Multiple |
| **Couverture tests** | 0% |

---

## 🗓️ Plan d'Action Recommandé

### Semaine 1 (Immédiat)
1. ✅ Créer API routes Contacts
2. ✅ Implémenter CRUD unified-service
3. ✅ Nettoyer console.log
4. ✅ Corriger relations Payload
5. ✅ Mettre en place authentification serveur

### Semaines 2-4 (Court terme)
1. Ajouter système d'emails
2. Finaliser upload média
3. Créer UI catégories/tags
4. Documenter API
5. Supprimer pages de debug

### Mois 2-3 (Moyen terme)
1. Implémenter tests
2. Ajouter analytics/reporting
3. Améliorer système rendez-vous
4. Enrichir blog
5. Documentation complète

### Mois 4+ (Long terme)
1. Refactoriser collections dupliquées
2. Features avancées (commentaires, reviews)
3. Optimisation performances
4. SEO improvements
5. Audit accessibilité

---

## 🎯 Estimation Temps de Développement

**Total pour items critiques et haute priorité** : 6-8 semaines

**Breakdown** :
- Critique (1-2 semaines) : 40h
- Haute priorité (2-3 semaines) : 80h
- Moyenne priorité (2-3 semaines) : 60h

**Total** : ~180 heures de développement

---

**Document créé le** : 23 octobre 2025
**Dernière analyse** : Analyse complète du codebase
