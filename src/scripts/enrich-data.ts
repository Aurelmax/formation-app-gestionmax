import { config } from 'dotenv'
import { getPayload } from 'payload'
import payloadConfig from '../payload.config'

// Charger les variables d'environnement
config({ path: '.env.local' })

interface EnrichmentOptions {
  dryRun?: boolean
  verbose?: boolean
  collection?: string
}

class DataEnrichmentManager {
  private payload: any
  private options: EnrichmentOptions

  constructor(options: EnrichmentOptions = {}) {
    this.options = {
      dryRun: false,
      verbose: true,
      ...options,
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
    this.log("🚀 Initialisation de l'enrichissement des données...")

    try {
      this.payload = await getPayload({ config: payloadConfig })
      this.log('✅ Connexion à Payload CMS établie')
      return true
    } catch (error) {
      this.log(`❌ Erreur lors de l'initialisation: ${error}`, 'error')
      return false
    }
  }

  // === ENRICHISSEMENT DES PROGRAMMES ===
  async enrichProgrammes() {
    this.log('\n📚 Enrichissement des programmes...')

    try {
      const programmes = await this.payload.find({
        collection: 'programmes',
        limit: 100,
      })

      for (const programme of programmes.docs) {
        const enrichments = {
          // Ajouter des compétences manquantes
          competences: this.getAdditionalCompetences(programme.titre),

          // Enrichir la description
          description: this.enrichDescription(programme.description, programme.titre),

          // Ajouter des objectifs détaillés
          objectifs: this.generateDetailedObjectives(programme.titre, programme.niveau),

          // Ajouter des prérequis spécifiques
          prerequis: this.generatePrerequisites(programme.niveau, programme.titre),

          // Ajouter des modalités pédagogiques
          modalitesPedagogiques: this.generatePedagogicalMethods(
            programme.modalites,
            programme.titre
          ),

          // Ajouter des méthodes d'évaluation
          evaluation: this.generateEvaluationMethods(programme.titre),

          // Ajouter des certifications
          certification: this.generateCertification(programme.titre),

          // Ajouter un code CPF si éligible
          eligibleCPF: this.isEligibleForCPF(programme.titre),
          codeCPF: this.isEligibleForCPF(programme.titre)
            ? this.generateCPFCode(programme.titre)
            : undefined,
        }

        if (!this.options.dryRun) {
          await this.payload.update({
            collection: 'programmes',
            id: programme.id,
            data: enrichments,
          })
        }

        this.log(`✅ Programme enrichi: ${programme.titre}`)
      }

      this.log(`🎉 ${programmes.docs.length} programmes enrichis`)
    } catch (error) {
      this.log(`❌ Erreur lors de l'enrichissement des programmes: ${error}`, 'error')
    }
  }

  // === ENRICHISSEMENT DES UTILISATEURS ===
  async enrichUsers() {
    this.log('\n👤 Enrichissement des utilisateurs...')

    try {
      const users = await this.payload.find({
        collection: 'users',
        limit: 100,
      })

      for (const user of users.docs) {
        const enrichments = {
          // Ajouter des permissions selon le rôle
          permissions: this.generatePermissions(user.role),

          // Ajouter des métadonnées
          metadata: {
            lastLoginAt: new Date().toISOString(),
            profileComplete: true,
            source: 'migration',
            version: '1.0',
          },
        }

        if (!this.options.dryRun) {
          await this.payload.update({
            collection: 'users',
            id: user.id,
            data: enrichments,
          })
        }

        this.log(`✅ Utilisateur enrichi: ${user.name}`)
      }

      this.log(`🎉 ${users.docs.length} utilisateurs enrichis`)
    } catch (error) {
      this.log(`❌ Erreur lors de l'enrichissement des utilisateurs: ${error}`, 'error')
    }
  }

  // === ENRICHISSEMENT DES APPRENANTS ===
  async enrichApprenants() {
    this.log('\n👥 Enrichissement des apprenants...')

    try {
      const apprenants = await this.payload.find({
        collection: 'apprenants',
        limit: 100,
      })

      for (const apprenant of apprenants.docs) {
        const enrichments = {
          // Ajouter des informations complémentaires
          progression: this.calculateProgression(apprenant.statut),

          // Ajouter des métadonnées
          metadata: {
            source: 'migration',
            lastActivity: new Date().toISOString(),
            profileScore: this.calculateProfileScore(apprenant),
          },
        }

        if (!this.options.dryRun) {
          await this.payload.update({
            collection: 'apprenants',
            id: apprenant.id,
            data: enrichments,
          })
        }

        this.log(`✅ Apprenant enrichi: ${apprenant.nom} ${apprenant.prenom}`)
      }

      this.log(`🎉 ${apprenants.docs.length} apprenants enrichis`)
    } catch (error) {
      this.log(`❌ Erreur lors de l'enrichissement des apprenants: ${error}`, 'error')
    }
  }

  // === ENRICHISSEMENT DES ARTICLES ===
  async enrichArticles() {
    this.log('\n📝 Enrichissement des articles...')

    try {
      const articles = await this.payload.find({
        collection: 'articles',
        limit: 100,
      })

      for (const article of articles.docs) {
        const enrichments = {
          // Ajouter des mots-clés SEO
          metaKeywords: this.generateSEOKeywords(article.titre, article.contenu),

          // Améliorer la meta description
          metaDescription: this.generateMetaDescription(article.resume, article.titre),

          // Ajouter un temps de lecture estimé
          tempsLecture: this.calculateReadingTime(article.contenu),

          // Ajouter des statistiques
          vue: 0,
          featured: this.shouldBeFeatured(article.titre),
        }

        if (!this.options.dryRun) {
          await this.payload.update({
            collection: 'articles',
            id: article.id,
            data: enrichments,
          })
        }

        this.log(`✅ Article enrichi: ${article.titre}`)
      }

      this.log(`🎉 ${articles.docs.length} articles enrichis`)
    } catch (error) {
      this.log(`❌ Erreur lors de l'enrichissement des articles: ${error}`, 'error')
    }
  }

  // === MÉTHODES UTILITAIRES ===

  private getAdditionalCompetences(titre: string): Array<{ competence: string }> {
    const competencesMap: Record<string, string[]> = {
      WordPress: ['Gutenberg', 'Elementor', 'Yoast SEO', 'Wordfence'],
      SEO: ['Google Search Console', 'Google Analytics', 'Mots-clés', 'Netlinking'],
      Marketing: ['Facebook Ads', 'Google Ads', 'Email Marketing', 'Analytics'],
      Canva: ['Design graphique', 'Branding', 'Réseaux sociaux', 'Print'],
      ChatGPT: ['IA générative', 'Prompting', 'Automatisation', 'Productivité'],
    }

    const competences: Array<{ competence: string }> = []

    for (const [keyword, skills] of Object.entries(competencesMap)) {
      if (titre.toLowerCase().includes(keyword.toLowerCase())) {
        skills.forEach(skill => {
          competences.push({ competence: skill })
        })
      }
    }

    return competences
  }

  private enrichDescription(description: string, _titre: string): string {
    if (description.length > 500) return description

    const enrichments = {
      WordPress:
        "\n\nCette formation vous permettra de maîtriser WordPress de A à Z, de l'installation à la personnalisation avancée.",
      SEO: '\n\nApprenez les techniques de référencement naturel pour améliorer la visibilité de votre site web.',
      Marketing:
        '\n\nDéveloppez vos compétences en marketing digital pour attirer et convertir vos clients.',
      Canva: '\n\nCréez des visuels professionnels pour votre communication digitale et print.',
      ChatGPT:
        "\n\nExploitez la puissance de l'IA générative pour automatiser vos tâches et améliorer votre productivité.",
    }

    for (const [keyword, enrichment] of Object.entries(enrichments)) {
      if (titre.toLowerCase().includes(keyword.toLowerCase())) {
        return description + enrichment
      }
    }

    return description
  }

  private generateDetailedObjectives(titre: string, niveau: string): string {
    const objectives = {
      WordPress: `À l'issue de cette formation, vous saurez :
• Installer et configurer WordPress
• Personnaliser l'apparence de votre site
• Gérer le contenu et les médias
• Optimiser les performances et la sécurité
• Utiliser les plugins essentiels`,

      SEO: `Objectifs pédagogiques :
• Comprendre les enjeux du référencement naturel
• Optimiser le contenu pour les moteurs de recherche
• Utiliser les outils d'analyse (Google Analytics, Search Console)
• Mettre en place une stratégie SEO efficace`,

      Marketing: `Cette formation vous permettra de :
• Développer une stratégie marketing digitale
• Créer et gérer des campagnes publicitaires
• Analyser les performances et optimiser les résultats
• Automatiser vos processus marketing`,
    }

    for (const [keyword, objective] of Object.entries(objectives)) {
      if (titre.toLowerCase().includes(keyword.toLowerCase())) {
        return objective
      }
    }

    return `Formation ${niveau.toLowerCase()} de ${titre} - Objectifs détaillés à définir selon vos besoins spécifiques.`
  }

  private generatePrerequisites(niveau: string, _titre: string): string {
    if (niveau === 'DEBUTANT') {
      return "Aucun prérequis technique. Maîtrise de base de l'environnement informatique recommandée."
    }

    if (niveau === 'INTERMEDIAIRE') {
      return 'Connaissances de base en informatique et navigation web. Expérience recommandée avec les outils numériques.'
    }

    if (niveau === 'AVANCE') {
      return 'Expérience confirmée dans le domaine. Connaissances approfondies des outils numériques requises.'
    }

    return 'Prérequis à définir selon le niveau et le contenu de la formation.'
  }

  private generatePedagogicalMethods(modalites: string, _titre: string): string {
    const methods = {
      PRESENTIEL:
        "Formation en présentiel avec alternance d'exposés théoriques et de travaux pratiques. Support de cours fourni.",
      DISTANCIEL:
        'Formation à distance avec sessions en visioconférence, exercices pratiques et suivi personnalisé.',
      HYBRIDE:
        'Formation hybride combinant sessions en présentiel et à distance pour une approche flexible et efficace.',
    }

    return (
      methods[modalites] ||
      'Modalités pédagogiques adaptées au contenu et aux objectifs de la formation.'
    )
  }

  private generateEvaluationMethods(titre: string): string {
    return `Évaluation continue tout au long de la formation :
• Quiz de validation des acquis
• Exercices pratiques
• Projet final de mise en application
• Attestation de formation délivrée`
  }

  private generateCertification(titre: string): string {
    return 'Attestation de formation professionnelle délivrée par GestionMax Formation'
  }

  private isEligibleForCPF(titre: string): boolean {
    const cpfEligibleKeywords = ['WordPress', 'SEO', 'Marketing', 'Digital', 'Formation']
    return cpfEligibleKeywords.some(keyword => titre.toLowerCase().includes(keyword.toLowerCase()))
  }

  private generateCPFCode(titre: string): string {
    const prefix = 'RS'
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')
    return `${prefix}${random}`
  }

  private generatePermissions(role: string): Array<{ permission: string }> {
    const permissionsMap: Record<string, string[]> = {
      superAdmin: [
        'users:read',
        'users:create',
        'users:update',
        'users:delete',
        'formations:read',
        'formations:create',
        'formations:update',
        'formations:delete',
        'apprenants:read',
        'apprenants:create',
        'apprenants:update',
        'apprenants:delete',
        'rendez_vous:read',
        'rendez_vous:create',
        'rendez_vous:update',
        'rendez_vous:delete',
        'admin:access',
        'system:settings',
        'reports:access',
      ],
      admin: [
        'users:read',
        'users:create',
        'users:update',
        'formations:read',
        'formations:create',
        'formations:update',
        'apprenants:read',
        'apprenants:create',
        'apprenants:update',
        'rendez_vous:read',
        'rendez_vous:create',
        'rendez_vous:update',
        'admin:access',
        'reports:access',
      ],
      formateur: [
        'formations:read',
        'formations:update',
        'apprenants:read',
        'apprenants:update',
        'rendez_vous:read',
        'rendez_vous:create',
        'rendez_vous:update',
      ],
      gestionnaire: [
        'apprenants:read',
        'apprenants:create',
        'apprenants:update',
        'rendez_vous:read',
        'rendez_vous:create',
        'rendez_vous:update',
        'reports:access',
      ],
      apprenant: ['formations:read', 'apprenants:read'],
    }

    const permissions = permissionsMap[role] || []
    return permissions.map(permission => ({ permission }))
  }

  private calculateProgression(statut: string): number {
    const progressionMap: Record<string, number> = {
      ACTIF: 25,
      EN_COURS: 50,
      TERMINE: 100,
      INACTIF: 0,
    }
    return progressionMap[statut] || 0
  }

  private calculateProfileScore(apprenant: any): number {
    let score = 0
    if (apprenant.email) score += 20
    if (apprenant.telephone) score += 20
    if (apprenant.dateNaissance) score += 20
    if (apprenant.adresse) score += 20
    if (apprenant.programmes && apprenant.programmes.length > 0) score += 20
    return score
  }

  private generateSEOKeywords(titre: string, _contenu: string): Array<{ keyword: string }> {
    const keywords = [
      'formation',
      'apprentissage',
      'compétences',
      'professionnel',
      'développement',
      'digital',
      'technologie',
      'expertise',
    ]

    // Extraire des mots-clés du titre
    const titleWords = titre
      .toLowerCase()
      .split(' ')
      .filter(word => word.length > 3)
    keywords.push(...titleWords)

    return keywords.slice(0, 10).map(keyword => ({ keyword }))
  }

  private generateMetaDescription(resume: string, _titre: string): string {
    if (resume && resume.length > 120) {
      return resume.substring(0, 120) + '...'
    }
    return `Formation ${titre} - Découvrez nos programmes de formation professionnelle pour développer vos compétences.`
  }

  private calculateReadingTime(contenu: string): number {
    const wordsPerMinute = 200
    const wordCount = contenu.split(' ').length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  private shouldBeFeatured(titre: string): boolean {
    const featuredKeywords = ['WordPress', 'SEO', 'Marketing', 'Guide', 'Complet']
    return featuredKeywords.some(keyword => titre.toLowerCase().includes(keyword.toLowerCase()))
  }

  // === MÉTHODE PRINCIPALE ===
  async enrichData() {
    const initialized = await this.initialize()
    if (!initialized) {
      return false
    }

    if (this.options.dryRun) {
      this.log('🧪 Mode DRY RUN - Aucune donnée ne sera modifiée', 'warning')
    }

    try {
      if (!this.options.collection || this.options.collection === 'programmes') {
        await this.enrichProgrammes()
      }

      if (!this.options.collection || this.options.collection === 'users') {
        await this.enrichUsers()
      }

      if (!this.options.collection || this.options.collection === 'apprenants') {
        await this.enrichApprenants()
      }

      if (!this.options.collection || this.options.collection === 'articles') {
        await this.enrichArticles()
      }

      this.log('\n🎉 Enrichissement des données terminé!', 'success')
      return true
    } catch (error) {
      this.log(`❌ Erreur lors de l'enrichissement: ${error}`, 'error')
      return false
    }
  }
}

// Fonction principale
async function runEnrichment() {
  const args = process.argv.slice(2)
  const options: EnrichmentOptions = {
    dryRun: args.includes('--dry-run'),
    verbose: !args.includes('--quiet'),
    collection: args.find(arg => arg.startsWith('--collection='))?.split('=')[1],
  }

  if (args.includes('--help')) {
    console.log(`
🎨 Script d'enrichissement des données Payload CMS

Usage: npx tsx src/scripts/enrich-data.ts [options]

Options:
  --dry-run              Mode test (aucune modification)
  --quiet                Mode silencieux
  --collection=NAME      Enrichir une collection spécifique
  --help                 Afficher cette aide

Collections disponibles:
  programmes             Enrichir les programmes de formation
  users                  Enrichir les utilisateurs
  apprenants             Enrichir les apprenants
  articles               Enrichir les articles

Exemples:
  npx tsx src/scripts/enrich-data.ts
  npx tsx src/scripts/enrich-data.ts --dry-run
  npx tsx src/scripts/enrich-data.ts --collection=programmes
  npx tsx src/scripts/enrich-data.ts --collection=users --dry-run
`)
    process.exit(0)
  }

  const enricher = new DataEnrichmentManager(options)
  const success = await enricher.enrichData()

  process.exit(success ? 0 : 1)
}

// Exécuter l'enrichissement
runEnrichment().catch(error => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})
