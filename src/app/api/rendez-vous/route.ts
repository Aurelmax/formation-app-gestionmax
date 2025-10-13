import { NextRequest, NextResponse } from 'next/server'
import { rendezVousServiceShared } from '@/lib/rendez-vous-service-shared'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API rendez-vous appelée')
    
    const { searchParams } = new URL(request.url)
    const filters = {
      statut: searchParams.get('statut') || undefined,
      type: searchParams.get('type') || undefined,
      lieu: searchParams.get('lieu') || undefined,
      programmeId: searchParams.get('programmeId') || undefined,
      dateDebut: searchParams.get('dateDebut') || undefined,
      dateFin: searchParams.get('dateFin') || undefined,
      search: searchParams.get('search') || undefined,
    }

    console.log('📋 Filtres:', filters)

    const result = await rendezVousServiceShared.getRendezVous(filters)
    
    console.log('✅ Rendez-vous:', result.rendezVous)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('❌ Erreur API rendez-vous:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des rendez-vous',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API création rendez-vous appelée')
    
    const body = await request.json()
    console.log('📋 Données reçues:', body)

    const nouveauRendezVous = await rendezVousServiceShared.createRendezVous(body)
    
    console.log('✅ Rendez-vous créé:', nouveauRendezVous)

    return NextResponse.json({
      success: true,
      data: nouveauRendezVous,
    })
  } catch (error) {
    console.error('❌ Erreur création rendez-vous:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la création du rendez-vous',
      },
      { status: 500 }
    )
  }
}