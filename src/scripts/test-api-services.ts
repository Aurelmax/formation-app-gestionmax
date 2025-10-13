import { config } from 'dotenv'
import { ProgrammeService } from '../lib/programme-service'
import { ApprenantService } from '../lib/apprenant-service'
import { UserApiService } from '../lib/user-api-service'
import { RendezVousApiService } from '../lib/rendez-vous-api-service'
import { BlogApiService } from '../lib/blog-api-service'
import { ApiService } from '../lib/api-service'

// Charger les variables d'environnement
config({ path: '.env.local' })

const testApiServices = async () => {
  console.log('🧪 Test des services API Payload...')
  console.log('🔑 PAYLOAD_SECRET:', process.env['PAYLOAD_SECRET'] ? '✅ Défini' : '❌ Manquant')
  console.log('🗄️ MONGODB_URI:', process.env['MONGODB_URI'] ? '✅ Défini' : '❌ Manquant')

  try {
    // Test 1: Service des programmes
    console.log('\n📚 Test ProgrammeService...')
    try {
      const programmes = await ProgrammeService.getProgrammes()
      console.log(`   ✅ ${programmes.length} programmes récupérés`)

      if (programmes.length > 0) {
        const programme = programmes[0]
        console.log(`   📋 Premier programme: ${programme.titre}`)

        // Test de récupération par ID
        const programmeById = await ProgrammeService.getProgramme(programme.id)
        if (programmeById) {
          console.log(`   ✅ Programme récupéré par ID: ${programmeById.titre}`)
        }
      }
    } catch (error) {
      console.log(`   ❌ Erreur ProgrammeService: ${error}`)
    }

    // Test 2: Service des apprenants
    console.log('\n👥 Test ApprenantService...')
    try {
      const apprenants = await ApprenantService.getApprenants()
      console.log(`   ✅ ${apprenants.length} apprenants récupérés`)

      if (apprenants.length > 0) {
        const apprenant = apprenants[0]
        console.log(`   📋 Premier apprenant: ${apprenant.nom} ${apprenant.prenom}`)
      }
    } catch (error) {
      console.log(`   ❌ Erreur ApprenantService: ${error}`)
    }

    // Test 3: Service des utilisateurs
    console.log('\n👤 Test UserApiService...')
    try {
      const users = await UserApiService.getUsers()
      console.log(`   ✅ ${users.length} utilisateurs récupérés`)

      if (users.length > 0) {
        const user = users[0]
        console.log(`   📋 Premier utilisateur: ${user.name} (${user.role})`)
      }
    } catch (error) {
      console.log(`   ❌ Erreur UserApiService: ${error}`)
    }

    // Test 4: Service des rendez-vous
    console.log('\n📅 Test RendezVousApiService...')
    try {
      const rdvs = await RendezVousApiService.getRendezVous()
      console.log(`   ✅ ${rdvs.length} rendez-vous récupérés`)

      if (rdvs.length > 0) {
        const rdv = rdvs[0]
        console.log(`   📋 Premier RDV: ${rdv.client.nom} ${rdv.client.prenom}`)
      }
    } catch (error) {
      console.log(`   ❌ Erreur RendezVousApiService: ${error}`)
    }

    // Test 5: Service du blog
    console.log('\n📝 Test BlogApiService...')
    try {
      const articles = await BlogApiService.getPublishedArticles()
      console.log(`   ✅ ${articles.length} articles publiés récupérés`)

      const categories = await BlogApiService.getCategories()
      console.log(`   ✅ ${categories.length} catégories récupérées`)

      const tags = await BlogApiService.getTags()
      console.log(`   ✅ ${tags.length} tags récupérés`)
    } catch (error) {
      console.log(`   ❌ Erreur BlogApiService: ${error}`)
    }

    // Test 6: Service unifié
    console.log('\n🔗 Test ApiService (service unifié)...')
    try {
      const stats = await ApiService.getStats()
      console.log('   📊 Statistiques:')
      console.log(`     - Programmes: ${stats.programmes}`)
      console.log(`     - Apprenants: ${stats.apprenants}`)
      console.log(`     - Rendez-vous: ${stats.rendezVous}`)
      console.log(`     - Articles: ${stats.articles}`)
      console.log(`     - Utilisateurs: ${stats.utilisateurs}`)

      const currentUser = await ApiService.getCurrentUser()
      console.log(`   👤 Utilisateur actuel: ${currentUser.name} (${currentUser.role})`)
    } catch (error) {
      console.log(`   ❌ Erreur ApiService: ${error}`)
    }

    // Test 7: Statistiques détaillées
    console.log('\n📈 Test des statistiques détaillées...')
    try {
      const programmeStats = await ProgrammeService.getProgrammeStats()
      console.log('   📚 Statistiques programmes:')
      console.log(`     - Total: ${programmeStats.total}`)
      console.log(`     - Actifs: ${programmeStats.actifs}`)
      console.log(`     - Inactifs: ${programmeStats.inactifs}`)

      const apprenantStats = await ApprenantService.getApprenantStats()
      console.log('   👥 Statistiques apprenants:')
      console.log(`     - Total: ${apprenantStats.total}`)
      console.log(`     - Actifs: ${apprenantStats.actifs}`)
      console.log(`     - Progression moyenne: ${apprenantStats.progressionMoyenne}%`)

      const rdvStats = await RendezVousApiService.getRendezVousStats()
      console.log('   📅 Statistiques rendez-vous:')
      console.log(`     - Total: ${rdvStats.total}`)
      console.log(`     - Confirmés: ${rdvStats.confirmes}`)
      console.log(`     - Aujourd'hui: ${rdvStats.aujourdhui}`)

      const blogStats = await BlogApiService.getBlogStats()
      console.log('   📝 Statistiques blog:')
      console.log(`     - Total articles: ${blogStats.total}`)
      console.log(`     - Publiés: ${blogStats.publies}`)
      console.log(`     - Vues totales: ${blogStats.vuesTotal}`)
    } catch (error) {
      console.log(`   ❌ Erreur statistiques: ${error}`)
    }

    console.log('\n🎉 Tests terminés!')
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error)
  }
}

// Exécuter les tests
testApiServices()
  .then(() => {
    console.log('\n✅ Tests terminés avec succès!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Erreur fatale lors des tests:', error)
    process.exit(1)
  })
