import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 🔧 MIDDLEWARE TEMPORAIREMENT DÉSACTIVÉ POUR TESTS
// Raison: L'authentification Payload native ne fonctionne pas dans l'instance Next.js embarquée
// Les routes REST API Payload (/api/users/*) ne sont pas exposées automatiquement

export function middleware(_request: NextRequest) {
  // ✅ Laisser passer toutes les requêtes sans vérification
  return NextResponse.next()
}

/*
// 📝 CODE ORIGINAL (À RÉACTIVER PLUS TARD SI BESOIN)
// Routes qui nécessitent une authentification
const protectedRoutes = ['/admin', '/dashboard']

// Routes Payload CMS (ne pas intercepter)
const payloadRoutes = ['/payload-cms', '/api']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ne pas intercepter les routes Payload
  if (payloadRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Vérifier si la route nécessite une authentification
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Vérifier si l'utilisateur a un cookie de session Payload
    const payloadToken = request.cookies.get('payload-token')

    if (!payloadToken) {
      // Rediriger vers la page de login
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}
*/

// Configuration des routes à intercepter
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
