#!/usr/bin/env tsx
/**
 * Script d'audit complet des collections MongoDB vs Payload CMS
 *
 * Objectif: Identifier toutes les divergences structurelles entre:
 * - Les données actuelles dans MongoDB
 * - Les schémas définis dans payload.config.ts
 *
 * Usage: npx tsx src/scripts/migrations/audit-collections.ts
 */

import { MongoClient, Db, Collection } from 'mongodb'
import * as fs from 'fs'
import * as path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') })

interface AuditIssue {
  collection: string
  field: string
  issue_type: 'type_mismatch' | 'structure_mismatch' | 'missing_field' | 'extra_field' | 'relation_broken'
  expected: string
  actual: string
  sample_document_id?: string
  fix_strategy: string
  severity: 'critical' | 'high' | 'medium' | 'low'
}

interface AuditReport {
  timestamp: string
  database: string
  collections_audited: string[]
  total_issues: number
  issues_by_severity: {
    critical: number
    high: number
    medium: number
    low: number
  }
  issues: AuditIssue[]
  summary: string
}

const PAYLOAD_SCHEMAS = {
  users: {
    email: { type: 'string', required: true },
    password: { type: 'string', required: false }, // hashed
    name: { type: 'string', required: true },
    role: { type: 'string', enum: ['admin', 'user'], required: true },
  },
  programmes: {
    codeFormation: { type: 'string', required: true, unique: true },
    titre: { type: 'string', required: true },
    description: { type: 'string', required: true },
    duree: { type: 'number', required: true },
    niveau: { type: 'string', enum: ['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE'], required: true },
    modalites: { type: 'string', enum: ['PRESENTIEL', 'DISTANCIEL', 'HYBRIDE'], required: true },
    prix: { type: 'number', required: true },
    competences: { type: 'array_of_objects', structure: { competence: 'string' } }, // ⚠️ MISMATCH CONNU
    objectifs: { type: 'richText', required: false },
    prerequis: { type: 'richText', required: false },
    programme: { type: 'richText', required: false },
    statut: { type: 'string', enum: ['actif', 'inactif', 'en_developpement'], required: true },
    eligibleCPF: { type: 'boolean', required: false },
    codeCPF: { type: 'string', required: false },
  },
  'rendez-vous': {
    programme: { type: 'relationship', relationTo: 'programmes', required: true },
    client: {
      type: 'group',
      structure: {
        nom: { type: 'string', required: true },
        prenom: { type: 'string', required: true },
        email: { type: 'email', required: true },
        telephone: { type: 'string', required: true },
        entreprise: { type: 'string', required: false },
      }
    },
    type: { type: 'string', enum: ['positionnement', 'information', 'inscription', 'suivi'], required: true },
    statut: { type: 'string', enum: ['enAttente', 'confirme', 'termine', 'annule', 'reporte'], required: true },
    date: { type: 'date', required: true },
    heure: { type: 'string', required: true },
    duree: { type: 'number', required: true },
    lieu: { type: 'string', enum: ['visio', 'presentiel', 'telephone'], required: true },
    rappelEnvoye: { type: 'boolean', required: false },
    createdBy: { type: 'string', required: true },
  },
  articles: {
    titre: { type: 'string', required: true },
    slug: { type: 'string', required: true, unique: true },
    contenu: { type: 'richText', required: true },
    resume: { type: 'string', required: true },
    auteur: { type: 'string', required: true },
    datePublication: { type: 'date', required: false },
    statut: { type: 'string', enum: ['brouillon', 'publie', 'archive'], required: true },
  },
  contacts: {
    nom: { type: 'string', required: true },
    email: { type: 'email', required: true },
    telephone: { type: 'string', required: false },
    type: { type: 'string', enum: ['question', 'reclamation', 'formation', 'devis'], required: true },
    sujet: { type: 'string', required: true },
    message: { type: 'string', required: true },
    statut: { type: 'string', enum: ['nouveau', 'en_cours', 'traite', 'ferme'], required: true },
  },
}

class CollectionAuditor {
  private db: Db
  private issues: AuditIssue[] = []

  constructor(db: Db) {
    this.db = db
  }

