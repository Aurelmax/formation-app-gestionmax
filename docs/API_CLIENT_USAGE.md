# Guide d'utilisation de l'API Client

Ce document explique comment utiliser les clients API centralisés pour interagir avec Payload CMS.

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Client API de base](#client-api-de-base)
3. [Client API avec Toast](#client-api-avec-toast)
4. [Exemples d'utilisation](#exemples-dutilisation)
5. [Gestion des erreurs](#gestion-des-erreurs)
6. [Notifications Toast](#notifications-toast)

---

## Vue d'ensemble

Deux modules sont disponibles pour interagir avec l'API Payload CMS :

- **`apiClient`** : Client HTTP de base sans notifications
- **`apiWithToast`** : Client avec notifications toast automatiques

### Quand utiliser lequel ?

- **apiClient** : Pour les requêtes silencieuses (ex: chargement de données en arrière-plan)
- **apiWithToast** : Pour les actions utilisateur nécessitant un feedback visuel (ex: création, modification, suppression)

---

## Client API de base

### Import

```typescript
import { api, apiClient } from '@/lib/apiClient'
```

### Authentification

```typescript
// Login
const response = await api.auth.login('email@example.com', 'password')
console.log(response.token)

// Logout
await api.auth.logout()

// Récupérer l'utilisateur connecté
const user = await api.auth.me()
```

### CRUD Programmes/Formations

```typescript
// Lister toutes les formations
const programmes = await api.programmes.list()

// Filtrer les formations
const filteredProgrammes = await api.programmes.list({
  where: JSON.stringify({ niveau: { equals: 'Débutant' } }),
  limit: '10',
})

// Récupérer une formation par ID
const programme = await api.programmes.get('programme-id-123')

// Créer une formation
const newProgramme = await api.programmes.create({
  titre: 'Formation WordPress Avancé',
  description: 'Description...',
  duree: 21,
  prix: 1500,
})

// Mettre à jour une formation
const updatedProgramme = await api.programmes.update('programme-id-123', {
  titre: 'Nouveau titre',
  prix: 1800,
})

// Supprimer une formation
await api.programmes.delete('programme-id-123')
```

### CRUD Apprenants

```typescript
// Lister tous les apprenants
const apprenants = await api.apprenants.list()

// Créer un apprenant
const newApprenant = await api.apprenants.create({
  nom: 'Dupont',
  prenom: 'Jean',
  email: 'jean.dupont@example.com',
  telephone: '0612345678',
})

// Mettre à jour un apprenant
const updatedApprenant = await api.apprenants.update('apprenant-id-123', {
  telephone: '0698765432',
})
```

### CRUD Rendez-vous

```typescript
// Lister tous les rendez-vous
const rendezVous = await api.rendezVous.list()

// Créer un rendez-vous
const newRdv = await api.rendezVous.create({
  titre: 'Entretien de positionnement',
  date: '2025-11-15T10:00:00Z',
  duree: 60,
  type: 'presentiel',
  apprenant: 'apprenant-id-123',
})

// Supprimer un rendez-vous
await api.rendezVous.delete('rdv-id-123')
```

### CRUD Articles (Blog)

```typescript
// Lister tous les articles
const articles = await api.articles.list()

// Filtrer les articles publiés
const publishedArticles = await api.articles.list({
  where: JSON.stringify({ statut: { equals: 'publie' } }),
})

// Récupérer un article par ID
const article = await api.articles.get('article-id-123')

// Créer un article
const newArticle = await api.articles.create({
  titre: 'Mon article de blog',
  slug: 'mon-article-de-blog',
  contenu: '<p>Contenu de l\'article</p>',
  resume: 'Résumé de l\'article...',
  auteur: 'Aurélien LAVAYSSIERE',
  datePublication: '2025-10-28',
  statut: 'publie',
  metaDescription: 'Description SEO de l\'article',
})

// Mettre à jour un article
const updatedArticle = await api.articles.update('article-id-123', {
  titre: 'Nouveau titre',
  statut: 'publie',
})

// Supprimer un article
await api.articles.delete('article-id-123')
```

### CRUD Catégories

```typescript
// Lister toutes les catégories
const categories = await api.categories.list()

// Créer une catégorie
const newCategory = await api.categories.create({
  nom: 'WordPress',
  slug: 'wordpress',
  description: 'Articles sur WordPress',
  couleur: '#3B82F6',
  icone: '📝',
})

// Mettre à jour une catégorie
await api.categories.update('category-id-123', {
  nom: 'WordPress Avancé',
})

// Supprimer une catégorie
await api.categories.delete('category-id-123')
```

### CRUD Tags

```typescript
// Lister tous les tags
const tags = await api.tags.list()

// Créer un tag
const newTag = await api.tags.create({
  nom: 'SEO',
  slug: 'seo',
  couleur: '#6B7280',
})

// Supprimer un tag
await api.tags.delete('tag-id-123')
```

### CRUD Contacts

```typescript
// Lister tous les contacts
const contacts = await api.contacts.list()

// Créer un contact (formulaire de contact)
const newContact = await api.contacts.create({
  nom: 'Martin',
  email: 'martin@example.com',
  message: 'Je souhaite des informations sur vos formations.',
})
```

### Media (Upload de fichiers)

```typescript
// Lister tous les médias
const media = await api.media.list()

// Upload d'un fichier
const formData = new FormData()
formData.append('file', fileInput.files[0])

const uploadedMedia = await api.media.upload(formData)
console.log(uploadedMedia.url)

// Supprimer un média
await api.media.delete('media-id-123')
```

### Requêtes personnalisées

```typescript
// GET personnalisé
const data = await apiClient.get('/api/custom-endpoint', {
  param1: 'value1',
  param2: 'value2',
})

// POST personnalisé
const result = await apiClient.post('/api/custom-endpoint', {
  field1: 'value1',
  field2: 'value2',
})
```

---

## Client API avec Toast

### Import

```typescript
import { apiWithToast } from '@/lib/apiClientWithToast'
import { showSuccess, showError, showInfo, showWarning } from '@/lib/toast'
```

### Utilisation avec feedback automatique

```typescript
'use client'

import { apiWithToast } from '@/lib/apiClientWithToast'
import { useRouter } from 'next/navigation'

export function CreateProgrammeForm() {
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Toast automatique : "Formation créée avec succès"
      const programme = await apiWithToast.programmes.create({
        titre: 'Formation WordPress',
        description: 'Description...',
        duree: 14,
        prix: 1200,
      })

      // Rediriger vers la liste des programmes
      router.push('/dashboard/programmes')
    } catch (error) {
      // Toast d'erreur déjà affiché automatiquement
      console.error('Erreur lors de la création', error)
    }
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

### Authentification avec feedback

```typescript
'use client'

import { apiWithToast } from '@/lib/apiClientWithToast'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    try {
      // Toast automatique : "Connexion réussie"
      const response = await apiWithToast.auth.login(email, password)

      // Rediriger vers le dashboard
      router.push('/dashboard')
    } catch (error) {
      // Toast d'erreur : "Identifiants incorrects"
      console.error('Erreur de connexion', error)
    }
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleLogin(email, password)
    }}>
      ...
    </form>
  )
}
```

### Suppression avec confirmation

```typescript
'use client'

import { apiWithToast } from '@/lib/apiClientWithToast'

export function DeleteButton({ programmeId }: { programmeId: string }) {
  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      try {
        // Toast automatique : "Formation supprimée"
        await apiWithToast.programmes.delete(programmeId)

        // Rafraîchir la liste
        router.refresh()
      } catch (error) {
        // Toast d'erreur affiché automatiquement
        console.error('Erreur lors de la suppression', error)
      }
    }
  }

  return (
    <button onClick={handleDelete} className="text-red-600">
      Supprimer
    </button>
  )
}
```

### Upload avec barre de progression

```typescript
'use client'

