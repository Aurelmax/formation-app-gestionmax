import { NextRequest, NextResponse } from 'next/server';
import { rendezVousService } from '@/lib/rendez-vous-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rendezVous = await rendezVousService.getRendezVousById(params.id);

    if (!rendezVous) {
      return NextResponse.json(
        { success: false, error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: rendezVous
    });
  } catch (error) {
    console.error('Erreur API rendez-vous:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération du rendez-vous' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const rendezVous = await rendezVousService.updateRendezVous(params.id, body);

    return NextResponse.json({
      success: true,
      data: rendezVous
    });
  } catch (error) {
    console.error('Erreur mise à jour rendez-vous:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour du rendez-vous' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await rendezVousService.deleteRendezVous(params.id);

    return NextResponse.json({
      success: true,
      message: 'Rendez-vous supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression rendez-vous:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression du rendez-vous' },
      { status: 500 }
    );
  }
}
