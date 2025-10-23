const mongoose = require('mongoose')

// Configuration des connexions
const LOCAL_URI = 'mongodb://localhost:27017/formation-app-gestionmax'
const ATLAS_URI =
  'mongodb+srv://aurelien_db_user:UabCxoHI9J4C75j0@clustergestionmaxformat.a9qrz87.mongodb.net/formation-app-gestionmax?retryWrites=true&w=majority'

// Collections à migrer
const COLLECTIONS_TO_MIGRATE = [
  'users',
  'formations',
  'formations_personnalisees',
  'apprenants',
  'articles',
  'categories',
  'tags',
  'programmes',
  'rendez-vous',
  'contacts',
  'media',
  'payload-preferences',
  'payload-migrations',
]

async function migrateData() {
  let localConnection = null
  let atlasConnection = null

  try {
    console.log('🚀 Début de la migration vers MongoDB Atlas...\n')

    // Connexion à la base locale
    console.log('📡 Connexion à MongoDB local...')
    localConnection = await mongoose.createConnection(LOCAL_URI).asPromise()
    console.log('✅ Connecté à MongoDB local\n')

    // Connexion à MongoDB Atlas
    console.log('☁️  Connexion à MongoDB Atlas...')
    atlasConnection = await mongoose.createConnection(ATLAS_URI).asPromise()
    console.log('✅ Connecté à MongoDB Atlas\n')

    // Récupérer la liste des collections existantes
    const localDb = localConnection.db
    const existingCollections = await localDb.listCollections().toArray()
    const collectionNames = existingCollections.map(c => c.name)

    console.log(`📦 Collections trouvées : ${collectionNames.length}\n`)

    // Statistiques de migration
    const stats = {
      total: 0,
      success: 0,
      errors: 0,
      collections: {},
    }

    // Migration collection par collection
    for (const collectionName of collectionNames) {
      try {
        console.log(`📋 Migration de la collection: ${collectionName}`)

        const sourceCollection = localDb.collection(collectionName)
        const targetCollection = atlasConnection.db.collection(collectionName)

        // Compter les documents
        const count = await sourceCollection.countDocuments()
        console.log(`   📊 Documents à migrer: ${count}`)

        if (count === 0) {
          console.log(`   ⏭️  Collection vide, passage à la suivante\n`)
          stats.collections[collectionName] = { count: 0, migrated: 0 }
          continue
        }

        // Récupérer tous les documents
        const documents = await sourceCollection.find({}).toArray()

        // Supprimer les documents existants dans Atlas (si présents)
        await targetCollection.deleteMany({})

        // Insérer les documents dans Atlas
        if (documents.length > 0) {
          await targetCollection.insertMany(documents, { ordered: false })
          console.log(`   ✅ ${documents.length} documents migrés avec succès\n`)
          stats.collections[collectionName] = {
            count: count,
            migrated: documents.length,
          }
          stats.success += documents.length
        }

        stats.total += count
      } catch (error) {
        console.error(`   ❌ Erreur lors de la migration de ${collectionName}:`, error.message)
        stats.errors++
        stats.collections[collectionName] = { count: 0, migrated: 0, error: error.message }
      }
    }

    // Afficher le résumé
    console.log('\n' + '='.repeat(60))
    console.log('📊 RÉSUMÉ DE LA MIGRATION')
    console.log('='.repeat(60))
    console.log(`Total de documents trouvés: ${stats.total}`)
    console.log(`Documents migrés avec succès: ${stats.success}`)
    console.log(`Erreurs: ${stats.errors}`)
    console.log('\n📦 Détails par collection:')
    Object.entries(stats.collections).forEach(([name, data]) => {
      if (data.error) {
        console.log(`   ❌ ${name}: ${data.error}`)
      } else {
        console.log(`   ✅ ${name}: ${data.migrated}/${data.count} documents`)
      }
    })
    console.log('='.repeat(60))
    console.log('\n✅ Migration terminée avec succès!')
  } catch (error) {
    console.error('\n❌ Erreur fatale lors de la migration:', error)
    throw error
  } finally {
    // Fermer les connexions
    if (localConnection) {
      await localConnection.close()
      console.log('\n🔒 Connexion locale fermée')
    }
    if (atlasConnection) {
      await atlasConnection.close()
      console.log('🔒 Connexion Atlas fermée')
    }
  }
}

// Lancer la migration
migrateData()
  .then(() => {
    console.log('\n🎉 Migration complétée!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n💥 La migration a échoué:', error)
    process.exit(1)
  })
