import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../../.env.local') });

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not defined');
    }

    const client = new MongoClient(mongoUri);
    await client.connect();
    
    const db = client.db();
    const collection = db.collection('formations_personnalisees');
    
    const id = new ObjectId(params.id);
    const programme = await collection.findOne({ _id: id });
    
    await client.close();
    
    if (!programme) {
      return NextResponse.json(
        { success: false, error: 'Programme de formation non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: programme
    });
  } catch (error) {
    console.error('Erreur API formation-programmes/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération du programme de formation' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
    
    const id = new ObjectId(params.id);
    
    // Vérifier si la formation existe
    const existingFormation = await collection.findOne({ _id: id });
    if (!existingFormation) {
      await client.close();
      return NextResponse.json(
        { success: false, error: 'Formation non trouvée' },
        { status: 404 }
      );
    }
    
    // Vérifier si le code formation est unique (sauf pour la formation actuelle)
    if (body.code_formation && body.code_formation !== existingFormation.code_formation) {
      const duplicateFormation = await collection.findOne({ 
        code_formation: body.code_formation,
        _id: { $ne: id }
      });
      
      if (duplicateFormation) {
        await client.close();
        return NextResponse.json(
          { success: false, error: 'Une formation avec ce code formation existe déjà' },
          { status: 400 }
        );
      }
    }
    
    // Mettre à jour la formation
    const updateData = {
      ...body,
      updatedAt: new Date()
    };
    
    const result = await collection.updateOne(
      { _id: id },
      { $set: updateData }
    );
    
    await client.close();

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Formation non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: params.id, ...updateData }
    });
  } catch (error) {
    console.error('Erreur lors de la modification de la formation:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la modification de la formation' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not defined');
    }

    const client = new MongoClient(mongoUri);
    await client.connect();
    
    const db = client.db();
    const collection = db.collection('formations_personnalisees');
    
    const id = new ObjectId(params.id);
    
    const result = await collection.deleteOne({ _id: id });
    
    await client.close();

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Formation non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Formation supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la formation:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression de la formation' },
      { status: 500 }
    );
  }
}