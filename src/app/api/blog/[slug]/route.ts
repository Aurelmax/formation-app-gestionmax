import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/lib/blog-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Récupérer l'article par son slug
    const article = await BlogService.getArticleBySlug(slug);
    
    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier que l'article est publié (sécurité)
    if (article.statut !== 'publie') {
      return NextResponse.json(
        { success: false, error: 'Article non disponible' },
        { status: 404 }
      );
    }
    
    // Incrémenter le compteur de vues
    await BlogService.incrementViews(article.id);
    
    return NextResponse.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Erreur API article:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération de l\'article' },
      { status: 500 }
    );
  }
}
