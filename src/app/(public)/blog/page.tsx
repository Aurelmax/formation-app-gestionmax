import { PublicLayout } from '@/components/layouts/public/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import Image from 'next/image';

export default function BlogPage() {
  const articles = [
    {
      id: 1,
      title: 'Les métiers du numérique en 2025',
      excerpt: 'Découvrez les tendances et opportunités dans le secteur du numérique pour cette nouvelle année.',
      category: 'Tendances',
      date: '15 janvier 2025',
      author: 'Marie Dubois',
    },
    {
      id: 2,
      title: 'Comment financer sa formation professionnelle ?',
      excerpt: 'Guide complet des dispositifs de financement : CPF, OPCO, Pôle Emploi et autres aides.',
      category: 'Conseils',
      date: '10 janvier 2025',
      author: 'Pierre Martin',
    },
    {
      id: 3,
      title: 'Reconversion : 5 conseils pour réussir',
      excerpt: 'Les clés pour réussir votre reconversion professionnelle et trouver le métier qui vous correspond.',
      category: 'Carrière',
      date: '5 janvier 2025',
      author: 'Marie Dubois',
    },
  ];

  return (
    <PublicLayout>
      {/* Header */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 overflow-hidden">
        <Image
          src="/formation-wordpress-antibes.webp"
          alt="Formation WordPress Antibes"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-gray-100">
            Actualités, conseils et tendances de la formation professionnelle
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition">
                <CardHeader>
                  <Badge className="w-fit mb-2">{article.category}</Badge>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {article.author}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
