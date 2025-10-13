/**
 * Script pour mettre à jour le programme WordPress avec le contenu détaillé
 */

import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import path from 'path'
import { MOCK_PROGRAMMES } from '@/data/mock-data'

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

async function updateWordPressProgramme() {
  console.log('🔄 Mise à jour du programme WordPress...')

  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    console.error("❌ MONGODB_URI n'est pas défini dans .env.local")
    return
  }

  let client: MongoClient | undefined
  try {
    client = new MongoClient(mongoUri)
    await client.connect()
    console.log('✅ Connexion MongoDB établie')

    const db = client.db()
    const programmesCollection = db.collection('programmes')

    // Trouver le programme WordPress
    const wordpressProgramme = MOCK_PROGRAMMES.find(p => p.codeFormation === 'A001-WP-DD')

    if (!wordpressProgramme) {
      console.error('❌ Programme WordPress non trouvé dans les données mock')
      return
    }

    // Mettre à jour le programme dans la base de données
    const result = await programmesCollection.updateOne(
      { codeFormation: 'A001-WP-DD' },
      {
        $set: {
          titre: wordpressProgramme.titre,
          description: wordpressProgramme.description,
          competences: wordpressProgramme.competences,
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      console.log('⚠️ Programme WordPress non trouvé dans la base de données')
      console.log('📝 Insertion du programme...')

      await programmesCollection.insertOne({
        ...wordpressProgramme,
        _id: wordpressProgramme.id,
      })
      console.log('✅ Programme WordPress inséré avec succès')
    } else {
      console.log('✅ Programme WordPress mis à jour avec succès')
    }

    // Vérifier la mise à jour
    const updatedProgramme = await programmesCollection.findOne({ codeFormation: 'A001-WP-DD' })
    if (updatedProgramme) {
      console.log('\n📋 Programme mis à jour :')
      console.log(`   Code: ${updatedProgramme.codeFormation}`)
      console.log(`   Titre: ${updatedProgramme.titre}`)
      console.log(`   Prix: ${updatedProgramme.prix}€`)
      console.log(`   Durée: ${updatedProgramme.duree}h`)
      console.log(`   Compétences: ${updatedProgramme.competences?.length || 0} compétences`)
    }
  } catch (error: any) {
    console.error('❌ Erreur lors de la mise à jour:', error)
  } finally {
    if (client) {
      await client.close()
    }
  }
}

updateWordPressProgramme()
