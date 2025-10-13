import { NextResponse } from 'next/server';
import { ApiRouteService } from '@/lib/api-route-service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const programme = await ApiRouteService.getProgramme(id);
    
    if (!programme) {
      return NextResponse.json(
        { success: false, error: 'Programme non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: programme
    });
  } catch (error) {
    console.error('Erreur API programme:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération du programme' },
      { status: 500 }
    );
  }
}
