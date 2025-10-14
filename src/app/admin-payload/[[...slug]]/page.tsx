'use client'

import { useEffect } from 'react'

export default function PayloadAdminPage() {
  useEffect(() => {
    // Rediriger vers l'interface Payload native
    // L'interface Payload est maintenant accessible via /payload-cms
    window.location.href = '/payload-cms'
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Interface Payload CMS</h1>
        <p className="text-gray-600 mb-6">Redirection vers l'interface d'administration...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  )
}
