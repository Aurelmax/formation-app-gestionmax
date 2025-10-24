import { getPayload } from 'payload'
import config from '../src/payload.config'

async function checkAndCreateFirstUser() {
  try {
    console.log('🔄 Connexion à Payload CMS...')
    const payload = await getPayload({ config })

    console.log('📋 Vérification des utilisateurs existants...\n')
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 100,
    })

    if (existingUsers.totalDocs === 0) {
      console.log('❌ Aucun utilisateur trouvé dans Payload CMS')
      console.log('\n🔧 Création du premier utilisateur admin...\n')

      const newUser = await payload.create({
        collection: 'users',
        data: {
          email: 'admin@gestionmax.fr',
          password: 'Admin123!',
          name: 'Administrateur',
          firstName: 'Admin',
          lastName: 'GestionMax',
          role: 'superAdmin',
          status: 'active',
        },
      })

      console.log('✅ Utilisateur admin créé avec succès !')
      console.log('\n📧 Identifiants de connexion:')
      console.log('   Email: admin@gestionmax.fr')
      console.log('   Mot de passe: Admin123!')
      console.log('\n🔗 Connectez-vous à:')
      console.log('   - Payload CMS: http://localhost:3010/payload-cms')
      console.log('   - Interface admin: http://localhost:3010/admin')
    } else {
      console.log(`✅ ${existingUsers.totalDocs} utilisateur(s) trouvé(s):\n`)
      existingUsers.docs.forEach((user: any) => {
        console.log(`  📧 ${user.email}`)
        console.log(`     Nom: ${user.name || 'N/A'}`)
        console.log(`     Rôle: ${user.role || 'N/A'}`)
        console.log(`     Statut: ${user.status || 'N/A'}`)
        console.log(`     ID: ${user.id}`)
        console.log('')
      })

      console.log('\n💡 Pour vous connecter, utilisez un des emails ci-dessus.')
      console.log('   Si vous avez oublié le mot de passe, utilisez la fonction')
      console.log('   "Mot de passe oublié" sur la page de connexion.')
    }

    process.exit(0)
  } catch (error: any) {
    console.error('❌ Erreur:', error.message)
    if (error.stack) {
      console.error('\nStack trace:', error.stack)
    }
    process.exit(1)
  }
}

checkAndCreateFirstUser()