import { apiWithToast } from '@/lib/apiClientWithToast'

export function FileUpload() {
  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      // Toast avec progression : "Upload en cours..." → "Fichier uploadé avec succès"
      const media = await apiWithToast.media.upload(formData)

      console.log('URL du média:', media.url)
    } catch (error) {
      // Toast d'erreur affiché automatiquement
      console.error('Erreur upload', error)
    }
  }

  return (
    <input
      type="file"
      onChange={(e) => {
        if (e.target.files?.[0]) {
          handleUpload(e.target.files[0])
        }
      }}
    />
  )
}
```

---

## Gestion des erreurs

### Structure d'erreur API

```typescript
interface ApiError {
  message: string
  status: number
  errors?: Array<{ field: string; message: string }>
}
```

### Gestion manuelle des erreurs

```typescript
import { apiClient, type ApiError } from '@/lib/apiClient'
import { showApiError } from '@/lib/toast'

try {
  const programme = await apiClient.get('/api/programmes/invalid-id')
} catch (error) {
  const apiError = error as ApiError

  console.error('Status:', apiError.status)
  console.error('Message:', apiError.message)

  if (apiError.errors) {
    apiError.errors.forEach((err) => {
      console.error(`${err.field}: ${err.message}`)
    })
  }

  // Afficher un toast d'erreur personnalisé
  showApiError(apiError)
}
```

### Gestion des erreurs de validation

```typescript
try {
  await apiClient.post('/api/programmes', {
    titre: '', // Champ requis manquant
  })
} catch (error) {
  const apiError = error as ApiError

  if (apiError.status === 400 && apiError.errors) {
    // Afficher les erreurs de validation
    apiError.errors.forEach((err) => {
      console.log(`Erreur sur ${err.field}: ${err.message}`)
    })
  }
}
```

---

## Notifications Toast

### Types de notifications

```typescript
import {
  showSuccess,
  showError,
  showInfo,
  showWarning,
  showPromise,
} from '@/lib/toast'

