# 📅 Système de Prise de Rendez-vous - GestionMax

## 🎯 Vue d'ensemble

Le système de prise de rendez-vous permet aux clients de demander des rendez-vous pour les programmes de formation et à l'équipe de gérer efficacement tous les rendez-vous depuis l'interface d'administration.

## ✨ Fonctionnalités principales

### 🗓️ Gestion des rendez-vous

- **CRUD complet** : Création, lecture, modification, suppression
- **Types de RDV** : Positionnement, Information, Inscription, Suivi
- **Statuts** : En attente, Confirmé, Annulé, Terminé, Reporté
- **Lieux** : Présentiel, Visioconférence, Téléphone
- **Filtres avancés** : Par statut, type, lieu, programme, dates
- **Recherche** : Par nom, email, programme

### 📊 Statistiques en temps réel

- Total des rendez-vous
- Rendez-vous du jour
- Rendez-vous de la semaine
- Rendez-vous confirmés
- Répartition par statut

### 🔗 Intégration

- **Programmes de formation** : Chaque RDV lié à un programme
- **Interface publique** : Formulaire accessible aux clients
- **Interface admin** : Gestion centralisée pour l'équipe

## 🏗️ Architecture

### 📁 Structure des fichiers

```
src/
├── types/
│   └── rendez-vous.ts          # Types TypeScript
├── lib/
│   └── rendez-vous-service.ts  # Service de gestion des données
├── components/
│   ├── admin/
│   │   └── RendezVousManagement.tsx  # Interface d'administration
│   └── forms/
│       ├── RendezVousForm.tsx        # Formulaire de création
│       └── RendezVousModal.tsx       # Modal réutilisable
├── app/
│   ├── api/rendez-vous/
│   │   ├── route.ts                  # API principale
│   │   └── [id]/route.ts             # API par ID
│   ├── admin/rendez-vous/
│   │   └── page.tsx                  # Page d'administration
│   └── (public)/rendez-vous/
│       └── page.tsx                  # Page publique
```

### 🔧 Composants principaux

#### 1. **RendezVousManagement**

Interface d'administration complète avec :

- Liste des rendez-vous avec filtres
- Statistiques en temps réel
- Actions rapides (confirmer, annuler, etc.)
- Recherche et tri

#### 2. **RendezVousForm**

Formulaire de création/modification avec :

- Informations client
- Type et lieu de rendez-vous
- Date et heure
- Notes supplémentaires

#### 3. **RendezVousModal**

Modal réutilisable pour intégration dans :

- Cartes de formation du catalogue
- Pages de programmes
- Boutons d'action

## 📋 Types de données

### RendezVous

```typescript
interface RendezVous {
  id: string
  programmeId: string
  programmeTitre: string
  client: {
    nom: string
    prenom: string
    email: string
    telephone?: string
    entreprise?: string
  }
  type: 'positionnement' | 'information' | 'inscription' | 'suivi'
  statut: 'en_attente' | 'confirme' | 'annule' | 'termine' | 'reporte'
  date: string
  heure: string
  duree: number
  lieu: 'presentiel' | 'visio' | 'telephone'
  adresse?: string
  lienVisio?: string
  notes?: string
  rappelEnvoye: boolean
  createdAt: string
  updatedAt: string
  createdBy?: string
}
```

### Types de rendez-vous

- **Positionnement** : Évaluation des besoins et objectifs
- **Information** : Demande d'informations sur les formations
- **Inscription** : Processus d'inscription à une formation
- **Suivi** : Suivi post-formation et accompagnement

### Statuts

- **En attente** : RDV créé, en attente de confirmation
- **Confirmé** : RDV validé par l'équipe
- **Terminé** : RDV réalisé avec succès
- **Annulé** : RDV annulé par le client ou l'équipe
- **Reporté** : RDV déplacé à une autre date

### Lieux

- **Présentiel** : Rendez-vous en personne (avec adresse)
- **Visioconférence** : RDV en ligne (avec lien)
- **Téléphone** : Appel téléphonique

## 🚀 API Endpoints

### GET `/api/rendez-vous`

Récupère la liste des rendez-vous avec filtres optionnels.

**Paramètres de requête :**

- `statut` : Filtre par statut
- `type` : Filtre par type
- `lieu` : Filtre par lieu
- `programmeId` : Filtre par programme
- `dateDebut` : Date de début (YYYY-MM-DD)
- `dateFin` : Date de fin (YYYY-MM-DD)
- `search` : Recherche textuelle

**Réponse :**

