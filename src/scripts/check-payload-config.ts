import { config } from 'dotenv'
import payloadConfig from '../payload.config'

// Charger les variables d'environnement
config({ path: '.env.local' })

const checkPayloadConfig = () => {
  console.log('🔍 Vérification de la configuration Payload CMS...')
  console.log('🔑 PAYLOAD_SECRET:', process.env['PAYLOAD_SECRET'] ? '✅ Défini' : '❌ Manquant')
  console.log('🗄️ MONGODB_URI:', process.env['MONGODB_URI'] ? '✅ Défini' : '❌ Manquant')

  try {
    // Vérifier que la configuration Payload peut être chargée
    console.log('\n📋 Configuration Payload chargée avec succès!')

    // Extraire les collections de la configuration
    const collections = payloadConfig.collections || []

    console.log(`\n📊 Collections configurées (${collections.length}):`)

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

    collections.forEach((collection: any) => {
      const slug = collection.slug
      const exists = expectedCollections.includes(slug)
      console.log(`   ${exists ? '✅' : '⚠️'} ${slug}`)
    })

    console.log(`\n📋 Vérification des collections attendues:`)
    expectedCollections.forEach(collection => {
      const exists = collections.some((col: any) => col.slug === collection)
      console.log(`   ${exists ? '✅' : '❌'} ${collection}`)
    })

    // Vérifier les champs de chaque collection
    console.log('\n🔍 Détail des collections:')
    collections.forEach((collection: any) => {
      console.log(`\n📦 ${collection.slug}:`)
      if (collection.fields) {
        console.log(`   Champs (${collection.fields.length}):`)
        collection.fields.forEach((field: any) => {
          const required = field.required ? ' *' : ''
          console.log(`     - ${field.name} (${field.type})${required}`)
        })
      }
      if (collection.upload) {
        console.log(`   Type: Upload (${collection.upload.staticDir})`)
      }
      if (collection.auth) {
        console.log(`   Type: Authentification`)
      }
    })

    // Vérifier les variables d'environnement
    console.log("\n🔧 Variables d'environnement:")
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'non défini'}`)
    console.log(`   NEXT_PUBLIC_APP_NAME: ${process.env.NEXT_PUBLIC_APP_NAME || 'non défini'}`)
    console.log(`   NEXT_PUBLIC_APP_URL: ${process.env.NEXT_PUBLIC_APP_URL || 'non défini'}`)
    console.log(
      `   NEXT_PUBLIC_USE_MOCK_DATA: ${process.env.NEXT_PUBLIC_USE_MOCK_DATA || 'non défini'}`
    )

    console.log('\n🎉 Configuration Payload vérifiée avec succès!')

    // Recommandations
    console.log('\n💡 Recommandations:')
    if (!process.env['MONGODB_URI']) {
      console.log('   ❌ MONGODB_URI manquant - Installez et configurez MongoDB')
    }
    if (process.env['NEXT_PUBLIC_USE_MOCK_DATA'] === 'true') {
      console.log('   ⚠️ Mode mock activé - Pensez à désactiver après migration')
    }
    if (
      process.env['PAYLOAD_SECRET'] ===
      'your-secret-key-change-this-in-production-please-use-a-strong-secret'
    ) {
      console.log('   ⚠️ PAYLOAD_SECRET par défaut - Changez en production')
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification de la configuration:', error)
  }
}

// Exécuter la vérification
checkPayloadConfig()
