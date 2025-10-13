import { config } from 'dotenv'
import { MongoClient } from 'mongodb'
import { MOCK_USERS, MOCK_PROGRAMMES, MOCK_APPRENANTS, MOCK_RENDEZ_VOUS } from '../data/mock-data'

// Charger les variables d'environnement
config({ path: '.env.local' })

interface MigrationStats {
  users: { imported: number; errors: number }
  programmes: { imported: number; errors: number }
  apprenants: { imported: number; errors: number }
  rendezVous: { imported: number; errors: number }
}

const migrateDirectMongoDB = async () => {
  console.log('🚀 Début de la migration directe vers MongoDB...')
  console.log('🔑 PAYLOAD_SECRET:', process.env['PAYLOAD_SECRET'] ? '✅ Défini' : '❌ Manquant')
  console.log('🗄️ MONGODB_URI:', process.env['MONGODB_URI'] ? '✅ Défini' : '❌ Manquant')
  
  const mongoUri = process.env['MONGODB_URI']
  if (!mongoUri) {
    console.log('❌ MONGODB_URI non défini')
    return
  }
  
  const client = new MongoClient(mongoUri)
  const stats: MigrationStats = {
    users: { imported: 0, errors: 0 },
    programmes: { imported: 0, errors: 0 },
    apprenants: { imported: 0, errors: 0 },
    rendezVous: { imported: 0, errors: 0 }
  }

  try {
    await client.connect()
    console.log('✅ Connexion MongoDB établie')
    
    const db = client.db('formation-app-gestionmax')
    
    // 1. Migration des utilisateurs
    console.log('\n📋 Migration des utilisateurs...')
    const usersCollection = db.collection('users')
    
    for (const user of MOCK_USERS) {
      try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await usersCollection.findOne({ email: user.email })
        
        const userData = {
          name: user.nom,
          firstName: user.prenom,
          email: user.email,
          role: user.role.toLowerCase(),
          status: 'active',
          phone: '',
          address: '',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }

        if (existingUser) {
          console.log(`🔄 Utilisateur mis à jour: ${user.email}`)
          await usersCollection.updateOne(
            { email: user.email },
            { $set: userData }
          )
        } else {
          await usersCollection.insertOne(userData)
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
    const programmesCollection = db.collection('programmes')
    
    for (const programme of MOCK_PROGRAMMES) {
      try {
        // Vérifier si le programme existe déjà
        const existingProgramme = await programmesCollection.findOne({ 
          codeFormation: programme.codeFormation 
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
          prerequis: programme.niveau === 'DEBUTANT' ? 'Aucun prérequis technique' : 'Connaissances de base en informatique',
          programme: `Programme détaillé de la formation ${programme.titre}`,
          modalitesPedagogiques: `Formation en ${programme.modalites.toLowerCase()} avec approche pratique`,
          evaluation: 'Évaluation continue et projet final',
          certification: 'Attestation de formation délivrée',
          createdAt: programme.createdAt,
          updatedAt: programme.updatedAt
        }

        if (existingProgramme) {
          console.log(`🔄 Programme mis à jour: ${programme.titre}`)
          await programmesCollection.updateOne(
            { codeFormation: programme.codeFormation },
            { $set: programmeData }
          )
        } else {
          await programmesCollection.insertOne(programmeData)
          console.log(`✅ Programme importé: ${programme.titre}`)
          stats.programmes.imported++
        }
      } catch (error) {
        console.error(`❌ Erreur lors de l'import du programme ${programme.titre}:`, error)
        stats.programmes.errors++
      }
    }

    // 3. Migration des apprenants
    console.log('\n👥 Migration des apprenants...')
    const apprenantsCollection = db.collection('apprenants')
    
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
          createdAt: apprenant.createdAt,
          updatedAt: apprenant.updatedAt
        }

        await apprenantsCollection.insertOne(apprenantData)
        console.log(`✅ Apprenant importé: ${apprenant.nom} ${apprenant.prenom}`)
        stats.apprenants.imported++
      } catch (error) {
        console.error(`❌ Erreur lors de l'import de l'apprenant ${apprenant.nom}:`, error)
        stats.apprenants.errors++
      }
    }

    // 4. Migration des rendez-vous
    console.log('\n📅 Migration des rendez-vous...')
    const rendezVousCollection = db.collection('rendez-vous')
    
    for (const rdv of MOCK_RENDEZ_VOUS) {
      try {
        const rdvData = {
          client: {
            nom: rdv.client.nom,
            prenom: rdv.client.prenom,
            email: rdv.client.email,
            telephone: rdv.client.telephone,
            entreprise: rdv.client.entreprise
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
          updatedAt: rdv.updatedAt
        }

        await rendezVousCollection.insertOne(rdvData)
        console.log(`✅ Rendez-vous importé: ${rdv.client.nom} ${rdv.client.prenom}`)
        stats.rendezVous.imported++
      } catch (error) {
        console.error(`❌ Erreur lors de l'import du rendez-vous ${rdv.client.nom}:`, error)
        stats.rendezVous.errors++
      }
    }

    // Résumé final
    console.log('\n🎉 Migration terminée!')
    console.log('📊 Résultats:')
    console.log(`   👤 Utilisateurs: ${stats.users.imported} importés, ${stats.users.errors} erreurs`)
    console.log(`   📚 Programmes: ${stats.programmes.imported} importés, ${stats.programmes.errors} erreurs`)
    console.log(`   👥 Apprenants: ${stats.apprenants.imported} importés, ${stats.apprenants.errors} erreurs`)
    console.log(`   📅 Rendez-vous: ${stats.rendezVous.imported} importés, ${stats.rendezVous.errors} erreurs`)

    // Vérification des données importées
    console.log('\n🔍 Vérification des données importées:')
    const usersCount = await usersCollection.countDocuments()
    const programmesCount = await programmesCollection.countDocuments()
    const apprenantsCount = await apprenantsCollection.countDocuments()
    const rendezVousCount = await rendezVousCollection.countDocuments()
    
    console.log(`   👤 Utilisateurs dans la DB: ${usersCount}`)
    console.log(`   📚 Programmes dans la DB: ${programmesCount}`)
    console.log(`   👥 Apprenants dans la DB: ${apprenantsCount}`)
    console.log(`   📅 Rendez-vous dans la DB: ${rendezVousCount}`)

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
  } finally {
    await client.close()
  }
}

// Exécuter la migration
migrateDirectMongoDB()
  .then(() => {
    console.log('\n✅ Migration terminée avec succès!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale lors de la migration:', error)
    process.exit(1)
  })
