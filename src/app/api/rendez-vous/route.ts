import { NextRequest, NextResponse } from 'next/server';
import { ApiRouteService } from '@/lib/api-route-service';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API rendez-vous appelée');
    const { searchParams } = new URL(request.url);
    
    const filters = {
      statut: searchParams.get('statut') || undefined,
      type: searchParams.get('type') || undefined,
      lieu: searchParams.get('lieu') || undefined,
      programmeId: searchParams.get('programmeId') || undefined,
      dateDebut: searchParams.get('dateDebut') || undefined,
      dateFin: searchParams.get('dateFin') || undefined,
      search: searchParams.get('search') || undefined,
    };

    console.log('📋 Filtres:', filters);
    const rendezVous = await ApiRouteService.getRendezVous();
    console.log('✅ Rendez-vous:', rendezVous);

    // Calculer les stats basiques
    const stats = {
      total: rendezVous.length,
      en_attente: rendezVous.filter(rdv => rdv.statut === 'en_attente').length,
      confirme: rendezVous.filter(rdv => rdv.statut === 'confirme').length,
      annule: rendezVous.filter(rdv => rdv.statut === 'annule').length,
      termine: rendezVous.filter(rdv => rdv.statut === 'termine').length
    };

    return NextResponse.json({
      success: true,
      data: {
        rendezVous,
        stats
      }
    });
  } catch (error) {
    console.error('❌ Erreur API rendez-vous:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des rendez-vous' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Pour l'instant, retourner un message de succès
    // TODO: Implémenter la création réelle de rendez-vous
    const rendezVous = {
      id: `rdv_${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: rendezVous
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur création rendez-vous:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création du rendez-vous' },
      { status: 500 }
    );
  }
}
