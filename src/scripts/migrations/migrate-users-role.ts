#!/usr/bin/env tsx
/**
 * Migration: Users - Role Enum Fix
 *
 * PROBLÈME:
 * - Payload attend: role ∈ ['admin', 'user']
 * - MongoDB contient: role = 'superAdmin'
 *
 * SOLUTION:
 * - Convertir 'superAdmin' → 'admin'
 * - OU ajouter 'superAdmin' au schéma Payload
 *
 * Usage: npx tsx src/scripts/migrations/migrate-users-role.ts
 */

import { MongoClient } from 'mongodb'
import * as path from 'path'
import dotenv from 'dotenv'
import * as readline from 'readline'

dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') })

interface UserDoc {
  _id: any
  email: string
  name: string
  role: string
}

async function askConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise(resolve => {
    rl.question(question + ' (y/n): ', answer => {
      rl.close()
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes')
    })
  })
}

async function migrateUsersRole(): Promise<void> {
  const mongoUri = process.env['MONGODB_URI']

  if (!mongoUri) {
    throw new Error('❌ MONGODB_URI non défini dans .env.local')
  }

  console.log('🚀 Migration: Users - Role Enum')
  console.log('📋 Conversion: "superAdmin" → "admin"\n')

  const client = new MongoClient(mongoUri)

  try {
    await client.connect()
    console.log('✅ Connexion MongoDB établie\n')

    const db = client.db()
    const usersCollection = db.collection<UserDoc>('users')

    // Trouver tous les users avec role = 'superAdmin'
    const usersWithSuperAdmin = await usersCollection
      .find({
        role: 'superAdmin',
      })
      .toArray()

    console.log(`📊 ${usersWithSuperAdmin.length} utilisateur(s) avec role="superAdmin"\n`)

    if (usersWithSuperAdmin.length === 0) {
      console.log('ℹ️  Aucun utilisateur à migrer')
      return
    }

    // Afficher les utilisateurs concernés
    console.log('👤 Utilisateurs concernés:')
    for (const user of usersWithSuperAdmin) {
      console.log(`   • ${user.email} (${user.name}) - role: ${user.role}`)
    }
    console.log()

    // Demander confirmation
    const confirmed = await askConfirmation(
      `⚠️  Voulez-vous convertir ${usersWithSuperAdmin.length} utilisateur(s) de "superAdmin" → "admin" ?`
    )

    if (!confirmed) {
      console.log('❌ Migration annulée par l\'utilisateur')
      return
    }

    let migratedCount = 0
    let errorCount = 0

    for (const user of usersWithSuperAdmin) {
      try {
        console.log(`🔄 Migration ${user.email}...`)

        const result = await usersCollection.updateOne(
          { _id: user._id },
          {
            $set: {
              role: 'admin',
              updatedAt: new Date(),
            },
          }
        )

        if (result.modifiedCount === 1) {
          console.log(`   ✅ Role mis à jour: "superAdmin" → "admin"\n`)
          migratedCount++
        } else {
          console.log(`   ❌ Échec de la mise à jour\n`)
          errorCount++
        }
      } catch (error) {
        console.error(`❌ Erreur lors de la migration de ${user.email}:`, error)
        errorCount++
      }
    }

    // Résumé
    console.log('\n' + '='.repeat(60))
    console.log('📊 RÉSUMÉ DE LA MIGRATION')
    console.log('='.repeat(60))
    console.log(`✅ Utilisateurs migrés: ${migratedCount}`)
    console.log(`❌ Erreurs: ${errorCount}`)
    console.log(`📊 Total: ${usersWithSuperAdmin.length}`)

    // Vérification post-migration
    console.log('\n🔍 Vérification post-migration...')
    const remainingSuperAdmins = await usersCollection.countDocuments({
      role: 'superAdmin',
    })

    if (remainingSuperAdmins === 0) {
      console.log('✅ Aucun utilisateur avec role="superAdmin" restant')
    } else {
      console.log(`⚠️  ${remainingSuperAdmins} utilisateur(s) avec role="superAdmin" encore présent(s)`)
    }

    const admins = await usersCollection.countDocuments({ role: 'admin' })
    console.log(`📊 Total utilisateurs avec role="admin": ${admins}`)

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
migrateUsersRole().catch(error => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})
