import {
  MOCK_USERS,
  MOCK_PROGRAMMES,
  MOCK_APPRENANTS,
  MOCK_RENDEZ_VOUS,
  MOCK_STATS,
} from '@/data/mock-data';

// Simule un délai réseau
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export class MockService {
  // Programmes
  static async getProgrammes() {
    await delay();
    return MOCK_PROGRAMMES;
  }

  static async getProgramme(id: string) {
    await delay();
    return MOCK_PROGRAMMES.find((p) => p.id === id) || null;
  }

  // Apprenants
  static async getApprenants() {
    await delay();
    return MOCK_APPRENANTS;
  }

  static async getApprenant(id: string) {
    await delay();
    return MOCK_APPRENANTS.find((a) => a.id === id) || null;
  }

  // Rendez-vous
  static async getRendezVous() {
    await delay();
    return MOCK_RENDEZ_VOUS;
  }

  // Stats
  static async getStats() {
    await delay();
    return MOCK_STATS;
  }

  // Users
  static async getUsers() {
    await delay();
    return MOCK_USERS;
  }

  static async getCurrentUser() {
    await delay();
    return MOCK_USERS[0]; // Admin par défaut
  }
}
