# 🎉 Guide d'Utilisation des Confettis

**Package**: `canvas-confetti`
**Hook personnalisé**: `useConfetti`

---

## 📦 Installation

Les confettis sont déjà installés et configurés dans l'application:

```bash
✅ npm install canvas-confetti
✅ npm install --save-dev @types/canvas-confetti
```

---

## 🚀 Utilisation Rapide

### Dans un Formulaire

```tsx
'use client'

import { useConfetti } from '@/hooks/useConfetti'
import { toast } from 'sonner'

export function MyForm() {
  const { triggerCelebration } = useConfetti()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await submitForm()

      if (response.success) {
        // 🎉 Déclencher les confettis!
        triggerCelebration()
        toast.success('Formulaire envoyé avec succès!')
      }
    } catch (error) {
      toast.error('Erreur')
    }
  }

  return <form onSubmit={handleSubmit}>{/* ... */}</form>
}
```

---

## 🎨 Types de Confettis Disponibles

Le hook `useConfetti` expose 8 fonctions différentes:

### 1. `triggerConfetti(options?)` - Confettis Basiques

Explosion simple de confettis au centre de l'écran.

```tsx
const { triggerConfetti } = useConfetti()

// Usage basique
triggerConfetti()

// Avec options personnalisées
triggerConfetti({
  particleCount: 150,
  spread: 90,
  colors: ['#00b894', '#0984e3'],
})
```

**Quand l'utiliser**: Actions simples, succès rapides

---

### 2. `triggerCelebration()` - Célébration Complète ⭐

Effet complet avec 3 vagues de confettis (gauche + droite + centre).

```tsx
const { triggerCelebration } = useConfetti()

triggerCelebration()
```

**Quand l'utiliser**:
- ✅ Soumission formulaire public (rendez-vous, contact)
- ✅ Inscription réussie
- ✅ Validation importante

**Déjà intégré dans**:
- `PublicRendezVousForm.tsx` (ligne 101)

---

### 3. `triggerBrandedConfetti()` - Confettis aux Couleurs de la Marque

Confettis avec les couleurs de votre entreprise (`#00b894`, `#0984e3`, `#6c5ce7`).

```tsx
const { triggerBrandedConfetti } = useConfetti()

triggerBrandedConfetti()
```

**Quand l'utiliser**:
- ✅ Formulaires admin
- ✅ Actions internes
- ✅ Succès "discrets"

**Déjà intégré dans**:
- `RendezVousForm.tsx` (ligne 87)

---

### 4. `triggerFireworks()` - Feux d'Artifice 🎆

Animation continue pendant 3 secondes avec des confettis qui jaillissent depuis les deux côtés.

```tsx
const { triggerFireworks } = useConfetti()

triggerFireworks()
```

**Quand l'utiliser**:
- ✅ Événement exceptionnel (première vente, 100ème inscription)
- ✅ Milestone important
- ✅ Succès majeur

---

### 5. `triggerRain()` - Pluie de Confettis 🌧️

Pluie continue de confettis pendant 2 secondes.

```tsx
const { triggerRain } = useConfetti()

triggerRain()
```

**Quand l'utiliser**:
- ✅ Effet d'ambiance
- ✅ Page de félicitations
- ✅ Fin de parcours

---

### 6. `triggerLeftConfetti()` / `triggerRightConfetti()`

Confettis depuis un côté spécifique.

```tsx
const { triggerLeftConfetti, triggerRightConfetti } = useConfetti()

triggerLeftConfetti() // Depuis la gauche
triggerRightConfetti() // Depuis la droite
```

**Quand l'utiliser**:
- ✅ Pour créer des animations personnalisées
- ✅ Combiner avec d'autres effets

---

### 7. `clearConfetti()` - Nettoyer

Supprime immédiatement tous les confettis de l'écran.

```tsx
const { clearConfetti } = useConfetti()

clearConfetti()
```

---

## 🎯 Où les Confettis Sont Déjà Intégrés

| Formulaire | Effet | Fichier | Ligne |
|------------|-------|---------|-------|
| **Rendez-vous Public** | `triggerCelebration()` | `PublicRendezVousForm.tsx` | 101 |
| **Rendez-vous Admin** | `triggerBrandedConfetti()` | `RendezVousForm.tsx` | 87 |

---

## 🎨 Personnalisation

### Options Disponibles

```typescript
interface ConfettiOptions {
  particleCount?: number // Nombre de confettis (défaut: 100)
  spread?: number // Angle de dispersion (défaut: 70)
  origin?: { x: number; y: number } // Point d'origine (x: 0-1, y: 0-1)
  colors?: string[] // Couleurs personnalisées
  gravity?: number // Gravité (défaut: 1)
  scalar?: number // Taille des confettis (défaut: 1)
  drift?: number // Dérive horizontale (défaut: 0)
}
```

### Exemples Personnalisés

```tsx
// Confettis géants et lents
triggerConfetti({
  particleCount: 50,
  scalar: 3, // 3x plus gros
  gravity: 0.5, // 2x plus lent
})

// Explosion massive
triggerConfetti({
  particleCount: 300,
  spread: 180,
  origin: { y: 0.4 },
})

// Confettis en forme de coeur
triggerConfetti({
  shapes: ['heart'],
  colors: ['#ff0000', '#ff69b4'],
  particleCount: 100,
})
```

