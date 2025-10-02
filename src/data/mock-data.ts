import { User, Programme, Apprenant, RendezVous } from '@/types/common';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    nom: 'Dubois',
    prenom: 'Marie',
    email: 'marie.dubois@gestionmax.fr',
    role: 'ADMIN',
    avatar: '/images/avatars/admin.jpg',
  },
  {
    id: '2',
    nom: 'Martin',
    prenom: 'Pierre',
    email: 'pierre.martin@gestionmax.fr',
    role: 'FORMATEUR',
  },
  {
    id: '3',
    nom: 'Dupont',
    prenom: 'Sophie',
    email: 'sophie.dupont@example.com',
    role: 'BENEFICIAIRE',
  },
];

export const MOCK_PROGRAMMES: Programme[] = [
  {
    id: '1',
    titre: 'Développement Web Full Stack',
    description: 'Formation complète sur les technologies web modernes : React, Node.js, PostgreSQL',
    duree: 400,
    niveau: 'INTERMEDIAIRE',
    modalites: 'HYBRIDE',
    prix: 5000,
    statut: 'PUBLIE',
    formateurs: ['2'],
    competences: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    titre: 'Data Science avec Python',
    description: 'Maîtrisez l\'analyse de données avec Python, Pandas, NumPy et Machine Learning',
    duree: 300,
    niveau: 'AVANCE',
    modalites: 'DISTANCIEL',
    prix: 4500,
    statut: 'PUBLIE',
    formateurs: ['2'],
    competences: ['Python', 'Pandas', 'NumPy', 'Machine Learning'],
    createdAt: '2025-01-10T14:30:00Z',
  },
  {
    id: '3',
    titre: 'Design UX/UI avec Figma',
    description: 'Apprenez à créer des interfaces utilisateur modernes et intuitives',
    duree: 120,
    niveau: 'DEBUTANT',
    modalites: 'PRESENTIEL',
    prix: 2000,
    statut: 'PUBLIE',
    formateurs: ['2'],
    competences: ['Figma', 'UX Design', 'Prototypage', 'Design Systems'],
    createdAt: '2025-01-20T09:00:00Z',
  },
];

export const MOCK_APPRENANTS: Apprenant[] = [
  {
    id: '1',
    nom: 'Dupont',
    prenom: 'Sophie',
    email: 'sophie.dupont@example.com',
    telephone: '0612345678',
    dateNaissance: '1995-03-15',
    adresse: '12 Rue de la Paix, 75001 Paris',
    statut: 'ACTIF',
    programmes: ['1'],
    progression: 65,
    createdAt: '2024-12-01T10:00:00Z',
  },
  {
    id: '2',
    nom: 'Bernard',
    prenom: 'Lucas',
    email: 'lucas.bernard@example.com',
    telephone: '0698765432',
    dateNaissance: '1992-07-22',
    adresse: '8 Avenue Victor Hugo, 06000 Nice',
    statut: 'ACTIF',
    programmes: ['1', '2'],
    progression: 42,
    createdAt: '2024-11-15T14:30:00Z',
  },
];

export const MOCK_RENDEZ_VOUS: RendezVous[] = [
  {
    id: '1',
    titre: 'Entretien de positionnement',
    type: 'ENTRETIEN',
    date: '2025-10-10T10:00:00Z',
    duree: 60,
    statut: 'CONFIRME',
    formateurId: '2',
    apprenantId: '1',
    notes: 'Premier contact pour évaluer le niveau',
    lieu: 'Salle A - Bâtiment 1',
  },
  {
    id: '2',
    titre: 'Session React Avancé',
    type: 'FORMATION',
    date: '2025-10-12T14:00:00Z',
    duree: 180,
    statut: 'PLANIFIE',
    formateurId: '2',
    apprenantId: '1',
    lieu: 'Salle B - Bâtiment 2',
  },
];

// KPIs pour le dashboard
export const MOCK_STATS = {
  totalApprenants: 42,
  apprenantActifs: 35,
  totalProgrammes: 12,
  programmesActifs: 8,
  tauxReussite: 87,
  tauxSatisfaction: 4.5,
  prochainRendezVous: 5,
  documentsGeneres: 128,
};
