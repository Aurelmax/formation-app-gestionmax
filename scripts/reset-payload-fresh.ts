import { MongoClient } from 'mongodb'

async function resetPayloadFresh() {
  const uri = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/formation-app-gestionmax'
  const client = new MongoClient(uri)

  try {
    console.log('🔄 Connexion à MongoDB...')
    await client.connect()
    const db = client.db()

    console.log('🗑️  Suppression de TOUS les utilisateurs pour réinitialiser Payload...')

    // Supprimer TOUS les documents de la collection users
    const result = await db.collection('users').deleteMany({})

    console.log(`✅ ${result.deletedCount} utilisateur(s) supprimé(s)`)
    console.log('\n✨ Payload est maintenant dans un état FRAIS (fresh)')
    console.log('\n📋 Prochaine étape:')
    console.log('   1. Redémarrez le serveur (Ctrl+C puis npm run dev)')
    console.log('   2. Allez sur: http://localhost:3010/payload-cms')
    console.log('   3. Vous verrez le formulaire "Create First User"')
    console.log('   4. Créez votre premier utilisateur admin !')
    console.log('\n💡 Le formulaire vous demandera:')
    console.log('   - Email')
    console.log('   - Password')
    console.log('   - Confirm Password')

  } catch (error: any) {
    console.error('❌ Erreur:', error.message)
  } finally {
    await client.close()
  }
}

resetPayloadFresh()
