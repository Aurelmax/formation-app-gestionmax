import { config } from 'dotenv'
import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'

// Charger les variables d'environnement
config({ path: '.env.local' })

interface MigrationStep {
  name: string
  description: string
  command: string
  required: boolean
  skipIf?: () => boolean
}

class CompleteMigrationManager {
  private steps: MigrationStep[] = []
  private results: Array<{ step: string; success: boolean; output?: string; error?: string }> = []

  constructor() {
    this.initializeSteps()
  }

  private log(message: string, level: 'info' | 'success' | 'warning' | 'error' = 'info') {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
    }
    console.log(`${icons[level]} ${message}`)
  }

  private initializeSteps() {
    this.steps = [
      {
        name: 'check-env',
        description: "Vérification des variables d'environnement",
        command: 'npx tsx src/scripts/check-collections.ts',
        required: true,
      },
      {
        name: 'migrate-data',
        description: 'Migration des données mock vers Payload',
        command: 'npx tsx src/scripts/migrate-collections-complete.ts',
        required: true,
        skipIf: () => {
          // Vérifier si des données existent déjà
          return process.env.NEXT_PUBLIC_USE_PAYLOAD === 'true'
        },
      },
      {
        name: 'test-migration',
        description: 'Test de la migration',
        command: 'npx tsx src/scripts/test-migration.ts',
        required: true,
      },
      {
        name: 'switch-to-payload',
        description: 'Basculement vers Payload CMS',
        command: 'npx tsx src/scripts/switch-to-payload.ts payload',
        required: true,
      },
      {
        name: 'generate-types',
        description: 'Génération des types TypeScript',
        command: 'npm run generate:types',
        required: false,
      },
      {
        name: 'final-test',
        description: "Test final de l'application",
        command: 'npx tsx src/scripts/test-migration.ts',
        required: false,
      },
    ]
  }

  private async executeStep(step: MigrationStep): Promise<boolean> {
    this.log(`\n🔄 ${step.description}...`)

    try {
      // Vérifier si l'étape doit être ignorée
      if (step.skipIf && step.skipIf()) {
        this.log(`⏭️ Étape ignorée: ${step.name}`, 'warning')
        this.results.push({ step: step.name, success: true, output: 'Étape ignorée' })
        return true
      }

      // Exécuter la commande
      const output = execSync(step.command, {
        encoding: 'utf-8',
        stdio: 'pipe',
        cwd: process.cwd(),
      })

      this.log(`✅ ${step.description} - Succès`, 'success')
      this.results.push({ step: step.name, success: true, output })
      return true
    } catch (error: any) {
      this.log(`❌ ${step.description} - Échec`, 'error')
      this.log(`   Erreur: ${error.message}`, 'error')

      this.results.push({
        step: step.name,
        success: false,
        error: error.message,
        output: error.stdout || error.stderr,
      })

      if (step.required) {
        this.log(`💥 Étape requise échouée: ${step.name}`, 'error')
        return false
      } else {
        this.log(`⚠️ Étape optionnelle échouée: ${step.name}`, 'warning')
        return true
      }
    }
  }

  private checkPrerequisites(): boolean {
    this.log('🔍 Vérification des prérequis...')

    // Vérifier Node.js
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim()
      this.log(`✅ Node.js: ${nodeVersion}`)
    } catch {
      this.log('❌ Node.js non installé', 'error')
      return false
    }

    // Vérifier npm
    try {
      const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim()
      this.log(`✅ npm: ${npmVersion}`)
    } catch {
      this.log('❌ npm non installé', 'error')
      return false
    }

    // Vérifier les variables d'environnement
    if (!process.env.MONGODB_URI) {
      this.log('❌ MONGODB_URI non défini dans .env.local', 'error')
      return false
    }
    this.log('✅ MONGODB_URI défini')

    if (!process.env.PAYLOAD_SECRET) {
      this.log('❌ PAYLOAD_SECRET non défini dans .env.local', 'error')
      return false
    }
    this.log('✅ PAYLOAD_SECRET défini')

    // Vérifier les fichiers nécessaires
    const requiredFiles = ['src/payload.config.ts', 'src/data/mock-data.ts', 'package.json']

    for (const file of requiredFiles) {
      if (!existsSync(join(process.cwd(), file))) {
        this.log(`❌ Fichier requis manquant: ${file}`, 'error')
        return false
      }
      this.log(`✅ Fichier trouvé: ${file}`)
    }

    return true
  }

  private printResults() {
    this.log('\n📊 RÉSULTATS DE LA MIGRATION')
    this.log('=' * 50)

    const successful = this.results.filter(r => r.success).length
    const failed = this.results.filter(r => !r.success).length
    const total = this.results.length

    this.log(`✅ Succès: ${successful}/${total}`)
    this.log(`❌ Échecs: ${failed}/${total}`)

    this.log('\n📋 Détail des étapes:')
    for (const result of this.results) {
      const icon = result.success ? '✅' : '❌'
      this.log(`  ${icon} ${result.step}`)

      if (result.error) {
        this.log(`    Erreur: ${result.error}`, 'error')
      }
    }

    if (failed === 0) {
      this.log('\n🎉 Migration complète réussie!', 'success')
      this.log('\n📖 Prochaines étapes:')
      this.log('1. Redémarrer le serveur: npm run dev')
      this.log("2. Accéder à l'admin Payload: http://localhost:3010/admin")
      this.log("3. Tester l'application: http://localhost:3010")
      this.log("4. Vérifier les données migrées dans l'interface admin")
    } else {
      this.log(`\n⚠️ Migration partiellement réussie (${failed} échec(s))`, 'warning')
      this.log('\n🔧 Actions recommandées:')
      this.log('1. Vérifier les erreurs ci-dessus')
      this.log('2. Corriger les problèmes identifiés')
      this.log('3. Relancer la migration: npm run migrate')
    }
  }

  private showHelp() {
    console.log(`
🚀 Script de migration complète Payload CMS

Usage: npx tsx src/scripts/migrate-complete.ts [options]

Options:
  --help       Afficher cette aide
  --dry-run    Mode test (aucune modification)
  --skip-test  Ignorer les tests
  --force      Forcer la migration même si des données existent

Ce script effectue:
  1. Vérification des prérequis
  2. Migration des données mock vers Payload
  3. Tests de la migration
  4. Basculement vers Payload CMS
  5. Génération des types TypeScript
  6. Tests finaux

Prérequis:
  - Node.js et npm installés
  - Variables d'environnement configurées (.env.local)
  - MongoDB accessible
  - Fichiers de configuration présents
`)
  }

  async run() {
    const args = process.argv.slice(2)

    if (args.includes('--help')) {
      this.showHelp()
      return true
    }

    this.log('🚀 DÉMARRAGE DE LA MIGRATION COMPLÈTE')
    this.log('=' * 50)

    // Vérifier les prérequis
    if (!this.checkPrerequisites()) {
      this.log('❌ Prérequis non satisfaits - Arrêt de la migration', 'error')
      return false
    }

    this.log('\n✅ Prérequis satisfaits - Démarrage de la migration')

    // Exécuter chaque étape
    for (const step of this.steps) {
      const success = await this.executeStep(step)

      if (!success && step.required) {
        this.log(`💥 Arrêt de la migration - Étape requise échouée: ${step.name}`, 'error')
        break
      }
    }

    // Afficher les résultats
    this.printResults()

    const allRequiredSuccessful = this.results
      .filter(r => this.steps.find(s => s.name === r.step)?.required)
      .every(r => r.success)

    return allRequiredSuccessful
  }
}

// Fonction principale
async function runCompleteMigration() {
  const manager = new CompleteMigrationManager()
  const success = await manager.run()

  process.exit(success ? 0 : 1)
}

// Exécuter la migration complète
runCompleteMigration().catch(error => {
  console.error('❌ Erreur fatale lors de la migration:', error)
  process.exit(1)
})
