import { getPayload } from 'payload'
import config from '../src/payload.config'

async function createAdminUser() {
  try {
    console.log('🔌 Connexion à Payload CMS...')
    const payload = await getPayload({ config })

    console.log('🗑️  Suppression des utilisateurs existants...')
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 100,
    })

    for (const user of existingUsers.docs) {
      console.log(`  - Suppression: ${user.email}`)
      await payload.delete({
        collection: 'users',
        id: user.id,
      })
    }

    console.log('\n👤 Création du nouvel utilisateur admin...')

    // Utiliser l'API locale de Payload qui gère automatiquement le hashing
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@gestionmax.fr',
        password: 'AdminGestionMax2025!',
        name: 'Administrateur',
        firstName: 'Admin',
        lastName: 'GestionMax',
        role: 'superAdmin',
        status: 'active',
      },
    })

    console.log('\n✅ Utilisateur admin créé avec succès!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email: admin@gestionmax.fr')
    console.log('🔑 Mot de passe: AdminGestionMax2025!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n🌐 Connectez-vous sur: http://localhost:3010/payload-cms')

    // Vérification que le password a bien été hashé
    const verifyUser = await payload.findByID({
      collection: 'users',
      id: adminUser.id,
    })

    console.log('\n🔍 Vérification:')
    console.log(`  - ID: ${verifyUser.id}`)
    console.log(`  - Email: ${verifyUser.email}`)
    console.log(`  - Role: ${verifyUser.role}`)
    console.log(`  - Password hashé: ${verifyUser.password ? 'OUI ✓' : 'NON ✗'}`)

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Erreur lors de la création de l\'utilisateur admin:')
    console.error(error)
    process.exit(1)
  }
}

createAdminUser()
