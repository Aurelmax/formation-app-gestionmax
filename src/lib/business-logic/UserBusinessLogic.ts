import { User, CreateUserRequest, UpdateUserRequest, UserRole } from '@/types/users&apos;;
import { validate, userValidationRules } from '@/lib/validation&apos;;

/**
 * Logique métier pour la gestion des utilisateurs
 * Sépare la logique métier de l&apos;interface utilisateur
 */
export class UserBusinessLogic {
  /**
   * Valide un utilisateur
   */
  static validateUser(user: Partial<User>): Record<string, string> {
    return validate(user, userValidationRules);
  }

  /**
   * Valide une requête de création d&apos;utilisateur
   */
  static validateCreateUserRequest(request: CreateUserRequest): Record<string, string> {
    return validate(request, userValidationRules);
  }

  /**
   * Génère un nom d&apos;utilisateur à partir du nom et prénom
   */
  static generateUsername(firstName: string, lastName: string): string {
    const cleanFirstName = firstName.toLowerCase().replace(/[^a-z]/g, '');
    const cleanLastName = lastName.toLowerCase().replace(/[^a-z]/g, '');
    return `${cleanFirstName}.${cleanLastName}`;
  }

  /**
   * Génère un mot de passe temporaire
   */
  static generateTemporaryPassword(length: number = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return password;
  }

  /**
   * Vérifie si un utilisateur peut être supprimé
   */
  static canDeleteUser(user: User, currentUser: User): { canDelete: boolean; reason?: string } {
    // Un utilisateur ne peut pas se supprimer lui-même
    if (user.id === currentUser.id) {
      return { canDelete: false, reason: 'Vous ne pouvez pas supprimer votre propre compte' };
    }

    // Vérifier les permissions
    if (currentUser.role === 'apprenant&apos;) {
      return { canDelete: false, reason: 'Permissions insuffisantes&apos; };
    }

    // Un apprenant ne peut pas supprimer un admin ou formateur
    if (currentUser.role === 'gestionnaire' && ['admin&apos;, 'formateur'].includes(user.role)) {
      return { canDelete: false, reason: 'Permissions insuffisantes pour supprimer cet utilisateur' };
    }

    return { canDelete: true };
  }

  /**
   * Vérifie si un utilisateur peut modifier un autre utilisateur
   */
  static canModifyUser(targetUser: User, currentUser: User): { canModify: boolean; reason?: string } {
    // Un utilisateur peut toujours se modifier lui-même (sauf le rôle)
    if (targetUser.id === currentUser.id) {
      return { canModify: true };
    }

    // Vérifier les permissions
    if (currentUser.role === 'apprenant&apos;) {
      return { canModify: false, reason: 'Permissions insuffisantes&apos; };
    }

    // Un gestionnaire ne peut pas modifier un admin ou formateur
    if (currentUser.role === 'gestionnaire' && ['admin&apos;, 'formateur'].includes(targetUser.role)) {
      return { canModify: false, reason: 'Permissions insuffisantes pour modifier cet utilisateur' };
    }

    return { canModify: true };
  }

  /**
   * Vérifie si un utilisateur peut changer le rôle d&apos;un autre utilisateur
   */
  static canChangeUserRole(targetUser: User, newRole: UserRole, currentUser: User): { canChange: boolean; reason?: string } {
    // Seuls les admins peuvent changer les rôles
    if (currentUser.role !== 'admin&apos;) {
      return { canChange: false, reason: 'Seuls les administrateurs peuvent changer les rôles&apos; };
    }

    // Un utilisateur ne peut pas changer son propre rôle
    if (targetUser.id === currentUser.id) {
      return { canChange: false, reason: 'Vous ne pouvez pas changer votre propre rôle' };
    }

    return { canChange: true };
  }

  /**
   * Calcule les statistiques d&apos;un utilisateur
   */
  static calculateUserStats(user: User) {
    const now = new Date();
    const createdAt = new Date(user.createdAt);
    const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

    return {
      daysSinceCreation,
      isActive: user.status === 'active',
      hasCompleteProfile: !!(user.firstName && user.lastName && user.email),
      roleLevel: this.getRoleLevel(user.role)
    };
  }

  /**
   * Obtient le niveau hiérarchique d&apos;un rôle
   */
  private static getRoleLevel(role: UserRole): number {
    const roleLevels = {
      'apprenant&apos;: 1,
      'gestionnaire': 2,
      'formateur': 3,
      'admin&apos;: 4,
      'super_admin&apos;: 5
    };
    return roleLevels[role] || 0;
  }

  /**
   * Filtre les utilisateurs selon les permissions
   */
  static filterUsersByPermissions(users: User[], currentUser: User): User[] {
    if (currentUser.role === 'super_admin&apos; || currentUser.role === 'admin&apos;) {
      return users;
    }

    if (currentUser.role === 'formateur') {
      return users.filter(user => ['apprenant&apos;, 'gestionnaire'].includes(user.role));
    }

    if (currentUser.role === 'gestionnaire') {
      return users.filter(user => user.role === 'apprenant&apos;);
    }

    return [];
  }

  /**
   * Prépare les données d&apos;utilisateur pour l&apos;affichage
   */
  static prepareUserForDisplay(user: User): User {
    return {
      ...user,
      // Masquer les informations sensibles si nécessaire
      password: undefined,
      // Formater les dates
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt)
    };
  }

  /**
   * Génère un résumé d&apos;utilisateur
   */
  static generateUserSummary(user: User): string {
    const stats = this.calculateUserStats(user);
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'Utilisateur';
    
    return `${fullName} (${user.role}) - ${stats.isActive ? 'Actif' : 'Inactif'} - Créé il y a ${stats.daysSinceCreation} jour(s)`;
  }

  /**
   * Vérifie la force d&apos;un mot de passe
   */
  static checkPasswordStrength(password: string): { strength: 'weak' | 'medium&apos; | 'strong'; score: number; feedback: string[] } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('Au moins 8 caractères&apos;);

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Au moins une minuscule');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Au moins une majuscule');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Au moins un chiffre');

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('Au moins un caractère spécial&apos;);

    let strength: 'weak' | 'medium&apos; | 'strong';
    if (score < 3) strength = 'weak';
    else if (score < 5) strength = 'medium&apos;;
    else strength = 'strong';

    return { strength, score, feedback };
  }
}
