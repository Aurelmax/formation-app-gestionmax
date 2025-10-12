import { config } from 'dotenv'
import { getPayload } from 'payload'
import payloadConfig from '../payload.config'

// Charger les variables d'environnement
config({ path: '.env.local' })

// Vérifier que PAYLOAD_SECRET est défini
if (!process.env['PAYLOAD_SECRET']) {
  console.error('❌ PAYLOAD_SECRET n\'est pas défini dans .env.local')
  process.exit(1)
}

const seed = async () => {
  console.log('🔑 PAYLOAD_SECRET:', process.env['PAYLOAD_SECRET'] ? '✅ Défini' : '❌ Manquant')
  console.log('🗄️ MONGODB_URI:', process.env['MONGODB_URI'] ? '✅ Défini' : '❌ Manquant')
  
  const payload = await getPayload({ config: payloadConfig })

  try {
    // Créer un utilisateur admin
    const adminUser = await payload.create({
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

    // Créer des programmes de formation
    const programmes = [
      {
        codeFormation: 'WP-DEB-001',
        titre: 'Formation WordPress Débutant',
        description: 'Apprenez les bases de WordPress pour créer et gérer votre site web professionnel.',
        duree: 21,
        niveau: 'DEBUTANT',
        modalites: 'HYBRIDE',
        prix: 1200,
        competences: [
          { competence: 'Installation WordPress' },
          { competence: 'Gestion des contenus' },
          { competence: 'Personnalisation des thèmes' },
          { competence: 'Plugins essentiels' },
        ],
        statut: 'actif',
        eligibleCPF: true,
        codeCPF: 'RS5168',
      },
      {
        codeFormation: 'SEO-AV-002',
        titre: 'Formation SEO Avancé',
        description: 'Maîtrisez les techniques avancées de référencement naturel pour optimiser vos sites web.',
        duree: 14,
        niveau: 'AVANCE',
        modalites: 'DISTANCIEL',
        prix: 1800,
        competences: [
          { competence: 'Audit SEO technique' },
          { competence: 'Optimisation contenu' },
          { competence: 'Link building' },
          { competence: 'Analytics avancé' },
        ],
        statut: 'actif',
        eligibleCPF: true,
        codeCPF: 'RS5169',
      },
      {
        codeFormation: 'MD-DEB-003',
        titre: 'Formation Marketing Digital',
        description: 'Découvrez les stratégies de marketing digital pour développer votre activité en ligne.',
        duree: 28,
        niveau: 'INTERMEDIAIRE',
        modalites: 'PRESENTIEL',
        prix: 1500,
        competences: [
          { competence: 'Stratégie digitale' },
          { competence: 'Réseaux sociaux' },
          { competence: 'Email marketing' },
          { competence: 'Publicité en ligne' },
        ],
        statut: 'actif',
        eligibleCPF: true,
        codeCPF: 'RS5170',
      },
    ]

    console.log('📚 Création des programmes de formation...')
    for (const programmeData of programmes) {
      try {
        await payload.create({
          collection: 'programmes',
          data: programmeData,
        })
        console.log(`✅ Programme créé: ${programmeData.titre}`)
      } catch (error) {
        console.log(`⚠️ Programme déjà existant: ${programmeData.titre}`)
      }
    }

    console.log('🎉 Seed terminé avec succès!')
    console.log('📊 Données créées:')
    console.log('   - 1 utilisateur admin')
    console.log('   - 3 programmes de formation')
    console.log('   - Collections: users, programmes, rendez-vous, articles, categories, tags, media')

  } catch (error) {
    console.error('❌ Erreur lors du seed:', error)
  }
}

seed()
