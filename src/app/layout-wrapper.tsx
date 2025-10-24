'use client'

import { usePathname } from 'next/navigation'
import './globals.css'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Si on est sur une route Payload CMS, on retourne children sans wrapper HTML
  // car Payload gère son propre <html> et <body>
  if (pathname?.startsWith('/payload-cms')) {
    return <>{children}</>
  }

  // Pour toutes les autres routes, on wrap avec html et body
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
