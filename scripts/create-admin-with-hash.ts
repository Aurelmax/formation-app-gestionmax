import { MongoClient } from 'mongodb'
import * as bcrypt from 'bcryptjs'
import 'dotenv/config'

async function createAdminWithHash() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI not found in environment variables')
  }

  const client = new MongoClient(uri)

  try {
    console.log('🔌 Connexion à MongoDB...')
    await client.connect()
    const db = client.db()

    console.log('🗑️  Suppression des utilisateurs existants...')
    await db.collection('users').deleteMany({})

    console.log('🔐 Génération du hash du mot de passe...')
    const password = 'AdminGestionMax2025!'
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    console.log('👤 Création de l\'utilisateur admin...')
    const result = await db.collection('users').insertOne({
      email: 'admin@gestionmax.fr',
      password: hashedPassword,
      name: 'Administrateur',
      firstName: 'Admin',
      lastName: 'GestionMax',
      role: 'superAdmin',
      status: 'active',
      permissions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    console.log('\n✅ Utilisateur admin créé avec succès!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email: admin@gestionmax.fr')
    console.log('🔑 Mot de passe: AdminGestionMax2025!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`\n🆔 ID: ${result.insertedId}`)
    console.log(`🔒 Password hashé: ${hashedPassword.substring(0, 20)}...`)
    console.log('\n🌐 Connectez-vous sur: http://localhost:3010/payload-cms')
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

createAdminWithHash()
