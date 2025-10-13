#!/usr/bin/env node

/**
 * Script simple de génération de types Payload
 * Alternative au script TSX pour éviter les problèmes undici
 */

const fs = require('fs');
const path = require('path');

// Configuration des collections basée sur payload.config.ts
const collections = [
  {
    slug: 'users',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'firstName', type: 'text' },
      { name: 'lastName', type: 'text' },
      { 
        name: 'role', 
        type: 'select', 
        required: true,
        options: [
          { label: 'Super Admin', value: 'superAdmin' },
          { label: 'Admin', value: 'admin' },
          { label: 'Formateur', value: 'formateur' },
          { label: 'Gestionnaire', value: 'gestionnaire' },
          { label: 'Apprenant', value: 'apprenant' }
        ]
      },
      { 
        name: 'status', 
        type: 'select', 
        required: true,
        options: [
          { label: 'Actif', value: 'active' },
          { label: 'Inactif', value: 'inactive' },
          { label: 'En attente', value: 'pending' }
        ]
      },
      { name: 'email', type: 'email', required: true },
      { name: 'password', type: 'text', required: true }
    ]
  },
  {
    slug: 'formation-programmes',
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'codeFormation', type: 'text', required: true },
      { 
        name: 'statut', 
        type: 'select', 
        required: true,
        options: [
          { label: 'En cours', value: 'EN_COURS' },
          { label: 'Finalisée', value: 'FINALISEE' },
          { label: 'Livrée', value: 'LIVREE' },
          { label: 'Archivée', value: 'ARCHIVE' }
        ]
      },
      { name: 'objectifs', type: 'richText' }
    ]
  },
  {
    slug: 'contacts',
    fields: [
      { name: 'nom', type: 'text', required: true },
      { name: 'email', type: 'email', required: true },
      { name: 'telephone', type: 'text' },
      { 
        name: 'type', 
        type: 'select', 
        required: true,
        options: [
          { label: 'Question générale', value: 'question' },
          { label: 'Réclamation', value: 'reclamation' },
          { label: 'Demande de formation', value: 'formation' },
          { label: 'Demande de devis', value: 'devis' }
        ]
      },
      { name: 'sujet', type: 'text', required: true },
      { name: 'message', type: 'textarea', required: true },
      { 
        name: 'statut', 
        type: 'select', 
        required: true,
        options: [
          { label: 'Nouveau', value: 'nouveau' },
          { label: 'En cours', value: 'enCours' },
          { label: 'Traité', value: 'traite' },
          { label: 'Fermé', value: 'ferme' }
        ]
      },
      { 
        name: 'priorite', 
        type: 'select', 
        required: true,
        options: [
          { label: 'Basse', value: 'basse' },
          { label: 'Normale', value: 'normale' },
          { label: 'Haute', value: 'haute' },
          { label: 'Urgente', value: 'urgente' }
        ]
      },
      { name: 'dateReception', type: 'date', required: true },
      { name: 'dateReponse', type: 'date' },
      { name: 'reponse', type: 'textarea' }
    ]
  }
];

function generateFieldType(field) {
  const { name, type, required, options } = field;
  
  let tsType;
  
  switch (type) {
    case 'text':
    case 'textarea':
    case 'email':
    case 'url':
      tsType = 'string';
      break;
    case 'number':
      tsType = 'number';
      break;
    case 'checkbox':
      tsType = 'boolean';
      break;
    case 'date':
      tsType = 'string'; // ISO string
      break;
    case 'richText':
      tsType = 'Record<string, unknown>';
      break;
    case 'select':
      if (options) {
        const values = options.map(opt => `'${opt.value}'`).join(' | ');
        tsType = values;
      } else {
        tsType = 'string';
      }
      break;
    default:
      tsType = 'unknown';
  }
  
  return required ? tsType : `${tsType} | undefined`;
}

function generateCollectionType(collection) {
  const { slug, fields } = collection;
  
  // Convertir le slug en nom de type (PascalCase)
  const typeName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  // Ajouter les champs de base Payload
  const baseFields = [
    '  id: string',
    '  createdAt: string',
    '  updatedAt: string'
  ];

  // Générer les types pour les champs de la collection
  const collectionFields = fields.map(field => {
    const type = generateFieldType(field);
    return `  ${field.name}: ${type}`;
  });

  const allFields = [...baseFields, ...collectionFields].join('\n');

  return `export interface ${typeName} extends Timestamped {\n${allFields}\n}`;
}

function generateTypes() {
  const header = `/**
 * Types générés automatiquement depuis payload.config.ts
 * ⚠️ NE PAS MODIFIER MANUELLEMENT - Utiliser le script generate-types-simple.js
 * 
 * Généré le: ${new Date().toISOString()}
 */

// ============================================================================
// TYPES DE BASE
// ============================================================================

export interface Timestamped {
  id: string
  createdAt: string
  updatedAt: string
}

`;

  const collectionTypes = collections
    .map(collection => generateCollectionType(collection))
    .join('\n\n');

  return header + collectionTypes;
}

function main() {
  console.log('🔄 Génération des types Payload...');

  try {
    const types = generateTypes();
    const outputPath = path.join(process.cwd(), 'src', 'types', 'payload-generated-simple.ts');
    
    // Créer le répertoire s'il n'existe pas
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Sauvegarder le fichier
    fs.writeFileSync(outputPath, types, 'utf8');
    
    console.log(`✅ Types générés et sauvegardés dans: ${outputPath}`);
    console.log('✅ Génération terminée!');

  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error);
    process.exit(1);
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}
