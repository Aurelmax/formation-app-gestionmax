/**
 * Service direct MongoDB pour remplacer les services mock
 */

import { MongoClient } from 'mongodb'
import type { Programme, Apprenant, User } from '@/types/common'
import type { RendezVous } from '@/types/rendez-vous'
import type { Article } from '@/types/blog'

class MongoDBService {
  private static instance: MongoDBService
  private client: MongoClient | null = null
  private db: any = null

  private constructor() {}

  static getInstance(): MongoDBService {
    if (!MongoDBService.instance) {
      MongoDBService.instance = new MongoDBService()
    }
    return MongoDBService.instance
  }

  private async connect() {
    if (!this.client) {
      const mongoUri =
        process.env.MONGODB_URI || 'mongodb://localhost:27017/formation-app-gestionmax'
      this.client = new MongoClient(mongoUri)
      await this.client.connect()
      this.db = this.client.db('formation-app-gestionmax')
    }
    return this.db
  }

  // Programmes
  async getProgrammes(): Promise<Programme[]> {
    const db = await this.connect()
    const programmes = await db.collection('programmes').find({}).toArray()
    return programmes.map(this.transformProgramme)
  }

  async getProgramme(id: string): Promise<Programme | null> {
    const db = await this.connect()
    const programme = await db.collection('programmes').findOne({ _id: id })
    return programme ? this.transformProgramme(programme) : null
  }

  // Apprenants
  async getApprenants(): Promise<Apprenant[]> {
    const db = await this.connect()
    const apprenants = await db.collection('apprenants').find({}).toArray()
    return apprenants.map(this.transformApprenant)
  }

  async getApprenant(id: string): Promise<Apprenant | null> {
    const db = await this.connect()
    const apprenant = await db.collection('apprenants').findOne({ _id: id })
    return apprenant ? this.transformApprenant(apprenant) : null
  }

  // Utilisateurs
  async getUsers(): Promise<User[]> {
    const db = await this.connect()
    const users = await db.collection('users').find({}).toArray()
    return users.map(this.transformUser)
  }

  async getCurrentUser(): Promise<User> {
    const users = await this.getUsers()
    const adminUser = users.find(user => user.role === 'admin')
    if (adminUser) {
      return adminUser
    }
    // Fallback vers le premier utilisateur
    return (
      users[0] || {
        id: '1',
        email: 'admin@gestionmax.fr',
        name: 'Admin',
        firstName: 'Admin',
        role: 'admin',
        status: 'active',
        permissions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    )
  }

  // Rendez-vous
  async getRendezVous(): Promise<RendezVous[]> {
    const db = await this.connect()
    const rdvs = await db.collection('rendez-vous').find({}).toArray()
    return rdvs.map(this.transformRendezVous)
  }

  // Articles
  async getArticles(): Promise<Article[]> {
    const db = await this.connect()
    const articles = await db.collection('articles').find({}).toArray()
    return articles.map(this.transformArticle)
  }

  // Statistiques
  async getStats(): Promise<any> {
    const db = await this.connect()

    const [programmes, apprenants, users, rdvs, articles] = await Promise.all([
      db.collection('programmes').countDocuments(),
      db.collection('apprenants').countDocuments(),
      db.collection('users').countDocuments(),
      db.collection('rendez-vous').countDocuments(),
      db.collection('articles').countDocuments(),
    ])

    return {
      programmes,
      apprenants,
      users,
      rdvs,
      articles,
    }
  }

  // Transformateurs
  private transformProgramme(doc: any): Programme {
    return {
      id: doc._id.toString(),
      codeFormation: doc.codeFormation,
      titre: doc.titre,
      description: doc.description,
      duree: doc.duree,
      niveau: doc.niveau,
      modalites: doc.modalites,
      prix: doc.prix,
      statut: doc.statut === 'actif' ? 'PUBLIE' : 'BROUILLON',
      image: doc.image,
      formateurs: doc.formateurs || [],
      competences: doc.competences?.map((c: any) => c.competence) || [],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }
  }

  private transformApprenant(doc: any): Apprenant {
    return {
      id: doc._id.toString(),
      nom: doc.nom,
      prenom: doc.prenom,
      email: doc.email,
      telephone: doc.telephone,
      dateNaissance: doc.dateNaissance,
      adresse: doc.adresse,
      statut: doc.statut,
      programmes: doc.programmes || [],
      progression: doc.progression || 0,
      avatar: doc.avatar,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }
  }

  private transformUser(doc: any): User {
    return {
      id: doc._id.toString(),
      email: doc.email,
      name: doc.name,
      firstName: doc.firstName,
      lastName: doc.lastName,
      role: doc.role,
      status: doc.status,
      avatar: doc.avatar,
      phone: doc.phone,
      address: doc.address,
      dateOfBirth: doc.dateOfBirth,
      lastLoginAt: doc.lastLoginAt,
      permissions: doc.permissions || [],
      metadata: doc.metadata,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }
  }

  private transformRendezVous(doc: any): RendezVous {
    return {
      id: doc._id.toString(),
      programmeId: doc.programme || '',
      programmeTitre: doc.programmeTitre || '',
      client: {
        nom: doc.client.nom,
        prenom: doc.client.prenom,
        email: doc.client.email,
        telephone: doc.client.telephone,
        entreprise: doc.client.entreprise,
      },
      type: doc.type,
      statut: doc.statut,
      date: doc.date,
      heure: doc.heure,
      duree: doc.duree,
      lieu: doc.lieu,
      adresse: doc.adresse,
      lienVisio: doc.lienVisio,
      notes: doc.notes,
      rappelEnvoye: doc.rappelEnvoye || false,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      createdBy: doc.createdBy,
    }
  }

  private transformArticle(doc: any): Article {
    return {
      id: doc._id.toString(),
      titre: doc.titre,
      slug: doc.slug,
      contenu: doc.contenu,
      resume: doc.resume,
      auteur: doc.auteur,
      datePublication: doc.datePublication,
      dateModification: doc.dateModification,
      statut: doc.statut,
      categories: doc.categories || [],
      tags: doc.tags || [],
      imagePrincipale: doc.imagePrincipale,
      images: doc.images || [],
      metaDescription: doc.metaDescription,
      metaKeywords: doc.metaKeywords || [],
      vue: doc.vue || 0,
      tempsLecture: doc.tempsLecture,
      featured: doc.featured || false,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const db = await this.connect()
    const user = await db.collection('users').findOne({ email })
    return user ? this.transformUser(user) : null
  }

  async close() {
    if (this.client) {
      await this.client.close()
      this.client = null
      this.db = null
    }
  }
}

// Instance singleton
export const mongodbService = MongoDBService.getInstance()

// Export de la classe pour les tests
export { MongoDBService }
