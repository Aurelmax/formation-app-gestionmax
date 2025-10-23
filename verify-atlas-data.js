const mongoose = require('mongoose')

const ATLAS_URI =
  'mongodb+srv://aurelien_db_user:UabCxoHI9J4C75j0@clustergestionmaxformat.a9qrz87.mongodb.net/formation-app-gestionmax?retryWrites=true&w=majority'

async function verifyData() {
  try {
    console.log('🔍 Vérification des données sur MongoDB Atlas...\n')

    await mongoose.connect(ATLAS_URI)
    const db = mongoose.connection.db

    const collections = await db.listCollections().toArray()
    console.log(`📦 Collections: ${collections.length}\n`)

    let totalDocuments = 0

    for (const collection of collections) {
      const coll = db.collection(collection.name)
      const count = await coll.countDocuments()
      totalDocuments += count
      console.log(`✅ ${collection.name}: ${count} documents`)

      // Afficher un exemple de document pour les collections importantes
      if (
        count > 0 &&
        ['users', 'programmes', 'formations_personnalisees', 'apprenants'].includes(collection.name)
      ) {
        const sample = await coll.findOne()
        const keys = Object.keys(sample)
        console.log(`   📋 Champs: ${keys.slice(0, 5).join(', ')}...`)
      }
    }

    console.log(`\n📊 Total: ${totalDocuments} documents dans ${collections.length} collections`)

    await mongoose.connection.close()
    console.log('✅ Vérification terminée!')
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

verifyData()
