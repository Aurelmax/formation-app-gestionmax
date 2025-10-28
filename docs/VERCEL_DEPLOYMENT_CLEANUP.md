# Guide de nettoyage des déploiements Vercel

Ce guide explique comment supprimer les déploiements échoués ou inutiles sur Vercel pour garder votre projet propre.

## Table des matières

- [Pourquoi nettoyer les déploiements ?](#pourquoi-nettoyer-les-déploiements-)
- [Méthode 1 : Interface Web Vercel (Recommandé)](#méthode-1--interface-web-vercel-recommandé)
- [Méthode 2 : CLI Vercel manuelle](#méthode-2--cli-vercel-manuelle)
- [Méthode 3 : Script automatique](#méthode-3--script-automatique)
- [Commandes utiles](#commandes-utiles)
- [Bonnes pratiques](#bonnes-pratiques)

---

## Pourquoi nettoyer les déploiements ?

- **Économiser de l'espace** : Les déploiements échoués occupent inutilement de l'espace
- **Améliorer la lisibilité** : Une liste propre facilite le suivi des déploiements réussis
- **Respecter les quotas** : Vercel limite le nombre de déploiements selon votre plan
- **Performances** : Réduire le nombre de déploiements améliore les temps de chargement du dashboard

---

## Méthode 1 : Interface Web Vercel (Recommandé)

### Pour les débutants - La plus simple

1. **Accéder au dashboard**
   - Allez sur https://vercel.com/dashboard
   - Connectez-vous avec votre compte

2. **Sélectionner votre projet**
   - Cliquez sur `formation-app-gestionmax`

3. **Accéder aux déploiements**
   - Cliquez sur l'onglet **"Deployments"** en haut

4. **Filtrer les déploiements échoués**
   - Utilisez le filtre de statut en haut à droite
   - Sélectionnez "Failed" ou "Error"

5. **Supprimer les déploiements**
   - Pour chaque déploiement échoué :
     - Cliquez sur les 3 points `⋮` à droite
     - Sélectionnez **"Delete Deployment"**
     - Confirmez la suppression

### Avantages
- ✅ Aucune installation requise
- ✅ Interface visuelle claire
- ✅ Prévisualisation avant suppression
- ✅ Pas de risque d'erreur de commande

### Inconvénients
- ❌ Fastidieux si beaucoup de déploiements
- ❌ Suppression un par un

---

## Méthode 2 : CLI Vercel manuelle

### Installation de la CLI Vercel

```bash
# Installer globalement
npm install -g vercel

# OU avec pnpm
pnpm add -g vercel

# OU avec yarn
yarn global add vercel
```

### Se connecter à Vercel

```bash
vercel login
```

Suivez les instructions pour vous authentifier (navigateur ou email).

### Lister les déploiements

```bash
# Lister tous les déploiements du projet
vercel ls

# Lister avec plus de détails
vercel ls formation-app-gestionmax

# Format JSON pour parsing
vercel ls formation-app-gestionmax --json
```

**Exemple de sortie :**
```
> formation-app-gestionmax
  ✓ dpl_abc123xyz (production) - 2 hours ago
  ✖ dpl_def456uvw (error) - 3 hours ago
  ✓ dpl_ghi789rst (preview) - 5 hours ago
```

### Supprimer un déploiement

```bash
# Supprimer avec confirmation interactive
vercel rm <deployment-url-or-id>

# Supprimer sans confirmation (automatique)
vercel rm <deployment-url-or-id> --yes

# Exemples concrets
vercel rm dpl_def456uvw --yes
vercel rm formation-app-gestionmax-abc123.vercel.app --yes
```

### Supprimer plusieurs déploiements

```bash
# Supprimer les déploiements un par un
vercel rm dpl_abc123 --yes
vercel rm dpl_def456 --yes
vercel rm dpl_ghi789 --yes
```

### Avantages
- ✅ Rapide pour quelques déploiements
- ✅ Scriptable
- ✅ Contrôle précis

### Inconvénients
- ❌ Nécessite installation CLI
- ❌ Suppression manuelle un par un
- ❌ Pas de filtre automatique par statut

---

## Méthode 3 : Script automatique

### Option A : Script avec jq (Avancé)

Le script `clean-vercel-deployments.sh` supprime automatiquement tous les déploiements échoués.

#### Prérequis

```bash
# Installer jq (parser JSON)
# Sur Ubuntu/Debian
sudo apt install jq

# Sur macOS
brew install jq

# Sur Windows (WSL)
sudo apt install jq
```

#### Utilisation

```bash
# 1. Se connecter à Vercel (une seule fois)
vercel login

# 2. Rendre le script exécutable (une seule fois)
chmod +x clean-vercel-deployments.sh

# 3. Exécuter le script
./clean-vercel-deployments.sh

# OU spécifier un projet différent
./clean-vercel-deployments.sh mon-autre-projet
```

#### Fonctionnement du script

```bash
#!/bin/bash

# Le script fait automatiquement :
# 1. Récupère tous les déploiements du projet
# 2. Filtre ceux avec statut ERROR, FAILED, ou CANCELED
# 3. Supprime chaque déploiement échoué
# 4. Affiche un récapitulatif
```

#### Exemple de sortie

```
🔍 Recherche des déploiements échoués pour le projet: formation-app-gestionmax

🗑️  Suppression du déploiement échoué: dpl_abc123xyz
   ✅ Supprimé avec succès
🗑️  Suppression du déploiement échoué: dpl_def456uvw
   ✅ Supprimé avec succès

✨ Nettoyage terminé !

📊 Déploiements restants:
> formation-app-gestionmax
  ✓ dpl_ghi789rst (production) - 2 hours ago
  ✓ dpl_jkl012mno (preview) - 5 hours ago
```

### Option B : Script simple (Sans jq)

Le script `clean-vercel-simple.sh` liste simplement les déploiements et donne les commandes à exécuter.

```bash
# Rendre exécutable
chmod +x clean-vercel-simple.sh

# Exécuter
./clean-vercel-simple.sh
```

**Sortie :**
```
🔍 Liste des déploiements pour: formation-app-gestionmax

> formation-app-gestionmax
  ✓ dpl_abc123 (production) - 2 hours ago
  ✖ dpl_def456 (error) - 3 hours ago
  ✓ dpl_ghi789 (preview) - 5 hours ago

Pour supprimer un déploiement, utilisez:
  vercel rm <deployment-url> --yes

Exemples:
  vercel rm formation-app-gestionmax-abc123.vercel.app --yes
  vercel rm dpl_xxxxxxxxxxxxx --yes
```

### Avantages
- ✅ Automatisation complète
- ✅ Suppression en masse
- ✅ Filtrage par statut

### Inconvénients
- ❌ Nécessite jq (Option A)
- ❌ Peut être risqué si mal configuré

---

## Commandes utiles

### Lister les déploiements

```bash
# Liste basique
vercel ls

# Liste avec nom de projet
vercel ls formation-app-gestionmax

# Format JSON (pour scripts)
vercel ls --json

# Limite à 10 déploiements
vercel ls --limit 10
```

### Obtenir des informations sur un déploiement

```bash
# Détails d'un déploiement
vercel inspect <deployment-id>

# Logs d'un déploiement
vercel logs <deployment-id>
```

### Supprimer des déploiements

```bash
# Suppression interactive (avec confirmation)
vercel rm <deployment-id>

# Suppression automatique (sans confirmation)
vercel rm <deployment-id> --yes

# Supprimer avec scope d'équipe
vercel rm <deployment-id> --scope my-team
```

### Supprimer TOUS les déploiements d'un projet

⚠️ **ATTENTION : Cette commande supprime TOUT, y compris les déploiements en production !**

```bash
# NE PAS UTILISER sans sauvegarde !
vercel remove formation-app-gestionmax --yes

# Préférez toujours supprimer sélectivement
```

---

## Bonnes pratiques

### 1. Nettoyage régulier

- **Hebdomadaire** : Supprimer les déploiements échoués de la semaine
- **Mensuel** : Réviser et supprimer les anciens previews inutiles
- **Avant release** : Nettoyer avant un déploiement important

### 2. Conservation des déploiements

À **GARDER** :
- ✅ Déploiement de production actuel
- ✅ Derniers previews réussis (pour rollback rapide)
- ✅ Déploiements de branches actives

À **SUPPRIMER** :
- ❌ Déploiements échoués (ERROR, FAILED)
- ❌ Déploiements annulés (CANCELED)
- ❌ Anciens previews de branches mergées
- ❌ Déploiements de test obsolètes

### 3. Automatisation recommandée

```bash
# Ajouter un alias dans ~/.bashrc ou ~/.zshrc
alias vercel-clean='cd ~/CascadeProjects/formation-app-gestionmax && ./clean-vercel-deployments.sh'

# Utiliser ensuite simplement
vercel-clean
```

### 4. Utiliser les filtres Vercel

```bash
# Déploiements de production uniquement
vercel ls --prod

# Déploiements d'une branche spécifique
vercel ls --branch main

# Déploiements récents (dernières 24h)
vercel ls --since 24h
```

### 5. Scripts d'automatisation CI/CD

Ajouter un job dans `.github/workflows/cleanup-vercel.yml` :

```yaml
name: Cleanup Vercel Deployments

on:
  schedule:
    - cron: '0 2 * * 0' # Tous les dimanches à 2h du matin
  workflow_dispatch: # Permet exécution manuelle

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Vercel CLI
        run: npm install -g vercel

      - name: Cleanup failed deployments
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          ./clean-vercel-deployments.sh
```

---

## Limites et quotas Vercel

### Plan Hobby (Gratuit)
- **Déploiements** : Illimités
- **Bande passante** : 100 GB/mois
- **Build time** : 6000 minutes/mois

### Plan Pro
- **Déploiements** : Illimités
- **Bande passante** : 1 TB/mois
- **Build time** : 24000 minutes/mois

### Recommandations
- Garder **< 100 déploiements** par projet pour de bonnes performances
- Supprimer les déploiements **> 30 jours** sauf production
- Nettoyer régulièrement pour éviter l'encombrement

---

## Dépannage

### Erreur : "Not authenticated"

```bash
# Se reconnecter à Vercel
vercel login

# Vérifier l'authentification
vercel whoami
```

### Erreur : "Project not found"

```bash
# Vérifier le nom du projet
vercel ls

# Utiliser le bon nom de projet
vercel ls formation-app-gestionmax
```

### Erreur : "Permission denied"

```bash
# Vérifier les permissions du script
ls -l clean-vercel-deployments.sh

# Rendre exécutable
chmod +x clean-vercel-deployments.sh
```

### Script ne supprime rien

```bash
# Vérifier que jq est installé
which jq

# Installer jq si nécessaire
sudo apt install jq  # Ubuntu/Debian
brew install jq      # macOS
```

### Déploiement ne se supprime pas

Certains déploiements ne peuvent pas être supprimés :
- Déploiement de production actuel
- Déploiements protégés par des règles d'équipe

**Solution** : Promouvoir un autre déploiement en production d'abord.

---

## Ressources supplémentaires

- **Documentation officielle Vercel CLI** : https://vercel.com/docs/cli
- **API Vercel** : https://vercel.com/docs/rest-api
- **Guide des déploiements** : https://vercel.com/docs/deployments/overview

---

## Récapitulatif rapide

| Besoin | Commande | Difficulté |
|--------|----------|------------|
| **Liste simple** | `vercel ls` | ⭐ Facile |
| **Supprimer 1 déploiement** | `vercel rm <id> --yes` | ⭐ Facile |
| **Supprimer plusieurs** | Répéter `vercel rm` | ⭐⭐ Moyen |
| **Nettoyage automatique** | `./clean-vercel-deployments.sh` | ⭐⭐⭐ Avancé |
| **Interface visuelle** | Dashboard Vercel | ⭐ Facile |

**Recommandation** : Commencez par l'interface web Vercel, puis passez au script automatique si vous avez beaucoup de déploiements à gérer régulièrement.

---

*Dernière mise à jour : 2025-10-28*
