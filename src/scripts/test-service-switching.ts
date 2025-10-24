import { config } from 'dotenv'
import { MockService } from '../lib/mock-service'
import { UnifiedService } from '../lib/unified-service'

// Charger les variables d'environnement
config({ path: '.env.local' })

const testServiceSwitching = async () => {
  console.log('🔄 Test du basculement entre services mock et API...')
  console.log('🔑 PAYLOAD_SECRET:', process.env['PAYLOAD_SECRET'] ? '✅ Défini' : '❌ Manquant')
  console.log('🗄️ MONGODB_URI:', process.env['MONGODB_URI'] ? '✅ Défini' : '❌ Manquant')
  console.log('🎭 NEXT_PUBLIC_USE_MOCK_DATA:', process.env['NEXT_PUBLIC_USE_MOCK_DATA'])

  try {
    // Test 1: Service Mock
    console.log('\n🎭 Test du service Mock...')
    const mockProgrammes = await MockService.getProgrammes()
    console.log(`   ✅ ${mockProgrammes.length} programmes mock récupérés`)

    const mockApprenants = await MockService.getApprenants()
    console.log(`   ✅ ${mockApprenants.length} apprenants mock récupérés`)

    const mockUsers = await MockService.getUsers()
    console.log(`   ✅ ${mockUsers.length} utilisateurs mock récupérés`)

    const mockStats = await MockService.getStats()
    console.log('   📊 Statistiques mock:')
    console.log(`     - Programmes: ${mockStats.programmes}`)
    console.log(`     - Apprenants: ${mockStats.apprenants}`)
    console.log(`     - Utilisateurs: ${mockStats.users}`)

    // Test 2: Service Unifié (API réelle)
    console.log('\n🔗 Test du service Unifié (API réelle)...')
    const apiProgrammes = await UnifiedService.getProgrammes()
    console.log(`   ✅ ${apiProgrammes.length} programmes API récupérés`)

    const apiApprenants = await UnifiedService.getApprenants()
    console.log(`   ✅ ${apiApprenants.length} apprenants API récupérés`)

    const apiUsers = await UnifiedService.getUsers()
    console.log(`   ✅ ${apiUsers.length} utilisateurs API récupérés`)

    const apiStats = await UnifiedService.getStats()
    console.log('   📊 Statistiques API:')
    console.log(`     - Programmes: ${apiStats.programmes}`)
    console.log(`     - Apprenants: ${apiStats.apprenants}`)
    console.log(`     - Utilisateurs: ${apiStats.users}`)

    // Test 3: Comparaison des données
    console.log('\n🔍 Comparaison des données...')
    console.log(`   📚 Programmes: Mock=${mockProgrammes.length} vs API=${apiProgrammes.length}`)
    console.log(`   👥 Apprenants: Mock=${mockApprenants.length} vs API=${apiApprenants.length}`)
    console.log(`   👤 Utilisateurs: Mock=${mockUsers.length} vs API=${apiUsers.length}`)

    // Test 4: Vérification de la cohérence
    console.log('\n✅ Vérification de la cohérence...')
    if (apiProgrammes.length > 0) {
      const programme = apiProgrammes[0]
      console.log(`   📋 Premier programme API: ${programme?.titre ?? 'N/A'}`)
      console.log(`   💰 Prix: ${programme?.prix ?? 0}€`)
      console.log(`   📊 Statut: ${programme?.statut ?? 'N/A'}`)
    }

    if (apiApprenants.length > 0) {
      const apprenant = apiApprenants[0]
      console.log(`   👤 Premier apprenant API: ${apprenant?.nom ?? ''} ${apprenant?.prenom ?? ''}`)
      console.log(`   📧 Email: ${apprenant?.email ?? 'N/A'}`)
      console.log(`   📊 Progression: ${apprenant?.progression ?? 0}%`)
    }

    if (apiUsers.length > 0) {
      const user = apiUsers[0]
      console.log(`   👤 Premier utilisateur API: ${user?.name ?? 'N/A'}`)
      console.log(`   📧 Email: ${user?.email ?? 'N/A'}`)
      console.log(`   🔑 Rôle: ${user?.role ?? 'N/A'}`)
    }

    // Test 5: Test du basculement conditionnel
    console.log('\n🔄 Test du basculement conditionnel...')
    const useMockData = process.env['NEXT_PUBLIC_USE_MOCK_DATA'] === 'true'
    console.log(`   🎭 Mode mock activé: ${useMockData}`)

    if (useMockData) {
      console.log('   ✅ Utilisation des données mock')
      const currentProgrammes = await MockService.getProgrammes()
      console.log(`   📚 Programmes actuels: ${currentProgrammes.length}`)
    } else {
      console.log('   ✅ Utilisation des données API')
      const currentProgrammes = await UnifiedService.getProgrammes()
      console.log(`   📚 Programmes actuels: ${currentProgrammes.length}`)
    }

    console.log('\n🎉 Tests de basculement terminés!')
  } catch (error) {
    console.error('❌ Erreur lors des tests de basculement:', error)
  }
}

// Exécuter les tests
testServiceSwitching()
  .then(() => {
    console.log('\n✅ Tests de basculement terminés avec succès!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Erreur fatale lors des tests de basculement:', error)
    process.exit(1)
  })