// Succès
showSuccess('Opération réussie')
showSuccess('Sauvegarde effectuée', 'Vos modifications ont été enregistrées')

// Erreur
showError('Une erreur est survenue')
showError('Erreur de validation', 'Veuillez vérifier les champs du formulaire')

// Information
showInfo('Nouveau message', 'Vous avez reçu 3 nouveaux messages')

// Avertissement
showWarning('Action sensible', 'Cette action est irréversible')

// Promesse (avec états loading/success/error)
const promise = fetch('/api/data')
showPromise(promise, {
  loading: 'Chargement en cours...',
  success: 'Données chargées',
  error: 'Erreur lors du chargement',
})
```

### Toast personnalisé avancé

```typescript
import { toast } from '@/lib/toast'

// Toast avec action
toast.success('Message envoyé', {
  action: {
    label: 'Annuler',
    onClick: () => console.log('Action annulée'),
  },
})

// Toast avec durée personnalisée
toast.info('Message temporaire', {
  duration: 2000, // 2 secondes
})

// Toast persistant (reste jusqu'à fermeture manuelle)
toast.error('Erreur critique', {
  duration: Infinity,
})
```

---

## Exemples complets

### Exemple 1 : Page de liste avec chargement

```typescript
'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/apiClient'
import { showError } from '@/lib/toast'

export default function ProgrammesPage() {
  const [programmes, setProgrammes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProgrammes()
  }, [])

  const loadProgrammes = async () => {
    try {
      const data = await api.programmes.list()
      setProgrammes(data.docs)
    } catch (error) {
      showError('Impossible de charger les formations')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Chargement...</div>

  return (
    <div>
      <h1>Formations</h1>
      <ul>
        {programmes.map((p) => (
          <li key={p.id}>{p.titre}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Exemple 2 : Formulaire de création avec toast

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiWithToast } from '@/lib/apiClientWithToast'

export default function CreateProgrammePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    duree: 14,
    prix: 1200,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Toast automatique : "Formation créée avec succès"
      await apiWithToast.programmes.create(formData)

      // Rediriger après succès
      router.push('/dashboard/programmes')
    } catch (error) {
      // Toast d'erreur déjà affiché
      console.error('Erreur lors de la création', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Titre"
        value={formData.titre}
        onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Création...' : 'Créer la formation'}
      </button>
    </form>
  )
}
```

### Exemple 3 : Hook personnalisé pour CRUD

```typescript
'use client'

import { useState, useCallback } from 'react'
import { apiWithToast } from '@/lib/apiClientWithToast'

export function useProgrammes() {
  const [programmes, setProgrammes] = useState([])
  const [loading, setLoading] = useState(false)

  const loadProgrammes = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiWithToast.programmes.list()
      setProgrammes(data.docs)
    } finally {
      setLoading(false)
    }
  }, [])

  const createProgramme = useCallback(async (data: unknown) => {
    const newProgramme = await apiWithToast.programmes.create(data)
    setProgrammes((prev) => [...prev, newProgramme])
    return newProgramme
  }, [])

  const updateProgramme = useCallback(async (id: string, data: unknown) => {
    const updated = await apiWithToast.programmes.update(id, data)
    setProgrammes((prev) => prev.map((p) => (p.id === id ? updated : p)))
    return updated
  }, [])

  const deleteProgramme = useCallback(async (id: string) => {
    await apiWithToast.programmes.delete(id)
    setProgrammes((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return {
    programmes,
    loading,
    loadProgrammes,
    createProgramme,
    updateProgramme,
    deleteProgramme,
  }
}

// Utilisation du hook
export default function ProgrammesPage() {
  const { programmes, loading, loadProgrammes, deleteProgramme } = useProgrammes()

  useEffect(() => {
    loadProgrammes()
  }, [loadProgrammes])

  return (
    <div>
      {programmes.map((p) => (
        <div key={p.id}>
          <h3>{p.titre}</h3>
          <button onClick={() => deleteProgramme(p.id)}>Supprimer</button>
        </div>
      ))}
    </div>
  )
}
```

---

## Bonnes pratiques

### ✅ À faire

- Utiliser `api` ou `apiClient` pour les chargements de données silencieux
- Utiliser `apiWithToast` pour les actions utilisateur (CRUD)
- Gérer les erreurs dans un bloc `try/catch`
- Afficher un état de chargement pendant les requêtes
- Valider les données côté client avant d'envoyer

### ❌ À éviter

- Oublier de gérer les erreurs
- Faire des requêtes sans état de chargement
- Utiliser `apiWithToast` pour du polling ou des requêtes fréquentes
- Exposer les tokens ou données sensibles côté client

---

## Support

Pour toute question ou problème :
- Documentation Payload CMS : https://payloadcms.com/docs
- Documentation Sonner : https://sonner.emilkowal.ski/

