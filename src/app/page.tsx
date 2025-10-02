import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicLayout } from '@/components/layouts/public/PublicLayout';
import { ArrowRight, BookOpen, Users, Award, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const stats = [
    { label: 'Apprenants formés', value: '500+', icon: Users },
    { label: 'Formations', value: '50+', icon: BookOpen },
    { label: 'Taux de réussite', value: '95%', icon: TrendingUp },
    { label: 'Certifié Qualiopi', value: '2024', icon: Award },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-purple-700 text-white overflow-hidden">
        <Image
          src="/formation-wordpress-antibes.webp"
          alt="Formation WordPress Antibes"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-700/90" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Développez vos compétences avec GestionMax
            </h1>
            <p className="text-lg leading-8 text-gray-100 mb-8">
              Organisme de formation professionnelle certifié Qualiopi.
              Des formations de qualité adaptées à vos besoins et objectifs professionnels.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/catalogue">
                  Voir nos formations
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600" asChild>
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                    <Icon className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Formations populaires */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos formations les plus populaires</h2>
            <p className="text-muted-foreground">Découvrez nos programmes phares</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>Développement Web Full Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Maîtrisez React, Node.js et PostgreSQL pour devenir développeur full stack.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">400h</span>
                  <Button variant="outline" asChild>
                    <Link href="/catalogue">En savoir plus</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>Data Science avec Python</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Analyse de données, Machine Learning et visualisation avec Python.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">300h</span>
                  <Button variant="outline" asChild>
                    <Link href="/catalogue">En savoir plus</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>Design UX/UI avec Figma</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Créez des interfaces modernes et intuitives avec les outils professionnels.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">120h</span>
                  <Button variant="outline" asChild>
                    <Link href="/catalogue">En savoir plus</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/catalogue">Voir toutes les formations</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à vous former ?</h2>
          <p className="text-lg mb-8 text-gray-100">
            Contactez-nous pour discuter de votre projet de formation
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/contact">Demander un devis</Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
