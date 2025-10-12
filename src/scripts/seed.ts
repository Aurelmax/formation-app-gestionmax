import { config } from 'dotenv'
import { getPayload } from 'payload'
import payloadConfig from '../payload.config'

// Charger les variables d'environnement
config({ path: '.env.local' })

// Vérifier que PAYLOAD_SECRET est défini
if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET n\'est pas défini dans .env.local')
  process.exit(1)
}

const seed = async () => {
  console.log('🔑 PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET ? '✅ Défini' : '❌ Manquant')
  console.log('🗄️ MONGODB_URI:', process.env.MONGODB_URI ? '✅ Défini' : '❌ Manquant')
  
  const payload = await getPayload({ config: payloadConfig })

  try {
    // Créer un utilisateur admin
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@gestionmax.fr',
        password: 'admin123',
        name: 'Administrateur GestionMax',
        role: 'admin',
      },
    })

    console.log('✅ Utilisateur admin créé avec succès!')
    console.log('📧 Email: admin@gestionmax.fr')
    console.log('🔑 Mot de passe: admin123')
    console.log('🌐 Accès: http://localhost:3000/admin')
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur:', error)
  }
}

seed()
