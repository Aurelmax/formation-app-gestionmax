import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    const apprenants = await payload.find({
      collection: 'apprenants',
      limit: 1000,
      depth: 2, // Pour charger les relations (structureJuridique)
    })

    // Transformer les données Payload en format compatible avec l'interface
    const transformedData = apprenants.docs.map((apprenant: any) => ({
      id: apprenant.id,
      nom: apprenant.nom || '',
      prenom: apprenant.prenom || '',
      email: apprenant.email || '',
      telephone: apprenant.telephone || '',
      dateNaissance: apprenant.dateNaissance || null,
      numeroSecuriteSociale: apprenant.numeroSecuriteSociale || '',
      numeroCotisantIndividuel: apprenant.numeroCotisantIndividuel || '',
      statut: apprenant.statut || 'prospect',
      programme: apprenant.programme || '',
      progression: apprenant.progression || 0,
      formations: [], // À adapter selon votre structure
      dateInscription: apprenant.createdAt || new Date().toISOString(),
      // Relation B2B
      structureJuridique: apprenant.structureJuridique
        ? typeof apprenant.structureJuridique === 'object'
          ? {
              id: apprenant.structureJuridique.id,
              nom: apprenant.structureJuridique.nom,
              siret: apprenant.structureJuridique.siret,
              email: apprenant.structureJuridique.email,
            }
          : { id: apprenant.structureJuridique }
        : null,
      notes: apprenant.notes || '',
    }))

    return NextResponse.json({
      success: true,
      data: transformedData,
      total: apprenants.totalDocs,
    })
  } catch (error: any) {
    console.error('❌ Erreur API apprenants-payload:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des apprenants depuis Payload CMS',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
