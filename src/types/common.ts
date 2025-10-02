export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'ADMIN' | 'FORMATEUR' | 'BENEFICIAIRE';
  avatar?: string;
}

export interface Programme {
  id: string;
  titre: string;
  description: string;
  duree: number; // heures
  niveau: 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE';
  modalites: 'PRESENTIEL' | 'DISTANCIEL' | 'HYBRIDE';
  prix: number;
  statut: 'BROUILLON' | 'PUBLIE' | 'ARCHIVE';
  image?: string;
  formateurs: string[]; // IDs
  competences: string[];
  createdAt: string;
}

export interface Apprenant {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  adresse: string;
  statut: 'ACTIF' | 'INACTIF' | 'TERMINE';
  programmes: string[]; // Programme IDs
  progression: number; // 0-100
  avatar?: string;
  createdAt: string;
}

export interface RendezVous {
  id: string;
  titre: string;
  type: 'ENTRETIEN' | 'FORMATION' | 'EVALUATION' | 'SUIVI';
  date: string;
  duree: number; // minutes
  statut: 'PLANIFIE' | 'CONFIRME' | 'TERMINE' | 'ANNULE';
  formateurId: string;
  apprenantId: string;
  notes?: string;
  lieu?: string;
  visio?: string; // URL
}
