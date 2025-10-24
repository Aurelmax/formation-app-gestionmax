/**
 * Script pour migrer tous les programmes mock vers la base de données
 * avec la structure réglementaire complète
 */

import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import path from 'path'
import { MOCK_PROGRAMMES } from '@/data/mock-data'

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

async function migrateAllMockProgrammes() {
  console.log('🔄 Migration de tous les programmes mock vers la base de données...')

  const mongoUri = process.env['MONGODB_URI']
  if (!mongoUri) {
    console.error("❌ MONGODB_URI n'est pas défini dans .env.local")
    return
  }

  let client: MongoClient | undefined
  try {
    client = new MongoClient(mongoUri)
    await client.connect()
    console.log('✅ Connexion MongoDB établie')

    const db = client.db()
// const programmesCollection = db.collection('programmes') // Removed: unused variable
    const formationProgrammesCollection = db.collection('formation_programmes')

    console.log(`📋 ${MOCK_PROGRAMMES.length} programmes mock à migrer`)

    let migratedCount = 0
    let skippedCount = 0

    for (const mockProgramme of MOCK_PROGRAMMES) {
      try {
        // Vérifier si le programme existe déjà dans formation_programmes
        const existingProgramme = await formationProgrammesCollection.findOne({
          code_formation: mockProgramme.codeFormation,
        })

        if (existingProgramme) {
          console.log(`⚠️ Programme ${mockProgramme.codeFormation} existe déjà - ignoré`)
          skippedCount++
          continue
        }

        // Créer la structure réglementaire à partir du programme mock
        const baseProgramme = {
          title: mockProgramme.titre,
          code_formation: mockProgramme.codeFormation,
          statut: mockProgramme.statut === 'PUBLIE' ? 'PUBLIE' : 'BROUILLON',

          // Objectifs génériques basés sur le titre et la description
          objectifs: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'p',
                  children: [
                    {
                      type: 'text',
                      text: `Maîtriser les compétences essentielles en ${mockProgramme.titre.split(' ')[0]}`,
                    },
                  ],
                },
                {
                  type: 'p',
                  children: [
                    {
                      type: 'text',
                      text: mockProgramme.description,
                    },
                  ],
                },
              ],
            },
          },

          // Structure programme détaillée générique
          programme_detail: [
            {
              jour: 'Jour 1',
              duree: `${Math.ceil(mockProgramme.duree / 2)} heures`,
              modules: [
                {
                  titre: 'Introduction et bases',
                  description: 'Découverte des concepts fondamentaux',
                  duree: `${Math.ceil(mockProgramme.duree / 4)}h`,
                  contenu: {
                    root: {
                      type: 'root',
                      children: [
                        {
                          type: 'p',
                          children: [
                            {
                              type: 'text',
                              text: '• Introduction aux concepts de base',
                            },
                          ],
                        },
                        {
                          type: 'p',
                          children: [
                            {
                              type: 'text',
                              text: '• Présentation des outils et technologies',
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
                {
                  titre: 'Mise en pratique',
                  description: 'Application des connaissances acquises',
                  duree: `${Math.ceil(mockProgramme.duree / 4)}h`,
                  contenu: {
                    root: {
                      type: 'root',
                      children: [
                        {
                          type: 'p',
                          children: [
                            {
                              type: 'text',
                              text: '• Exercices pratiques guidés',
                            },
                          ],
                        },
                        {
                          type: 'p',
                          children: [
                            {
                              type: 'text',
                              text: "• Cas d'usage concrets",
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
              ],
            },
          ],
        }

        // Si c'est une formation de 2 jours, ajouter le jour 2
        if (mockProgramme.duree > 7) {
          baseProgramme.programme_detail.push({
            jour: 'Jour 2',
            duree: `${Math.ceil(mockProgramme.duree / 2)} heures`,
            modules: [
              {
                titre: 'Approfondissement',
                description: 'Approfondissement des compétences',
                duree: `${Math.ceil(mockProgramme.duree / 4)}h`,
                contenu: {
                  root: {
                    type: 'root',
                    children: [
                      {
                        type: 'p',
                        children: [
                          {
                            type: 'text',
                            text: '• Techniques avancées',
                          },
                        ],
                      },
                      {
                        type: 'p',
                        children: [
                          {
                            type: 'text',
                            text: '• Optimisation et bonnes pratiques',
                          },
                        ],
                      },
                    ],
                  },
                },
              },
              {
                titre: 'Projet final',
                description: 'Mise en application complète',
                duree: `${Math.ceil(mockProgramme.duree / 4)}h`,
                contenu: {
                  root: {
                    type: 'root',
                    children: [
                      {
                        type: 'p',
                        children: [
                          {
                            type: 'text',
                            text: "• Réalisation d'un projet complet",
                          },
                        ],
                      },
                      {
                        type: 'p',
                        children: [
                          {
                            type: 'text',
                            text: '• Présentation et évaluation',
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            ],
          })
        }

        const formationProgramme = {
          ...baseProgramme,

          modalites_acces: {
            prerequis:
              'Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur.',
            public_concerne: 'Artisans, commerçants, professions libérales et entrepreneurs.',
            duree: `${mockProgramme.duree} heures`,
            horaires: '9h à 13h et de 14h à 17h',
            delais_mise_en_place: "Dès réception de l'accord de prise en charge",
            tarif: mockProgramme.prix,
            modalites_reglement: 'Chèque ou virement à réception de facture',
          },

          contact_formateur: {
            nom: 'Aurélien LAVAYSSIERE',
            email: 'aurelien@gestionmax.fr',
            telephone: '06.46.02.24.68',
            role: 'Consultant formateur en informatique de gestion',
            biographie:
              "Aurélien LAVAYSSIERE est un consultant formateur en informatique de gestion, spécialisé dans la formation des adultes. Doté d'une solide expérience dans le domaine de la formation, Aurélien possède une expertise approfondie en matière de technologies web et de gestion d'entreprise.",
          },

          modalites_pedagogiques: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'p',
                  children: [
                    {
                      type: 'text',
                      text: "Formation en présentiel individuel (méthode expositive et démonstrative) avec alternance d'exposés théoriques et de cas pratiques. Cette méthode permet de varier les modes d'apprentissage pour favoriser l'acquisition des connaissances et des compétences.",
                    },
                  ],
                },
              ],
            },
          },

          ressources_dispo: [
            {
              ressource: 'Salle de formation équipée',
              description: 'Matériel informatique haut de gamme connectée à internet',
            },
            {
              ressource: 'Support de cours',
              description: 'Ressources téléchargeables, quizz, fiches pratiques',
            },
          ],

          modalites_evaluation: {
            types_evaluation: [
              {
                type: 'Quizz',
                description: 'Évaluation des connaissances théoriques',
              },
              {
                type: 'Travaux pratiques',
                description: 'Mise en application des compétences acquises',
              },
            ],
            plateforme_evaluation: 'EVALBOX',
            grille_analyse: "Grille d'analyse des compétences, travaux pratiques",
          },

          sanction_formation:
            "Certificat de réalisation de formation. Une feuille d'émargement individuelle sera conjointement signée par le formateur et chaque stagiaire, pour chaque demi-journée de formation, permettant d'attester de l'exécution de l'action de formation.",

          niveau_certification: 'Aucune',

          accessibilite_handicap: {
            referent_handicap: 'Aurélien LAVAYSSIERE',
            contact_referent: 'aurelien@gestionmax.fr – 06.46.02.24.68',
            adaptations_proposees:
              "Entretien téléphonique pour évaluer les besoins spécifiques au regard d'une situation de handicap, mise en œuvre des adaptations pédagogiques, organisationnelles et matérielles nécessaires.",
          },

          cessation_abandon: {
            conditions_renonciation:
              "En cas de renonciation de l'apprenant(e) avant le début de la formation, aucune facturation",
            facturation_abandon:
              "En cas de renonciation en cours de formation, la facturation se fera au prorata de l'assiduité de l'apprenant(e).",
          },
        }

        // Insérer le programme dans la collection formation_programmes
        await formationProgrammesCollection.insertOne(formationProgramme)

        console.log(`✅ Programme migré: ${mockProgramme.codeFormation} - ${mockProgramme.titre}`)
        migratedCount++
      } catch (error: any) {
        console.error(
          `❌ Erreur lors de la migration du programme ${mockProgramme.codeFormation}:`,
          error.message
        )
      }
    }

    console.log(`\n📊 Résumé de la migration:`)
    console.log(`   ✅ Programmes migrés: ${migratedCount}`)
    console.log(`   ⚠️ Programmes ignorés: ${skippedCount}`)
    console.log(`   📋 Total programmes mock: ${MOCK_PROGRAMMES.length}`)

    // Vérifier le nombre total de programmes dans la base
    const totalProgrammes = await formationProgrammesCollection.countDocuments()
    console.log(`   🗄️ Total programmes en base: ${totalProgrammes}`)
  } catch (error: any) {
    console.error('❌ Erreur lors de la migration:', error)
  } finally {
    if (client) {
      await client.close()
    }
  }
}

migrateAllMockProgrammes()
