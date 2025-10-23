const mongoose = require('mongoose')
const { config } = require('dotenv')

// Charger les variables d'environnement du fichier .env (MongoDB Atlas)
config({ path: '.env' })

console.log('🔍 Test de connexion MongoDB Atlas...')
console.log('📋 URI:', process.env['MONGODB_URI'].replace(/:[^:@]+@/, ':****@'))

const testConnection = async () => {
  try {
    console.log('\n🔗 Connexion à MongoDB Atlas...')
    await mongoose.connect(process.env['MONGODB_URI'])
    console.log('✅ Connexion MongoDB Atlas réussie!')

    // Vérifier la base de données
    const db = mongoose.connection.db
    console.log('📊 Base de données:', db.databaseName)

    const collections = await db.listCollections().toArray()
    console.log(`\n📦 Collections (${collections.length}) :`)
    if (collections.length === 0) {
      console.log('   (Aucune collection trouvée)')
    } else {
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`)
      })
    }

    await mongoose.connection.close()
    console.log('\n✅ Test terminé avec succès!')
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

testConnection()