  async auditCollection(collectionName: string, schema: any): Promise<void> {
    console.log(`\n🔍 Audit de la collection: ${collectionName}`)

    const collection = this.db.collection(collectionName)
    const count = await collection.countDocuments()

    if (count === 0) {
      console.log(`  ℹ️  Collection vide (0 documents)`)
      return
    }

    console.log(`  📊 ${count} document(s) trouvé(s)`)

    // Prendre un échantillon de documents
    const sampleSize = Math.min(10, count)
    const samples = await collection.find({}).limit(sampleSize).toArray()

    // Analyser chaque document
    for (const doc of samples) {
      this.auditDocument(collectionName, doc, schema)
    }

    console.log(`  ✅ Audit terminé: ${this.issues.filter(i => i.collection === collectionName).length} problème(s) détecté(s)`)
  }

  private auditDocument(collectionName: string, doc: any, schema: any): void {
    const docId = doc._id?.toString() || 'unknown'

    for (const [fieldName, fieldSchema] of Object.entries(schema)) {
      const fieldValue = doc[fieldName]

      // Vérifier champ requis manquant
      if ((fieldSchema as any).required && fieldValue === undefined) {
        this.addIssue({
          collection: collectionName,
          field: fieldName,
          issue_type: 'missing_field',
          expected: `Required field of type ${(fieldSchema as any).type}`,
          actual: 'undefined',
          sample_document_id: docId,
          fix_strategy: `Add default value or make field optional in Payload schema`,
          severity: 'high',
        })
        continue
      }

      if (fieldValue === undefined || fieldValue === null) continue

      // Vérifier type de champ
      this.checkFieldType(collectionName, fieldName, fieldValue, fieldSchema as any, docId)
    }
  }

  private checkFieldType(collection: string, field: string, value: any, schema: any, docId: string): void {
    const actualType = Array.isArray(value) ? 'array' : typeof value
    const expectedType = schema.type

    // Cas spécial: array_of_objects (comme competences)
    if (expectedType === 'array_of_objects') {
      if (!Array.isArray(value)) {
        this.addIssue({
          collection,
          field,
          issue_type: 'type_mismatch',
          expected: 'array of objects',
          actual: actualType,
          sample_document_id: docId,
          fix_strategy: `Convert ${actualType} to array of objects with structure: ${JSON.stringify(schema.structure)}`,
          severity: 'critical',
        })
      } else if (value.length > 0) {
        // Vérifier si c'est un tableau de strings au lieu d'objets
        if (typeof value[0] === 'string') {
          this.addIssue({
            collection,
            field,
            issue_type: 'structure_mismatch',
            expected: `array of objects: [{${Object.keys(schema.structure).join(', ')}}]`,
            actual: 'array of strings',
            sample_document_id: docId,
            fix_strategy: `Transform array: ['value'] → [{${Object.keys(schema.structure)[0]}: 'value'}]`,
            severity: 'critical',
          })
        } else if (typeof value[0] === 'object') {
          // Vérifier structure de l'objet
          const expectedKeys = Object.keys(schema.structure)
          const actualKeys = Object.keys(value[0])
          const missingKeys = expectedKeys.filter(k => !actualKeys.includes(k))

          if (missingKeys.length > 0) {
            this.addIssue({
              collection,
              field,
              issue_type: 'structure_mismatch',
              expected: `objects with keys: ${expectedKeys.join(', ')}`,
              actual: `objects with keys: ${actualKeys.join(', ')}`,
              sample_document_id: docId,
              fix_strategy: `Add missing keys: ${missingKeys.join(', ')}`,
              severity: 'high',
            })
          }
        }
      }
      return
    }

    // Cas spécial: group (comme client dans rendez-vous)
    if (expectedType === 'group') {
      if (typeof value !== 'object' || Array.isArray(value)) {
        this.addIssue({
          collection,
          field,
          issue_type: 'type_mismatch',
          expected: 'object (group)',
          actual: actualType,
          sample_document_id: docId,
          fix_strategy: `Convert to object with structure: ${JSON.stringify(Object.keys(schema.structure))}`,
          severity: 'critical',
        })
      } else {
        // Vérifier structure du groupe
        const expectedKeys = Object.keys(schema.structure)
        const actualKeys = Object.keys(value)

        for (const [key, keySchema] of Object.entries(schema.structure)) {
          if ((keySchema as any).required && !actualKeys.includes(key)) {
            this.addIssue({
              collection,
              field: `${field}.${key}`,
              issue_type: 'missing_field',
              expected: `Required field in group`,
              actual: 'undefined',
              sample_document_id: docId,
              fix_strategy: `Add required field '${key}' to group '${field}'`,
              severity: 'high',
            })
          }
        }
      }
      return
    }

    // Cas spécial: relationship
    if (expectedType === 'relationship') {
      // Vérifier que c'est un ObjectId valide
      if (typeof value !== 'object' || !value._bsontype) {
        this.addIssue({
          collection,
          field,
          issue_type: 'type_mismatch',
          expected: 'ObjectId (relationship)',
          actual: typeof value,
          sample_document_id: docId,
          fix_strategy: `Convert to ObjectId: new ObjectId(${value})`,
          severity: 'critical',
        })
      }
      return
    }

    // Cas spécial: date
    if (expectedType === 'date') {
      if (!(value instanceof Date)) {
        this.addIssue({
          collection,
          field,
          issue_type: 'type_mismatch',
          expected: 'Date object',
          actual: typeof value,
          sample_document_id: docId,
          fix_strategy: `Convert to Date: new Date(${value})`,
          severity: 'medium',
        })
      }
      return
    }

    // Vérification enum
    if (schema.enum && !schema.enum.includes(value)) {
      this.addIssue({
        collection,
        field,
        issue_type: 'type_mismatch',
        expected: `One of: ${schema.enum.join(', ')}`,
        actual: value,
        sample_document_id: docId,
        fix_strategy: `Update value to match enum or update Payload schema`,
        severity: 'medium',
      })
    }
  }

