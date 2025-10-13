import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      throw new Error('MONGODB_URI not defined')
    }

    const client = new MongoClient(mongoUri)
    await client.connect()

    const db = client.db()
    const collection = db.collection('rendez-vous')

    // Essayer de trouver par ObjectId d'abord
    let rdv = await collection.findOne({ _id: new ObjectId(id) })

    // Si pas trouvé, essayer par id string
    if (!rdv) {
      rdv = await collection.findOne({ id: id })
    }

    await client.close()

    if (!rdv) {
      return NextResponse.json({ success: false, error: 'Rendez-vous non trouvé' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: rdv,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération du RDV:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération du rendez-vous' },
      { status: 500 }
    )
  }
}
