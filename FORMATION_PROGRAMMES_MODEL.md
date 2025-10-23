# Modélisation des Programmes de Formation Réglementaires

## 📋 Collection : `formation_programmes`

Cette collection implémente une structure complète et réglementaire pour les programmes de formation, conforme aux exigences légales françaises.

### 🏗️ Structure des Champs

| Champ                    | Type       | Description                          | Exemple                                                                          |
| ------------------------ | ---------- | ------------------------------------ | -------------------------------------------------------------------------------- |
| `title`                  | `text`     | Nom du programme de formation        | "Création de son site internet (WordPress) + Stratégie de développement digital" |
| `objectifs`              | `richText` | Objectifs pédagogiques détaillés     | Objectifs par jour avec formatage                                                |
| `programme_detail`       | `array`    | Détail des modules et séances        | Jour 1, Jour 2 avec modules détaillés                                            |
| `modalites_acces`        | `group`    | Informations d'accès et tarification | Prérequis, public, durée, horaires, tarif                                        |
| `contact_formateur`      | `group`    | Informations du formateur            | Nom, email, téléphone, biographie                                                |
| `modalites_pedagogiques` | `richText` | Description de la pédagogie          | Méthode expositive et démonstrative                                              |
| `ressources_dispo`       | `array`    | Ressources mises à disposition       | Matériel, support de cours, plateformes                                          |
| `modalites_evaluation`   | `group`    | Modalités d'évaluation               | Types d'évaluation, plateforme, grille                                           |
| `sanction_formation`     | `text`     | Type de certificat délivré           | "Certificat de réalisation de formation"                                         |
| `niveau_certification`   | `text`     | Niveau ou certification obtenue      | "Aucune" ou niveau spécifique                                                    |
| `accessibilite_handicap` | `group`    | Informations accessibilité           | Référent, contact, adaptations                                                   |
| `cessation_abandon`      | `group`    | Conditions d'abandon                 | Renonciation, facturation                                                        |
| `statut`                 | `select`   | Statut du programme                  | Publié, Brouillon, Archivé                                                       |
| `code_formation`         | `text`     | Code unique de formation             | "A001-WP-DD"                                                                     |

### 📊 Détail des Groupes

#### `modalites_acces`

- `prerequis` : Prérequis pour la formation
- `public_concerne` : Public cible
- `duree` : Durée totale
- `horaires` : Horaires de formation
- `delais_mise_en_place` : Délais de mise en place
- `tarif` : Prix en euros
- `modalites_reglement` : Modalités de règlement

#### `contact_formateur`

- `nom` : Nom du formateur
- `email` : Email de contact
- `telephone` : Téléphone
- `role` : Rôle/Fonction
- `biographie` : Biographie du formateur

#### `programme_detail`

Structure hiérarchique :

- `jour` : "Jour 1", "Jour 2", etc.
- `duree` : Durée du jour
- `modules` : Array de modules
  - `titre` : Titre du module
  - `description` : Description courte
  - `duree` : Durée du module
  - `contenu` : Contenu détaillé (richText)

#### `modalites_evaluation`

- `types_evaluation` : Array des types d'évaluation
- `plateforme_evaluation` : Plateforme utilisée
- `grille_analyse` : Grille d'analyse des compétences

#### `accessibilite_handicap`

- `referent_handicap` : Nom du référent
- `contact_referent` : Contact du référent
- `adaptations_proposees` : Adaptations proposées

#### `cessation_abandon`

- `conditions_renonciation` : Conditions de renonciation
- `facturation_abandon` : Modalités de facturation

### 🔗 API Endpoints

#### GET `/api/formation-programmes`

Récupère tous les programmes de formation réglementaires.

**Réponse :**

```json
{
  "success": true,
  "data": [
    {
      "_id": "68ec7fda8e8f256ad77f8bf8",
      "title": "Création de son site internet (WordPress) + Stratégie de développement digital",
      "code_formation": "A001-WP-DD",
      "statut": "PUBLIE",
      "modalites_acces": {
        "tarif": 980,
        "duree": "14 heures ou 2 jours",
        "public_concerne": "Artisans, commerçants ou professions libérales."
      },
      "contact_formateur": {
        "nom": "Aurélien LAVAYSSIERE",
        "email": "aurelien@gestionmax.fr"
      }
    }
  ]
}
```

#### GET `/api/formation-programmes/[id]`

Récupère un programme de formation spécifique par son ID.

### 🎯 Avantages de cette Modélisation

1. **Conformité Réglementaire** : Structure complète conforme aux exigences légales
2. **Flexibilité** : Support des contenus riches avec richText
3. **Hiérarchisation** : Structure claire jour/module/contenu
4. **Traçabilité** : Toutes les informations réglementaires centralisées
5. **Évolutivité** : Facile d'ajouter de nouveaux champs
6. **API Ready** : Endpoints prêts pour l'intégration

### 📱 Interface Admin

- **Page Admin** : `/admin/formation-programmes`
- **Navigation** : Ajout dans la sidebar avec icône `GraduationCap`
- **Fonctionnalités** :
  - Liste des programmes avec statut
  - Affichage des informations clés (durée, tarif, formateur)
  - Actions : Voir, Modifier, Générer document
  - Filtrage par statut

### 🚀 Migration Réalisée

Le programme WordPress existant a été migré vers cette nouvelle structure avec :

- ✅ Structure réglementaire complète
- ✅ Contenu détaillé jour par jour
- ✅ Informations formateur complètes
- ✅ Modalités d'accès et tarification
- ✅ Évaluation et certification
- ✅ Accessibilité handicap
- ✅ Conditions d'abandon

### 📈 Prochaines Étapes

1. **Interface de Création** : Formulaire de création de programmes
2. **Génération de Documents** : Export PDF des programmes
3. **Validation** : Contrôles de conformité réglementaire
4. **Templates** : Modèles de programmes réutilisables
5. **Intégration** : Liaison avec les inscriptions et évaluations
