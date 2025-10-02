import {
  MOCK_USERS,
  MOCK_PROGRAMMES,
  MOCK_APPRENANTS,
  MOCK_RENDEZ_VOUS,
  MOCK_STATS,
} from '@/data/mock-data';
import type { Programme, Apprenant, RendezVous, User } from '@/types/common';

// Simule un délai réseau
const delay = (ms: number = 500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export class MockService {
  // Programmes
  static async getProgrammes(): Promise<Programme[]> {
    await delay();
    return MOCK_PROGRAMMES;
  }

  static async getProgramme(id: string): Promise<Programme | null> {
    await delay();
    return MOCK_PROGRAMMES.find((p) => p.id === id) || null;
  }

  // Apprenants
  static async getApprenants(): Promise<Apprenant[]> {
    await delay();
    return MOCK_APPRENANTS;
  }

  static async getApprenant(id: string): Promise<Apprenant | null> {
    await delay();
    return MOCK_APPRENANTS.find((a) => a.id === id) || null;
  }

  // Rendez-vous
  static async getRendezVous(): Promise<RendezVous[]> {
    await delay();
    return MOCK_RENDEZ_VOUS;
  }

  // Stats
  static async getStats(): Promise<typeof MOCK_STATS> {
    await delay();
    return MOCK_STATS;
  }

  // Users
  static async getUsers(): Promise<User[]> {
    await delay();
    return MOCK_USERS;
  }

  static async getCurrentUser(): Promise<User> {
    await delay();
    return MOCK_USERS[0]!; // Admin par défaut
  }
}