```json
{
  "success": true,
  "data": {
    "rendezVous": [...],
    "total": 4,
    "stats": {
      "total": 4,
      "enAttente": 2,
      "confirmes": 1,
      "annules": 0,
      "termines": 1,
      "reportes": 0,
      "aujourdhui": 0,
      "cetteSemaine": 0,
      "ceMois": 0
    }
  }
}
```

### POST `/api/rendez-vous`

Crée un nouveau rendez-vous.

**Body :**

```json
{
  "programmeId": "1",
  "client": {
    "nom": "Dupont",
    "prenom": "Marie",
    "email": "marie@example.com",
    "telephone": "06 12 34 56 78",
    "entreprise": "Entreprise ABC"
  },
  "type": "positionnement",
  "date": "2024-01-20",
  "heure": "14:00",
  "duree": 30,
  "lieu": "visio",
  "notes": "Notes optionnelles"
}
```

### PUT `/api/rendez-vous/[id]`

Met à jour un rendez-vous existant.

### DELETE `/api/rendez-vous/[id]`

Supprime un rendez-vous.

## 🎨 Interface utilisateur

### Page d'administration (`/admin/rendez-vous`)

- **Dashboard** : Statistiques en temps réel
- **Filtres** : Recherche et filtrage avancé
- **Liste** : Tableau avec actions rapides
- **Actions** : Voir, modifier, confirmer, annuler, supprimer

### Page publique (`/rendez-vous`)

- **Formulaire** : Interface simple et intuitive
- **Validation** : Contrôles en temps réel
- **Feedback** : Messages de confirmation
- **Responsive** : Adapté mobile et desktop

### Intégration catalogue

- **Bouton RDV** : Sur chaque carte de formation
- **Modal** : Formulaire pré-rempli
- **Expérience fluide** : Pas de redirection

## 🔧 Configuration

### Variables d'environnement

Aucune configuration spéciale requise. Le système utilise le stockage local par défaut.

### Personnalisation

- **Durées** : Configurables dans le formulaire (15min à 2h)
- **Types** : Extensibles dans les types TypeScript
- **Statuts** : Modifiables selon les besoins
- **Lieux** : Ajout possible de nouveaux formats

## 📱 Utilisation

### Pour les clients

1. **Accès** : Via `/rendez-vous` ou bouton sur les cartes de formation
2. **Formulaire** : Remplir les informations requises
3. **Soumission** : Envoi automatique à l'équipe
4. **Confirmation** : Message de succès affiché

### Pour l'équipe

1. **Accès** : Via `/admin/rendez-vous`
2. **Vue d'ensemble** : Statistiques et liste des RDV
3. **Gestion** : Actions rapides sur chaque RDV
4. **Suivi** : Historique des modifications

## 🚀 Déploiement

### Prérequis

- Next.js 15+
- React 18+
- TypeScript
- Tailwind CSS

### Installation

Aucune installation supplémentaire requise. Le système est intégré dans l'application existante.

### Base de données

Actuellement en mode mock avec localStorage. Prêt pour intégration avec :

- MongoDB
- PostgreSQL
- MySQL
- Firebase

## 🔮 Évolutions futures

### Fonctionnalités prévues

- **Notifications email** : Confirmations et rappels automatiques
- **Calendrier intégré** : Vue calendrier des RDV
- **Synchronisation** : Google Calendar, Outlook
- **Rappels SMS** : Notifications par SMS
- **Statistiques avancées** : Graphiques et rapports
- **Intégration CRM** : Export vers outils externes
- **Gestion des créneaux** : Disponibilités automatiques
- **Réservation en ligne** : Créneaux disponibles en temps réel

### Améliorations techniques

- **Base de données** : Migration vers une vraie DB
- **Cache** : Optimisation des performances
- **Tests** : Couverture de tests complète
- **Documentation API** : Swagger/OpenAPI
- **Monitoring** : Logs et métriques

## 🐛 Dépannage

### Problèmes courants

#### Erreur localStorage

```
ReferenceError: localStorage is not defined
```

**Solution** : Vérifier que les appels localStorage sont protégés par `typeof window !== 'undefined'`

#### API non accessible

**Vérifications** :

1. Serveur Next.js démarré
2. Route API correcte
3. Pas d'erreurs dans les logs

#### Formulaire ne se soumet pas

**Vérifications** :

1. Validation des champs requis
2. Format des dates (YYYY-MM-DD)
3. Format des heures (HH:MM)

## 📞 Support

Pour toute question ou problème :

1. Vérifier les logs du serveur
2. Consulter la documentation API
3. Tester avec les données mock
4. Contacter l'équipe de développement

---

**Version** : 1.0.0  
**Dernière mise à jour** : Octobre 2024  
**Auteur** : Équipe GestionMax
