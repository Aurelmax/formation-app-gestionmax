/**
 * Types générés automatiquement depuis la configuration Payload
 * Ces types correspondent exactement aux collections définies dans payload.config.ts
 */

export interface User {
  id: string
  name: string
  firstName?: string
  lastName?: string
  role: 'superAdmin' | 'admin' | 'formateur' | 'gestionnaire' | 'apprenant'
  status: 'active' | 'inactive' | 'pending'
  email: string
  password: string
  createdAt: string
  updatedAt: string
}

export interface FormationPersonnalisee {
  id: string
  title: string
  codeFormation: string
  objectifs?: Record<string, unknown>
  programmeDetail?: Array<{
    jour?: string
    duree?: string
    modules?: Array<{
      titre: string
      description?: string
      duree?: string
      contenu?: Record<string, unknown>
    }>
  }>
  modalitesAcces?: {
    prerequis?: string
    publicConcerne?: string
    duree?: string
    horaires?: string
    delaisMiseEnPlace?: string
    tarif?: number
    modalitesReglement?: string
  }
  contactFormateur?: {
    nom: string
    email: string
    telephone?: string
    role?: string
    biographie?: string
  }
  modalitesPedagogiques?: Record<string, unknown>
  ressourcesDispo?: Array<{
    ressource: string
    description?: string
  }>
  modalitesEvaluation?: {
    typesEvaluation?: Array<{
      type: string
      description?: string
    }>
    plateformeEvaluation?: string
    grilleAnalyse?: string
  }
  sanctionFormation?: string
  niveauCertification?: string
  accessibiliteHandicap?: {
    referentHandicap?: string
    contactReferent?: string
    adaptationsProposees?: string
  }
  cessationAbandon?: {
    conditionsRenonciation?: string
    facturationAbandon?: string
  }
  statut: 'EN_COURS' | 'FINALISEE' | 'LIVREE' | 'ARCHIVE'
  createdAt: string
  updatedAt: string
}

export interface Apprenant {
  id: string
  nom: string
  prenom: string
  email: string
  telephone?: string
  dateNaissance?: string
  adresse?: {
    rue?: string
    ville?: string
    codePostal?: string
    pays?: string
  }
  statut: 'actif' | 'inactif' | 'suspendu'
  formationsInscrites?: string[]
  createdAt: string
  updatedAt: string
}

export interface RendezVous {
  id: string
  client: {
    nom: string
    prenom: string
    email: string
    telephone?: string
  }
  programmeTitre: string
  date: string
  heure: string
  statut: 'planifie' | 'confirme' | 'annule' | 'termine'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Article {
  id: string
  title: string
  slug: string
  content?: Record<string, unknown>
  excerpt?: string
  status: 'draft' | 'published' | 'archived'
  publishedDate?: string
  author?: string
  tags?: string[]
  featuredImage?: string
  createdAt: string
  updatedAt: string
}

export interface Media {
  id: string
  filename: string
  mimeType: string
  filesize: number
  width?: number
  height?: number
  url: string
  alt?: string
  createdAt: string
  updatedAt: string
}

// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage?: number
  nextPage?: number
}

// Types pour les formulaires
export type FormationPersonnaliseeFormData = Omit<
  FormationPersonnalisee,
  'id' | 'createdAt' | 'updatedAt'
>

// Types pour les props des composants
export interface FormationPersonnaliseeFormProps {
  formation?: FormationPersonnaliseeFormData | Partial<FormationPersonnaliseeFormData>
  onSave: (formation: FormationPersonnaliseeFormData) => void
  onCancel: () => void
  isLoading?: boolean
  rdvData?: Record<string, unknown>
}
