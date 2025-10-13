import { NextResponse } from 'next/server';
import { ApiRouteService } from '@/lib/api-route-service';

export async function GET() {
  try {
    const programmes = await ApiRouteService.getProgrammes();
    
    return NextResponse.json({
      success: true,
      data: programmes
    });
  } catch (error) {
    console.error('Erreur API programmes:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des programmes' },
      { status: 500 }
    );
  }
}
