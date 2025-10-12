import { NextResponse } from 'next/server';
import { BlogService } from '@/lib/blog-service';

export async function GET() {
  try {
    const tags = await BlogService.getTags();
    
    return NextResponse.json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error('Erreur API tags:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des tags' },
      { status: 500 }
    );
  }
}
