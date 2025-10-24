import { getPayload } from 'payload'
import config from '@/payload.config'

const DEFAULT_EMAIL = 'admin@gestionmax.fr'
const DEFAULT_PASSWORD = 'Admin123!' // Mot de passe par défaut sécurisé

async function unlockAdmin() {
  console.log('🔓 Déverrouillage de l\'utilisateur admin...\n')

  try {
    const payload = await getPayload({ config })

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
      process.exit(1)
    }

    const adminUser = users.docs[0]
    if (!adminUser) {
      throw new Error('Utilisateur introuvable')
    }

    console.log('👤 Utilisateur trouvé:', adminUser['email'])
    console.log('🆔 ID:', adminUser.id)

    // Déverrouiller et réinitialiser le mot de passe
    await payload.update({
      collection: 'users',
      id: adminUser.id,
      data: {
        password: DEFAULT_PASSWORD,
        lockUntil: null, // Déverrouiller
        loginAttempts: 0, // Réinitialiser les tentatives
      },
    })

    console.log('\n✅ Utilisateur déverrouillé et mot de passe réinitialisé!')
    console.log('\n📧 Email:', DEFAULT_EMAIL)
    console.log('🔑 Nouveau mot de passe:', DEFAULT_PASSWORD)
    console.log('🔗 Connexion:', 'http://localhost:3010/admin/login')
    console.log('\n⚠️  IMPORTANT: Changez ce mot de passe après votre première connexion!')

    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur lors du déverrouillage:', error)
    process.exit(1)
  }
}

unlockAdmin()
