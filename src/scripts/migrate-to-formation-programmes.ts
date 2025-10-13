/**
 * Script pour migrer le programme WordPress vers la nouvelle structure réglementaire
 */

import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

async function migrateToFormationProgrammes() {
  console.log('🔄 Migration vers la structure réglementaire formation_programmes...')

  const mongoUri = process.env.MONGODB_URI
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
    const programmesCollection = db.collection('programmes')
    const formationProgrammesCollection = db.collection('formation_programmes')

    // Récupérer le programme WordPress existant
    const wordpressProgramme = await programmesCollection.findOne({ codeFormation: 'A001-WP-DD' })

    if (!wordpressProgramme) {
      console.error('❌ Programme WordPress non trouvé dans la base de données')
      return
    }

    console.log('📋 Programme WordPress trouvé:', wordpressProgramme.titre)

    // Créer le programme dans la nouvelle structure réglementaire
    const formationProgramme = {
      title: wordpressProgramme.titre,
      code_formation: wordpressProgramme.codeFormation,
      statut: 'PUBLIE',

      objectifs: {
        root: {
          type: 'root',
          children: [
            {
              type: 'p',
              children: [
                {
                  type: 'text',
                  text: "Jour 1 : Apprendre à créer, personnaliser et gérer un site internet avec WordPress, en mettant l'accent sur la gestion du contenu, la personnalisation du design et l'ajout de fonctionnalités essentielles.",
                },
              ],
            },
            {
              type: 'p',
              children: [
                {
                  type: 'text',
                  text: "Jour 2 : Comprendre les bases d'une stratégie de développement digital, incluant le SEO, la gestion des réseaux sociaux et l'utilisation de la publicité en ligne pour attirer et convertir des clients potentiels.",
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
              titre: 'Introduction à WordPress',
              description:
                "Qu'est-ce que WordPress ? Pourquoi choisir WordPress pour créer un site internet.",
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
                          text: '• Installation de WordPress : guide pratique pour installer son site sur son hébergeur',
                        },
                      ],
                    },
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Configuration initiale : choisir un thème, régler les paramètres généraux',
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              titre: 'Gestion de la structure du site',
              description: 'Création des pages essentielles et gestion du contenu.',
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
                          text: '• Création des pages essentielles : Accueil, À propos, Contact, Politique de confidentialité',
                        },
                      ],
                    },
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Gestion des articles et catégories : pourquoi et comment organiser un blog',
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              titre: "Personnalisation de l'apparence",
              description: 'Choisir et personnaliser un thème adapté à votre activité.',
              duree: '1.5h',
              contenu: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Choisir un thème adapté à votre activité (thèmes gratuits et payants)',
                        },
                      ],
                    },
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Personnalisation via le customizer : couleurs, typographies, menus et widgets',
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              titre: 'Ajout de fonctionnalités essentielles',
              description: 'Installer des plugins et gérer la sécurité.',
              duree: '1.5h',
              contenu: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Installer des plugins : sécurité (ex. Wordfence), SEO (Yoast SEO), formulaires de contact',
                        },
                      ],
                    },
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Introduction à un constructeur de pages (ex. Elementor)',
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
              titre: 'Définir les objectifs commerciaux sur internet',
              description: 'Déterminer les objectifs spécifiques de votre site.',
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
                          text: '• Déterminer les objectifs spécifiques de votre site : acquisition de trafic, conversion des visiteurs en clients',
                        },
                      ],
                    },
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Identifier votre audience cible : définition des personas et de leurs besoins',
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              titre: 'Introduction au référencement naturel (SEO)',
              description: 'Comprendre les bases du SEO et optimiser son site.',
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
                          text: '• Comprendre les bases du SEO : recherche de mots-clés, optimisation du contenu',
                        },
                      ],
                    },
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Optimisation on-page : amélioration de la vitesse du site, structure des URL',
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              titre: 'Stratégie sur les réseaux sociaux',
              description: 'Importance des réseaux sociaux pour accroître la visibilité.',
              duree: '1.5h',
              contenu: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Importance des réseaux sociaux pour accroître la visibilité de votre site',
                        },
                      ],
                    },
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Choisir les bonnes plateformes : Facebook, LinkedIn, Instagram, YouTube',
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              titre: 'Publicité en ligne et autres outils',
              description: "Introduction aux publicités payantes et outils d'analyse.",
              duree: '1.5h',
              contenu: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Introduction aux publicités payantes : Facebook Ads, Google Ads',
                        },
                      ],
                    },
                    {
                      type: 'p',
                      children: [
                        {
                          type: 'text',
                          text: '• Outils pour analyser et suivre la performance : Google Analytics, Matomo',
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
          'Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur.',
        public_concerne: 'Artisans, commerçants ou professions libérales.',
        duree: '14 heures ou 2 jours',
        horaires: '9h à 13h et de 14h à 17h',
        delais_mise_en_place:
          'Dès réception de votre accord de prise en charge pour les professionnels.',
        tarif: 980,
        modalites_reglement: 'Chèque ou virement à réception de facture',
      },

      contact_formateur: {
        nom: 'Aurélien LAVAYSSIERE',
        email: 'aurelien@gestionmax.fr',
        telephone: '06.46.02.24.68',
        role: 'Consultant formateur en informatique de gestion',
        biographie:
          "Aurélien LAVAYSSIERE est un consultant formateur en informatique de gestion, spécialisé dans la formation des adultes et plus particulièrement dans le domaine du CMS WordPress. Doté d'une solide expérience dans le domaine de la formation, Aurélien possède une expertise approfondie en matière de gestion de sites web, avec une attention particulière portée à l'utilisation efficace du CMS WordPress.",
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
          description:
            'Projet et ressources téléchargeables sur Notion, un hébergement Web, quizz, fiches pratiques',
        },
      ],

      modalites_evaluation: {
        types_evaluation: [
          {
            type: 'Quizz',
            description:
              "Quizz d'une dizaine de questions par l'intermédiaire de notre plateforme d'évaluation en ligne EVALBOX",
          },
          {
            type: 'Travaux pratiques',
            description: 'Mise en application des connaissances acquises',
          },
        ],
        plateforme_evaluation: 'EVALBOX',
        grille_analyse: "Grille d'analyse des compétences, travaux pratiques",
      },

      sanction_formation:
        "Un certificat de réalisation de formation. Une feuille d'émargement individuelle sera conjointement signée par le formateur et chaque stagiaire, pour chaque demi-journée de formation, permettant d'attester de l'exécution de l'action de formation.",

      niveau_certification: 'Aucune',

      accessibilite_handicap: {
        referent_handicap: 'Aurélien LAVAYSSIERE',
        contact_referent: 'aurelien@gestionmax.fr – 06.46.02.24.68',
        adaptations_proposees:
          "Un entretien téléphonique pour vous accompagner individuellement, évaluer vos besoins spécifiques au regard d'une situation de handicap, mettre en œuvre les adaptations pédagogiques, organisationnelles et matériels nécessaires.",
      },

      cessation_abandon: {
        conditions_renonciation:
          "En cas de renonciation de l'apprenant(e) avant le début de la formation, aucune facturation",
        facturation_abandon:
          "En cas de renonciation en cours de formation, la facturation se fera au pro rata de l'assiduité de l'apprenant(e).",
      },
    }

    // Insérer le programme dans la nouvelle collection
    const result = await formationProgrammesCollection.insertOne(formationProgramme)

    if (result.insertedId) {
      console.log('✅ Programme migré avec succès vers formation_programmes')
      console.log(`   ID: ${result.insertedId}`)
      console.log(`   Titre: ${formationProgramme.title}`)
      console.log(`   Code: ${formationProgramme.code_formation}`)
      console.log(`   Tarif: ${formationProgramme.modalites_acces.tarif}€`)
    } else {
      console.error("❌ Erreur lors de l'insertion du programme")
    }
  } catch (error: any) {
    console.error('❌ Erreur lors de la migration:', error)
  } finally {
    if (client) {
      await client.close()
    }
  }
}

migrateToFormationProgrammes()
