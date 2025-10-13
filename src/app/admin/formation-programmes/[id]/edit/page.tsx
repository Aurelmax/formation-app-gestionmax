'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FormationPersonnaliseeForm } from '@/components/admin/FormationPersonnaliseeForm';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';

export default function EditFormationPersonnaliseePage() {
  const [formation, setFormation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const params = useParams();
  const formationId = params.id as string;

  useEffect(() => {
    if (formationId) {
      loadFormation();
    }
  }, [formationId]);

  const loadFormation = async () => {
    try {
      const response = await fetch(`/api/formation-programmes/${formationId}`);
      const result = await response.json();
      
      if (result.success) {
        setFormation(result.data);
      } else {
        toast.error('Erreur lors du chargement de la formation');
        router.push('/admin/formation-programmes');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la formation:', error);
      toast.error('Erreur lors du chargement de la formation');
      router.push('/admin/formation-programmes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (formationData: any) => {
    setIsSaving(true);
    
    try {
      const response = await fetch(`/api/formation-programmes/${formationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formationData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la modification de la formation');
      }

      toast.success('Formation modifiée avec succès !');
      router.push('/admin/formation-programmes');
      
    } catch (error: any) {
      console.error('Erreur lors de la modification de la formation:', error);
      toast.error(error.message || 'Erreur lors de la modification de la formation');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/formation-programmes');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement de la formation...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!formation) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Formation non trouvée</h1>
            <p className="text-muted-foreground mb-4">La formation demandée n'existe pas ou a été supprimée.</p>
            <button
              onClick={() => router.push('/admin/formation-programmes')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Modifier la formation personnalisée</h1>
          <p className="text-muted-foreground">
            Modifiez les informations de la formation : {formation.title}
          </p>
        </div>
        
        <FormationPersonnaliseeForm
          formation={formation}
          onSave={handleSave}
          onCancel={handleCancel}
          isLoading={isSaving}
        />
      </div>
    </DashboardLayout>
  );
}
