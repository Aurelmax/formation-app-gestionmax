#!/usr/bin/env tsx
/**
 * Script Master - Exécution de toutes les migrations
 *
 * Ordre d'exécution (par priorité):
 * 1. 🔴 CRITICAL: Programmes - Competences structure
 * 2. 🟡 MEDIUM: Users - Role enum
 * 3. 🟡 MEDIUM: Rendez-vous - Date type
 *
 * Usage: npx tsx src/scripts/migrations/run-all-migrations.ts
 */

import { execSync } from 'child_process'
import * as path from 'path'

interface MigrationScript {
  name: string
  file: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
}

const MIGRATIONS: MigrationScript[] = [
  {
    name: 'Programmes - Competences Structure',
    file: 'migrate-programmes-competences.ts',
    severity: 'critical',
    description: 'Transform competences: [string] → [{competence: string}]',
  },
  {
    name: 'Users - Role Enum',
    file: 'migrate-users-role.ts',
    severity: 'medium',
    description: 'Convert role: "superAdmin" → "admin"',
  },
  {
    name: 'Rendez-vous - Date Type',
    file: 'migrate-rendezvous-dates.ts',
    severity: 'medium',
    description: 'Convert date: string → Date object',
  },
]

function getSeverityEmoji(severity: string): string {
  switch (severity) {
    case 'critical':
      return '🔴'
    case 'high':
      return '🟠'
    case 'medium':
      return '🟡'
    case 'low':
      return '🟢'
    default:
      return '⚪'
  }
}

async function runAllMigrations(): Promise<void> {
  console.log('🚀 Exécution de toutes les migrations MongoDB → Payload CMS')
  console.log('=' .repeat(70))
  console.log()

  console.log('📋 Migrations planifiées:\n')
  MIGRATIONS.forEach((migration, index) => {
    console.log(`${index + 1}. ${getSeverityEmoji(migration.severity)} ${migration.name}`)
    console.log(`   📄 ${migration.file}`)
    console.log(`   📝 ${migration.description}`)
    console.log()
  })

  console.log('=' .repeat(70))
  console.log()

  const results: Array<{ migration: string; success: boolean; error?: string }> = []

  for (let i = 0; i < MIGRATIONS.length; i++) {
    const migration = MIGRATIONS[i]
    const emoji = getSeverityEmoji(migration.severity)

    console.log(`\n${'='.repeat(70)}`)
    console.log(`${emoji} Migration ${i + 1}/${MIGRATIONS.length}: ${migration.name}`)
    console.log('='.repeat(70))

    try {
      const scriptPath = path.resolve(__dirname, migration.file)

      // Exécuter le script de migration
      execSync(`npx tsx "${scriptPath}"`, {
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '../../..'),
      })

      results.push({ migration: migration.name, success: true })
      console.log(`\n✅ ${migration.name} - SUCCÈS`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      results.push({ migration: migration.name, success: false, error: errorMessage })
      console.error(`\n❌ ${migration.name} - ÉCHEC`)
      console.error(`   Erreur: ${errorMessage}`)

      // Demander si on continue ou on arrête
      console.log('\n⚠️  Une migration a échoué.')
      console.log('   Les migrations suivantes peuvent échouer également.')
      console.log('   Voulez-vous continuer ? (Ctrl+C pour arrêter)')

      // Petite pause pour permettre l'interruption
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
  }

  // Résumé final
  console.log('\n' + '='.repeat(70))
  console.log('📊 RÉSUMÉ FINAL DES MIGRATIONS')
  console.log('='.repeat(70))
  console.log()

  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length

  console.log(`✅ Migrations réussies: ${successful}/${MIGRATIONS.length}`)
  console.log(`❌ Migrations échouées: ${failed}/${MIGRATIONS.length}`)
  console.log()

  if (failed > 0) {
    console.log('❌ Migrations échouées:\n')
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`   • ${r.migration}`)
        if (r.error) {
          console.log(`     Erreur: ${r.error}`)
        }
      })
    console.log()
  }

  if (successful === MIGRATIONS.length) {
    console.log('🎉 Toutes les migrations ont réussi!')
    console.log()
    console.log('🔧 Prochaines étapes:')
    console.log('   1. Vérifier les données dans MongoDB')
    console.log('   2. Re-exécuter l\'audit: npx tsx src/scripts/migrations/audit-collections.ts')
    console.log('   3. Tester Payload CMS (Dashboard + API)')
    console.log('   4. Tester les relations (rendez-vous ↔ programmes)')
  } else {
    console.log('⚠️  Certaines migrations ont échoué.')
    console.log('   Veuillez corriger les erreurs et relancer.')
  }

  console.log()
  console.log('=' .repeat(70))
}

// Exécuter toutes les migrations
runAllMigrations().catch(error => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})
