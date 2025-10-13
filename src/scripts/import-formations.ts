import { config } from 'dotenv'
import { getPayload } from 'payload'
import payloadConfig from '../payload.config'
import { MOCK_PROGRAMMES } from '../data/mock-data'

// Charger les variables d'environnement
config({ path: '.env.local' })

const importFormations = async () => {
  console.log("🚀 Début de l'import des formations du catalogue public...")
  console.log('🔑 PAYLOAD_SECRET:', process.env['PAYLOAD_SECRET'] ? '✅ Défini' : '❌ Manquant')
  console.log('🗄️ MONGODB_URI:', process.env['MONGODB_URI'] ? '✅ Défini' : '❌ Manquant')

  const payload = await getPayload({ config: payloadConfig })

  try {
    console.log(`📚 Import de ${MOCK_PROGRAMMES.length} formations...`)

    let importedCount = 0
    let updatedCount = 0
    let errorCount = 0

    for (const programme of MOCK_PROGRAMMES) {
      try {
        // Vérifier si le programme existe déjà
        const existingProgrammes = await payload.find({
          collection: 'programmes',
          where: {
            codeFormation: {
              equals: programme.codeFormation,
            },
          },
        })

        const programmeData = {
          codeFormation: programme.codeFormation,
          titre: programme.titre,
          description: programme.description,
          duree: programme.duree,
          niveau: programme.niveau,
          modalites: programme.modalites,
          prix: programme.prix,
          competences: programme.competences.map(comp => ({ competence: comp })),
          statut: programme.statut === 'PUBLIE' ? 'actif' : 'inactif',
          eligibleCPF: true, // Par défaut, toutes les formations sont éligibles CPF
          codeCPF: `RS${Math.floor(Math.random() * 10000)}`, // Code CPF généré
          objectifs: `Formation ${programme.niveau.toLowerCase()} de ${programme.duree} heures sur ${programme.titre}`,
          prerequis:
            programme.niveau === 'DEBUTANT'
              ? 'Aucun prérequis technique'
              : 'Connaissances de base en informatique',
          programme: `Programme détaillé de la formation ${programme.titre}`,
          modalitesPedagogiques: `Formation en ${programme.modalites.toLowerCase()} avec approche pratique`,
          evaluation: 'Évaluation continue et projet final',
          certification: 'Attestation de formation délivrée',
        }

        if (existingProgrammes.docs.length > 0) {
          // Mettre à jour le programme existant
          const existingProgramme = existingProgrammes.docs[0]
          if (existingProgramme) {
            await payload.update({
              collection: 'programmes',
              id: existingProgramme.id,
              data: programmeData,
            })
            console.log(`🔄 Programme mis à jour: ${programme.titre}`)
            updatedCount++
          }
        } else {
          // Créer un nouveau programme
          await payload.create({
            collection: 'programmes',
            data: programmeData,
          })
          console.log(`✅ Programme importé: ${programme.titre}`)
          importedCount++
        }
      } catch (error) {
        console.error(`❌ Erreur lors de l'import de ${programme.titre}:`, error)
        errorCount++
      }
    }

    console.log('\n🎉 Import terminé!')
    console.log('📊 Résultats:')
    console.log(`   - ✅ ${importedCount} programmes importés`)
    console.log(`   - 🔄 ${updatedCount} programmes mis à jour`)
    console.log(`   - ❌ ${errorCount} erreurs`)
    console.log(
      `   - 📚 Total traité: ${importedCount + updatedCount + errorCount}/${MOCK_PROGRAMMES.length}`
    )

    // Afficher un résumé des formations importées
    const allProgrammes = await payload.find({
      collection: 'programmes',
      limit: 1000,
    })

    console.log('\n📋 Formations disponibles dans le back-office:')
    allProgrammes.docs.forEach(prog => {
      console.log(`   - ${prog['codeFormation']}: ${prog['titre']} (${prog['statut']})`)
    })
  } catch (error) {
    console.error("❌ Erreur lors de l'import:", error)
  }
}

importFormations()
