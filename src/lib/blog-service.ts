import {
  Article,
  Categorie,
  Tag,
  CreateArticleRequest,
  UpdateArticleRequest,
  ArticleFilters,
  ArticleStats,
} from '@/types/blog'

// Données mock pour le développement
const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    titre: 'Introduction à la formation WordPress',
    slug: 'introduction-formation-wordpress',
    contenu:
      '<h1>Introduction à WordPress</h1><p>WordPress est un système de gestion de contenu (CMS) qui permet de créer et gérer facilement des sites web...</p>',
    resume:
      'Découvrez les bases de WordPress et comment créer votre premier site web professionnel.',
    auteur: 'Aurélien GestionMax',
    datePublication: '2024-01-15',
    dateModification: '2024-01-15',
    statut: 'publie',
    categories: ['wordpress', 'formation'],
    tags: ['cms', 'débutant', 'web'],
    imagePrincipale:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
    metaDescription: 'Apprenez les bases de WordPress avec notre formation complète',
    metaKeywords: ['wordpress', 'cms', 'formation', 'web'],
    vue: 1250,
    tempsLecture: 8,
    featured: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    titre: 'Optimisation SEO pour votre site',
    slug: 'optimisation-seo-site',
    contenu:
      '<h1>Les bases du SEO</h1><p>Le référencement naturel est essentiel pour améliorer la visibilité de votre site...</p>',
    resume: 'Techniques avancées pour améliorer le référencement de votre site web.',
    auteur: 'Aurélien GestionMax',
    datePublication: '2024-01-20',
    dateModification: '2024-01-20',
    statut: 'publie',
    categories: ['seo', 'marketing'],
    tags: ['seo', 'référencement', 'optimisation'],
    imagePrincipale:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    metaDescription: 'Guide complet pour optimiser le SEO de votre site web',
    metaKeywords: ['seo', 'référencement', 'optimisation', 'marketing'],
    vue: 890,
    tempsLecture: 12,
    featured: false,
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: '3',
    titre: 'Gestion des médias dans WordPress',
    slug: 'gestion-medias-wordpress',
    contenu:
      '<h1>Bibliothèque de médias</h1><p>WordPress offre une bibliothèque de médias complète pour gérer vos images...</p>',
    resume: 'Apprenez à gérer efficacement vos images et médias dans WordPress.',
    auteur: 'Aurélien GestionMax',
    datePublication: '2024-01-25',
    dateModification: '2024-01-25',
    statut: 'brouillon',
    categories: ['wordpress', 'médias'],
    tags: ['images', 'médias', 'bibliothèque'],
    imagePrincipale:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
    metaDescription: 'Guide complet pour gérer les médias dans WordPress',
    metaKeywords: ['wordpress', 'médias', 'images', 'bibliothèque'],
    vue: 0,
    tempsLecture: 6,
    featured: false,
    createdAt: '2024-01-25T09:15:00Z',
    updatedAt: '2024-01-25T09:15:00Z',
  },
]

