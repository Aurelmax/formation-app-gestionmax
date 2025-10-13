import { config } from 'dotenv'
import { UnifiedService } from '../lib/unified-service'

// Charger les variables d'environnement
config({ path: '.env.local' })

const testUnifiedService = async () => {
  console.log('🧪 Test du service unifié...')
  console.log('🔑 PAYLOAD_SECRET:', process.env['PAYLOAD_SECRET'] ? '✅ Défini' : '❌ Manquant')
  console.log('🗄️ MONGODB_URI:', process.env['MONGODB_URI'] ? '✅ Défini' : '❌ Manquant')
  
  try {
    // Test 1: Programmes
    console.log('\n📚 Test des programmes...')
    const programmes = await UnifiedService.getProgrammes()
    console.log(`   ✅ ${programmes.length} programmes récupérés`)
    
    if (programmes.length > 0) {
      const programme = programmes[0]
      console.log(`   📋 Premier programme: ${programme.titre}`)
      console.log(`   💰 Prix: ${programme.prix}€`)
      console.log(`   📊 Statut: ${programme.statut}`)
    }

    // Test 2: Apprenants
    console.log('\n👥 Test des apprenants...')
    const apprenants = await UnifiedService.getApprenants()
    console.log(`   ✅ ${apprenants.length} apprenants récupérés`)
    
    if (apprenants.length > 0) {
      const apprenant = apprenants[0]
      console.log(`   📋 Premier apprenant: ${apprenant.nom} ${apprenant.prenom}`)
      console.log(`   📧 Email: ${apprenant.email}`)
      console.log(`   📊 Progression: ${apprenant.progression}%`)
    }

    // Test 3: Utilisateurs
    console.log('\n👤 Test des utilisateurs...')
    const users = await UnifiedService.getUsers()
    console.log(`   ✅ ${users.length} utilisateurs récupérés`)
    
    if (users.length > 0) {
      const user = users[0]
      console.log(`   📋 Premier utilisateur: ${user.name}`)
      console.log(`   📧 Email: ${user.email}`)
      console.log(`   🔑 Rôle: ${user.role}`)
    }

    // Test 4: Utilisateur actuel
    console.log('\n👤 Test de l\'utilisateur actuel...')
    const currentUser = await UnifiedService.getCurrentUser()
    console.log(`   ✅ Utilisateur actuel: ${currentUser.name} (${currentUser.role})`)

    // Test 5: Rendez-vous
    console.log('\n📅 Test des rendez-vous...')
    const rdvs = await UnifiedService.getRendezVous()
    console.log(`   ✅ ${rdvs.length} rendez-vous récupérés`)

    // Test 6: Articles
    console.log('\n📝 Test des articles...')
    const articles = await UnifiedService.getArticles()
    console.log(`   ✅ ${articles.length} articles récupérés`)

    // Test 7: Statistiques
    console.log('\n📊 Test des statistiques...')
    const stats = await UnifiedService.getStats()
    console.log('   📊 Statistiques:')
    console.log(`     - Programmes: ${stats.programmes}`)
    console.log(`     - Apprenants: ${stats.apprenants}`)
    console.log(`     - Utilisateurs: ${stats.users}`)
    console.log(`     - Rendez-vous: ${stats.rdvs}`)
    console.log(`     - Articles: ${stats.articles}`)

    console.log('\n🎉 Tests terminés avec succès!')
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error)
  }
}

// Exécuter les tests
testUnifiedService()
  .then(() => {
    console.log('\n✅ Tests terminés avec succès!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale lors des tests:', error)
    process.exit(1)
  })
