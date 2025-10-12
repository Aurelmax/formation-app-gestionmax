/**
 * Hook pour la gestion de l'authentification et des permissions
 */

import { useState, useEffect, useCallback } from 'react';
import { User, Permission, hasPermission, isUserActive } from '@/types/users';
import { userService } from '@/lib/user-service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkPermission: (permission: Permission) => boolean;
  hasRole: (role: string) => boolean;
  refreshUser: () => Promise<void>;
}

export function useAuth(): AuthState & AuthActions {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialiser l'état d'authentification
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // En production, vérifier le token stocké
        let token = localStorage.getItem('auth_token');
        
        // Pour le développement, créer un token par défaut si aucun n'existe
        if (!token) {
          token = 'dev_token_admin';
          localStorage.setItem('auth_token', token);
        }
        
        if (token) {
          // Gérer le token de debug
          if (token === 'debug_token_admin') {
            const user = await userService.getUserByEmail('aurelien@gestionmax.fr');
            if (user) {
              setState({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
              return;
            }
          }

          // Décoder le token et récupérer l'utilisateur
          // Pour le moment, utiliser l'utilisateur réel
          const user = await userService.getUserByEmail('aurelien@gestionmax.fr');
          if (user && isUserActive(user)) {
            setState({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            localStorage.removeItem('auth_token');
            setState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Erreur lors de l\'initialisation de l\'authentification',
        });
      }
    };

    initializeAuth();
  }, []);

  // Fonction de connexion
  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await userService.login({ email, password });
      
      // Stocker le token
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('refresh_token', response.refreshToken);
      
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur de connexion',
      });
    }
  }, []);

  // Fonction de déconnexion
  const logout = useCallback(() => {
    console.log('🚪 Déconnexion en cours...');
    
    // Supprimer tous les tokens et données d'authentification
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('debug_mode');
    
    // Réinitialiser l'état
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    
    console.log('✅ Déconnexion terminée');
    
    // Rediriger vers la page de login
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
  }, []);

  // Vérifier une permission
  const checkPermission = useCallback((permission: Permission): boolean => {
    if (!state.user || !isUserActive(state.user)) {
      return false;
    }
    return hasPermission(state.user, permission);
  }, [state.user]);

  // Vérifier un rôle
  const hasRole = useCallback((role: string): boolean => {
    return state.user?.role === role;
  }, [state.user]);

  // Rafraîchir les données utilisateur
  const refreshUser = useCallback(async () => {
    if (!state.user) return;
    
    try {
      const updatedUser = await userService.getUserById(state.user.id);
      if (updatedUser) {
        setState(prev => ({ ...prev, user: updatedUser }));
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de l\'utilisateur:', error);
    }
  }, [state.user]);

  return {
    ...state,
    login,
    logout,
    checkPermission,
    hasRole,
    refreshUser,
  };
}

// Hook pour vérifier une permission spécifique
export function usePermission(permission: Permission): boolean {
  const { checkPermission } = useAuth();
  return checkPermission(permission);
}

// Hook pour vérifier un rôle spécifique
export function useRole(role: string): boolean {
  const { hasRole } = useAuth();
  return hasRole(role);
}

// Hook pour obtenir l'utilisateur actuel
export function useCurrentUser(): User | null {
  const { user } = useAuth();
  return user;
}
