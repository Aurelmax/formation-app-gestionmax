import { config } from 'dotenv'
import { getPayloadClient } from '@/lib/getPayloadClient'
import payloadConfig from '../payload.config'
import { MOCK_USERS, MOCK_PROGRAMMES, MOCK_APPRENANTS, MOCK_RENDEZ_VOUS } from '../data/mock-data'

// Charger les variables d'environnement
config({ path: '.env.local' })

interface MigrationStats {
  users: { imported: number; updated: number; errors: number; skipped: number }
  programmes: { imported: number; updated: number; errors: number; skipped: number }
  apprenants: { imported: number; updated: number; errors: number; skipped: number }
  rendezVous: { imported: number; updated: number; errors: number; skipped: number }
  articles: { imported: number; updated: number; errors: number; skipped: number }
  categories: { imported: number; updated: number; errors: number; skipped: number }
  tags: { imported: number; updated: number; errors: number; skipped: number }
  contacts: { imported: number; updated: number; errors: number; skipped: number }
}

interface MigrationOptions {
  forceUpdate?: boolean
  skipExisting?: boolean
  dryRun?: boolean
  verbose?: boolean
}

class PayloadMigrationManager {
  private payload: any
  private stats: MigrationStats
  private options: MigrationOptions

  constructor(options: MigrationOptions = {}) {
    this.options = {
      forceUpdate: false,
      skipExisting: true,
      dryRun: false,
      verbose: true,
      ...options,
    }
    this.stats = {
      users: { imported: 0, updated: 0, errors: 0, skipped: 0 },
      programmes: { imported: 0, updated: 0, errors: 0, skipped: 0 },
      apprenants: { imported: 0, updated: 0, errors: 0, skipped: 0 },
      rendezVous: { imported: 0, updated: 0, errors: 0, skipped: 0 },
      articles: { imported: 0, updated: 0, errors: 0, skipped: 0 },
      categories: { imported: 0, updated: 0, errors: 0, skipped: 0 },
      tags: { imported: 0, updated: 0, errors: 0, skipped: 0 },
      contacts: { imported: 0, updated: 0, errors: 0, skipped: 0 },
    }
  }

  private log(message: string, level: 'info' | 'success' | 'warning' | 'error' = 'info') {
    if (!this.options.verbose && level === 'info') return

    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
    }

