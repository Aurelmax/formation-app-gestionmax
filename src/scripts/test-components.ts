import { config } from 'dotenv'
import { ApiRouteService } from '../lib/api-route-service'

// Charger les variables d'environnement
config({ path: '.env.local' })

const testComponents = async () => {
  console.log('🧪 Test des composants avec les nouveaux services...')
  console.log('🔑 PAYLOAD_SECRET:', process.env['PAYLOAD_SECRET'] ? '✅ Défini' : '❌ Manquant')
  console.log('🗄️ MONGODB_URI:', process.env['MONGODB_URI'] ? '✅ Défini' : '❌ Manquant')
  console.log('🎭 NEXT_PUBLIC_USE_MOCK_DATA:', process.env['NEXT_PUBLIC_USE_MOCK_DATA'])

  try {
    // Test 1: Service des programmes
    console.log('\n📚 Test des programmes...')
    const programmes = await ApiRouteService.getProgrammes()
    console.log(`   ✅ ${programmes.length} programmes récupérés`)

    if (programmes.length > 0) {
      const programme = programmes[0]
      console.log(`   📋 Premier programme: ${programme?.titre ?? 'N/A'}`)
      console.log(`   💰 Prix: ${programme?.prix ?? 0}€`)
      console.log(`   📊 Statut: ${programme?.statut ?? 'N/A'}`)
    }

    // Test 2: Service des apprenants
    console.log('\n👥 Test des apprenants...')
    const apprenants = await ApiRouteService.getApprenants()
    console.log(`   ✅ ${apprenants.length} apprenants récupérés`)

    if (apprenants.length > 0) {
      const apprenant = apprenants[0]
      console.log(`   📋 Premier apprenant: ${apprenant?.nom ?? ''} ${apprenant?.prenom ?? ''}`)
      console.log(`   📧 Email: ${apprenant?.email ?? 'N/A'}`)
      console.log(`   📊 Progression: ${apprenant?.progression ?? 0}%`)
    }

    // Test 3: Service des utilisateurs
    console.log('\n👤 Test des utilisateurs...')
    const users = await ApiRouteService.getUsers()
    console.log(`   ✅ ${users.length} utilisateurs récupérés`)

    if (users.length > 0) {
      const user = users[0]
      console.log(`   📋 Premier utilisateur: ${user?.name ?? 'N/A'}`)
      console.log(`   📧 Email: ${user?.email ?? 'N/A'}`)
      console.log(`   🔑 Rôle: ${user?.role ?? 'N/A'}`)
    }

    // Test 4: Service des rendez-vous
    console.log('\n📅 Test des rendez-vous...')
    const rdvs = await ApiRouteService.getRendezVous()
    console.log(`   ✅ ${rdvs.length} rendez-vous récupérés`)

    // Test 5: Service du blog
    console.log('\n📝 Test du blog...')
    const articles = await ApiRouteService.getArticles()
    console.log(`   ✅ ${articles.length} articles récupérés`)

    const categories = await ApiRouteService.getCategories()
    console.log(`   ✅ ${categories.length} catégories récupérées`)

    const tags = await ApiRouteService.getTags()
    console.log(`   ✅ ${tags.length} tags récupérés`)

    // Test 6: Statistiques
    console.log('\n📊 Test des statistiques...')
    const stats = await ApiRouteService.getStats()
    console.log('   📊 Statistiques:')
    console.log(`     - Programmes: ${stats.programmes}`)
    console.log(`     - Apprenants: ${stats.apprenants}`)
    console.log(`     - Utilisateurs: ${stats.users}`)
    console.log(`     - Rendez-vous: ${stats.rdvs}`)
    console.log(`     - Articles: ${stats.articles}`)

    // Test 7: Vérification du mode
    console.log('\n🔄 Vérification du mode...')
    const isMockMode = process.env['NEXT_PUBLIC_USE_MOCK_DATA'] === 'true'
    console.log(`   🎭 Mode mock activé: ${isMockMode}`)

    if (isMockMode) {
      console.log('   ✅ Utilisation des données mock')
    } else {
      console.log('   ✅ Utilisation des données MongoDB réelles')
    }

    console.log('\n🎉 Tests des composants terminés!')
  } catch (error) {
    console.error('❌ Erreur lors des tests des composants:', error)
  }
}

// Exécuter les tests
testComponents()
  .then(() => {
    console.log('\n✅ Tests des composants terminés avec succès!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Erreur fatale lors des tests des composants:', error)
    process.exit(1)
  })
