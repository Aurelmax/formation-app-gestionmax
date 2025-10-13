/**
 * Hook personnalisé pour gérer le basculement entre services mock et API
 */

import { useMemo } from 'react'
import { MockService } from '@/lib/mock-service'
import { UserService } from '@/lib/user-service'
import { RendezVousService } from '@/lib/rendez-vous-service'
import { BlogService } from '@/lib/blog-service'

export interface UseApiServiceReturn {
  // Services disponibles
  MockService: typeof MockService
  UserService: typeof UserService
  RendezVousService: typeof RendezVousService
  BlogService: typeof BlogService

  // Service actuel (toujours mock côté client)
  currentService: typeof MockService
  currentUserService: typeof UserService
  currentRendezVousService: typeof RendezVousService
  currentBlogService: typeof BlogService

  // État du mode
  isMockMode: boolean
  isApiMode: boolean
}

export function useApiService(): UseApiServiceReturn {
  // Côté client, toujours utiliser les services mock
  // Les vraies données MongoDB sont accessibles via les routes API
  const isMockMode = true
  const isApiMode = false

  // Retourner les services appropriés
  return useMemo(
    () => ({
      // Services disponibles
      MockService,
      UserService,
      RendezVousService,
      BlogService,

      // Services actuellement utilisés (toujours mock côté client)
      currentService: MockService,
      currentUserService: UserService,
      currentRendezVousService: RendezVousService,
      currentBlogService: BlogService,

      // État du mode
      isMockMode,
      isApiMode,
    }),
    []
  )
}

// Hook simplifié pour obtenir le service principal
export function useMainService() {
  const { currentService, isMockMode } = useApiService()
  return { service: currentService, isMockMode }
}

// Hook simplifié pour obtenir le service utilisateurs
export function useUserService() {
  const { currentUserService, isMockMode } = useApiService()
  return { service: currentUserService, isMockMode }
}

// Hook simplifié pour obtenir le service rendez-vous
export function useRendezVousService() {
  const { currentRendezVousService, isMockMode } = useApiService()
  return { service: currentRendezVousService, isMockMode }
}

// Hook simplifié pour obtenir le service blog
export function useBlogService() {
  const { currentBlogService, isMockMode } = useApiService()
  return { service: currentBlogService, isMockMode }
}
