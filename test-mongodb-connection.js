const mongoose = require('mongoose')
const { config } = require('dotenv')

// Charger les variables d'environnement
config({ path: '.env.local' })

console.log('🔍 Test de connexion MongoDB...')
console.log('🔑 PAYLOAD_SECRET:', process.env['PAYLOAD_SECRET'] ? '✅ Défini' : '❌ Manquant')
console.log('🗄️ MONGODB_URI:', process.env['MONGODB_URI'] ? '✅ Défini' : '❌ Manquant')
console.log('📋 URI complète:', process.env['MONGODB_URI'])

const testConnection = async () => {
  try {
    console.log('\n🔗 Connexion à MongoDB...')
    await mongoose.connect(process.env['MONGODB_URI'])
    console.log('✅ Connexion MongoDB réussie!')

    // Lister les bases de données
    const admin = mongoose.connection.db.admin()
    const dbs = await admin.listDatabases()
    console.log('\n📊 Bases de données disponibles:')
    dbs.databases.forEach(db => {
      console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`)
    })

    // Vérifier la base de données de l'application
    const db = mongoose.connection.db
    const collections = await db.listCollections().toArray()
    console.log('\n📦 Collections dans formation-app-gestionmax:')
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
    console.error('📋 Détails:', error)
  }
}

testConnection()
