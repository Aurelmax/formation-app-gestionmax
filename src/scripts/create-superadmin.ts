import { getPayloadClient } from '@/lib/getPayloadClient'
import config from '@/payload.config'

const SUPER_ADMIN_EMAIL = 'aurelien@gestionmax.fr'
const SUPER_ADMIN_PASSWORD = 'Admin123!' // Changez ce mot de passe après

async function createSuperAdmin() {
  console.log('🚀 Création du superAdmin...\n')

  try {
    const payload = await getPayloadClient()

    // Vérifier si l'utilisateur existe déjà
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: SUPER_ADMIN_EMAIL,
        },
      },
    })

    if (existingUsers.totalDocs > 0) {
      console.log('⚠️  Un utilisateur avec cet email existe déjà.')
      console.log('🔄 Mise à jour du rôle en superAdmin...\n')

      const user = existingUsers.docs[0]
      if (user?.id) {
        await payload.update({
          collection: 'users',
          id: user.id,
          data: {
            role: 'superAdmin',
            status: 'active',
            password: SUPER_ADMIN_PASSWORD,
          },
        })

        console.log('✅ Utilisateur mis à jour avec succès!')
      } else {
        console.log('❌ Erreur: utilisateur trouvé mais ID manquant')
      }
    } else {
      console.log('➕ Création d\'un nouvel utilisateur...\n')

      await payload.create({
        collection: 'users',
        data: {
          name: 'Aurélien',
          email: SUPER_ADMIN_EMAIL,
          password: SUPER_ADMIN_PASSWORD,
          role: 'superAdmin',
          status: 'active',
        },
      })

      console.log('✅ Utilisateur créé avec succès!')
    }

    console.log('\n📧 Email:', SUPER_ADMIN_EMAIL)
    console.log('🔑 Mot de passe:', SUPER_ADMIN_PASSWORD)
    console.log('👑 Rôle: superAdmin')
    console.log('🔗 Connexion:', 'http://localhost:3010/dashboard/login')
    console.log('\n⚠️  IMPORTANT: Changez ce mot de passe après votre première connexion!')

    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

createSuperAdmin()
