import { getPayloadClient } from '@/payload'

async function initPayload() {
  try {
    console.log('🚀 Initialisation de Payload CMS...')
    
    const payload = await getPayloadClient()
    
    console.log('✅ Payload initialisé avec succès')
    console.log('📋 Collections disponibles:', Object.keys(payload.collections))
    
    // Vérifier si la collection rendez-vous existe
    if (payload.collections['rendez-vous']) {
      console.log('✅ Collection rendez-vous trouvée')
      
      // Lister les programmes disponibles
      const programmes = await payload.find({
        collection: 'programmes',
        limit: 10,
      })
      
      console.log('📚 Programmes disponibles:', programmes.docs.length)
      programmes.docs.forEach((prog: any) => {
        console.log(`  - ${prog.id}: ${prog.titre}`)
      })
      
    } else {
      console.log('❌ Collection rendez-vous non trouvée')
      console.log('📋 Collections disponibles:', Object.keys(payload.collections))
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de Payload:', error)
  }
}

initPayload()