    console.log(`${icons[level]} ${message}`)
  }

  async initialize() {
    this.log('🚀 Initialisation de la migration Payload CMS...')
    this.log(`🔑 PAYLOAD_SECRET: ${process.env['PAYLOAD_SECRET'] ? '✅ Défini' : '❌ Manquant'}`)
    this.log(`🗄️ MONGODB_URI: ${process.env['MONGODB_URI'] ? '✅ Défini' : '❌ Manquant'}`)

    if (this.options.dryRun) {
      this.log('🧪 Mode DRY RUN activé - Aucune donnée ne sera modifiée', 'warning')
    }

    try {
      this.payload = await getPayloadClient()
      this.log('✅ Connexion à Payload CMS établie')

      // Vérifier les collections disponibles
      const collections = Object.keys(this.payload.collections)
      this.log(`📋 Collections disponibles: ${collections.join(', ')}`)

      return true
    } catch (error) {
      this.log(`❌ Erreur lors de l'initialisation: ${error}`, 'error')
      return false
    }
  }

  async migrateUsers() {
    this.log('\n👤 Migration des utilisateurs...')

    for (const user of MOCK_USERS) {
      try {
        // Vérifier si l'utilisateur existe déjà
        const existingUsers = await this.payload.find({
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
          if (this.options.skipExisting) {
            this.log(`⏭️ Utilisateur ignoré (existe déjà): ${user.email}`)
            this.stats.users.skipped++
            continue
          } else if (this.options.forceUpdate) {
            if (!this.options.dryRun) {
              await this.payload.update({
                collection: 'users',
                id: existingUsers.docs[0].id,
                data: userData,
              })
            }
            this.log(`🔄 Utilisateur mis à jour: ${user.email}`)
            this.stats.users.updated++
          }
        } else {
          if (!this.options.dryRun) {
            await this.payload.create({
              collection: 'users',
              data: userData,
            })
          }
          this.log(`✅ Utilisateur importé: ${user.email}`)
          this.stats.users.imported++
        }
      } catch (error) {
        this.log(`❌ Erreur lors de l'import de l'utilisateur ${user.email}: ${error}`, 'error')
        this.stats.users.errors++
      }
    }
  }

  async migrateProgrammes() {
    this.log('\n📚 Migration des programmes...')

    for (const programme of MOCK_PROGRAMMES) {
      try {
        // Vérifier si le programme existe déjà
        const existingProgrammes = await this.payload.find({
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
          if (this.options.skipExisting) {
            this.log(`⏭️ Programme ignoré (existe déjà): ${programme.titre}`)
            this.stats.programmes.skipped++
            continue
          } else if (this.options.forceUpdate) {
            if (!this.options.dryRun) {
              await this.payload.update({
                collection: 'programmes',
                id: existingProgrammes.docs[0].id,
                data: programmeData,
              })
            }
            this.log(`🔄 Programme mis à jour: ${programme.titre}`)
            this.stats.programmes.updated++
          }
        } else {
          if (!this.options.dryRun) {
            await this.payload.create({
              collection: 'programmes',
              data: programmeData,
            })
          }
          this.log(`✅ Programme importé: ${programme.titre}`)
          this.stats.programmes.imported++
        }
      } catch (error) {
        this.log(`❌ Erreur lors de l'import du programme ${programme.titre}: ${error}`, 'error')
        this.stats.programmes.errors++
      }
    }
  }

  async migrateApprenants() {
    this.log('\n👥 Migration des apprenants...')

    // Vérifier si la collection apprenants existe
    if (!this.payload.collections['apprenants']) {
      this.log('⚠️ Collection apprenants non trouvée - ignorée', 'warning')
      return
    }

    for (const apprenant of MOCK_APPRENANTS) {
      try {
        // Vérifier si l'apprenant existe déjà
        const existingApprenants = await this.payload.find({
          collection: 'apprenants',
          where: {
            email: {
              equals: apprenant.email,
            },
          },
        })

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

        if (existingApprenants.docs.length > 0) {
          if (this.options.skipExisting) {
            this.log(`⏭️ Apprenant ignoré (existe déjà): ${apprenant.nom} ${apprenant.prenom}`)
            this.stats.apprenants.skipped++
            continue
          } else if (this.options.forceUpdate) {
            if (!this.options.dryRun) {
              await this.payload.update({
                collection: 'apprenants',
                id: existingApprenants.docs[0].id,
                data: apprenantData,
              })
            }
            this.log(`🔄 Apprenant mis à jour: ${apprenant.nom} ${apprenant.prenom}`)
            this.stats.apprenants.updated++
          }
        } else {
          if (!this.options.dryRun) {
            await this.payload.create({
              collection: 'apprenants',
              data: apprenantData,
            })
          }
          this.log(`✅ Apprenant importé: ${apprenant.nom} ${apprenant.prenom}`)
          this.stats.apprenants.imported++
        }
      } catch (error) {
        this.log(`❌ Erreur lors de l'import de l'apprenant ${apprenant.nom}: ${error}`, 'error')
        this.stats.apprenants.errors++
      }
    }
  }

  async migrateRendezVous() {
    this.log('\n📅 Migration des rendez-vous...')

    // Vérifier si la collection rendez-vous existe
    if (!this.payload.collections['rendez-vous']) {
      this.log('⚠️ Collection rendez-vous non trouvée - ignorée', 'warning')
      return
    }

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

        if (!this.options.dryRun) {
          await this.payload.create({
            collection: 'rendez-vous',
            data: rdvData,
          })
        }
        this.log(`✅ Rendez-vous importé: ${rdv.client.nom} ${rdv.client.prenom}`)
        this.stats.rendezVous.imported++
      } catch (error) {
        this.log(`❌ Erreur lors de l'import du rendez-vous ${rdv.client.nom}: ${error}`, 'error')
        this.stats.rendezVous.errors++
      }
    }
  }

  async migrateSampleArticles() {
    this.log("\n📝 Migration d'articles d'exemple...")

    // Vérifier si la collection articles existe
    if (!this.payload.collections['articles']) {
      this.log('⚠️ Collection articles non trouvée - ignorée', 'warning')
      return
    }

    const sampleArticles = [
      {
        titre: 'Guide complet WordPress pour débutants',
        slug: 'guide-wordpress-debutants',
        contenu: 'Ce guide vous accompagne dans la création de votre premier site WordPress...',
        resume: 'Découvrez comment créer votre site WordPress en quelques étapes simples.',
        auteur: 'Aurélien LAVAYSSIERE',
        datePublication: new Date().toISOString().split('T')[0],
        statut: 'publie',
        metaDescription: 'Guide complet pour créer un site WordPress professionnel',
        vue: 0,
        tempsLecture: 8,
        featured: true,
      },
      {
        titre: 'SEO : Les bases du référencement naturel',
        slug: 'seo-bases-referencement-naturel',
        contenu: 'Le SEO est essentiel pour améliorer la visibilité de votre site...',
        resume: 'Apprenez les fondamentaux du SEO pour améliorer votre visibilité en ligne.',
        auteur: 'Aurélien LAVAYSSIERE',
        datePublication: new Date().toISOString().split('T')[0],
        statut: 'publie',
        metaDescription: 'Découvrez les bases du SEO pour améliorer votre référencement',
        vue: 0,
        tempsLecture: 12,
        featured: false,
      },
    ]

    for (const article of sampleArticles) {
      try {
        // Vérifier si l'article existe déjà
        const existingArticles = await this.payload.find({
          collection: 'articles',
          where: {
            slug: {
              equals: article.slug,
            },
          },
        })

        if (existingArticles.docs.length > 0) {
          if (this.options.skipExisting) {
            this.log(`⏭️ Article ignoré (existe déjà): ${article.titre}`)
            this.stats.articles.skipped++
            continue
          }
        }

        if (!this.options.dryRun) {
          await this.payload.create({
            collection: 'articles',
            data: article,
          })
        }
        this.log(`✅ Article importé: ${article.titre}`)
        this.stats.articles.imported++
      } catch (error) {
        this.log(`❌ Erreur lors de l'import de l'article ${article.titre}: ${error}`, 'error')
        this.stats.articles.errors++
      }
    }
  }

  async migrateSampleCategories() {
    this.log("\n📂 Migration de catégories d'exemple...")

    // Vérifier si la collection categories existe
    if (!this.payload.collections['categories']) {
      this.log('⚠️ Collection categories non trouvée - ignorée', 'warning')
      return
    }

    const sampleCategories = [
      {
        nom: 'WordPress',
        slug: 'wordpress',
        description: 'Tout sur WordPress : création, personnalisation, plugins...',
        couleur: '#21759B',
        icone: '🎨',
      },
      {
        nom: 'SEO',
        slug: 'seo',
        description: 'Référencement naturel et optimisation pour les moteurs de recherche',
        couleur: '#FF6B35',
        icone: '🔍',
      },
      {
        nom: 'Marketing Digital',
        slug: 'marketing-digital',
        description: 'Stratégies et outils de marketing en ligne',
        couleur: '#4ECDC4',
        icone: '📈',
      },
    ]

    for (const category of sampleCategories) {
      try {
        // Vérifier si la catégorie existe déjà
        const existingCategories = await this.payload.find({
          collection: 'categories',
          where: {
            slug: {
              equals: category.slug,
            },
          },
        })

        if (existingCategories.docs.length > 0) {
          if (this.options.skipExisting) {
            this.log(`⏭️ Catégorie ignorée (existe déjà): ${category.nom}`)
            this.stats.categories.skipped++
            continue
          }
        }

        if (!this.options.dryRun) {
          await this.payload.create({
            collection: 'categories',
            data: category,
          })
        }
        this.log(`✅ Catégorie importée: ${category.nom}`)
        this.stats.categories.imported++
      } catch (error) {
        this.log(`❌ Erreur lors de l'import de la catégorie ${category.nom}: ${error}`, 'error')
        this.stats.categories.errors++
      }
    }
  }

  async migrateSampleTags() {
    this.log("\n🏷️ Migration de tags d'exemple...")

    // Vérifier si la collection tags existe
    if (!this.payload.collections['tags']) {
      this.log('⚠️ Collection tags non trouvée - ignorée', 'warning')
      return
    }

    const sampleTags = [
      { nom: 'Débutant', slug: 'debutant', couleur: '#10B981' },
      { nom: 'Tutoriel', slug: 'tutoriel', couleur: '#3B82F6' },
      { nom: 'Formation', slug: 'formation', couleur: '#8B5CF6' },
      { nom: 'Guide', slug: 'guide', couleur: '#F59E0B' },
      { nom: 'Conseils', slug: 'conseils', couleur: '#EF4444' },
    ]

    for (const tag of sampleTags) {
      try {
        // Vérifier si le tag existe déjà
        const existingTags = await this.payload.find({
          collection: 'tags',
          where: {
            slug: {
              equals: tag.slug,
            },
          },
        })

        if (existingTags.docs.length > 0) {
          if (this.options.skipExisting) {
            this.log(`⏭️ Tag ignoré (existe déjà): ${tag.nom}`)
            this.stats.tags.skipped++
            continue
          }
        }

        if (!this.options.dryRun) {
          await this.payload.create({
            collection: 'tags',
            data: tag,
          })
        }
        this.log(`✅ Tag importé: ${tag.nom}`)
        this.stats.tags.imported++
      } catch (error) {
        this.log(`❌ Erreur lors de l'import du tag ${tag.nom}: ${error}`, 'error')
        this.stats.tags.errors++
      }
    }
  }

  async migrateSampleContacts() {
    this.log("\n📞 Migration de contacts d'exemple...")

    // Vérifier si la collection contacts existe
    if (!this.payload.collections['contacts']) {
      this.log('⚠️ Collection contacts non trouvée - ignorée', 'warning')
      return
    }

    const sampleContacts = [
      {
        nom: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        telephone: '06.12.34.56.78',
        type: 'formation',
        sujet: "Demande d'information sur la formation WordPress",
        message:
          'Bonjour, je souhaiterais obtenir des informations sur vos formations WordPress. Pouvez-vous me contacter ?',
        statut: 'nouveau',
        priorite: 'normale',
      },
      {
        nom: 'Marie Martin',
        email: 'marie.martin@example.com',
        telephone: '06.87.65.43.21',
        type: 'devis',
        sujet: 'Demande de devis pour formation SEO',
        message:
          'Nous sommes une entreprise de 10 personnes et souhaiterions organiser une formation SEO pour notre équipe marketing.',
        statut: 'enCours',
        priorite: 'haute',
      },
    ]

    for (const contact of sampleContacts) {
      try {
        if (!this.options.dryRun) {
          await this.payload.create({
            collection: 'contacts',
            data: contact,
          })
        }
        this.log(`✅ Contact importé: ${contact.nom}`)
        this.stats.contacts.imported++
      } catch (error) {
        this.log(`❌ Erreur lors de l'import du contact ${contact.nom}: ${error}`, 'error')
        this.stats.contacts.errors++
      }
    }
  }

  async validateMigration() {
    this.log('\n🔍 Validation de la migration...')

    const collections = [
      'users',
      'programmes',
      'apprenants',
      'rendez-vous',
      'articles',
      'categories',
      'tags',
      'contacts',
    ]

    for (const collectionName of collections) {
      try {
        if (this.payload.collections[collectionName]) {
          const count = await this.payload.count({ collection: collectionName })
          this.log(`📦 ${collectionName}: ${count.totalDocs} documents`)
        } else {
          this.log(`⚠️ ${collectionName}: Collection non trouvée`, 'warning')
        }
      } catch (error) {
        this.log(`❌ ${collectionName}: Erreur lors de la validation - ${error}`, 'error')
      }
    }
  }

  printStats() {
    this.log('\n📊 RÉSUMÉ DE LA MIGRATION')
    this.log('=' * 50)

    const collections = [
      { name: 'Utilisateurs', key: 'users' },
      { name: 'Programmes', key: 'programmes' },
      { name: 'Apprenants', key: 'apprenants' },
      { name: 'Rendez-vous', key: 'rendezVous' },
      { name: 'Articles', key: 'articles' },
      { name: 'Catégories', key: 'categories' },
      { name: 'Tags', key: 'tags' },
      { name: 'Contacts', key: 'contacts' },
    ]

    for (const collection of collections) {
      const stats = this.stats[collection.key as keyof MigrationStats]
      this.log(`${collection.name}:`)
      this.log(`  ✅ Importés: ${stats.imported}`)
      this.log(`  🔄 Mis à jour: ${stats.updated}`)
      this.log(`  ⏭️ Ignorés: ${stats.skipped}`)
      this.log(`  ❌ Erreurs: ${stats.errors}`)
    }

    const totalImported = Object.values(this.stats).reduce((sum, stat) => sum + stat.imported, 0)
    const totalUpdated = Object.values(this.stats).reduce((sum, stat) => sum + stat.updated, 0)
    const totalErrors = Object.values(this.stats).reduce((sum, stat) => sum + stat.errors, 0)

    this.log('\n🎯 TOTAUX:')
    this.log(`  ✅ Total importés: ${totalImported}`)
    this.log(`  🔄 Total mis à jour: ${totalUpdated}`)
    this.log(`  ❌ Total erreurs: ${totalErrors}`)

    if (this.options.dryRun) {
      this.log("\n🧪 Mode DRY RUN - Aucune donnée n'a été modifiée", 'warning')
    }
  }

  async run() {
    const initialized = await this.initialize()
    if (!initialized) {
      return false
    }

    try {
      await this.migrateUsers()
      await this.migrateProgrammes()
      await this.migrateApprenants()
      await this.migrateRendezVous()
      await this.migrateSampleArticles()
      await this.migrateSampleCategories()
      await this.migrateSampleTags()
      await this.migrateSampleContacts()

      await this.validateMigration()
      this.printStats()

      this.log('\n🎉 Migration terminée avec succès!', 'success')
      return true
    } catch (error) {
      this.log(`❌ Erreur fatale lors de la migration: ${error}`, 'error')
      return false
    }
  }
}

// Fonction principale
async function runMigration() {
  const args = process.argv.slice(2)
  const options: MigrationOptions = {
    forceUpdate: args.includes('--force'),
    skipExisting: !args.includes('--no-skip'),
    dryRun: args.includes('--dry-run'),
    verbose: !args.includes('--quiet'),
  }

  if (args.includes('--help')) {
    console.log(`
🚀 Script de migration Payload CMS

Usage: npx tsx src/scripts/migrate-collections-complete.ts [options]

Options:
  --force      Mettre à jour les documents existants
  --no-skip    Ne pas ignorer les documents existants
  --dry-run    Mode test (aucune modification)
  --quiet      Mode silencieux
  --help       Afficher cette aide

Exemples:
  npx tsx src/scripts/migrate-collections-complete.ts
  npx tsx src/scripts/migrate-collections-complete.ts --dry-run
  npx tsx src/scripts/migrate-collections-complete.ts --force --no-skip
`)
    process.exit(0)
  }

  const migration = new PayloadMigrationManager(options)
  const success = await migration.run()

  process.exit(success ? 0 : 1)
}

// Exécuter la migration
runMigration().catch(error => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})
