'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PayloadFullPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Vérifier si Payload est accessible
    const checkPayload = async () => {
      try {
        // Essayer de charger l'interface Payload
        const response = await fetch('/api/payload/health', {
          method: 'GET',
        });
        
        if (response.ok) {
          setIsLoading(false);
        } else {
          setError('Payload CMS n\'est pas accessible');
          setIsLoading(false);
        }
      } catch {
        setError('Erreur de connexion à Payload CMS');
        setIsLoading(false);
      }
    };

    checkPayload();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Chargement de Payload CMS</h2>
          <p className="text-muted-foreground">
            Connexion à l&apos;interface d&apos;administration...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Erreur de connexion
            </h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Payload CMS</h1>
              <p className="text-sm text-muted-foreground">
                Interface d&apos;administration complète
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('/admin/payload/full', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Nouvel onglet
            </Button>
          </div>
        </div>
      </div>

      {/* Interface Payload intégrée */}
      <div className="h-[calc(100vh-80px)]">
        <iframe
          src="/admin"
          className="w-full h-full border-0"
          title="Payload CMS Interface"
          onLoad={() => setIsLoading(false)}
          onError={() => setError('Erreur de chargement de l\'interface Payload')}
        />
      </div>
    </div>
  );
}
