import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GestionMax Formation',
  description: 'Plateforme de gestion de formations professionnelles',
}

// Root layout - doit gérer le cas spécial de Payload CMS
// Payload CMS crée son propre <html> et <body>, donc on ne doit PAS le wrapper
export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Pour Payload CMS uniquement, on retourne children sans wrapper
  // Payload gère son propre layout complet avec <html> et <body>
  // Note: Cette détection se fait automatiquement via la structure des routes
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
