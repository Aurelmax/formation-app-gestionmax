/**
 * Script pour mettre à jour les statuts des formations personnalisées
 * avec des statuts plus appropriés au contexte
 */

import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

async function updateFormationsPersonnaliseesStatuts() {
  console.log('🔄 Mise à jour des statuts des formations personnalisées...')

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
    const collection = db.collection('formations_personnalisees')

    // Récupérer toutes les formations personnalisées
    const formations = await collection.find({}).toArray()
    console.log(`📋 ${formations.length} formations personnalisées trouvées`)

    let updatedCount = 0

    for (const formation of formations) {
      // Mapper les anciens statuts vers les nouveaux
      let nouveauStatut = formation.statut

      switch (formation.statut) {
        case 'PUBLIE':
          // Les formations "publiées" deviennent "finalisées" car elles sont prêtes pour le client
          nouveauStatut = 'FINALISEE'
          break
        case 'BROUILLON':
          // Les brouillons deviennent "en cours"
          nouveauStatut = 'EN_COURS'
          break
        case 'ARCHIVE':
          // Les archives restent archivées
          nouveauStatut = 'ARCHIVE'
          break
        default:
          // Par défaut, mettre en "en cours"
          nouveauStatut = 'EN_COURS'
          break
      }

      // Mettre à jour seulement si le statut a changé
      if (nouveauStatut !== formation.statut) {
        await collection.updateOne(
          { _id: formation._id },
          {
            $set: {
              statut: nouveauStatut,
              updatedAt: new Date(),
            },
          }
        )

        console.log(
          `✅ Formation mise à jour: ${formation.title} - ${formation.statut} → ${nouveauStatut}`
        )
        updatedCount++
      } else {
        console.log(`ℹ️ Formation déjà à jour: ${formation.title} - ${formation.statut}`)
      }
    }

    console.log(`\n📊 Résumé de la mise à jour:`)
    console.log(`   ✅ Formations mises à jour: ${updatedCount}`)
    console.log(`   📋 Total formations: ${formations.length}`)

    // Afficher la répartition des nouveaux statuts
    console.log(`\n📈 Répartition des statuts après mise à jour:`)
    const statutsCount = await collection
      .aggregate([{ $group: { _id: '$statut', count: { $sum: 1 } } }, { $sort: { _id: 1 } }])
      .toArray()

    statutsCount.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} formation(s)`)
    })
  } catch (error: any) {
    console.error('❌ Erreur lors de la mise à jour:', error)
  } finally {
    if (client) {
      await client.close()
    }
  }
}

updateFormationsPersonnaliseesStatuts()
