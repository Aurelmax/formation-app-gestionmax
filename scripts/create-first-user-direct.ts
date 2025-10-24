#!/usr/bin/env tsx
/**
 * Script pour créer le premier utilisateur Payload CMS directement dans MongoDB
 * Contourne le problème du formulaire "Create First User" cassé
 */

import { MongoClient } from 'mongodb'
import * as bcrypt from 'bcryptjs'

async function createFirstUser() {
  const uri = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/formation-app-gestionmax'
  const client = new MongoClient(uri)

  try {
    console.log('🔌 Connexion à MongoDB...')
    await client.connect()
    const db = client.db()
    const usersCollection = db.collection('users')

    // Vérifier si un utilisateur existe déjà
    const existingUser = await usersCollection.findOne({})
    if (existingUser) {
      console.log('⚠️  Un utilisateur existe déjà:', existingUser.email)
      console.log('👉 Voulez-vous vraiment créer un nouvel utilisateur ?')
      console.log('   Si oui, supprimez d\'abord tous les utilisateurs avec: npm run create:admin')
      return
    }

    // Créer le premier utilisateur admin
    const email = 'admin@gestionmax.fr'
    const password = 'Admin123456!'
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = {
      email,
      password: hashedPassword,
      name: 'Super Admin',
      role: 'superAdmin',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log('👤 Création de l\'utilisateur:', email)
    const result = await usersCollection.insertOne(user)

    if (result.acknowledged) {
      console.log('✅ Utilisateur créé avec succès!')
      console.log('')
      console.log('🔑 Identifiants de connexion:')
      console.log('   Email:', email)
      console.log('   Mot de passe:', password)
      console.log('')
      console.log('🌐 Connectez-vous sur: http://localhost:3010/payload-cms/login')
      console.log('')
      console.log('⚠️  IMPORTANT: Changez ce mot de passe après votre première connexion!')
    } else {
      console.error('❌ Erreur lors de la création de l\'utilisateur')
    }
  } catch (error) {
    console.error('❌ Erreur:', error)
    throw error
  } finally {
    await client.close()
    console.log('🔌 Déconnexion de MongoDB')
  }
}

createFirstUser().catch(console.error)
