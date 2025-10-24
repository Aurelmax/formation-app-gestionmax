import { getPayload } from 'payload'
import config from '../src/payload.config'

async function createAdminUser() {
  try {
    console.log('Connexion à Payload CMS...')
    const payload = await getPayload({ config })

    console.log('Vérification des utilisateurs existants...')
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 100,
    })

    console.log(`Nombre d'utilisateurs trouvés: ${existingUsers.totalDocs}`)

    // Supprimer les utilisateurs sans mot de passe
    for (const user of existingUsers.docs) {
      if (!user['password']) {
        console.log(`Suppression de l'utilisateur sans mot de passe: ${user['email']}`)
        await payload.delete({
          collection: 'users',
          id: user.id,
        })
      }
    }

    // Créer un nouvel utilisateur admin
    console.log('\nCréation du nouvel utilisateur admin...')
    await payload.create({
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

    console.log('\n✅ Utilisateur admin créé avec succès!')
    console.log('Email: admin@gestionmax.fr')
    console.log('Mot de passe: Admin123!')
    console.log('\nVous pouvez maintenant vous connecter à http://localhost:3010/payload-cms')

    process.exit(0)
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur admin:', error)
    process.exit(1)
  }
}

createAdminUser()
