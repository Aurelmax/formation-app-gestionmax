import { config } from 'dotenv'

// Charger les variables d'environnement
config({ path: '.env.local' })

const testMongoDBConnection = async () => {
  console.log('🔍 Test de connexion MongoDB...')
  console.log('🔑 PAYLOAD_SECRET:', process.env['PAYLOAD_SECRET'] ? '✅ Défini' : '❌ Manquant')
  console.log('🗄️ MONGODB_URI:', process.env['MONGODB_URI'] ? '✅ Défini' : '❌ Manquant')
  
  const mongoUri = process.env['MONGODB_URI']
  if (!mongoUri) {
    console.log('❌ MONGODB_URI non défini')
    return
  }
  
  console.log(`\n📋 URI MongoDB: ${mongoUri}`)
  
  // Tester différentes variantes de l'URI
  const testUris = [
    mongoUri,
    mongoUri.replace('formation-app-gestionmax', 'admin'),
    mongoUri.replace('formation-app-gestionmax', 'test'),
    'mongodb://localhost:27017/',
    'mongodb://localhost:27017/admin'
  ]
  
  console.log('\n🧪 Test des différentes URIs:')
  
  for (const uri of testUris) {
    console.log(`\n🔗 Test: ${uri}`)
    
    try {
      // Import dynamique de mongodb
      const { MongoClient } = await import('mongodb')
      
      const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
      })
      
      await client.connect()
      console.log('   ✅ Connexion réussie')
      
      // Tester une opération simple
      const db = client.db()
      const collections = await db.listCollections().toArray()
      console.log(`   📦 Collections trouvées: ${collections.length}`)
      
      if (collections.length > 0) {
        console.log('   📋 Collections:')
        collections.forEach(col => {
          console.log(`     - ${col.name}`)
        })
      }
      
      await client.close()
      
    } catch (error) {
      console.log(`   ❌ Erreur: ${error}`)
    }
  }
  
  console.log('\n💡 Recommandations:')
  console.log('   1. Vérifier que MongoDB fonctionne sans authentification')
  console.log('   2. Ou configurer l\'authentification MongoDB')
  console.log('   3. Ou utiliser une URI sans base de données spécifique')
  
  console.log('\n🎉 Test terminé!')
}

// Exécuter le test
testMongoDBConnection()
  .then(() => {
    console.log('\n✅ Test terminé avec succès!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale lors du test:', error)
    process.exit(1)
  })
