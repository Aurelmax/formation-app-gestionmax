/**
 * Types pour les formulaires de l'application
 */

// Types pour les formulaires de l'application

// Types de base pour les formulaires
export interface FormState {
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  errors: Record<string, string>;
}
export interface BaseFormProps {
  onSubmit: (data: unknown) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
}

// Types pour les champs de formulaire
export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
  validation?: FormFieldValidation;
  defaultValue?: unknown;
  disabled?: boolean;
  hidden?: boolean;
}

export type FormFieldType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'date'
  | 'datetime-local'
  | 'time'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'hidden';

export interface FormFieldOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface FormFieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
}

// Types pour les formulaires de connexion
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormState extends FormState {
  data: LoginFormData;
}

// Types pour les formulaires d'inscription
export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  acceptTerms: boolean;
}

export interface RegisterFormState extends FormState {
  data: RegisterFormData;
}

// Types pour les formulaires de programmes
export interface ProgrammeFormData {
  titre: string;
  description: string;
  duree: number;
  niveau: string;
  modalites: string;
  prix: number;
  competences: string[];
  prerequis: string[];
  objectifs: string[];
  isActive: boolean;
}

export interface ProgrammeFormState extends FormState {
  data: ProgrammeFormData;
}

// Types pour les formulaires d'apprenants
export interface ApprenantFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  dateNaissance?: string;
  adresse?: string;
  niveauEtude?: string;
  experience?: string;
  objectifs?: string;
}

export interface ApprenantFormState extends FormState {
  data: ApprenantFormData;
}

// Types pour les formulaires de rendez-vous
export interface RendezVousFormData {
  apprenantId: string;
  programmeId: string;
  date: string;
  time: string;
  type: string;
  duree: number;
  modalite: string;
  lieu?: string;
  notes?: string;
}

export interface RendezVousFormState extends FormState {
  data: RendezVousFormData;
}

// Types pour les formulaires de contact
export interface ContactFormData {
  nom: string;
  email: string;
  telephone?: string;
  type: string;
  sujet: string;
  message: string;
}

export interface ContactFormState extends FormState {
  data: ContactFormData;
}

// Interface pour les messages de contact
export interface ContactMessage {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
  type: 'question' | 'reclamation' | 'formation' | 'devis';
  sujet: string;
  message: string;
  statut: 'nouveau' | 'en_cours' | 'traite' | 'ferme';
  dateReception: Date;
  dateReponse?: Date;
  reponse?: string;
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
}

// Interface pour les filtres de contact
export interface ContactFilters {
  searchTerm?: string;
  statut?: string;
  type?: string;
  priorite?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

// Types pour les formulaires de recherche
export interface SearchFormData {
  query: string;
  filters: Record<string, unknown>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchFormState extends FormState {
  data: SearchFormData;
}

// Types pour les formulaires de filtres
export interface FilterFormData {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  type?: string;
  category?: string;
}

export interface FilterFormState extends FormState {
  data: FilterFormData;
}

// Types pour les formulaires de profil
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  telephone?: string;
  adresse?: string;
  bio?: string;
  avatar?: File;
}

export interface ProfileFormState extends FormState {
  data: ProfileFormData;
}

// Types pour les formulaires de mot de passe
export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordFormState extends FormState {
  data: PasswordFormData;
}

// Types pour les formulaires de paramètres
export interface SettingsFormData {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisible: boolean;
    dataSharing: boolean;
  };
}

export interface SettingsFormState extends FormState {
  data: SettingsFormData;
}

// Types pour les formulaires d'évaluation
export interface EvaluationFormData {
  apprenantId: string;
  programmeId: string;
  type: string;
  note?: number;
  commentaires?: string;
  competences: CompetenceEvaluationForm[];
}

export interface CompetenceEvaluationForm {
  competence: string;
  niveau: number;
  commentaire?: string;
}

export interface EvaluationFormState extends FormState {
  data: EvaluationFormData;
}

// Types pour les formulaires de feedback
export interface FeedbackFormData {
  type: 'bug' | 'feature' | 'improvement' | 'other';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  attachments?: File[];
}

export interface FeedbackFormState extends FormState {
  data: FeedbackFormData;
}
