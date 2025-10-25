#!/usr/bin/env tsx
/**
 * Migration: Rendez-vous - Date Type Fix
 *
 * PROBLÈME:
 * - Payload attend: date de type Date object
 * - MongoDB contient: date de type string ("2025-10-24")
 *
 * SOLUTION:
 * Convertir toutes les dates string en Date objects
 *
 * Usage: npx tsx src/scripts/migrations/migrate-rendezvous-dates.ts
 */

import { MongoClient } from 'mongodb'
import * as path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') })

interface RendezVousDoc {
  _id: any
  programme: any
  client: {
    nom: string
    prenom: string
    email: string
  }
  date: string | Date
  heure: string
  type: string
}

async function migrateRendezVousDates(): Promise<void> {
  const mongoUri = process.env['MONGODB_URI']

  if (!mongoUri) {
    throw new Error('❌ MONGODB_URI non défini dans .env.local')
  }

  console.log('🚀 Migration: Rendez-vous - Type Date')
  console.log('📋 Conversion: string → Date object\n')

  const client = new MongoClient(mongoUri)

  try {
    await client.connect()
    console.log('✅ Connexion MongoDB établie\n')

    const db = client.db()
    const rdvCollection = db.collection<RendezVousDoc>('rendez-vous')

    // Trouver tous les rendez-vous
    const allRendezVous = await rdvCollection.find({}).toArray()

    console.log(`📊 ${allRendezVous.length} rendez-vous trouvé(s)\n`)

    if (allRendezVous.length === 0) {
      console.log('ℹ️  Aucun rendez-vous à migrer')
      return
    }

    let migratedCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (const rdv of allRendezVous) {
      try {
        // Vérifier si la date est déjà un objet Date
        if (rdv.date instanceof Date) {
          console.log(`⏭️  Rendez-vous ${rdv._id} - date déjà au format Date`)
          skippedCount++
          continue
        }

        // Vérifier si la date est une string
        if (typeof rdv.date !== 'string') {
          console.log(`⚠️  Rendez-vous ${rdv._id} - type date inattendu: ${typeof rdv.date}`)
          skippedCount++
          continue
        }

        // Convertir la date string en Date object
        const dateString = rdv.date as string
        const dateObject = new Date(dateString)

        // Vérifier que la conversion est valide
        if (isNaN(dateObject.getTime())) {
          console.log(`❌ Rendez-vous ${rdv._id} - date invalide: "${dateString}"`)
          errorCount++
          continue
        }

        const clientName = `${rdv.client?.prenom || ''} ${rdv.client?.nom || ''}`.trim() || 'Client inconnu'
        console.log(`🔄 Migration rendez-vous ${rdv._id}`)
        console.log(`   Client: ${clientName}`)
        console.log(`   Avant: "${dateString}" (string)`)
        console.log(`   Après: ${dateObject.toISOString()} (Date)`)

        // Mettre à jour le document
        const result = await rdvCollection.updateOne(
          { _id: rdv._id },
          {
            $set: {
              date: dateObject,
              updatedAt: new Date(),
            },
          }
        )

        if (result.modifiedCount === 1) {
          console.log(`   ✅ Migré avec succès\n`)
          migratedCount++
        } else {
          console.log(`   ❌ Échec de la mise à jour\n`)
          errorCount++
        }
      } catch (error) {
        console.error(`❌ Erreur lors de la migration du rendez-vous ${rdv._id}:`, error)
        errorCount++
      }
    }

    // Résumé
    console.log('\n' + '='.repeat(60))
    console.log('📊 RÉSUMÉ DE LA MIGRATION')
    console.log('='.repeat(60))
    console.log(`✅ Rendez-vous migrés: ${migratedCount}`)
    console.log(`⏭️  Rendez-vous ignorés (déjà Date): ${skippedCount}`)
    console.log(`❌ Erreurs: ${errorCount}`)
    console.log(`📊 Total: ${allRendezVous.length}`)

    // Vérification post-migration
    console.log('\n🔍 Vérification post-migration...')
    const verificationResult = await rdvCollection.findOne({
      _id: allRendezVous[0]?._id,
    })

    if (verificationResult && verificationResult.date instanceof Date) {
      console.log('✅ Structure validée: date au format Date object')
      console.log(`   Exemple: ${verificationResult.date.toISOString()}`)
    } else {
      console.log('⚠️  Structure non conforme après migration')
      console.log(`   Type actuel: ${typeof verificationResult?.date}`)
    }

    console.log('\n✅ Migration terminée!')
  } catch (error) {
    console.error('❌ Erreur fatale lors de la migration:', error)
    throw error
  } finally {
    await client.close()
    console.log('🔌 Connexion MongoDB fermée')
  }
}

// Exécuter la migration
migrateRendezVousDates().catch(error => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})
