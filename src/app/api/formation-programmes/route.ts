import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env.local') });

export async function GET() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not defined');
    }

    const client = new MongoClient(mongoUri);
    await client.connect();
    
    const db = client.db();
    const collection = db.collection('formations_personnalisees');
    
    const programmes = await collection.find({}).toArray();
    
    await client.close();
    
    return NextResponse.json({
      success: true,
      data: programmes
    });
  } catch (error) {
    console.error('Erreur API formation-programmes:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des programmes de formation' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not defined');
    }

    const client = new MongoClient(mongoUri);
    await client.connect();
    
    const db = client.db();
    const collection = db.collection('formations_personnalisees');
    
    // Vérifier si le code formation existe déjà
    const existingProgramme = await collection.findOne({ 
      code_formation: body.code_formation 
    });
    
    if (existingProgramme) {
      await client.close();
      return NextResponse.json(
        { success: false, error: 'Une formation avec ce code formation existe déjà' },
        { status: 400 }
      );
    }
    
    // Créer la nouvelle formation
    const newFormation = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newFormation);
    
    await client.close();

    return NextResponse.json({
      success: true,
      data: {
        id: result.insertedId,
        ...newFormation
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la formation:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création de la formation' },
      { status: 500 }
    );
  }
}
