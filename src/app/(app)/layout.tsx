import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import PlausibleProvider from 'next-plausible'
import '../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'GestionMax Formation',
  description: 'Plateforme de gestion de formations professionnelles',
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <PlausibleProvider
        domain={process.env['NEXT_PUBLIC_PLAUSIBLE_DOMAIN'] || 'gestion.fr'}
        customDomain="https://plausible.io"
        scriptProps={{
          src: 'https://plausible.io/js/pa-foXNNP06JJpbUKtH5aIuV.js'
        }}
      >
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          suppressHydrationWarning
        >
          {children}
        </body>
      </PlausibleProvider>
    </html>
  )
}