---

## 🧪 Page de Démonstration

Testez tous les effets de confettis:

**URL**: [http://localhost:3010/demo/confetti](http://localhost:3010/demo/confetti)

Cette page permet de:
- ✅ Tester tous les types de confettis
- ✅ Voir les effets en direct
- ✅ Copier le code d'exemple
- ✅ Comprendre quand utiliser chaque effet

---

## 📝 Bonnes Pratiques

### ✅ À FAIRE

1. **Utiliser modérément**: Les confettis doivent rester un moment spécial
2. **Timing approprié**: Déclencher APRÈS la confirmation de succès
3. **Feedback combiné**: Utiliser avec `toast.success()` pour le texte
4. **Mobile-friendly**: Les confettis fonctionnent sur mobile sans impact performance

```tsx
// ✅ BON
if (response.success) {
  triggerCelebration() // D'abord les confettis
  toast.success('Succès!') // Puis le message
  onSuccess?.() // Puis les callbacks
}
```

### ❌ À ÉVITER

1. **Pas de confettis sur chaque clic**: Réserver aux vrais succès
2. **Pas de confettis multiples simultanés**: Éviter de tout déclencher en même temps
3. **Pas de confettis sur erreur**: Uniquement pour les succès

```tsx
// ❌ MAUVAIS
onClick={() => {
  triggerFireworks()
  triggerRain()
  triggerCelebration() // Trop de confettis!
}}

// ❌ MAUVAIS
if (error) {
  triggerConfetti() // Pas de confettis sur erreur!
}
```

---

## 🔧 Intégration dans Nouveaux Formulaires

### Étape 1: Importer le Hook

```tsx
import { useConfetti } from '@/hooks/useConfetti'
```

### Étape 2: Initialiser

```tsx
export function MyForm() {
  const { triggerCelebration } = useConfetti()
  // ...
}
```

### Étape 3: Déclencher au Succès

```tsx
const handleSubmit = async () => {
  try {
    const response = await api.submit()
    if (response.success) {
      triggerCelebration() // 🎉
      toast.success('Succès!')
    }
  } catch (error) {
    toast.error('Erreur')
  }
}
```

---

## 📊 Performance

- ✅ **Léger**: ~5KB gzippé
- ✅ **Performant**: Utilise Canvas API
- ✅ **Mobile-friendly**: Fonctionne sur tous devices
- ✅ **Pas de dépendances lourdes**: Juste canvas-confetti

---

## 🎓 Exemples Complets

### Formulaire de Contact

```tsx
'use client'

import { useState } from 'react'
import { useConfetti } from '@/hooks/useConfetti'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { triggerCelebration } = useConfetti()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
      })

      const data = await response.json()

      if (data.success) {
        // 🎉 Confettis de célébration!
        triggerCelebration()
        toast.success('Message envoyé avec succès!')
        e.currentTarget.reset()
      } else {
        toast.error('Erreur lors de l\'envoi')
      }
    } catch (error) {
      toast.error('Erreur réseau')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="nom" placeholder="Nom" required />
      <input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Message" required />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Envoi...' : 'Envoyer'}
      </Button>
    </form>
  )
}
```

### Formulaire avec Options

```tsx
export function FormWithOptions() {
  const {
    triggerCelebration,
    triggerBrandedConfetti,
    triggerFireworks,
  } = useConfetti()

  const handleSubmit = async (importance: 'normal' | 'important' | 'exceptionnel') => {
    const response = await submitForm()

    if (response.success) {
      // Choisir l'effet selon l'importance
      switch (importance) {
        case 'exceptionnel':
          triggerFireworks() // Feux d'artifice pour événement exceptionnel
          break
        case 'important':
          triggerCelebration() // Célébration complète
          break
        default:
          triggerBrandedConfetti() // Confettis simples
      }

      toast.success('Succès!')
    }
  }

  return <>{/* ... */}</>
}
```

---

## 🐛 Dépannage

### Les confettis ne s'affichent pas

1. Vérifier que le composant est `'use client'`
2. Vérifier que le hook est appelé à l'intérieur du composant
3. Vérifier la console pour les erreurs

### Les confettis restent à l'écran

```tsx
const { clearConfetti } = useConfetti()

// Nettoyer après 5 secondes
useEffect(() => {
  const timer = setTimeout(clearConfetti, 5000)
  return () => clearTimeout(timer)
}, [])
```

---

## 📚 Ressources

- **Documentation canvas-confetti**: [https://www.npmjs.com/package/canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Hook personnalisé**: `src/hooks/useConfetti.ts`
- **Composant démo**: `src/components/demo/ConfettiDemo.tsx`
- **Page démo**: `/demo/confetti`

---

## ✅ Checklist d'Intégration

Avant de déployer un nouveau formulaire avec confettis:

- [ ] Hook `useConfetti` importé
- [ ] Effet de confettis choisi selon le contexte
- [ ] Confettis déclenchés APRÈS succès confirmé
- [ ] Toast message combiné avec confettis
- [ ] Testé sur mobile et desktop
- [ ] Testé le formulaire complet end-to-end

---

**Créé le**: 2025-10-25
**Version**: 1.0.0
**Status**: ✅ Production Ready
