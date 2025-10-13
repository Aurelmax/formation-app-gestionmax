import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

// Charger les variables d'environnement
config({ path: '.env.local' })

const testDirectApi = async () => {
  console.log('🧪 Test direct des données MongoDB...')
  console.log('🔑 PAYLOAD_SECRET:', process.env['PAYLOAD_SECRET'] ? '✅ Défini' : '❌ Manquant')
  console.log('🗄️ MONGODB_URI:', process.env['MONGODB_URI'] ? '✅ Défini' : '❌ Manquant')
  
  const mongoUri = process.env['MONGODB_URI']
  if (!mongoUri) {
    console.log('❌ MONGODB_URI non défini')
    return
  }
  
  const client = new MongoClient(mongoUri)

  try {
    await client.connect()
    console.log('✅ Connexion MongoDB établie')
    
    const db = client.db('formation-app-gestionmax')
    
    // Test 1: Programmes
    console.log('\n📚 Test des programmes...')
    const programmesCollection = db.collection('programmes')
    const programmes = await programmesCollection.find({}).toArray()
    console.log(`   ✅ ${programmes.length} programmes trouvés`)
    
    if (programmes.length > 0) {
      const programme = programmes[0]
      console.log(`   📋 Premier programme: ${programme.titre}`)
      console.log(`   📊 Statut: ${programme.statut}`)
      console.log(`   💰 Prix: ${programme.prix}€`)
    }

    // Test 2: Apprenants
    console.log('\n👥 Test des apprenants...')
    const apprenantsCollection = db.collection('apprenants')
    const apprenants = await apprenantsCollection.find({}).toArray()
    console.log(`   ✅ ${apprenants.length} apprenants trouvés`)
    
    if (apprenants.length > 0) {
      const apprenant = apprenants[0]
      console.log(`   📋 Premier apprenant: ${apprenant.nom} ${apprenant.prenom}`)
      console.log(`   📧 Email: ${apprenant.email}`)
      console.log(`   📊 Progression: ${apprenant.progression}%`)
    }

    // Test 3: Utilisateurs
    console.log('\n👤 Test des utilisateurs...')
    const usersCollection = db.collection('users')
    const users = await usersCollection.find({}).toArray()
    console.log(`   ✅ ${users.length} utilisateurs trouvés`)
    
    if (users.length > 0) {
      const user = users[0]
      console.log(`   📋 Premier utilisateur: ${user.name}`)
      console.log(`   📧 Email: ${user.email}`)
      console.log(`   🔑 Rôle: ${user.role}`)
    }

    // Test 4: Rendez-vous
    console.log('\n📅 Test des rendez-vous...')
    const rdvCollection = db.collection('rendez-vous')
    const rdvs = await rdvCollection.find({}).toArray()
    console.log(`   ✅ ${rdvs.length} rendez-vous trouvés`)
    
    if (rdvs.length > 0) {
      const rdv = rdvs[0]
      console.log(`   📋 Premier RDV: ${rdv.client.nom} ${rdv.client.prenom}`)
      console.log(`   📅 Date: ${rdv.date}`)
      console.log(`   🕐 Heure: ${rdv.heure}`)
    }

    // Test 5: Articles
    console.log('\n📝 Test des articles...')
    const articlesCollection = db.collection('articles')
    const articles = await articlesCollection.find({}).toArray()
    console.log(`   ✅ ${articles.length} articles trouvés`)
    
    if (articles.length > 0) {
      const article = articles[0]
      console.log(`   📋 Premier article: ${article.titre}`)
      console.log(`   📊 Statut: ${article.statut}`)
      console.log(`   👀 Vues: ${article.vue || 0}`)
    }

    // Test 6: Catégories
    console.log('\n🏷️ Test des catégories...')
    const categoriesCollection = db.collection('categories')
    const categories = await categoriesCollection.find({}).toArray()
    console.log(`   ✅ ${categories.length} catégories trouvées`)
    
    if (categories.length > 0) {
      const categorie = categories[0]
      console.log(`   📋 Première catégorie: ${categorie.nom}`)
    }

    // Test 7: Tags
    console.log('\n🔖 Test des tags...')
    const tagsCollection = db.collection('tags')
    const tags = await tagsCollection.find({}).toArray()
    console.log(`   ✅ ${tags.length} tags trouvés`)
    
    if (tags.length > 0) {
      const tag = tags[0]
      console.log(`   📋 Premier tag: ${tag.nom}`)
    }

    // Test 8: Contacts
    console.log('\n📞 Test des contacts...')
    const contactsCollection = db.collection('contacts')
    const contacts = await contactsCollection.find({}).toArray()
    console.log(`   ✅ ${contacts.length} contacts trouvés`)
    
    if (contacts.length > 0) {
      const contact = contacts[0]
      console.log(`   📋 Premier contact: ${contact.nom}`)
      console.log(`   📧 Email: ${contact.email}`)
      console.log(`   📊 Type: ${contact.type}`)
    }

    // Test 9: Statistiques globales
    console.log('\n📊 Statistiques globales:')
    console.log(`   📚 Programmes: ${programmes.length}`)
    console.log(`   👥 Apprenants: ${apprenants.length}`)
    console.log(`   👤 Utilisateurs: ${users.length}`)
    console.log(`   📅 Rendez-vous: ${rdvs.length}`)
    console.log(`   📝 Articles: ${articles.length}`)
    console.log(`   🏷️ Catégories: ${categories.length}`)
    console.log(`   🔖 Tags: ${tags.length}`)
    console.log(`   📞 Contacts: ${contacts.length}`)

    // Test 10: Test de création d'un document
    console.log('\n🧪 Test de création d\'un document...')
    try {
      const testDoc = {
        nom: 'Test Document',
        email: `test-${Date.now()}@example.com`,
        type: 'question',
        sujet: 'Test',
        message: 'Message de test',
        statut: 'nouveau',
        priorite: 'normale',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const result = await contactsCollection.insertOne(testDoc)
      console.log(`   ✅ Document créé avec ID: ${result.insertedId}`)
      
      // Supprimer le document de test
      await contactsCollection.deleteOne({ _id: result.insertedId })
      console.log(`   🗑️ Document de test supprimé`)
    } catch (error) {
      console.log(`   ❌ Erreur lors du test de création: ${error}`)
    }

    console.log('\n🎉 Tests terminés avec succès!')
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error)
  } finally {
    await client.close()
  }
}

// Exécuter les tests
testDirectApi()
  .then(() => {
    console.log('\n✅ Tests terminés avec succès!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale lors des tests:', error)
    process.exit(1)
  })
