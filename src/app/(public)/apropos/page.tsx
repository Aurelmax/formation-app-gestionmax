import { PublicLayout } from '@/components/layouts/public/PublicLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Users, Target, Heart } from 'lucide-react';
import Image from 'next/image';

export default function AproposPage() {
  const values = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'Des formations de qualité certifiées Qualiopi pour garantir votre réussite.',
    },
    {
      icon: Users,
      title: 'Accompagnement',
      description: 'Un suivi personnalisé tout au long de votre parcours de formation.',
    },
    {
      icon: Target,
      title: 'Résultats',
      description: 'Un taux de réussite de 95% grâce à notre pédagogie éprouvée.',
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Une équipe passionnée dédiée à votre développement professionnel.',
    },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
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
          <h1 className="text-4xl font-bold mb-4">À propos de GestionMax</h1>
          <p className="text-lg text-gray-100">
            Votre partenaire formation depuis 2015
          </p>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Notre histoire</h2>
          <div className="prose prose-lg mx-auto text-muted-foreground">
            <p className="text-center mb-6">
              Créé en 2015, GestionMax Formation est devenu un acteur majeur de la formation professionnelle en France. 
              Notre mission est simple : accompagner les professionnels dans leur montée en compétences et leur évolution de carrière.
            </p>
            <p className="text-center">
              Certifié Qualiopi depuis 2021, nous garantissons la qualité de nos formations et l'excellence de notre accompagnement. 
              Avec plus de 500 apprenants formés et un taux de satisfaction de 4.8/5, nous sommes fiers de contribuer au développement 
              professionnel de nos participants.
            </p>
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Nos valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="text-center">
                  <CardContent className="pt-6">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Nos certifications</h2>
          <div className="bg-gray-50 rounded-lg p-8">
            <Award className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Certification Qualiopi</h3>
            <p className="text-muted-foreground">
              Organisme de formation certifié Qualiopi depuis 2021, garantissant la qualité de nos actions de formation.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
