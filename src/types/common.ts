/**
 * Types globaux partagés dans toute l'application
 */

import { Timestamped } from './utils';
// Types de base
export type ID = string;
export type UUID = string;
export type ISODate = string;
// Rôles utilisateur
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  FORMATEUR: 'FORMATEUR',
  BENEFICIAIRE: 'BENEFICIAIRE',
} as const;
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
// Interface User
export interface User extends Timestamped {
  id: ID;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  avatar?: string;
}
// Niveaux de formation
export const NIVEAUX = {
  DEBUTANT: 'DEBUTANT',
  INTERMEDIAIRE: 'INTERMEDIAIRE',
  AVANCE: 'AVANCE',
} as const;
export type Niveau = typeof NIVEAUX[keyof typeof NIVEAUX];
// Modalités de formation
export const MODALITES = {
  PRESENTIEL: 'PRESENTIEL',
  DISTANCIEL: 'DISTANCIEL',
  HYBRIDE: 'HYBRIDE',
} as const;
export type Modalite = typeof MODALITES[keyof typeof MODALITES];
// Statuts de programme
export const PROGRAMME_STATUTS = {
  BROUILLON: 'BROUILLON',
  PUBLIE: 'PUBLIE',
  ARCHIVE: 'ARCHIVE',
} as const;
export type ProgrammeStatut = typeof PROGRAMME_STATUTS[keyof typeof PROGRAMME_STATUTS];
// Interface Programme
export interface Programme extends Timestamped {
  id: ID;
  codeFormation: string; // Code formation interne (ex: A009-SW-MA)
  titre: string;
  description: string;
  duree: number; // heures
  niveau: Niveau;
  modalites: Modalite;
  prix: number;
  statut: ProgrammeStatut;
  image?: string;
  formateurs: ID[]; // IDs
  competences: string[];
}
// Statuts apprenant
export const APPRENANT_STATUTS = {
  ACTIF: 'ACTIF',
  INACTIF: 'INACTIF',
  TERMINE: 'TERMINE',
} as const;
export type ApprenantStatut = typeof APPRENANT_STATUTS[keyof typeof APPRENANT_STATUTS];
// Interface Apprenant
export interface Apprenant extends Timestamped {
  id: ID;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: ISODate;
  adresse: string;
  statut: ApprenantStatut;
  programmes: ID[]; // Programme IDs
  progression: number; // 0-100
  avatar?: string;
}
// Types de rendez-vous
export const RENDEZ_VOUS_TYPES = {
  ENTRETIEN: 'ENTRETIEN',
  FORMATION: 'FORMATION',
  EVALUATION: 'EVALUATION',
  SUIVI: 'SUIVI',
} as const;
export type RendezVousType = typeof RENDEZ_VOUS_TYPES[keyof typeof RENDEZ_VOUS_TYPES];
// Statuts rendez-vous
export const RENDEZ_VOUS_STATUTS = {
  PLANIFIE: 'PLANIFIE',
  CONFIRME: 'CONFIRME',
  TERMINE: 'TERMINE',
  ANNULE: 'ANNULE',
} as const;
export type RendezVousStatut = typeof RENDEZ_VOUS_STATUTS[keyof typeof RENDEZ_VOUS_STATUTS];
// Interface RendezVous
export interface RendezVous extends Timestamped {
  id: ID;
  titre: string;
  type: RendezVousType;
  date: ISODate;
  duree: number; // minutes
  statut: RendezVousStatut;
  formateurId: ID;
  apprenantId: ID;
  notes?: string;
  lieu?: string;
  visio?: string; // URL
}
