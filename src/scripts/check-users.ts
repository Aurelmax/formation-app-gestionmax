import { getPayload } from 'payload'
import config from '@/payload.config'

async function checkUsers() {
  console.log('🔍 Vérification des utilisateurs...')

  try {
    const payload = await getPayload({ config })

    // Récupérer tous les utilisateurs
    const users = await payload.find({
      collection: 'users',
      limit: 10,
    })

    console.log(`\n📊 Nombre d'utilisateurs trouvés: ${users.totalDocs}`)

    if (users.totalDocs > 0) {
      console.log('\n👥 Liste des utilisateurs:')
      users.docs.forEach((user: any, index: number) => {
        console.log(`\n${index + 1}. ${user.email}`)
        console.log(`   - Rôle: ${user.role}`)
        console.log(`   - ID: ${user.id}`)
        console.log(`   - Créé le: ${user.createdAt}`)
      })

      console.log('\n✅ Des utilisateurs existent déjà.')
      console.log('➡️  Rendez-vous sur http://localhost:3010/admin pour vous connecter.')
      console.log('❓ Si vous avez oublié le mot de passe, vous devez le réinitialiser manuellement.')
    } else {
      console.log('\n❌ Aucun utilisateur trouvé.')
      console.log('➡️  Vous devez créer un premier utilisateur sur http://localhost:3010/admin/create-first-user')
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error)
    process.exit(1)
  }
}

checkUsers()
