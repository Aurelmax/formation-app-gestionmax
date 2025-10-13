import { config } from 'dotenv'
import { getPayload } from 'payload'
import payloadConfig from '../payload.config'

// Charger les variables d'environnement
config({ path: '.env.local' })

const checkCollections = async () => {
  console.log('🔍 Vérification des collections Payload CMS...')
  console.log('🔑 PAYLOAD_SECRET:', process.env['PAYLOAD_SECRET'] ? '✅ Défini' : '❌ Manquant')
  console.log('🗄️ MONGODB_URI:', process.env['MONGODB_URI'] ? '✅ Défini' : '❌ Manquant')
  
  try {
    const payload = await getPayload({ config: payloadConfig })
    
    console.log('\n📋 Collections disponibles:')
    
    // Liste des collections attendues
    const expectedCollections = [
      'users',
      'formations', 
      'apprenants',
      'articles',
      'categories',
      'tags',
      'programmes',
      'rendez-vous',
      'contacts',
      'media'
    ]
    
    const availableCollections = Object.keys(payload.collections)
    
    console.log(`\n✅ Collections trouvées (${availableCollections.length}):`)
    availableCollections.forEach(collection => {
      console.log(`   - ${collection}`)
    })
    
    console.log(`\n📊 Vérification des collections attendues:`)
    expectedCollections.forEach(collection => {
      const exists = availableCollections.includes(collection)
      console.log(`   ${exists ? '✅' : '❌'} ${collection}`)
    })
    
    // Vérifier les données existantes
    console.log('\n📈 Données existantes:')
    for (const collectionName of availableCollections) {
      try {
        const count = await payload.count({ collection: collectionName })
        console.log(`   📦 ${collectionName}: ${count.totalDocs} documents`)
      } catch (error) {
        console.log(`   ❌ ${collectionName}: Erreur lors du comptage`)
      }
    }
    
    // Test de création d'un document de test pour chaque collection
    console.log('\n🧪 Test de création de documents:')
    for (const collectionName of availableCollections) {
      try {
        // Test avec des données minimales selon la collection
        let testData: any = {}
        
        switch (collectionName) {
          case 'users':
            testData = {
              name: 'Test User',
              email: `test-${Date.now()}@example.com`,
              role: 'apprenant',
              status: 'active'
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
              prix: 100
            }
            break
          case 'contacts':
            testData = {
              nom: 'Test Contact',
              email: `test-${Date.now()}@example.com`,
              type: 'question',
              sujet: 'Test',
              message: 'Message de test'
            }
            break
          case 'articles':
            testData = {
              titre: 'Test Article',
              slug: `test-${Date.now()}`,
              contenu: 'Contenu de test',
              resume: 'Résumé de test',
              auteur: 'Test Author',
              statut: 'brouillon'
            }
            break
          case 'categories':
            testData = {
              nom: 'Test Category',
              slug: `test-${Date.now()}`
            }
            break
          case 'tags':
            testData = {
              nom: 'Test Tag',
              slug: `test-${Date.now()}`
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
              progression: 0
            }
            break
          case 'rendez-vous':
            testData = {
              client: {
                nom: 'Test',
                prenom: 'Client',
                email: `test-${Date.now()}@example.com`
              },
              type: 'information',
              statut: 'en_attente',
              date: new Date().toISOString().split('T')[0],
              heure: '10:00',
              duree: 30,
              lieu: 'visio'
            }
            break
          default:
            continue // Skip collections that don't need test data
        }
        
        const created = await payload.create({
          collection: collectionName,
          data: testData
        })
        
        console.log(`   ✅ ${collectionName}: Document créé avec ID ${created.id}`)
        
        // Supprimer le document de test
        await payload.delete({
          collection: collectionName,
          id: created.id
        })
        
      } catch (error) {
        console.log(`   ❌ ${collectionName}: Erreur - ${error}`)
      }
    }
    
    console.log('\n🎉 Vérification terminée!')
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error)
  }
}

// Exécuter la vérification
checkCollections()
  .then(() => {
    console.log('\n✅ Vérification terminée avec succès!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale lors de la vérification:', error)
    process.exit(1)
  })
