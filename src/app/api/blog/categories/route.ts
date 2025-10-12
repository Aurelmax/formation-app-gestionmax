import { NextResponse } from 'next/server';
import { BlogService } from '@/lib/blog-service';

export async function GET() {
  try {
    const categories = await BlogService.getCategories();
    
    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Erreur API catégories:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    );
  }
}
