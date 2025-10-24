import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import path from 'path'

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

async function cleanDuplicateFormations() {
  const mongoUri = process.env['MONGODB_URI']
  if (!mongoUri) {
    throw new Error('MONGODB_URI not defined')
  }

  const client = new MongoClient(mongoUri)
  await client.connect()
  const db = client.db()

  console.log('🧹 Nettoyage des données dupliquées...\n')

  // Récupérer tous les programmes du catalogue
  const programmes = await db.collection('programmes').find({}).toArray()
  console.log(`📋 Programmes catalogue trouvés: ${programmes.length}`)

  // Récupérer toutes les formations personnalisées
  const formations = await db.collection('formations_personnalisees').find({}).toArray()
  console.log(`🎯 Formations personnalisées trouvées: ${formations.length}`)

  // Identifier les formations personnalisées qui sont des doublons des programmes catalogue
  const programmesCodes = new Set(programmes.map(p => p['codeFormation']))
  const formationsToDelete = formations.filter(f => programmesCodes.has(f['code_formation']))

  console.log(
    `\n🔍 Formations personnalisées identifiées comme doublons: ${formationsToDelete.length}`
  )

  if (formationsToDelete.length > 0) {
    console.log('\n📝 Formations qui seront supprimées:')
    formationsToDelete.forEach(f => {
      console.log(`   - ${f['title']} (${f['code_formation']})`)
    })

    // Supprimer les doublons
    const idsToDelete = formationsToDelete.map(f => f._id)
    const result = await db.collection('formations_personnalisees').deleteMany({
      _id: { $in: idsToDelete },
    })

    console.log(`\n✅ ${result.deletedCount} formations personnalisées supprimées`)
  } else {
    console.log('\n✅ Aucune duplication détectée')
  }

  // Vérifier l'état final
  const finalFormations = await db.collection('formations_personnalisees').find({}).toArray()
  console.log(`\n📊 État final:`)
  console.log(`   - Programmes catalogue: ${programmes.length}`)
  console.log(`   - Formations personnalisées: ${finalFormations.length}`)

  if (finalFormations.length > 0) {
    console.log('\n🎯 Formations personnalisées restantes:')
    finalFormations.forEach(f => {
      console.log(`   - ${f['title']} (${f['code_formation']})`)
    })
  }

  await client.close()
  console.log('\n🎉 Nettoyage terminé !')
}

// Exécuter le script
cleanDuplicateFormations().catch(console.error)
