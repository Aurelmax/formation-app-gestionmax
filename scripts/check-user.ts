#!/usr/bin/env tsx
import { MongoClient } from 'mongodb'

async function checkUser() {
  const uri = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/formation-app-gestionmax'
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()
    const users = await db.collection('users').find({}).toArray()

    console.log('📋 Utilisateurs dans la base de données:')
    console.log(JSON.stringify(users, null, 2))
  } finally {
    await client.close()
  }
}

checkUser().catch(console.error)
