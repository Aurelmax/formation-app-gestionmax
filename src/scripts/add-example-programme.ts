/**
 * Script pour ajouter l'exemple de programme "Développement digital et publicités en ligne"
 */

import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

async function addExampleProgramme() {
  console.log('🔄 Ajout du programme exemple "Développement digital et publicités en ligne"...')

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
    const collection = db.collection('formation_programmes')

    // Structure du programme exemple
    const programmeExemple = {
      title: 'Développement digital et publicités en ligne',
      code_formation: 'A002-DD-PA',
      statut: 'PUBLIE',

      objectifs: {
        root: {
          type: 'root',
          children: [
            {
              type: 'ul',
              children: [
                {
                  type: 'li',
                  children: [
                    {
                      type: 'text',
                      text: 'Comprendre les bases des publicités payantes',
                    },
                  ],
                },
                {
                  type: 'li',
                  children: [
                    {
                      type: 'text',
                      text: 'Définir un budget et cibler son audience',
                    },
                  ],
                },
                {
                  type: 'li',
                  children: [
                    {
                      type: 'text',
                      text: 'Analyser et suivre la performance du site',
                    },
                  ],
                },
                {
                  type: 'li',
                  children: [
                    {
                      type: 'text',
                      text: 'Automatiser la communication',
                    },
                  ],
                },
              ],
            },
          ],
        },
      },

      programme_detail: [
        {
          jour: 'Jour 1',
          duree: '7 heures',
          modules: [
            {
              titre: 'Publicités payantes',
              description: 'Introduction aux publicités payantes et plateformes principales',
              duree: '3h',
              contenu: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Facebook Ads : création de campagnes, ciblage, optimisation',
                        },
                      ],
                    },
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Google Ads : recherche, display, remarketing',
                        },
                      ],
                    },
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Définir un budget et cibler son audience',
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              titre: "Outils d'analyse",
              description: 'Analyser et suivre la performance de ses campagnes',
              duree: '2h',
              contenu: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Google Analytics : configuration et interprétation des données',
                        },
                      ],
                    },
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Matomo : alternative open source à Google Analytics',
                        },
                      ],
                    },
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Métriques clés : ROI, CPA, CTR, conversion',
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              titre: 'Automatisation emailing',
              description: 'Automatiser la communication avec ses clients',
              duree: '2h',
              contenu: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Mailchimp : création de campagnes, segmentation, automatisation',
                        },
                      ],
                    },
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Brevo : alternative française, workflows avancés',
                        },
                      ],
                    },
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: "• Bonnes pratiques de l'email marketing",
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
        },
        {
          jour: 'Jour 2',
          duree: '7 heures',
          modules: [
            {
              titre: "Plan d'action digital",
              description: 'Élaborer et mettre en place une stratégie digitale complète',
              duree: '4h',
              contenu: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: "• Élaboration d'un plan d'action : étapes pour mettre en œuvre une stratégie complète",
                        },
                      ],
                    },
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Suivi et ajustement des actions : comment évaluer et améliorer les résultats',
                        },
                      ],
                    },
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Intégration des différents outils et canaux',
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              titre: 'Optimisation et ROI',
              description: 'Optimiser ses campagnes et mesurer le retour sur investissement',
              duree: '3h',
              contenu: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• A/B testing et optimisation des campagnes',
                        },
                      ],
                    },
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Calcul du ROI et des métriques de performance',
                        },
                      ],
                    },
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Questions-réponses et cas pratiques',
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

      modalites_acces: {
        prerequis:
          'Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur. Avoir des bases en marketing digital.',
        public_concerne:
          'Artisans, commerçants, professions libérales souhaitant développer leur présence digitale et leurs ventes en ligne.',
        duree: '14 heures ou 2 jours',
        horaires: '9h à 13h et de 14h à 17h',
        delais_mise_en_place: "À réception de l'accord de prise en charge",
        tarif: 980,
        modalites_reglement: 'Chèque ou virement à réception de facture',
      },

      contact_formateur: {
        nom: 'Aurélien LAVAYSSIERE',
        email: 'aurelien@gestionmax.fr',
        telephone: '06.46.02.24.68',
        role: 'Formateur et référent pédagogique',
        biographie:
          "Aurélien LAVAYSSIERE est un consultant formateur en informatique de gestion, spécialisé dans la formation des adultes et plus particulièrement dans le domaine du marketing digital et des publicités en ligne. Doté d'une solide expérience dans le domaine de la formation, Aurélien possède une expertise approfondie en matière de publicités payantes, d'analyse de données et d'automatisation marketing.",
      },

      modalites_pedagogiques: {
        root: {
          type: 'root',
          children: [
            {
              type: 'ul',
              children: [
                {
                  type: 'li',
                  children: [
                    {
                      type: 'text',
                      text: 'Formation en présentiel individuel',
                    },
                  ],
                },
                {
                  type: 'li',
                  children: [
                    {
                      type: 'text',
                      text: 'Méthode expositive et démonstrative',
                    },
                  ],
                },
                {
                  type: 'li',
                  children: [
                    {
                      type: 'text',
                      text: 'Alternance exposés théoriques et cas pratiques',
                    },
                  ],
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
          ressource: 'Support de cours sur Notion',
          description: 'Ressources téléchargeables, quizz, fiches pratiques',
        },
        {
          ressource: 'Hébergement web',
          description: 'Accès à un hébergement pour les exercices pratiques',
        },
      ],

      modalites_evaluation: {
        types_evaluation: [
          {
            type: 'Quizz',
            description: '10 questions par bloc via EVALBOX',
          },
          {
            type: 'Travaux pratiques',
            description: 'Création de campagnes publicitaires et analyse de données',
          },
          {
            type: "Grille d'analyse",
            description: 'Évaluation des compétences acquises',
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
          "Entretien téléphonique, évaluation des besoins spécifiques au regard d'une situation de handicap, mise en œuvre des adaptations pédagogiques, organisationnelles et matérielles nécessaires.",
      },

      cessation_abandon: {
        conditions_renonciation:
          "En cas de renonciation de l'apprenant(e) avant le début de la formation, aucune facturation",
        facturation_abandon:
          "En cas de renonciation en cours de formation, la facturation se fera au prorata de l'assiduité de l'apprenant(e).",
      },
    }

    // Vérifier si le programme existe déjà
    const existingProgramme = await collection.findOne({ code_formation: 'A002-DD-PA' })

    if (existingProgramme) {
      console.log('⚠️ Programme avec le code A002-DD-PA existe déjà')
      console.log('🔄 Mise à jour du programme existant...')

      const result = await collection.updateOne(
        { code_formation: 'A002-DD-PA' },
        { $set: programmeExemple }
      )

      if (result.modifiedCount > 0) {
        console.log('✅ Programme mis à jour avec succès')
      } else {
        console.log('ℹ️ Aucune modification nécessaire')
      }
    } else {
      // Insérer le nouveau programme
      const result = await collection.insertOne(programmeExemple)

      if (result.insertedId) {
        console.log('✅ Programme ajouté avec succès')
        console.log(`   ID: ${result.insertedId}`)
        console.log(`   Titre: ${programmeExemple.title}`)
        console.log(`   Code: ${programmeExemple.code_formation}`)
        console.log(`   Tarif: ${programmeExemple.modalites_acces.tarif}€`)
      } else {
        console.error("❌ Erreur lors de l'insertion du programme")
      }
    }

    // Vérifier le nombre total de programmes
    const totalProgrammes = await collection.countDocuments()
    console.log(`\n📊 Total des programmes de formation: ${totalProgrammes}`)
  } catch (error: any) {
    console.error("❌ Erreur lors de l'ajout du programme:", error)
  } finally {
    if (client) {
      await client.close()
    }
  }
}

addExampleProgramme()
