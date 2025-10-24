import { getPayload } from 'payload'
import config from '../src/payload.config'

async function createSimpleUser() {
  try {
    console.log('🔄 Connexion à Payload CMS...')
    const payload = await getPayload({ config })

    // Supprimer tous les utilisateurs existants
    console.log('🗑️  Suppression de tous les utilisateurs existants...')
    const allUsers = await payload.find({
      collection: 'users',
      limit: 1000,
    })

    for (const user of allUsers.docs) {
      await payload.delete({
        collection: 'users',
        id: user.id,
      })
    }

    console.log(`✅ ${allUsers.docs.length} utilisateur(s) supprimé(s)`)

    // Créer un nouvel utilisateur simple
    console.log('\n🔧 Création d\'un nouvel utilisateur...')

    const _newUser = await payload.create({
      collection: 'users',
      data: {
        email: 'test@test.com',
        password: 'test123',
        name: 'Test User',
        role: 'superAdmin',
        status: 'active',
      },
    })

    console.log('\n✅ Utilisateur créé avec succès !')
    console.log('\n📧 IDENTIFIANTS DE CONNEXION:')
    console.log('   ╔════════════════════════════════╗')
    console.log('   ║  Email: test@test.com          ║')
    console.log('   ║  Mot de passe: test123         ║')
    console.log('   ╚════════════════════════════════╝')
    console.log('\n🔗 URL de connexion:')
    console.log('   http://localhost:3010/payload-cms/login')
    console.log('\n⚠️  IMPORTANT: Utilisez EXACTEMENT ces identifiants')

    process.exit(0)
  } catch (error: any) {
    console.error('❌ Erreur:', error.message)
    if (error.data) {
      console.error('Détails:', JSON.stringify(error.data, null, 2))
    }
    process.exit(1)
  }
}

createSimpleUser()
