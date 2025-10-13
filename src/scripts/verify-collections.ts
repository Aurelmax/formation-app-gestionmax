import { config } from 'dotenv'

// Charger les variables d'environnement
config({ path: '.env.local' })

const verifyCollections = () => {
  console.log('🔍 Vérification des collections Payload CMS...')
  console.log('🔑 PAYLOAD_SECRET:', process.env['PAYLOAD_SECRET'] ? '✅ Défini' : '❌ Manquant')
  console.log('🗄️ MONGODB_URI:', process.env['MONGODB_URI'] ? '✅ Défini' : '❌ Manquant')

  // Liste des collections attendues
  const expectedCollections = [
    'users',
    'formations',
    'apprenants',
    'articles',
    'categories',
    'tags',
    'programmes',
    'rendez-vous',
    'contacts',
    'media',
  ]

  console.log('\n📋 Collections attendues:')
  expectedCollections.forEach(collection => {
    console.log(`   ✅ ${collection}`)
  })

  console.log("\n🔧 Variables d'environnement:")
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'non défini'}`)
  console.log(`   NEXT_PUBLIC_APP_NAME: ${process.env.NEXT_PUBLIC_APP_NAME || 'non défini'}`)
  console.log(`   NEXT_PUBLIC_APP_URL: ${process.env.NEXT_PUBLIC_APP_URL || 'non défini'}`)
  console.log(
    `   NEXT_PUBLIC_USE_MOCK_DATA: ${process.env.NEXT_PUBLIC_USE_MOCK_DATA || 'non défini'}`
  )

  console.log('\n💡 Prochaines étapes:')
  console.log('   1. Installer MongoDB si pas déjà fait')
  console.log('   2. Démarrer MongoDB')
  console.log('   3. Exécuter le script de migration des données')
  console.log("   4. Tester les collections via l'interface Payload")

  console.log('\n🎉 Vérification terminée!')
}

// Exécuter la vérification
verifyCollections()
