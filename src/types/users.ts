/**
 * Types pour la gestion des utilisateurs et permissions
 */

import { ID, Timestamped } from './utils';

// Rôles utilisateur étendus
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  FORMATEUR: 'formateur',
  APPRENANT: 'apprenant',
  GESTIONNAIRE: 'gestionnaire',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Permissions disponibles
export const PERMISSIONS = {
  // Gestion des utilisateurs
  USERS_READ: 'users:read',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  
  // Gestion des formations
  FORMATIONS_READ: 'formations:read',
  FORMATIONS_CREATE: 'formations:create',
  FORMATIONS_UPDATE: 'formations:update',
  FORMATIONS_DELETE: 'formations:delete',
  
  // Gestion des apprenants
  APPRENANTS_READ: 'apprenants:read',
  APPRENANTS_CREATE: 'apprenants:create',
  APPRENANTS_UPDATE: 'apprenants:update',
  APPRENANTS_DELETE: 'apprenants:delete',
  
  // Gestion des rendez-vous
  RENDEZ_VOUS_READ: 'rendez_vous:read',
  RENDEZ_VOUS_CREATE: 'rendez_vous:create',
  RENDEZ_VOUS_UPDATE: 'rendez_vous:update',
  RENDEZ_VOUS_DELETE: 'rendez_vous:delete',
  
  // Gestion des documents
  DOCUMENTS_READ: 'documents:read',
  DOCUMENTS_CREATE: 'documents:create',
  DOCUMENTS_UPDATE: 'documents:update',
  DOCUMENTS_DELETE: 'documents:delete',
  
  // Administration
  ADMIN_ACCESS: 'admin:access',
  SYSTEM_SETTINGS: 'system:settings',
  REPORTS_ACCESS: 'reports:access',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Statuts utilisateur
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
} as const;

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

// Interface utilisateur étendue
export interface User extends Timestamped {
  id: ID;
  email: string;
  password?: string; // Hashé, jamais en plain text
  name: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  lastLoginAt?: string;
  permissions: Permission[];
  metadata?: Record<string, any>;
}

// Interface pour la création d'utilisateur
export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  permissions?: Permission[];
}

// Interface pour la mise à jour d'utilisateur
export interface UpdateUserRequest {
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  status?: UserStatus;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  permissions?: Permission[];
  avatar?: string;
}

// Interface pour le changement de mot de passe
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Interface pour la connexion
export interface LoginRequest {
  email: string;
  password: string;
}

// Interface pour la réponse de connexion
export interface LoginResponse {
  user: Omit<User, 'password'>;
  token: string;
  refreshToken: string;
}

// Configuration des permissions par rôle
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [USER_ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [USER_ROLES.ADMIN]: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.FORMATIONS_READ,
    PERMISSIONS.FORMATIONS_CREATE,
    PERMISSIONS.FORMATIONS_UPDATE,
    PERMISSIONS.APPRENANTS_READ,
    PERMISSIONS.APPRENANTS_CREATE,
    PERMISSIONS.APPRENANTS_UPDATE,
    PERMISSIONS.RENDEZ_VOUS_READ,
    PERMISSIONS.RENDEZ_VOUS_CREATE,
    PERMISSIONS.RENDEZ_VOUS_UPDATE,
    PERMISSIONS.DOCUMENTS_READ,
    PERMISSIONS.DOCUMENTS_CREATE,
    PERMISSIONS.DOCUMENTS_UPDATE,
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.REPORTS_ACCESS,
  ],
  [USER_ROLES.FORMATEUR]: [
    PERMISSIONS.FORMATIONS_READ,
    PERMISSIONS.APPRENANTS_READ,
    PERMISSIONS.RENDEZ_VOUS_READ,
    PERMISSIONS.RENDEZ_VOUS_CREATE,
    PERMISSIONS.RENDEZ_VOUS_UPDATE,
    PERMISSIONS.DOCUMENTS_READ,
    PERMISSIONS.DOCUMENTS_CREATE,
  ],
  [USER_ROLES.GESTIONNAIRE]: [
    PERMISSIONS.APPRENANTS_READ,
    PERMISSIONS.APPRENANTS_CREATE,
    PERMISSIONS.APPRENANTS_UPDATE,
    PERMISSIONS.RENDEZ_VOUS_READ,
    PERMISSIONS.RENDEZ_VOUS_CREATE,
    PERMISSIONS.RENDEZ_VOUS_UPDATE,
    PERMISSIONS.DOCUMENTS_READ,
  ],
  [USER_ROLES.APPRENANT]: [
    PERMISSIONS.FORMATIONS_READ,
    PERMISSIONS.DOCUMENTS_READ,
  ],
};

// Fonction utilitaire pour vérifier les permissions
export function hasPermission(user: User, permission: Permission): boolean {
  return user.permissions.includes(permission) || 
         user.permissions.includes(PERMISSIONS.ADMIN_ACCESS);
}

// Fonction utilitaire pour vérifier le rôle
export function hasRole(user: User, role: UserRole): boolean {
  return user.role === role;
}

// Fonction utilitaire pour vérifier si l'utilisateur est actif
export function isUserActive(user: User): boolean {
  return user.status === USER_STATUS.ACTIVE;
}
