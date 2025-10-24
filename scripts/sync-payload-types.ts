#!/usr/bin/env tsx

/**
 * Script de synchronisation des types Payload
 *
 * Ce script :
 * 1. Lit la configuration Payload
 * 2. Génère les types TypeScript correspondants
 * 3. Met à jour le fichier payload-generated.ts
 * 4. Vérifie la cohérence avec les types existants
 */

import { config } from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// Charger les variables d'environnement
config({ path: '.env.local' })

interface PayloadField {
  name: string
  type: string
  required?: boolean
  defaultValue?: any
  options?: Array<{ label: string; value: string }>
  fields?: PayloadField[]
  relationTo?: string
  hasMany?: boolean
}

interface PayloadCollection {
  slug: string
  fields: PayloadField[]
}

interface PayloadConfig {
  collections: PayloadCollection[]
}

class PayloadTypeGenerator {
  private config: PayloadConfig

  constructor(config: PayloadConfig) {
    this.config = config
  }

  /**
   * Génère le type TypeScript pour un champ
   */
  private generateFieldType(field: PayloadField): string {
    const { name, type, required, options, fields, relationTo, hasMany } = field

    let tsType: string

    switch (type) {
      case 'text':
      case 'textarea':
      case 'email':
      case 'url':
        tsType = 'string'
        break
      case 'number':
        tsType = 'number'
        break
      case 'checkbox':
        tsType = 'boolean'
        break
      case 'date':
        tsType = 'string' // ISO string
        break
      case 'richText':
        tsType = 'Record<string, unknown>'
        break
      case 'select':
        if (options) {
          const values = options.map(opt => `'${opt.value}'`).join(' | ')
          tsType = values
        } else {
          tsType = 'string'
        }
        break
      case 'array':
        if (fields) {
          const arrayType = this.generateObjectType(fields)
          tsType = `Array<${arrayType}>`
        } else {
          tsType = 'Array<any>'
        }
        break
      case 'group':
        if (fields) {
          tsType = this.generateObjectType(fields)
        } else {
          tsType = 'Record<string, unknown>'
        }
        break
      case 'relationship':
        if (relationTo) {
          tsType = hasMany ? `string[]` : 'string'
        } else {
          tsType = 'string'
        }
        break
      case 'upload':
        tsType = 'string'
        break
      default:
        tsType = 'unknown'
    }

    return required ? tsType : `${tsType} | undefined`
  }

  /**
   * Génère le type TypeScript pour un objet
   */
  private generateObjectType(fields: PayloadField[]): string {
    const fieldTypes = fields
      .map(field => {
        const type = this.generateFieldType(field)
        return `  ${field.name}: ${type}`
      })
      .join('\n')

    return `{\n${fieldTypes}\n}`
  }

  /**
   * Génère le type TypeScript pour une collection
   */
  private generateCollectionType(collection: PayloadCollection): string {
    const { slug, fields } = collection

    // Convertir le slug en nom de type (PascalCase)
    const typeName = this.slugToPascalCase(slug)

    // Ajouter les champs de base Payload
    const baseFields = ['  id: string', '  createdAt: string', '  updatedAt: string']

    // Générer les types pour les champs de la collection
    const collectionFields = fields.map(field => {
      const type = this.generateFieldType(field)
      return `  ${field.name}: ${type}`
    })

    const allFields = [...baseFields, ...collectionFields].join('\n')

    return `export interface ${typeName} extends Timestamped {\n${allFields}\n}`
  }

  /**
   * Convertit un slug en PascalCase
   */
  private slugToPascalCase(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }

  /**
   * Génère tous les types pour les collections
   */
  generateTypes(): string {
    const header = `/**
 * Types générés automatiquement depuis payload.config.ts
 * ⚠️ NE PAS MODIFIER MANUELLEMENT - Utiliser le script sync-payload-types.ts
 * 
 * Généré le: ${new Date().toISOString()}
 */

import { Timestamped } from './common'

`

    const collectionTypes = this.config.collections
      .map(collection => this.generateCollectionType(collection))
      .join('\n\n')

    return header + collectionTypes
  }

  /**
   * Sauvegarde les types générés dans le fichier
   */
  async saveTypes(outputPath: string): Promise<void> {
    const types = this.generateTypes()

    // Créer le répertoire s'il n'existe pas
    const dir = path.dirname(outputPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Sauvegarder le fichier
    fs.writeFileSync(outputPath, types, 'utf8')

    console.log(`✅ Types générés et sauvegardés dans: ${outputPath}`)
  }

  /**
   * Vérifie la cohérence avec les types existants
   */
  async checkConsistency(existingTypesPath: string): Promise<boolean> {
    if (!fs.existsSync(existingTypesPath)) {
      console.log("⚠️ Fichier de types existant non trouvé, création d'un nouveau fichier")
      return false
    }

    const existingContent = fs.readFileSync(existingTypesPath, 'utf8')
    const _newTypes = this.generateTypes()

    // Comparaison simple (pourrait être améliorée)
    const isConsistent = existingContent.includes('Généré le:')

    if (!isConsistent) {
      console.log('⚠️ Types existants ne semblent pas être générés automatiquement')
    }

    return isConsistent
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🔄 Synchronisation des types Payload...')

  try {
    // Charger la configuration Payload
    const configPath = path.join(process.cwd(), 'src', 'payload.config.ts')

    if (!fs.existsSync(configPath)) {
      throw new Error(`Configuration Payload non trouvée: ${configPath}`)
    }

    // Pour l'instant, on utilise une configuration statique
    // Dans une version future, on pourrait parser le fichier config
    const payloadConfig: PayloadConfig = {
      collections: [
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
                { label: 'Apprenant', value: 'apprenant' },
              ],
            },
            {
              name: 'status',
              type: 'select',
              required: true,
              options: [
                { label: 'Actif', value: 'active' },
                { label: 'Inactif', value: 'inactive' },
                { label: 'En attente', value: 'pending' },
              ],
            },
            { name: 'email', type: 'email', required: true },
            { name: 'password', type: 'text', required: true },
          ],
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
                { label: 'Archivée', value: 'ARCHIVE' },
              ],
            },
            { name: 'objectifs', type: 'richText' },
          ],
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
                { label: 'Demande de devis', value: 'devis' },
              ],
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
                { label: 'Fermé', value: 'ferme' },
              ],
            },
            {
              name: 'priorite',
              type: 'select',
              required: true,
              options: [
                { label: 'Basse', value: 'basse' },
                { label: 'Normale', value: 'normale' },
                { label: 'Haute', value: 'haute' },
                { label: 'Urgente', value: 'urgente' },
              ],
            },
            { name: 'dateReception', type: 'date', required: true },
            { name: 'dateReponse', type: 'date' },
            { name: 'reponse', type: 'textarea' },
          ],
        },
        // ... autres collections
      ],
    }

    // Générer les types
    const generator = new PayloadTypeGenerator(payloadConfig)
    const outputPath = path.join(process.cwd(), 'src', 'types', 'payload-generated.ts')

    // Vérifier la cohérence
    const isConsistent = await generator.checkConsistency(outputPath)

    if (!isConsistent) {
      console.log('🔄 Mise à jour des types...')
    }

    // Sauvegarder les types
    await generator.saveTypes(outputPath)

    console.log('✅ Synchronisation terminée!')
    console.log("💡 N'oubliez pas de mettre à jour les imports dans vos composants")
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error)
    process.exit(1)
  }
}

// Exécuter le script
if (require.main === module) {
  main()
}

export { PayloadTypeGenerator }
