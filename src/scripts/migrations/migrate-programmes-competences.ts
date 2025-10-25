#!/usr/bin/env tsx
/**
 * Migration: Programmes - Competences Structure
 *
 * PROBLÈME CRITIQUE:
 * - Payload attend: competences: [{ competence: "WordPress" }, { competence: "SEO" }]
 * - MongoDB contient: competences: ["WordPress", "SEO", ...]
 *
 * Cette divergence cause l'erreur:
 * "TypeError: Cannot delete property '0' of [object String]"
 *
 * SOLUTION:
 * Transformer tous les tableaux de strings en tableaux d'objets
 *
 * Usage: npx tsx src/scripts/migrations/migrate-programmes-competences.ts
 */

import { MongoClient } from 'mongodb'
import * as path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') })

interface ProgrammeDoc {
  _id: any
  codeFormation: string
  titre: string
  competences: string[] | Array<{ competence: string }>
}

async function migrateProgrammesCompetences(): Promise<void> {
  const mongoUri = process.env['MONGODB_URI']

  if (!mongoUri) {
    throw new Error('❌ MONGODB_URI non défini dans .env.local')
  }

  console.log('🚀 Migration: Programmes - Structure competences')
  console.log('📋 Transformation: [string] → [{competence: string}]\n')

  const client = new MongoClient(mongoUri)

  try {
    await client.connect()
    console.log('✅ Connexion MongoDB établie\n')

    const db = client.db()
    const programmesCollection = db.collection<ProgrammeDoc>('programmes')

    // Trouver tous les programmes avec competences en array de strings
    const programmesWithStringArray = await programmesCollection
      .find({
        competences: { $type: 'array' },
      })
      .toArray()

    console.log(`📊 ${programmesWithStringArray.length} programme(s) trouvé(s)\n`)

    if (programmesWithStringArray.length === 0) {
      console.log('ℹ️  Aucun programme à migrer')
      return
    }

    let migratedCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (const programme of programmesWithStringArray) {
      try {
        // Vérifier si c'est déjà au bon format
        if (
          Array.isArray(programme.competences) &&
          programme.competences.length > 0 &&
          typeof programme.competences[0] === 'object' &&
          'competence' in programme.competences[0]
        ) {
          console.log(`⏭️  Programme "${programme.codeFormation}" déjà au bon format`)
          skippedCount++
          continue
        }

        // Vérifier si c'est un array de strings
        if (
          !Array.isArray(programme.competences) ||
          programme.competences.length === 0 ||
          typeof programme.competences[0] !== 'string'
        ) {
          console.log(`⚠️  Programme "${programme.codeFormation}" - format inattendu, skip`)
          skippedCount++
          continue
        }

        // Transformation: [string] → [{competence: string}]
        const oldCompetences = programme.competences as string[]
        const newCompetences = oldCompetences.map(comp => ({
          competence: comp,
        }))

        console.log(`🔄 Migration "${programme.codeFormation}"`)
        console.log(`   Avant: [${oldCompetences.slice(0, 3).join(', ')}${oldCompetences.length > 3 ? ', ...' : ''}]`)
        console.log(`   Après: [${newCompetences.slice(0, 2).map(c => `{competence: "${c.competence}"}`).join(', ')}${newCompetences.length > 2 ? ', ...' : ''}]`)

        // Mettre à jour le document
        const result = await programmesCollection.updateOne(
          { _id: programme._id },
          {
            $set: {
              competences: newCompetences,
              updatedAt: new Date(),
            },
          }
        )

        if (result.modifiedCount === 1) {
          console.log(`   ✅ Migré avec succès (${newCompetences.length} compétences)\n`)
          migratedCount++
        } else {
          console.log(`   ❌ Échec de la mise à jour\n`)
          errorCount++
        }
      } catch (error) {
        console.error(`❌ Erreur lors de la migration du programme "${programme.codeFormation}":`, error)
        errorCount++
      }
    }

    // Résumé
    console.log('\n' + '='.repeat(60))
    console.log('📊 RÉSUMÉ DE LA MIGRATION')
    console.log('='.repeat(60))
    console.log(`✅ Programmes migrés: ${migratedCount}`)
    console.log(`⏭️  Programmes ignorés (déjà bon format): ${skippedCount}`)
    console.log(`❌ Erreurs: ${errorCount}`)
    console.log(`📊 Total: ${programmesWithStringArray.length}`)

    // Vérification post-migration
    console.log('\n🔍 Vérification post-migration...')
    const verificationResult = await programmesCollection.findOne({
      _id: programmesWithStringArray[0]?._id,
    })

    if (verificationResult && Array.isArray(verificationResult.competences)) {
      const firstComp = verificationResult.competences[0]
      if (typeof firstComp === 'object' && 'competence' in firstComp) {
        console.log('✅ Structure validée: competences au format objet')
        console.log(`   Exemple: ${JSON.stringify(verificationResult.competences.slice(0, 2), null, 2)}`)
      } else {
        console.log('⚠️  Structure non conforme après migration')
      }
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
migrateProgrammesCompetences().catch(error => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})
