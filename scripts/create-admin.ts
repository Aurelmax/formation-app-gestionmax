import { getPayload } from 'payload'
import config from '../src/payload.config'

async function createAdmin() {
  try {
    console.log('🔄 Initialisation de Payload...')
    const payload = await getPayload({ config })

    console.log('📋 Vérification des utilisateurs existants...')
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 10,
    })

    console.log(`✅ ${existingUsers.totalDocs} utilisateur(s) trouvé(s)`)

    if (existingUsers.totalDocs > 0) {
      console.log('\n📋 Utilisateurs existants:')
      existingUsers.docs.forEach((user: any) => {
        console.log(`  - ${user.email} (${user.role || 'apprenant'})`)
      })
    }

    // Demander confirmation avant de créer
    console.log('\n🔧 Création d\'un nouvel utilisateur admin...')

    const email = 'admin@gestionmax.fr'
    const password = 'Admin123!'

    // Vérifier si l'utilisateur existe déjà
    const existing = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (existing.totalDocs > 0) {
      console.log(`⚠️  L'utilisateur ${email} existe déjà`)
      console.log('💡 Utilisez cet email et mot de passe pour vous connecter:')
      console.log(`   Email: ${email}`)
      console.log(`   Mot de passe: ${password}`)
      process.exit(0)
    }

    // Créer le nouvel utilisateur admin
    const _newUser = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        name: 'Administrateur',
        firstName: 'Admin',
        lastName: 'GestionMax',
        role: 'superAdmin',
        status: 'active',
      },
    })

    console.log('\n✅ Utilisateur admin créé avec succès !')
    console.log('\n📧 Identifiants de connexion:')
    console.log(`   Email: ${email}`)
    console.log(`   Mot de passe: ${password}`)
    console.log('\n🔗 Connectez-vous à:')
    console.log('   - Interface admin personnalisée: http://localhost:3010/admin')
    console.log('   - Payload CMS: http://localhost:3010/payload-cms')
    console.log('\n⚠️  Pensez à changer le mot de passe après la première connexion !')

    process.exit(0)
  } catch (error: any) {
    console.error('❌ Erreur lors de la création de l\'utilisateur:', error)
    console.error('Détails:', error.message)
    if (error.data) {
      console.error('Données:', JSON.stringify(error.data, null, 2))
    }
    process.exit(1)
  }
}

createAdmin()
