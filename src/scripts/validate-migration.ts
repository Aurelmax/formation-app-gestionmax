import { config } from 'dotenv'
import { getPayloadClient } from '@/lib/getPayloadClient'
import payloadConfig from '../payload.config'
import { payloadService } from '../lib/payload-service'

// Charger les variables d'environnement
config({ path: '.env.local' })

interface ValidationResult {
  test: string
  status: 'success' | 'error' | 'warning'
  message: string
  details?: any
  duration?: number
}

class MigrationValidator {
  private results: ValidationResult[] = []
  private payload: any

  private log(message: string, level: 'info' | 'success' | 'warning' | 'error' = 'info') {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
    }
    console.log(`${icons[level]} ${message}`)
  }

  private addResult(
    test: string,
    status: ValidationResult['status'],
    message: string,
    details?: any,
    duration?: number
  ) {
    this.results.push({ test, status, message, details, duration })
  }

  async initialize() {
    this.log('🧪 Initialisation du validateur de migration...')

    try {
      this.payload = await getPayloadClient()
      this.log('✅ Connexion à Payload CMS établie')
      return true
    } catch (error) {
      this.log(`❌ Erreur lors de l'initialisation: ${error}`, 'error')
      return false
    }
  }

  async testEnvironmentVariables() {
    const startTime = Date.now()
    this.log("\n🔧 Test des variables d'environnement...")

    const requiredVars = [
      'MONGODB_URI',
      'PAYLOAD_SECRET',
      'NEXT_PUBLIC_USE_MOCK_DATA',
      'NEXT_PUBLIC_USE_PAYLOAD',
    ]

    let allPresent = true

    for (const varName of requiredVars) {
      if (process.env[varName]) {
        this.log(`  ✅ ${varName}: ${process.env[varName]}`)
      } else {
        this.log(`  ❌ ${varName}: Non défini`, 'error')
        allPresent = false
      }
    }

    const duration = Date.now() - startTime
    this.addResult(
      'environment-variables',
      allPresent ? 'success' : 'error',
      allPresent
        ? "Toutes les variables d'environnement sont définies"
        : "Variables d'environnement manquantes",
      { requiredVars, present: requiredVars.filter(v => process.env[v]).length },
      duration
    )

    return allPresent
  }

  async testPayloadConnection() {
    const startTime = Date.now()
    this.log('\n🔗 Test de la connexion Payload...')

    try {
      const collections = Object.keys(this.payload.collections)
      const duration = Date.now() - startTime

      this.log(`  ✅ Collections disponibles: ${collections.join(', ')}`)

      this.addResult(
        'payload-connection',
        'success',
        `Connexion Payload réussie avec ${collections.length} collections`,
        { collections, count: collections.length },
        duration
      )

      return true
    } catch (error) {
      const duration = Date.now() - startTime
      this.addResult(
        'payload-connection',
        'error',
        `Erreur de connexion Payload: ${error}`,
        { error: error.toString() },
        duration
      )
      return false
    }
  }

  async testCollectionsData() {
    const startTime = Date.now()
    this.log('\n📊 Test des données dans les collections...')

    const collections = [
      'users',
      'programmes',
      'apprenants',
      'rendez-vous',
      'articles',
      'categories',
      'tags',
      'contacts',
    ]
    const results: Record<string, number> = {}
    let totalDocuments = 0

    for (const collectionName of collections) {
      try {
        if (this.payload.collections[collectionName]) {
          const count = await this.payload.count({ collection: collectionName })
          results[collectionName] = count.totalDocs
          totalDocuments += count.totalDocs
          this.log(`  📦 ${collectionName}: ${count.totalDocs} documents`)
        } else {
          this.log(`  ⚠️ ${collectionName}: Collection non trouvée`, 'warning')
          results[collectionName] = 0
        }
      } catch (error) {
        this.log(`  ❌ ${collectionName}: Erreur - ${error}`, 'error')
        results[collectionName] = 0
      }
    }

    const duration = Date.now() - startTime
    const hasData = totalDocuments > 0

    this.addResult(
      'collections-data',
      hasData ? 'success' : 'warning',
      hasData
        ? `${totalDocuments} documents trouvés dans les collections`
        : 'Aucune donnée trouvée dans les collections',
      { results, totalDocuments },
      duration
    )

    return hasData
  }

  async testPayloadService() {
    const startTime = Date.now()
    this.log('\n🔧 Test du service Payload...')

    try {
      // Test des utilisateurs
      const users = await payloadService.getUsers()
      this.log(`  👤 Utilisateurs: ${users.length} récupérés`)

      // Test des programmes
      const programmes = await payloadService.getProgrammes()
      this.log(`  📚 Programmes: ${programmes.length} récupérés`)

      // Test des apprenants
      const apprenants = await payloadService.getApprenants()
      this.log(`  👥 Apprenants: ${apprenants.length} récupérés`)

      // Test des rendez-vous
      const rendezVous = await payloadService.getRendezVous()
      this.log(`  📅 Rendez-vous: ${rendezVous.length} récupérés`)

      // Test des statistiques
      const stats = await payloadService.getStats()
      this.log(`  📊 Statistiques: ${JSON.stringify(stats)}`)

      const duration = Date.now() - startTime
      this.addResult(
        'payload-service',
        'success',
        'Service Payload fonctionne correctement',
        {
          users: users.length,
          programmes: programmes.length,
          apprenants: apprenants.length,
          rendezVous: rendezVous.length,
          stats,
        },
        duration
      )

      return true
    } catch (error) {
      const duration = Date.now() - startTime
      this.addResult(
        'payload-service',
        'error',
        `Erreur du service Payload: ${error}`,
        { error: error.toString() },
        duration
      )
      return false
    }
  }

  async testCRUDOperations() {
    const startTime = Date.now()
    this.log('\n🔧 Test des opérations CRUD...')

    try {
      // Test de création d'un utilisateur
      const testUser = await payloadService.createUser({
        nom: 'Test User',
        prenom: 'Validation',
        email: `test-validation-${Date.now()}@example.com`,
        role: 'APPRENANT',
      })
      this.log(`  ✅ Utilisateur créé: ${testUser.id}`)

      // Test de lecture
      const retrievedUser = await payloadService.getUserById(testUser.id)
      if (retrievedUser) {
        this.log(`  ✅ Utilisateur lu: ${retrievedUser.nom}`)
      }

      // Test de mise à jour
      const updatedUser = await payloadService.updateUser(testUser.id, {
        nom: 'Test User Updated',
      })
      this.log(`  ✅ Utilisateur mis à jour: ${updatedUser.nom}`)

      // Test de suppression
      const deleted = await payloadService.deleteUser(testUser.id)
      if (deleted) {
        this.log(`  ✅ Utilisateur supprimé`)
      }

      const duration = Date.now() - startTime
      this.addResult(
        'crud-operations',
        'success',
        'Toutes les opérations CRUD fonctionnent',
        { created: testUser.id, deleted },
        duration
      )

      return true
    } catch (error) {
      const duration = Date.now() - startTime
      this.addResult(
        'crud-operations',
        'error',
        `Erreur lors des opérations CRUD: ${error}`,
        { error: error.toString() },
        duration
      )
      return false
    }
  }

  async testDataIntegrity() {
    const startTime = Date.now()
    this.log("\n🔍 Test d'intégrité des données...")

    try {
      const issues: string[] = []

      // Vérifier les utilisateurs
      const users = await payloadService.getUsers()
      const validRoles = ['SUPERADMIN', 'ADMIN', 'FORMATEUR', 'GESTIONNAIRE', 'APPRENANT']
      const invalidUsers = users.filter(user => !validRoles.includes(user.role))

      if (invalidUsers.length > 0) {
        issues.push(`${invalidUsers.length} utilisateurs avec des rôles invalides`)
      }

      // Vérifier les programmes
      const programmes = await payloadService.getProgrammes()
      const codes = programmes.map(p => p.codeFormation)
      const uniqueCodes = new Set(codes)

      if (codes.length !== uniqueCodes.size) {
        issues.push('Codes de formation dupliqués détectés')
      }

      // Vérifier les apprenants
      const apprenants = await payloadService.getApprenants()
      const emails = apprenants.map(a => a.email)
      const uniqueEmails = new Set(emails)

      if (emails.length !== uniqueEmails.size) {
        issues.push("Emails d'apprenants dupliqués détectés")
      }

      const duration = Date.now() - startTime
      const hasIssues = issues.length > 0

      this.addResult(
        'data-integrity',
        hasIssues ? 'warning' : 'success',
        hasIssues
          ? `Problèmes d'intégrité détectés: ${issues.join(', ')}`
          : 'Intégrité des données validée',
        {
          issues,
          userCount: users.length,
          programmeCount: programmes.length,
          apprenantCount: apprenants.length,
        },
        duration
      )

      return !hasIssues
    } catch (error) {
      const duration = Date.now() - startTime
      this.addResult(
        'data-integrity',
        'error',
        `Erreur lors du test d'intégrité: ${error}`,
        { error: error.toString() },
        duration
      )
      return false
    }
  }

  async testPerformance() {
    const startTime = Date.now()
    this.log('\n⚡ Test de performance...')

    try {
      const operations = [
        { name: 'getUsers', fn: () => payloadService.getUsers() },
        { name: 'getProgrammes', fn: () => payloadService.getProgrammes() },
        { name: 'getApprenants', fn: () => payloadService.getApprenants() },
        { name: 'getRendezVous', fn: () => payloadService.getRendezVous() },
        { name: 'getStats', fn: () => payloadService.getStats() },
      ]

      const results: Record<string, number> = {}

      for (const op of operations) {
        const opStart = Date.now()
        await op.fn()
        const opDuration = Date.now() - opStart
        results[op.name] = opDuration
        this.log(`  ⚡ ${op.name}: ${opDuration}ms`)
      }

      const totalDuration = Date.now() - startTime
      const avgDuration =
        Object.values(results).reduce((a, b) => a + b, 0) / Object.values(results).length

      this.addResult(
        'performance',
        avgDuration < 1000 ? 'success' : 'warning',
        `Performance moyenne: ${avgDuration.toFixed(2)}ms par opération`,
        { results, totalDuration, averageDuration: avgDuration },
        totalDuration
      )

      return avgDuration < 1000
    } catch (error) {
      const duration = Date.now() - startTime
      this.addResult(
        'performance',
        'error',
        `Erreur lors du test de performance: ${error}`,
        { error: error.toString() },
        duration
      )
      return false
    }
  }

  printResults() {
    this.log('\n📊 RÉSULTATS DE LA VALIDATION')
    this.log('=' * 50)

    const successful = this.results.filter(r => r.status === 'success').length
    const warnings = this.results.filter(r => r.status === 'warning').length
    const errors = this.results.filter(r => r.status === 'error').length
    const total = this.results.length

    this.log(`✅ Succès: ${successful}/${total}`)
    this.log(`⚠️ Avertissements: ${warnings}/${total}`)
    this.log(`❌ Erreurs: ${errors}/${total}`)

    this.log('\n📋 Détail des tests:')
    for (const result of this.results) {
      const icon = result.status === 'success' ? '✅' : result.status === 'warning' ? '⚠️' : '❌'
      const duration = result.duration ? ` (${result.duration}ms)` : ''
      this.log(`  ${icon} ${result.test}: ${result.message}${duration}`)

      if (result.details) {
        this.log(`    Détails: ${JSON.stringify(result.details, null, 2)}`)
      }
    }

    // Recommandations
    this.log('\n💡 Recommandations:')
    if (errors === 0 && warnings === 0) {
      this.log('  🎉 Migration parfaitement réussie!')
      this.log('  🚀 Vous pouvez maintenant utiliser Payload CMS en production')
    } else if (errors === 0) {
      this.log('  ✅ Migration réussie avec quelques avertissements')
      this.log('  🔧 Considérez les améliorations suggérées')
    } else {
      this.log('  ⚠️ Migration partiellement réussie')
      this.log('  🔧 Corrigez les erreurs avant de passer en production')
    }
  }

  async run() {
    this.log('🚀 VALIDATION DE LA MIGRATION PAYLOAD CMS')
    this.log('=' * 50)

    const initialized = await this.initialize()
    if (!initialized) {
      return false
    }

    // Exécuter tous les tests
    await this.testEnvironmentVariables()
    await this.testPayloadConnection()
    await this.testCollectionsData()
    await this.testPayloadService()
    await this.testCRUDOperations()
    await this.testDataIntegrity()
    await this.testPerformance()

    // Afficher les résultats
    this.printResults()

    const hasErrors = this.results.some(r => r.status === 'error')
    return !hasErrors
  }
}

// Fonction principale
async function runValidation() {
  const args = process.argv.slice(2)

  if (args.includes('--help')) {
    console.log(`
🧪 Script de validation de migration Payload CMS

Usage: npx tsx src/scripts/validate-migration.ts [options]

Options:
  --help       Afficher cette aide

Ce script valide:
  - Les variables d'environnement
  - La connexion Payload
  - Les données dans les collections
  - Le service Payload
  - Les opérations CRUD
  - L'intégrité des données
  - Les performances

Exemples:
  npx tsx src/scripts/validate-migration.ts
`)
    process.exit(0)
  }

  const validator = new MigrationValidator()
  const success = await validator.run()

  process.exit(success ? 0 : 1)
}

// Exécuter la validation
runValidation().catch(error => {
  console.error('❌ Erreur fatale lors de la validation:', error)
  process.exit(1)
})