  private addIssue(issue: AuditIssue): void {
    this.issues.push(issue)
  }

  getIssues(): AuditIssue[] {
    return this.issues
  }
}

async function runAudit(): Promise<void> {
  const mongoUri = process.env['MONGODB_URI']

  if (!mongoUri) {
    throw new Error('❌ MONGODB_URI non défini dans .env.local')
  }

  console.log('🚀 Démarrage de l\'audit MongoDB → Payload CMS')
  console.log(`📍 URI: ${mongoUri.replace(/\/\/.*:.*@/, '//***:***@')}`)

  const client = new MongoClient(mongoUri)

  try {
    await client.connect()
    console.log('✅ Connexion MongoDB établie')

    const db = client.db()
    const auditor = new CollectionAuditor(db)

    // Lister toutes les collections
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(c => c.name)

    console.log(`\n📦 Collections trouvées: ${collectionNames.join(', ')}`)

    // Auditer chaque collection définie dans Payload
    for (const [collectionName, schema] of Object.entries(PAYLOAD_SCHEMAS)) {
      if (collectionNames.includes(collectionName)) {
        await auditor.auditCollection(collectionName, schema)
      } else {
        console.log(`\n⚠️  Collection "${collectionName}" définie dans Payload mais absente de MongoDB`)
      }
    }

    // Générer le rapport
    const issues = auditor.getIssues()
    const report: AuditReport = {
      timestamp: new Date().toISOString(),
      database: db.databaseName,
      collections_audited: Object.keys(PAYLOAD_SCHEMAS),
      total_issues: issues.length,
      issues_by_severity: {
        critical: issues.filter(i => i.severity === 'critical').length,
        high: issues.filter(i => i.severity === 'high').length,
        medium: issues.filter(i => i.severity === 'medium').length,
        low: issues.filter(i => i.severity === 'low').length,
      },
      issues,
      summary: `Audit completed: ${issues.length} issues found across ${Object.keys(PAYLOAD_SCHEMAS).length} collections`,
    }

    // Afficher résumé
    console.log('\n' + '='.repeat(80))
    console.log('📋 RÉSUMÉ DE L\'AUDIT')
    console.log('='.repeat(80))
    console.log(`\n🕒 Timestamp: ${report.timestamp}`)
    console.log(`📊 Collections auditées: ${report.collections_audited.length}`)
    console.log(`⚠️  Total problèmes: ${report.total_issues}`)
    console.log(`\n📈 Par sévérité:`)
    console.log(`  🔴 Critical: ${report.issues_by_severity.critical}`)
    console.log(`  🟠 High: ${report.issues_by_severity.high}`)
    console.log(`  🟡 Medium: ${report.issues_by_severity.medium}`)
    console.log(`  🟢 Low: ${report.issues_by_severity.low}`)

    // Grouper par collection
    const issuesByCollection: Record<string, AuditIssue[]> = {}
    for (const issue of issues) {
      if (!issuesByCollection[issue.collection]) {
        issuesByCollection[issue.collection] = []
      }
      issuesByCollection[issue.collection].push(issue)
    }

    console.log(`\n📦 Par collection:`)
    for (const [collection, collectionIssues] of Object.entries(issuesByCollection)) {
      console.log(`  • ${collection}: ${collectionIssues.length} problème(s)`)
    }

    // Sauvegarder le rapport
    const reportPath = path.resolve(__dirname, '../../../migrations/AUDIT_REPORT.json')
    const reportDir = path.dirname(reportPath)

    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true })
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8')
    console.log(`\n💾 Rapport sauvegardé: ${reportPath}`)

    // Générer aussi un rapport Markdown
    const mdReport = generateMarkdownReport(report, issuesByCollection)
    const mdPath = path.resolve(__dirname, '../../../migrations/AUDIT_REPORT.md')
    fs.writeFileSync(mdPath, mdReport, 'utf-8')
    console.log(`📄 Rapport Markdown: ${mdPath}`)

    console.log('\n✅ Audit terminé!')

  } catch (error) {
    console.error('❌ Erreur lors de l\'audit:', error)
    throw error
  } finally {
    await client.close()
    console.log('🔌 Connexion MongoDB fermée')
  }
}

