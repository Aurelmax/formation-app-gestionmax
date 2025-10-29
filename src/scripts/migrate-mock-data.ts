import { config } from 'dotenv'
import { getPayloadClient } from '@/lib/getPayloadClient'
import payloadConfig from '../payload.config'
import { MOCK_USERS, MOCK_PROGRAMMES, MOCK_APPRENANTS, MOCK_RENDEZ_VOUS } from '../data/mock-data'

// Charger les variables d'environnement
config({ path: '.env.local' })

interface MigrationStats {
  users: { imported: number; errors: number }
  programmes: { imported: number; errors: number }
  apprenants: { imported: number; errors: number }
  rendezVous: { imported: number; errors: number }
}

const migrateMockData = async () => {
  console.log('🚀 Début de la migration des données mock vers MongoDB...')
  console.log('🔑 PAYLOAD_SECRET:', process.env['PAYLOAD_SECRET'] ? '✅ Défini' : '❌ Manquant')
  console.log('🗄️ MONGODB_URI:', process.env['MONGODB_URI'] ? '✅ Défini' : '❌ Manquant')

  const payload = await getPayloadClient()
  const stats: MigrationStats = {
    users: { imported: 0, errors: 0 },
    programmes: { imported: 0, errors: 0 },
    apprenants: { imported: 0, errors: 0 },
    rendezVous: { imported: 0, errors: 0 },
  }

  try {
    // 1. Migration des utilisateurs
    console.log('\n📋 Migration des utilisateurs...')
    for (const user of MOCK_USERS) {
      try {
        // Vérifier si l'utilisateur existe déjà
        const existingUsers = await payload.find({
          collection: 'users',
          where: {
            email: {
              equals: user.email,
            },
          },
        })

        const userData = {
          name: user.nom,
          firstName: user.prenom,
          email: user.email,
          role: user.role.toLowerCase(),
          status: 'active',
          phone: '',
          address: '',
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        }

        if (existingUsers.docs.length > 0) {
          console.log(`🔄 Utilisateur mis à jour: ${user.email}`)
        } else {
          await payload.create({
            collection: 'users',
            data: userData,
          })
          console.log(`✅ Utilisateur importé: ${user.email}`)
          stats.users.imported++
        }
      } catch (error) {
        console.error(`❌ Erreur lors de l'import de l'utilisateur ${user.email}:`, error)
        stats.users.errors++
      }
    }

    // 2. Migration des programmes
    console.log('\n📚 Migration des programmes...')
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
          eligibleCPF: true,
          codeCPF: `RS${Math.floor(Math.random() * 10000)}`,
          objectifs: `Formation ${programme.niveau.toLowerCase()} de ${programme.duree} heures sur ${programme.titre}`,
          prerequis:
            programme.niveau === 'DEBUTANT'
              ? 'Aucun prérequis technique'
              : 'Connaissances de base en informatique',
          programme: `Programme détaillé de la formation ${programme.titre}`,
          modalitesPedagogiques: `Formation en ${programme.modalites.toLowerCase()} avec approche pratique`,
          evaluation: 'Évaluation continue et projet final',
          certification: 'Attestation de formation délivrée',
          createdAt: programme.createdAt.toISOString(),
          updatedAt: programme.updatedAt.toISOString(),
        }

        if (existingProgrammes.docs.length > 0) {
          console.log(`🔄 Programme mis à jour: ${programme.titre}`)
        } else {
          await payload.create({
            collection: 'programmes',
            data: programmeData,
          })
          console.log(`✅ Programme importé: ${programme.titre}`)
          stats.programmes.imported++
        }
      } catch (error) {
        console.error(`❌ Erreur lors de l'import du programme ${programme.titre}:`, error)
        stats.programmes.errors++
      }
    }

    // 3. Migration des apprenants (si la collection existe)
    console.log('\n👥 Migration des apprenants...')
    try {
      // Vérifier si la collection apprenants existe
      const apprenantsCollection = payload.collections['apprenants']
      if (apprenantsCollection) {
        for (const apprenant of MOCK_APPRENANTS) {
          try {
            const apprenantData = {
              nom: apprenant.nom,
              prenom: apprenant.prenom,
              email: apprenant.email,
              telephone: apprenant.telephone,
              dateNaissance: apprenant.dateNaissance,
              adresse: apprenant.adresse,
              statut: apprenant.statut,
              progression: apprenant.progression,
              createdAt: apprenant.createdAt.toISOString(),
              updatedAt: apprenant.updatedAt.toISOString(),
            }

            await payload.create({
              collection: 'apprenants',
              data: apprenantData,
            })
            console.log(`✅ Apprenant importé: ${apprenant.nom} ${apprenant.prenom}`)
            stats.apprenants.imported++
          } catch (error) {
            console.error(`❌ Erreur lors de l'import de l'apprenant ${apprenant.nom}:`, error)
            stats.apprenants.errors++
          }
        }
      } else {
        console.log('⚠️ Collection apprenants non trouvée - à créer dans payload.config.ts')
      }
    } catch (error) {
      console.error('❌ Erreur lors de la migration des apprenants:', error)
    }

    // 4. Migration des rendez-vous (si la collection existe)
    console.log('\n📅 Migration des rendez-vous...')
    try {
      const rendezVousCollection = payload.collections['rendez-vous']
      if (rendezVousCollection) {
        for (const rdv of MOCK_RENDEZ_VOUS) {
          try {
            const rdvData = {
              client: {
                nom: rdv.client.nom,
                prenom: rdv.client.prenom,
                email: rdv.client.email,
                telephone: rdv.client.telephone,
                entreprise: rdv.client.entreprise,
              },
              type: rdv.type,
              statut: rdv.statut,
              date: rdv.date,
              heure: rdv.heure,
              duree: rdv.duree,
              lieu: rdv.lieu,
              adresse: rdv.adresse,
              lienVisio: rdv.lienVisio,
              notes: rdv.notes,
              rappelEnvoye: rdv.rappelEnvoye,
              createdAt: rdv.createdAt,
              updatedAt: rdv.updatedAt,
            }

            await payload.create({
              collection: 'rendez-vous',
              data: rdvData,
            })
            console.log(`✅ Rendez-vous importé: ${rdv.client.nom} ${rdv.client.prenom}`)
            stats.rendezVous.imported++
          } catch (error) {
            console.error(`❌ Erreur lors de l'import du rendez-vous ${rdv.client.nom}:`, error)
            stats.rendezVous.errors++
          }
        }
      } else {
        console.log('⚠️ Collection rendez-vous non trouvée - à créer dans payload.config.ts')
      }
    } catch (error) {
      console.error('❌ Erreur lors de la migration des rendez-vous:', error)
    }

    // Résumé final
    console.log('\n🎉 Migration terminée!')
    console.log('📊 Résultats:')
    console.log(
      `   👤 Utilisateurs: ${stats.users.imported} importés, ${stats.users.errors} erreurs`
    )
    console.log(
      `   📚 Programmes: ${stats.programmes.imported} importés, ${stats.programmes.errors} erreurs`
    )
    console.log(
      `   👥 Apprenants: ${stats.apprenants.imported} importés, ${stats.apprenants.errors} erreurs`
    )
    console.log(
      `   📅 Rendez-vous: ${stats.rendezVous.imported} importés, ${stats.rendezVous.errors} erreurs`
    )

    // Vérification des données importées
    console.log('\n🔍 Vérification des données importées:')
    const usersCount = await payload.count({ collection: 'users' })
    const programmesCount = await payload.count({ collection: 'programmes' })
    console.log(`   👤 Utilisateurs dans la DB: ${usersCount.totalDocs}`)
    console.log(`   📚 Programmes dans la DB: ${programmesCount.totalDocs}`)
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
  }
}

// Exécuter la migration
migrateMockData()
  .then(() => {
    console.log('\n✅ Migration terminée avec succès!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Erreur fatale lors de la migration:', error)
    process.exit(1)
  })