const MOCK_CATEGORIES: Categorie[] = [
  {
    id: '1',
    nom: 'WordPress',
    slug: 'wordpress',
    description: 'Articles sur WordPress et son écosystème',
    couleur: '#21759B',
    icone: '🚀',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    nom: 'SEO',
    slug: 'seo',
    description: 'Optimisation pour les moteurs de recherche',
    couleur: '#FF6B35',
    icone: '🔍',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    nom: 'Formation',
    slug: 'formation',
    description: 'Contenu pédagogique et formations',
    couleur: '#4ECDC4',
    icone: '📚',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    nom: 'Marketing',
    slug: 'marketing',
    description: 'Stratégies marketing digital',
    couleur: '#45B7D1',
    icone: '📈',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

const MOCK_TAGS: Tag[] = [
  {
    id: '1',
    nom: 'CMS',
    slug: 'cms',
    couleur: '#6B7280',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    nom: 'Débutant',
    slug: 'debutant',
    couleur: '#10B981',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    nom: 'Web',
    slug: 'web',
    couleur: '#3B82F6',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    nom: 'Référencement',
    slug: 'referencement',
    couleur: '#F59E0B',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    nom: 'Optimisation',
    slug: 'optimisation',
    couleur: '#EF4444',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    nom: 'Images',
    slug: 'images',
    couleur: '#8B5CF6',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '7',
    nom: 'Médias',
    slug: 'medias',
    couleur: '#06B6D4',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

// Fonction utilitaire pour simuler un délai réseau
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Fonction pour générer un slug à partir d'un titre
const generateSlug = (titre: string): string => {
  return titre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Fonction pour calculer le temps de lecture
const calculateReadingTime = (contenu: string): number => {
  const wordsPerMinute = 200
  const words = contenu.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

class BlogService {
  // Articles
  static async getArticles(filters?: ArticleFilters): Promise<Article[]> {
    await delay()

    let articles = [...MOCK_ARTICLES]

    if (filters) {
      if (filters.statut) {
        articles = articles.filter(article => article.statut === filters.statut)
      }

      if (filters.categorie) {
        articles = articles.filter(article => article.categories.includes(filters.categorie!))
      }

      if (filters.tag) {
        articles = articles.filter(article => article.tags.includes(filters.tag!))
      }

      if (filters.auteur) {
        articles = articles.filter(article =>
          article.auteur.toLowerCase().includes(filters.auteur!.toLowerCase())
        )
      }

      if (filters.featured !== undefined) {
        articles = articles.filter(article => article.featured === filters.featured)
      }

      if (filters.recherche) {
        const searchTerm = filters.recherche.toLowerCase()
        articles = articles.filter(
          article =>
            article.titre.toLowerCase().includes(searchTerm) ||
            article.resume.toLowerCase().includes(searchTerm) ||
            article.contenu.toLowerCase().includes(searchTerm)
        )
      }
    }

    return articles.sort((a, b) => {
      const dateA = a.datePublication ? new Date(a.datePublication).getTime() : 0
      const dateB = b.datePublication ? new Date(b.datePublication).getTime() : 0
      return dateB - dateA
    })
  }

  static async getArticleById(id: string): Promise<Article | null> {
    await delay()
    return MOCK_ARTICLES.find(article => article.id === id) || null
  }

  static async getArticleBySlug(slug: string): Promise<Article | null> {
    await delay()
    return MOCK_ARTICLES.find(article => article.slug === slug) || null
  }

  static async createArticle(articleData: CreateArticleRequest): Promise<Article> {
    await delay()

    const now = new Date().toISOString()
    const newArticle: Article = {
      id: `article_${Date.now()}`,
      slug: generateSlug(articleData.titre),
      dateModification: now.split('T')[0],
      datePublication:
        articleData.statut === 'publie'
          ? articleData.datePublication || now.split('T')[0]
          : undefined,
      tempsLecture: calculateReadingTime(articleData.contenu),
      vue: 0,
      createdAt: now,
      updatedAt: now,
      ...articleData,
    }

    MOCK_ARTICLES.push(newArticle)
    return newArticle
  }

  static async updateArticle(id: string, articleData: UpdateArticleRequest): Promise<Article> {
    await delay()

    const articleIndex = MOCK_ARTICLES.findIndex(article => article.id === id)
    if (articleIndex === -1) {
      throw new Error('Article non trouvé')
    }

    const now = new Date().toISOString()
    const currentArticle = MOCK_ARTICLES[articleIndex]!

    // Construct updated article with explicit type
    const updatedArticle: Article = {
      ...currentArticle,
      ...articleData,
      id: currentArticle.id, // Preserve original id
      dateModification: now.split('T')[0],
      updatedAt: now,
    }

    // Si passage en statut 'publie' et pas de datePublication, on l'ajoute
    if (articleData.statut === 'publie' && !updatedArticle.datePublication) {
      updatedArticle.datePublication = articleData.datePublication || now.split('T')[0]
    }

    if (articleData.titre) {
      updatedArticle.slug = generateSlug(articleData.titre)
    }

    if (articleData.contenu) {
      updatedArticle.tempsLecture = calculateReadingTime(articleData.contenu)
    }

    MOCK_ARTICLES[articleIndex] = updatedArticle
    return updatedArticle
  }

  static async deleteArticle(id: string): Promise<void> {
    await delay()

    const articleIndex = MOCK_ARTICLES.findIndex(article => article.id === id)
    if (articleIndex === -1) {
      throw new Error('Article non trouvé')
    }

    MOCK_ARTICLES.splice(articleIndex, 1)
  }

  static async incrementViews(id: string): Promise<void> {
    await delay()

    const article = MOCK_ARTICLES.find(article => article.id === id)
    if (article) {
      article.vue++
    }
  }

  // Catégories
  static async getCategories(): Promise<Categorie[]> {
    await delay()
    return [...MOCK_CATEGORIES]
  }

  static async getCategoryById(id: string): Promise<Categorie | null> {
    await delay()
    return MOCK_CATEGORIES.find(category => category.id === id) || null
  }

  static async createCategory(
    categoryData: Omit<Categorie, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Categorie> {
    await delay()

    const newCategory: Categorie = {
      id: `category_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...categoryData,
    }

    MOCK_CATEGORIES.push(newCategory)
    return newCategory
  }

  // Tags
  static async getTags(): Promise<Tag[]> {
    await delay()
    return [...MOCK_TAGS]
  }

  static async getTagById(id: string): Promise<Tag | null> {
    await delay()
    return MOCK_TAGS.find(tag => tag.id === id) || null
  }

  static async createTag(tagData: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tag> {
    await delay()

    const newTag: Tag = {
      id: `tag_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...tagData,
    }

    MOCK_TAGS.push(newTag)
    return newTag
  }

  // Statistiques
  static async getArticleStats(): Promise<ArticleStats> {
    await delay()

    const articles = MOCK_ARTICLES
    const publies = articles.filter(a => a.statut === 'publie')
    const brouillons = articles.filter(a => a.statut === 'brouillon')
    const archives = articles.filter(a => a.statut === 'archive')

    const vuesTotal = articles.reduce((sum, article) => sum + article.vue, 0)

    const articlesPopulaires = [...articles].sort((a, b) => b.vue - a.vue).slice(0, 5)

    const categoriesPopulaires = MOCK_CATEGORIES.map(category => ({
      categorie: category.nom,
      count: articles.filter(a => a.categories.includes(category.slug)).length,
    })).sort((a, b) => b.count - a.count)

    const auteursActifs = Array.from(new Set(articles.map(a => a.auteur)))
      .map(auteur => ({
        auteur,
        count: articles.filter(a => a.auteur === auteur).length,
      }))
      .sort((a, b) => b.count - a.count)

    return {
      total: articles.length,
      publies: publies.length,
      brouillons: brouillons.length,
      archives: archives.length,
      vuesTotal,
      articlesPopulaires,
      categoriesPopulaires,
      auteursActifs,
    }
  }
}

export { BlogService }
