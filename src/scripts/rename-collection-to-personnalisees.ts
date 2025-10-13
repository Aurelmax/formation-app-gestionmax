/**
 * Script pour renommer la collection formation_programmes en formations_personnalisees
 */

import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

async function renameCollectionToPersonnalisees() {
  console.log('🔄 Renommage de la collection formation_programmes en formations_personnalisees...')

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

    // Vérifier si la collection formation_programmes existe
    const collections = await db.listCollections().toArray()
    const formationProgrammesExists = collections.some(col => col.name === 'formation_programmes')
    const formationsPersonnaliseesExists = collections.some(
      col => col.name === 'formations_personnalisees'
    )

    if (!formationProgrammesExists) {
      console.log("⚠️ La collection formation_programmes n'existe pas")
      return
    }

    if (formationsPersonnaliseesExists) {
      console.log('⚠️ La collection formations_personnalisees existe déjà')
      console.log("🔄 Suppression de l'ancienne collection...")
      await db.collection('formations_personnalisees').drop()
    }

    // Renommer la collection
    console.log('🔄 Renommage en cours...')
    await db.collection('formation_programmes').rename('formations_personnalisees')

    console.log('✅ Collection renommée avec succès')

    // Vérifier le nombre de documents
    const count = await db.collection('formations_personnalisees').countDocuments()
    console.log(`📊 Nombre de formations personnalisées: ${count}`)

    // Lister les collections existantes
    const newCollections = await db.listCollections().toArray()
    console.log('\n📋 Collections existantes:')
    newCollections.forEach(col => {
      console.log(`   - ${col.name}`)
    })
  } catch (error: any) {
    console.error('❌ Erreur lors du renommage:', error)
  } finally {
    if (client) {
      await client.close()
    }
  }
}

renameCollectionToPersonnalisees()
