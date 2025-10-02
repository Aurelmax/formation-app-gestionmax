'use client';

import { PublicLayout } from '@/components/layouts/public/PublicLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  User, 
  Clock, 
  AlertTriangle,
  Mail
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const categories = ['Tous', 'Débutant', 'Technique', 'E-commerce', 'Tendances', 'Sécurité', 'Outils'];

  const articles = [
    {
      id: 1,
      title: '10 erreurs à éviter lors de la création de votre site WordPress',
      excerpt: 'Découvrez les pièges les plus courants que font les débutants sur WordPress et comment les éviter pour créer un site professionnel dès le...',
      category: 'Débutant',
      date: '15 mai 2024',
      author: 'Marie Dubois',
      readTime: '5 min',
      image: '/images/blog-placeholder.jpg'
    },
    {
      id: 2,
      title: 'Comment optimiser la vitesse de votre site WordPress',
      excerpt: 'La vitesse de chargement est cruciale pour l\'expérience utilisateur et le référencement. Voici nos conseils d\'experts pour accélérer votre site.',
      category: 'Technique',
      date: '10 mai 2024',
      author: 'Pierre Martin',
      readTime: '8 min',
      image: '/images/blog-placeholder.jpg'
    },
    {
      id: 3,
      title: 'WooCommerce vs Shopify : quel choix pour votre e-commerce?',
      excerpt: 'Comparaison détaillée entre WooCommerce et Shopify pour vous aider à choisir la meilleure solution e-commerce selon vos besoins.',
      category: 'E-commerce',
      date: '5 mai 2024',
      author: 'Sophie Leroy',
      readTime: '6 min',
      image: '/images/blog-placeholder.jpg'
    },
    {
      id: 4,
      title: 'Les tendances WordPress 2024 à ne pas manquer',
      excerpt: 'Découvrez les dernières tendances en matière de design, fonctionnalités et développement WordPress pour rester à la pointe.',
      category: 'Tendances',
      date: '1er mai 2024',
      author: 'Thomas Rousseau',
      readTime: '7 min',
      image: '/images/blog-placeholder.jpg'
    },
    {
      id: 5,
      title: 'Sécuriser son site WordPress : guide complet 2024',
      excerpt: 'La sécurité WordPress est essentielle. Découvrez toutes les bonnes pratiques pour protéger efficacement votre site contre les cybermenaces.',
      category: 'Sécurité',
      date: '25 avril 2024',
      author: 'Marie Dubois',
      readTime: '10 min',
      image: '/images/blog-placeholder.jpg'
    },
    {
      id: 6,
      title: 'Gutenberg vs Elementor : quel éditeur choisir?',
      excerpt: 'Comparaison approfondie entre l\'éditeur natif Gutenberg et le page builder Elementor pour créer vos pages WordPress.',
      category: 'Outils',
      date: '20 avril 2024',
      author: 'Pierre Martin',
      readTime: '9 min',
      image: '/images/blog-placeholder.jpg'
    }
  ];

  const filteredArticles = selectedCategory === 'Tous' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20 overflow-hidden">
        <Image
          src="/formation-wordpress-antibes.webp"
          alt="Formation WordPress Antibes"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Blog WordPress</h1>
          <p className="text-xl text-gray-100 max-w-4xl mx-auto">
            Conseils, tutoriels et actualités pour maîtriser WordPress. Restez à jour avec les dernières tendances et bonnes pratiques.
          </p>
        </div>
      </section>

      {/* Warning Banner */}
      <section className="bg-yellow-50 border-l-4 border-yellow-400 py-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Blog en cours de mise à jour</h3>
              <p className="text-gray-700">
                Nous sommes en train d'améliorer notre blog pour vous offrir un contenu de meilleure qualité. Merci de votre patience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`px-6 py-2 rounded-full ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-all duration-300 border border-gray-200">
                {/* Article Image Placeholder */}
                <div className="h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
                  <div className="text-gray-400 text-sm">Image de l'article</div>
                </div>
                
                <CardContent className="p-6">
                  {/* Category Badge */}
                  <Badge className="mb-4 bg-gray-100 text-gray-700 hover:bg-gray-100">
                    {article.category}
                  </Badge>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-blue-900 mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {article.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                  </div>
                  
                  {/* Read Article Button */}
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Lire l'article
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-50">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Restez informé</h2>
          <p className="text-lg text-gray-600 mb-8">
            Recevez nos derniers articles et conseils WordPress directement dans votre boîte mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Votre adresse email" 
              className="flex-1"
            />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              <Mail className="h-4 w-4 mr-2" />
              S'abonner
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
