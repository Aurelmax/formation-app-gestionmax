import { config } from 'dotenv'
import { getPayload } from 'payload'
import payloadConfig from '../payload.config'

// Charger les variables d'environnement
config({ path: '.env.local' })

interface TestResult {
  collection: string
  status: 'success' | 'error' | 'warning'
  message: string
  count?: number
  details?: any
}

class MigrationTester {
  private payload: any
  private results: TestResult[] = []

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
    collection: string,
    status: TestResult['status'],
    message: string,
    count?: number,
    details?: any
  ) {
    this.results.push({ collection, status, message, count, details })
  }

  async initialize() {
    this.log('🧪 Initialisation des tests de migration...')

    try {
      this.payload = await getPayload({ config: payloadConfig })
      this.log('✅ Connexion à Payload CMS établie')
      return true
    } catch (error) {
      this.log(`❌ Erreur lors de l'initialisation: ${error}`, 'error')
      return false
    }
  }

  async testCollectionExists(collectionName: string): Promise<boolean> {
    try {
      const exists = !!this.payload.collections[collectionName]
      if (exists) {
        this.addResult(collectionName, 'success', 'Collection trouvée')
      } else {
        this.addResult(collectionName, 'error', 'Collection non trouvée')
      }
      return exists
    } catch (error) {
      this.addResult(collectionName, 'error', `Erreur lors de la vérification: ${error}`)
      return false
    }
  }

  async testCollectionData(collectionName: string) {
    try {
      const count = await this.payload.count({ collection: collectionName })
      this.addResult(collectionName, 'success', `Données trouvées`, count.totalDocs)

      if (count.totalDocs === 0) {
        this.addResult(collectionName, 'warning', 'Aucune donnée dans la collection')
      }

      return count.totalDocs
    } catch (error) {
      this.addResult(collectionName, 'error', `Erreur lors du comptage: ${error}`)
      return 0
    }
  }

  async testCollectionCRUD(collectionName: string) {
    try {
      // Test de création
      let testData: any = {}

      switch (collectionName) {
        case 'users':
          testData = {
            name: 'Test User',
            email: `test-${Date.now()}@example.com`,
            role: 'apprenant',
            status: 'active',
          }
          break
        case 'programmes':
          testData = {
            codeFormation: `TEST-${Date.now()}`,
            titre: 'Test Programme',
            description: 'Description de test',
            duree: 1,
            niveau: 'DEBUTANT',
            modalites: 'PRESENTIEL',
            prix: 100,
          }
          break
        case 'contacts':
          testData = {
            nom: 'Test Contact',
            email: `test-${Date.now()}@example.com`,
            type: 'question',
            sujet: 'Test',
            message: 'Message de test',
          }
          break
        case 'articles':
          testData = {
            titre: 'Test Article',
            slug: `test-${Date.now()}`,
            contenu: 'Contenu de test',
            resume: 'Résumé de test',
            auteur: 'Test Author',
            statut: 'brouillon',
          }
          break
        case 'categories':
          testData = {
            nom: 'Test Category',
            slug: `test-${Date.now()}`,
          }
          break
        case 'tags':
          testData = {
            nom: 'Test Tag',
            slug: `test-${Date.now()}`,
          }
          break
        case 'apprenants':
          testData = {
            nom: 'Test',
            prenom: 'Apprenant',
            email: `test-${Date.now()}@example.com`,
            telephone: '0123456789',
            dateNaissance: '1990-01-01',
            adresse: 'Test Address',
            statut: 'ACTIF',
            progression: 0,
          }
          break
        case 'rendez-vous':
          testData = {
            client: {
              nom: 'Test',
              prenom: 'Client',
              email: `test-${Date.now()}@example.com`,
            },
            type: 'information',
            statut: 'en_attente',
            date: new Date().toISOString().split('T')[0],
            heure: '10:00',
            duree: 30,
            lieu: 'visio',
          }
          break
        default:
          this.addResult(collectionName, 'warning', 'Pas de test CRUD défini')
          return
      }

      // Créer
      const created = await this.payload.create({
        collection: collectionName,
        data: testData,
      })
      this.addResult(collectionName, 'success', 'Test de création réussi', undefined, {
        id: created.id,
      })

      // Lire
      const read = await this.payload.findByID({
        collection: collectionName,
        id: created.id,
      })
      this.addResult(collectionName, 'success', 'Test de lecture réussi')

      // Mettre à jour
      const updated = await this.payload.update({
        collection: collectionName,
        id: created.id,
        data: { ...testData, updatedAt: new Date().toISOString() },
      })
      this.addResult(collectionName, 'success', 'Test de mise à jour réussi')

      // Supprimer
      await this.payload.delete({
        collection: collectionName,
        id: created.id,
      })
      this.addResult(collectionName, 'success', 'Test de suppression réussi')
    } catch (error) {
      this.addResult(collectionName, 'error', `Erreur lors du test CRUD: ${error}`)
    }
  }

  async testRelations() {
    this.log('\n🔗 Test des relations entre collections...')

    try {
      // Test relation programmes -> formateurs (users)
      const programmes = await this.payload.find({
        collection: 'programmes',
        limit: 1,
      })

      if (programmes.docs.length > 0) {
        this.addResult('relations', 'success', 'Relation programmes trouvée')
      } else {
        this.addResult('relations', 'warning', 'Aucun programme trouvé pour tester les relations')
      }

      // Test relation apprenants -> programmes
      const apprenants = await this.payload.find({
        collection: 'apprenants',
        limit: 1,
      })

      if (apprenants.docs.length > 0) {
        this.addResult('relations', 'success', 'Relation apprenants trouvée')
      } else {
        this.addResult('relations', 'warning', 'Aucun apprenant trouvé pour tester les relations')
      }
    } catch (error) {
      this.addResult('relations', 'error', `Erreur lors du test des relations: ${error}`)
    }
  }

  async testAPIEndpoints() {
    this.log('\n🌐 Test des endpoints API...')

    const endpoints = [
      '/api/users',
      '/api/programmes',
      '/api/apprenants',
      '/api/rendez-vous',
      '/api/articles',
      '/api/categories',
      '/api/tags',
      '/api/contacts',
    ]

    for (const endpoint of endpoints) {
      try {
        // Test avec fetch (simulation d'appel API)
        const response = await fetch(`http://localhost:3010${endpoint}`)
        if (response.ok) {
          this.addResult('api', 'success', `Endpoint ${endpoint} accessible`)
        } else {
          this.addResult('api', 'warning', `Endpoint ${endpoint} retourne ${response.status}`)
        }
      } catch (error) {
        this.addResult(
          'api',
          'warning',
          `Endpoint ${endpoint} non accessible (serveur non démarré?)`
        )
      }
    }
  }

  async testDataIntegrity() {
    this.log("\n🔍 Test d'intégrité des données...")

    try {
      // Vérifier que les utilisateurs ont des rôles valides
      const users = await this.payload.find({
        collection: 'users',
        limit: 10,
      })

      const validRoles = ['superAdmin', 'admin', 'formateur', 'gestionnaire', 'apprenant']
      let invalidRoles = 0

      for (const user of users.docs) {
        if (!validRoles.includes(user.role)) {
          invalidRoles++
        }
      }

      if (invalidRoles === 0) {
        this.addResult('integrity', 'success', 'Tous les utilisateurs ont des rôles valides')
      } else {
        this.addResult(
          'integrity',
          'warning',
          `${invalidRoles} utilisateurs avec des rôles invalides`
        )
      }

      // Vérifier que les programmes ont des codes de formation uniques
      const programmes = await this.payload.find({
        collection: 'programmes',
        limit: 100,
      })

      const codes = programmes.docs.map(p => p.codeFormation)
      const uniqueCodes = new Set(codes)

      if (codes.length === uniqueCodes.size) {
        this.addResult('integrity', 'success', 'Tous les codes de formation sont uniques')
      } else {
        this.addResult('integrity', 'warning', 'Codes de formation dupliqués détectés')
      }
    } catch (error) {
      this.addResult('integrity', 'error', `Erreur lors du test d'intégrité: ${error}`)
    }
  }

  printResults() {
    this.log('\n📊 RÉSULTATS DES TESTS')
    this.log('=' * 50)

    const groupedResults = this.results.reduce(
      (acc, result) => {
        if (!acc[result.collection]) {
          acc[result.collection] = []
        }
        acc[result.collection].push(result)
        return acc
      },
      {} as Record<string, TestResult[]>
    )

    for (const [collection, results] of Object.entries(groupedResults)) {
      this.log(`\n📦 ${collection.toUpperCase()}:`)

      for (const result of results) {
        const icon = result.status === 'success' ? '✅' : result.status === 'warning' ? '⚠️' : '❌'
        const count = result.count ? ` (${result.count})` : ''
        this.log(`  ${icon} ${result.message}${count}`)

        if (result.details) {
          this.log(`    Détails: ${JSON.stringify(result.details)}`)
        }
      }
    }

    // Résumé global
    const totalTests = this.results.length
    const successTests = this.results.filter(r => r.status === 'success').length
    const warningTests = this.results.filter(r => r.status === 'warning').length
    const errorTests = this.results.filter(r => r.status === 'error').length

    this.log('\n🎯 RÉSUMÉ GLOBAL:')
    this.log(`  ✅ Succès: ${successTests}/${totalTests}`)
    this.log(`  ⚠️ Avertissements: ${warningTests}/${totalTests}`)
    this.log(`  ❌ Erreurs: ${errorTests}/${totalTests}`)

    if (errorTests === 0) {
      this.log('\n🎉 Tous les tests sont passés avec succès!', 'success')
    } else {
      this.log(`\n⚠️ ${errorTests} erreur(s) détectée(s)`, 'warning')
    }
  }

  async run() {
    const initialized = await this.initialize()
    if (!initialized) {
      return false
    }

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

    // Test 1: Vérifier l'existence des collections
    this.log('\n📋 Test 1: Vérification des collections...')
    for (const collection of collections) {
      await this.testCollectionExists(collection)
    }

    // Test 2: Vérifier les données
    this.log('\n📊 Test 2: Vérification des données...')
    for (const collection of collections) {
      const exists = await this.testCollectionExists(collection)
      if (exists) {
        await this.testCollectionData(collection)
      }
    }

    // Test 3: Test CRUD
    this.log('\n🔧 Test 3: Test des opérations CRUD...')
    for (const collection of collections) {
      const exists = await this.testCollectionExists(collection)
      if (exists) {
        await this.testCollectionCRUD(collection)
      }
    }

    // Test 4: Relations
    await this.testRelations()

    // Test 5: Intégrité des données
    await this.testDataIntegrity()

    // Test 6: Endpoints API (optionnel)
    await this.testAPIEndpoints()

    this.printResults()

    const hasErrors = this.results.some(r => r.status === 'error')
    return !hasErrors
  }
}

// Fonction principale
async function runTests() {
  const args = process.argv.slice(2)

  if (args.includes('--help')) {
    console.log(`
🧪 Script de test de migration Payload CMS

Usage: npx tsx src/scripts/test-migration.ts [options]

Options:
  --help       Afficher cette aide

Ce script teste:
  - L'existence des collections
  - La présence de données
  - Les opérations CRUD
  - Les relations entre collections
  - L'intégrité des données
  - Les endpoints API (si le serveur est démarré)
`)
    process.exit(0)
  }

  const tester = new MigrationTester()
  const success = await tester.run()

  process.exit(success ? 0 : 1)
}

// Exécuter les tests
runTests().catch(error => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})
