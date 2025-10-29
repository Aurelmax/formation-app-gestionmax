import { getPayloadClient } from '@/lib/getPayloadClient'
import config from '@/payload.config'

const DEFAULT_EMAIL = 'admin@gestionmax.fr'
const DEFAULT_PASSWORD = 'Admin123!' // Mot de passe par défaut sécurisé

async function resetAdminPassword() {
  console.log('🔐 Réinitialisation du mot de passe administrateur...\n')

  try {
    const payload = await getPayloadClient()

    // Chercher l'utilisateur admin
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: DEFAULT_EMAIL,
        },
      },
    })

    if (users.totalDocs === 0) {
      console.log('❌ Aucun utilisateur trouvé avec l\'email:', DEFAULT_EMAIL)
      console.log('➡️  Création d\'un nouvel utilisateur admin...\n')

      // Créer un nouvel utilisateur admin
      await payload.create({
        collection: 'users',
        data: {
          name: 'Super Admin',
          email: DEFAULT_EMAIL,
          password: DEFAULT_PASSWORD,
          role: 'superAdmin',
          status: 'active',
        },
      })

      console.log('✅ Utilisateur admin créé avec succès!')
      console.log('\n📧 Email:', DEFAULT_EMAIL)
      console.log('🔑 Mot de passe:', DEFAULT_PASSWORD)
      console.log('🔗 Connexion:', 'http://localhost:3010/admin/login')
      console.log('\n⚠️  IMPORTANT: Changez ce mot de passe après votre première connexion!')
    } else {
      const adminUser = users.docs[0]
      if (!adminUser) {
        throw new Error('Utilisateur introuvable')
      }

      console.log('👤 Utilisateur trouvé:', adminUser['email'])
      console.log('🆔 ID:', adminUser.id)

      // Mettre à jour le mot de passe
      await payload.update({
        collection: 'users',
        id: adminUser.id,
        data: {
          password: DEFAULT_PASSWORD,
        },
      })

      console.log('\n✅ Mot de passe réinitialisé avec succès!')
      console.log('\n📧 Email:', DEFAULT_EMAIL)
      console.log('🔑 Nouveau mot de passe:', DEFAULT_PASSWORD)
      console.log('🔗 Connexion:', 'http://localhost:3010/admin/login')
      console.log('\n⚠️  IMPORTANT: Changez ce mot de passe après votre première connexion!')
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error)
    process.exit(1)
  }
}

resetAdminPassword()