function generateMarkdownReport(report: AuditReport, issuesByCollection: Record<string, AuditIssue[]>): string {
  const severityEmoji = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🟢',
  }

  let md = `# Audit MongoDB → Payload CMS\n\n`
  md += `**Date**: ${new Date(report.timestamp).toLocaleString('fr-FR')}\n`
  md += `**Database**: ${report.database}\n\n`
  md += `---\n\n`

  md += `## 📊 Résumé Global\n\n`
  md += `- **Collections auditées**: ${report.collections_audited.length}\n`
  md += `- **Total problèmes**: ${report.total_issues}\n\n`

  md += `### Par sévérité\n\n`
  md += `| Sévérité | Nombre |\n`
  md += `|----------|--------|\n`
  md += `| 🔴 Critical | ${report.issues_by_severity.critical} |\n`
  md += `| 🟠 High | ${report.issues_by_severity.high} |\n`
  md += `| 🟡 Medium | ${report.issues_by_severity.medium} |\n`
  md += `| 🟢 Low | ${report.issues_by_severity.low} |\n\n`

  md += `---\n\n`

  for (const [collection, issues] of Object.entries(issuesByCollection)) {
    md += `## 📦 Collection: \`${collection}\`\n\n`
    md += `**${issues.length} problème(s) détecté(s)**\n\n`

    for (const issue of issues) {
      md += `### ${severityEmoji[issue.severity]} ${issue.field}\n\n`
      md += `- **Type**: \`${issue.issue_type}\`\n`
      md += `- **Attendu**: ${issue.expected}\n`
      md += `- **Actuel**: ${issue.actual}\n`
      if (issue.sample_document_id) {
        md += `- **Document exemple**: \`${issue.sample_document_id}\`\n`
      }
      md += `- **Stratégie de correction**: ${issue.fix_strategy}\n\n`
    }
  }

  md += `---\n\n`
  md += `## 🔧 Prochaines étapes\n\n`
  md += `1. Examiner les problèmes **Critical** et **High** en priorité\n`
  md += `2. Créer les scripts de migration dans \`src/scripts/migrations/\`\n`
  md += `3. Tester les migrations sur un environnement de dev\n`
  md += `4. Exécuter en production\n`
  md += `5. Vérifier la conformité Payload\n`

  return md
}

// Exécuter l'audit
runAudit().catch(error => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})
