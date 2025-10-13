import * as path from 'path'
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  secret: process.env['PAYLOAD_SECRET'] || 'your-secret-key-change-this-in-production',
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- GestionMax CMS',
      icons: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          url: '/favicon.ico',
        },
      ],
    },
  },
  editor: lexicalEditor({}),
  collections: [
    {
      slug: 'users',
      auth: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'firstName',
          type: 'text',
        },
        {
          name: 'lastName',
          type: 'text',
        },
        {
          name: 'role',
          type: 'select',
          options: [
            {
              label: 'Super Admin',
              value: 'super_admin',
            },
            {
              label: 'Admin',
              value: 'admin',
            },
            {
              label: 'Formateur',
              value: 'formateur',
            },
            {
              label: 'Gestionnaire',
              value: 'gestionnaire',
            },
            {
              label: 'Apprenant',
              value: 'apprenant',
            },
          ],
          defaultValue: 'apprenant',
          required: true,
        },
        {
          name: 'status',
          type: 'select',
          options: [
            {
              label: 'Actif',
              value: 'active',
            },
            {
              label: 'Inactif',
              value: 'inactive',
            },
            {
              label: 'Suspendu',
              value: 'suspended',
            },
            {
              label: 'En attente',
              value: 'pending',
            },
          ],
          defaultValue: 'active',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'address',
          type: 'textarea',
        },
        {
          name: 'dateOfBirth',
          type: 'date',
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'permissions',
          type: 'array',
          fields: [
            {
              name: 'permission',
              type: 'select',
              options: [
                { label: 'Lecture utilisateurs', value: 'users:read' },
                { label: 'Création utilisateurs', value: 'users:create' },
                { label: 'Modification utilisateurs', value: 'users:update' },
                { label: 'Suppression utilisateurs', value: 'users:delete' },
                { label: 'Lecture formations', value: 'formations:read' },
                { label: 'Création formations', value: 'formations:create' },
                { label: 'Modification formations', value: 'formations:update' },
                { label: 'Suppression formations', value: 'formations:delete' },
                { label: 'Lecture apprenants', value: 'apprenants:read' },
                { label: 'Création apprenants', value: 'apprenants:create' },
                { label: 'Modification apprenants', value: 'apprenants:update' },
                { label: 'Suppression apprenants', value: 'apprenants:delete' },
                { label: 'Lecture rendez-vous', value: 'rendez_vous:read' },
                { label: 'Création rendez-vous', value: 'rendez_vous:create' },
                { label: 'Modification rendez-vous', value: 'rendez_vous:update' },
                { label: 'Suppression rendez-vous', value: 'rendez_vous:delete' },
                { label: 'Lecture documents', value: 'documents:read' },
                { label: 'Création documents', value: 'documents:create' },
                { label: 'Modification documents', value: 'documents:update' },
                { label: 'Suppression documents', value: 'documents:delete' },
                { label: 'Accès admin', value: 'admin:access' },
                { label: 'Paramètres système', value: 'system:settings' },
                { label: 'Accès rapports', value: 'reports:access' },
              ],
            },
          ],
        },
        {
          name: 'lastLoginAt',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'metadata',
          type: 'json',
        },
      ],
    },
    {
      slug: 'formations',
      fields: [
        {
          name: 'titre',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
        },
        {
          name: 'duree',
          type: 'number',
          required: true,
        },
        {
          name: 'niveau',
          type: 'select',
          options: [
            { label: 'Débutant', value: 'Débutant' },
            { label: 'Intermédiaire', value: 'Intermédiaire' },
            { label: 'Avancé', value: 'Avancé' },
          ],
          required: true,
        },
        {
          name: 'modalites',
          type: 'select',
          options: [
            { label: 'Présentiel', value: 'Présentiel' },
            { label: 'Distanciel', value: 'Distanciel' },
            { label: 'Hybride', value: 'Hybride' },
          ],
          required: true,
        },
        {
          name: 'prix',
          type: 'number',
          required: true,
        },
        {
          name: 'competences',
          type: 'array',
          fields: [
            {
              name: 'competence',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'codeFormation',
          type: 'text',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      slug: 'formations_personnalisees',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Nom du programme de formation',
        },
        {
          name: 'objectifs',
          type: 'richText',
          label: 'Objectifs pédagogiques',
        },
        {
          name: 'programme_detail',
          type: 'array',
          label: 'Détail des modules et séances',
          fields: [
            {
              name: 'jour',
              type: 'text',
              label: 'Jour (ex: Jour 1, Jour 2)',
            },
            {
              name: 'duree',
              type: 'text',
              label: 'Durée (ex: 7 heures)',
            },
            {
              name: 'modules',
              type: 'array',
              label: 'Modules du jour',
              fields: [
                {
                  name: 'titre',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'duree',
                  type: 'text',
                },
                {
                  name: 'contenu',
                  type: 'richText',
                },
              ],
            },
          ],
        },
        {
          name: 'modalites_acces',
          type: 'group',
          label: 'Modalités d\'accès',
          fields: [
            {
              name: 'prerequis',
              type: 'textarea',
              label: 'Prérequis',
            },
            {
              name: 'public_concerne',
              type: 'textarea',
              label: 'Public concerné',
            },
            {
              name: 'duree',
              type: 'text',
              label: 'Durée totale',
            },
            {
              name: 'horaires',
              type: 'text',
              label: 'Horaires',
            },
            {
              name: 'delais_mise_en_place',
              type: 'text',
              label: 'Délais de mise en place',
            },
            {
              name: 'tarif',
              type: 'number',
              label: 'Tarif en euros',
            },
            {
              name: 'modalites_reglement',
              type: 'textarea',
              label: 'Modalités de règlement',
            },
          ],
        },
        {
          name: 'contact_formateur',
          type: 'group',
          label: 'Contact formateur',
          fields: [
            {
              name: 'nom',
              type: 'text',
              required: true,
            },
            {
              name: 'email',
              type: 'email',
              required: true,
            },
            {
              name: 'telephone',
              type: 'text',
            },
            {
              name: 'role',
              type: 'text',
              label: 'Rôle/Fonction',
            },
            {
              name: 'biographie',
              type: 'textarea',
            },
          ],
        },
        {
          name: 'modalites_pedagogiques',
          type: 'richText',
          label: 'Modalités techniques et pédagogiques',
        },
        {
          name: 'ressources_dispo',
          type: 'array',
          label: 'Ressources mises à disposition',
          fields: [
            {
              name: 'ressource',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
            },
          ],
        },
        {
          name: 'modalites_evaluation',
          type: 'group',
          label: 'Modalités d\'évaluation',
          fields: [
            {
              name: 'types_evaluation',
              type: 'array',
              label: 'Types d\'évaluation',
              fields: [
                {
                  name: 'type',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
              ],
            },
            {
              name: 'plateforme_evaluation',
              type: 'text',
              label: 'Plateforme d\'évaluation',
            },
            {
              name: 'grille_analyse',
              type: 'textarea',
              label: 'Grille d\'analyse des compétences',
            },
          ],
        },
        {
          name: 'sanction_formation',
          type: 'text',
          label: 'Sanction de la formation',
        },
        {
          name: 'niveau_certification',
          type: 'text',
          label: 'Niveau/Certification obtenue',
        },
        {
          name: 'accessibilite_handicap',
          type: 'group',
          label: 'Accessibilité handicap',
          fields: [
            {
              name: 'referent_handicap',
              type: 'text',
              label: 'Référent handicap',
            },
            {
              name: 'contact_referent',
              type: 'text',
              label: 'Contact référent',
            },
            {
              name: 'adaptations_proposees',
              type: 'textarea',
              label: 'Adaptations proposées',
            },
          ],
        },
        {
          name: 'cessation_abandon',
          type: 'group',
          label: 'Cessation anticipée/Abandon',
          fields: [
            {
              name: 'conditions_renonciation',
              type: 'textarea',
              label: 'Conditions de renonciation',
            },
            {
              name: 'facturation_abandon',
              type: 'textarea',
              label: 'Modalités de facturation en cas d\'abandon',
            },
          ],
        },
        {
          name: 'statut',
          type: 'select',
          options: [
            { label: 'Publié', value: 'PUBLIE' },
            { label: 'Brouillon', value: 'BROUILLON' },
            { label: 'Archivé', value: 'ARCHIVE' },
          ],
          defaultValue: 'BROUILLON',
        },
        {
          name: 'code_formation',
          type: 'text',
          label: 'Code formation',
          unique: true,
        },
      ],
    },
    {
      slug: 'apprenants',
      fields: [
        {
          name: 'nom',
          type: 'text',
          required: true,
        },
        {
          name: 'prenom',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          unique: true,
        },
        {
          name: 'telephone',
          type: 'text',
        },
        {
          name: 'statut',
          type: 'select',
          options: [
            { label: 'Inscrit', value: 'inscrit' },
            { label: 'En cours', value: 'en_cours' },
            { label: 'Terminé', value: 'termine' },
            { label: 'Abandonné', value: 'abandonne' },
          ],
          defaultValue: 'inscrit',
          required: true,
        },
        {
          name: 'formations',
          type: 'relationship',
          relationTo: 'formations',
          hasMany: true,
        },
        {
          name: 'dateInscription',
          type: 'date',
          required: true,
        },
      ],
    },
    {
      slug: 'articles',
      fields: [
        {
          name: 'titre',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'contenu',
          type: 'richText',
          required: true,
        },
        {
          name: 'resume',
          type: 'textarea',
          required: true,
        },
        {
          name: 'auteur',
          type: 'text',
          required: true,
        },
        {
          name: 'datePublication',
          type: 'date',
          required: true,
        },
        {
          name: 'statut',
          type: 'select',
          options: [
            { label: 'Brouillon', value: 'brouillon' },
            { label: 'Publié', value: 'publie' },
            { label: 'Archivé', value: 'archive' },
          ],
          defaultValue: 'brouillon',
          required: true,
        },
        {
          name: 'categories',
          type: 'relationship',
          relationTo: 'categories',
          hasMany: true,
        },
        {
          name: 'tags',
          type: 'relationship',
          relationTo: 'tags',
          hasMany: true,
        },
        {
          name: 'imagePrincipale',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'images',
          type: 'array',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          required: true,
        },
        {
          name: 'metaKeywords',
          type: 'array',
          fields: [
            {
              name: 'keyword',
              type: 'text',
            },
          ],
        },
        {
          name: 'vue',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'tempsLecture',
          type: 'number',
          defaultValue: 5,
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      slug: 'categories',
      fields: [
        {
          name: 'nom',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'couleur',
          type: 'text',
          defaultValue: '#3B82F6',
        },
        {
          name: 'icone',
          type: 'text',
          defaultValue: '📝',
        },
      ],
    },
    {
      slug: 'tags',
      fields: [
        {
          name: 'nom',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'couleur',
          type: 'text',
          defaultValue: '#6B7280',
        },
      ],
    },
    {
      slug: 'programmes',
      fields: [
        {
          name: 'codeFormation',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'titre',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'duree',
          type: 'number',
          required: true,
        },
        {
          name: 'niveau',
          type: 'select',
          options: [
            { label: 'Débutant', value: 'DEBUTANT' },
            { label: 'Intermédiaire', value: 'INTERMEDIAIRE' },
            { label: 'Avancé', value: 'AVANCE' },
          ],
          required: true,
        },
        {
          name: 'modalites',
          type: 'select',
          options: [
            { label: 'Présentiel', value: 'PRESENTIEL' },
            { label: 'Distanciel', value: 'DISTANCIEL' },
            { label: 'Hybride', value: 'HYBRIDE' },
          ],
          required: true,
        },
        {
          name: 'prix',
          type: 'number',
          required: true,
        },
        {
          name: 'competences',
          type: 'array',
          fields: [
            {
              name: 'competence',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'objectifs',
          type: 'richText',
        },
        {
          name: 'prerequis',
          type: 'richText',
        },
        {
          name: 'programme',
          type: 'richText',
        },
        {
          name: 'modalitesPedagogiques',
          type: 'richText',
        },
        {
          name: 'evaluation',
          type: 'richText',
        },
        {
          name: 'certification',
          type: 'text',
        },
        {
          name: 'eligibleCPF',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'codeCPF',
          type: 'text',
        },
        {
          name: 'statut',
          type: 'select',
          options: [
            { label: 'Actif', value: 'actif' },
            { label: 'Inactif', value: 'inactif' },
            { label: 'En développement', value: 'en_developpement' },
          ],
          defaultValue: 'actif',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'rating',
          type: 'number',
          min: 0,
          max: 5,
        },
        {
          name: 'students',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
    {
      slug: 'rendez-vous',
      fields: [
        {
          name: 'programme',
          type: 'relationship',
          relationTo: 'programmes',
          required: true,
        },
        {
          name: 'client',
          type: 'group',
          fields: [
            {
              name: 'nom',
              type: 'text',
              required: true,
            },
            {
              name: 'prenom',
              type: 'text',
              required: true,
            },
            {
              name: 'email',
              type: 'email',
              required: true,
            },
            {
              name: 'telephone',
              type: 'text',
              required: true,
            },
            {
              name: 'entreprise',
              type: 'text',
            },
          ],
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Positionnement', value: 'positionnement' },
            { label: 'Information', value: 'information' },
            { label: 'Inscription', value: 'inscription' },
            { label: 'Suivi', value: 'suivi' },
          ],
          defaultValue: 'positionnement',
          required: true,
        },
        {
          name: 'statut',
          type: 'select',
          options: [
            { label: 'En attente', value: 'en_attente' },
            { label: 'Confirmé', value: 'confirme' },
            { label: 'Terminé', value: 'termine' },
            { label: 'Annulé', value: 'annule' },
            { label: 'Reporté', value: 'reporte' },
          ],
          defaultValue: 'en_attente',
          required: true,
        },
        {
          name: 'date',
          type: 'date',
          required: true,
        },
        {
          name: 'heure',
          type: 'text',
          required: true,
        },
        {
          name: 'duree',
          type: 'number',
          defaultValue: 30,
          required: true,
        },
        {
          name: 'lieu',
          type: 'select',
          options: [
            { label: 'Visio', value: 'visio' },
            { label: 'Présentiel', value: 'presentiel' },
            { label: 'Téléphone', value: 'telephone' },
          ],
          defaultValue: 'visio',
          required: true,
        },
        {
          name: 'adresse',
          type: 'textarea',
        },
        {
          name: 'lienVisio',
          type: 'text',
        },
        {
          name: 'notes',
          type: 'textarea',
        },
        {
          name: 'rappelEnvoye',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'createdBy',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      slug: 'contacts',
      fields: [
        {
          name: 'nom',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'telephone',
          type: 'text',
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Question générale', value: 'question' },
            { label: 'Réclamation', value: 'reclamation' },
            { label: 'Demande de formation', value: 'formation' },
            { label: 'Demande de devis', value: 'devis' },
          ],
          required: true,
        },
        {
          name: 'sujet',
          type: 'text',
          required: true,
        },
        {
          name: 'message',
          type: 'textarea',
          required: true,
        },
        {
          name: 'statut',
          type: 'select',
          options: [
            { label: 'Nouveau', value: 'nouveau' },
            { label: 'En cours', value: 'en_cours' },
            { label: 'Traité', value: 'traite' },
            { label: 'Fermé', value: 'ferme' },
          ],
          defaultValue: 'nouveau',
          required: true,
        },
        {
          name: 'priorite',
          type: 'select',
          options: [
            { label: 'Basse', value: 'basse' },
            { label: 'Normale', value: 'normale' },
            { label: 'Haute', value: 'haute' },
            { label: 'Urgente', value: 'urgente' },
          ],
          defaultValue: 'normale',
          required: true,
        },
        {
          name: 'reponse',
          type: 'textarea',
        },
        {
          name: 'dateReponse',
          type: 'date',
        },
      ],
    },
    {
      slug: 'media',
      upload: {
        staticDir: 'media',
        imageSizes: [
          {
            name: 'thumbnail',
            width: 400,
            height: 300,
            position: 'centre',
          },
          {
            name: 'card',
            width: 768,
            height: 1024,
            position: 'centre',
          },
        ],
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/*'],
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [],
  db: mongooseAdapter({
    url: process.env['MONGODB_URI'] || '',
  }),
})
