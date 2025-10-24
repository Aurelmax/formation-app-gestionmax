import { getPayload } from 'payload'
import config from '../src/payload.config'

async function resetAdminPassword() {
  try {
    console.log('🔄 Connexion à Payload CMS...')
    const payload = await getPayload({ config })

    console.log('🔍 Recherche de l\'utilisateur admin...')

    // Chercher l'utilisateur admin
    const adminUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'admin@gestionmax.fr',
        },
      },
    })

    if (adminUsers.docs.length === 0) {
      console.log('❌ Utilisateur admin@gestionmax.fr non trouvé')
      console.log('🔧 Création d\'un nouveau compte admin...\n')

      const _newAdmin = await payload.create({
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

      console.log('✅ Compte admin créé avec succès !')
      console.log('\n📧 Nouveaux identifiants:')
      console.log('   Email: admin@gestionmax.fr')
      console.log('   Mot de passe: Admin123!')
      console.log('\n🔗 Connectez-vous sur: http://localhost:3010/payload-cms')
    } else {
      console.log('✅ Utilisateur trouvé:', adminUsers.docs[0]['email'])
      console.log('🔄 Réinitialisation du mot de passe...\n')

      const adminId = adminUsers.docs[0]?.id

      await payload.update({
        collection: 'users',
        id: adminId,
        data: {
          password: 'Admin123!',
        },
      })

      console.log('✅ Mot de passe réinitialisé avec succès !')
      console.log('\n📧 Identifiants mis à jour:')
      console.log('   Email: admin@gestionmax.fr')
      console.log('   Mot de passe: Admin123!')
      console.log('\n🔗 Connectez-vous sur: http://localhost:3010/payload-cms')
    }

    process.exit(0)
  } catch (error: any) {
    console.error('❌ Erreur:', error.message)
    if (error.data) {
      console.error('Détails:', JSON.stringify(error.data, null, 2))
    }
    process.exit(1)
  }
}

resetAdminPassword()
