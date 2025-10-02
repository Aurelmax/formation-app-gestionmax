'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PublicLayout } from '@/components/layouts/public/PublicLayout';
import { 
  ArrowRight, 
  BookOpen, 
  Users, 
  Award, 
  Phone, 
  Calendar,
  CheckCircle,
  Search,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

export default function HomePage() {
  const [isFaqOpen, setIsFaqOpen] = useState<number | null>(null);

  const formations = [
    {
      id: 1,
      title: "Génération de contenu avec ChatGPT + Automatisation Marketing",
      duration: "2 jours",
      level: "Débutant",
      description: "Maîtrisez l'IA pour créer du contenu et automatiser vos campagnes marketing."
    },
    {
      id: 2,
      title: "WordPress pour débutants - Créer son premier site",
      duration: "3 jours",
      level: "Débutant",
      description: "Apprenez les bases de WordPress et créez votre premier site professionnel."
    },
    {
      id: 3,
      title: "Développement WordPress avancé",
      duration: "5 jours",
      level: "Intermédiaire",
      description: "Développez des thèmes et plugins personnalisés avec PHP et JavaScript."
    },
    {
      id: 4,
      title: "WooCommerce - E-commerce avec WordPress",
      duration: "4 jours",
      level: "Intermédiaire",
      description: "Créez une boutique en ligne complète avec WooCommerce."
    },
    {
      id: 5,
      title: "Sécurité WordPress - Protection avancée",
      duration: "2 jours",
      level: "Avancé",
      description: "Sécurisez votre site WordPress contre les cyberattaques."
    },
    {
      id: 6,
      title: "Performance WordPress - Optimisation",
      duration: "3 jours",
      level: "Intermédiaire",
      description: "Optimisez la vitesse et les performances de votre site WordPress."
    }
  ];

  const faqItems = [
    {
      question: "Qui peut suivre une formation WordPress?",
      answer: "Nos formations s'adressent à tous les profils : débutants, développeurs, entrepreneurs, marketeurs. Chaque formation est adaptée au niveau des participants."
    },
    {
      question: "Faut-il avoir des connaissances techniques pour apprendre WordPress?",
      answer: "Non, nos formations débutant ne nécessitent aucune connaissance technique préalable. Nous partons des bases et progressons étape par étape."
    },
    {
      question: "Les formations sont-elles éligibles au CPF?",
      answer: "Oui, toutes nos formations sont éligibles au Compte Personnel de Formation (CPF) et peuvent être financées par votre OPCO."
    },
    {
      question: "Quel est le format des formations?",
      answer: "Nous proposons des formations en présentiel à Antibes, en distanciel ou en hybride selon vos préférences et contraintes."
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section - UNIQUE */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Formations WordPress Professionnelles</h1>
          <p className="text-xl text-gray-100 max-w-4xl mx-auto mb-8">
            Développez vos compétences WordPress avec un formateur certifié. Formations éligibles FAF & OPCO et conformes Qualiopi.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              <Phone className="h-5 w-5 mr-2" />
              Appeler maintenant
            </Button>
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3">
              <Calendar className="h-5 w-5 mr-2" />
              RDV de positionnement
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <CheckCircle className="h-4 w-4 mr-2" />
              Certifié Qualiopi
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Award className="h-4 w-4 mr-2" />
              Éligible FAF & OPCO
            </Button>
          </div>
        </div>
      </section>

      {/* Votre formateur certifié */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Votre formateur certifié</h2>
              <p className="text-lg text-gray-600 mb-8">
                Formateur indépendant certifié Qualiopi avec plus de 8 ans d'expérience dans l'enseignement WordPress. 
                Passionné par la transmission de connaissances et l'accompagnement personnalisé de chaque apprenant.
              </p>
              
              <div className="space-y-4">
                {[
                  'Certification Qualiopi',
                  'Formations éligibles CPF',
                  'Suivi personnalisé',
                  'Support technique inclus'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 text-center shadow-lg">
                <CardContent className="p-0">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Formations</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-1">50+</div>
                  <p className="text-sm text-gray-600">Sessions réalisées</p>
                </CardContent>
              </Card>

              <Card className="p-6 text-center shadow-lg">
                <CardContent className="p-0">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Apprenants</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-1">200+</div>
                  <p className="text-sm text-gray-600">Personnes formées</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Catalogue de Formations */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Catalogue de Formations</h2>
            <p className="text-lg text-gray-600">
              Découvrez notre catalogue complet de formations professionnelles certifiées Qualiopi. 
              Formations éligibles CPF, adaptées aux entreprises et particuliers.
            </p>
          </div>

          {/* Trouvez votre formation */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Trouvez votre formation</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input 
                  placeholder="Rechercher une formation..." 
                  className="border-gray-300"
                />
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-64 border-gray-300">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toutes">Toutes les catégories</SelectItem>
                  <SelectItem value="debutant">Débutant</SelectItem>
                  <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                  <SelectItem value="avance">Avancé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-gray-600 mt-4">9 formation(s) trouvé(s)</p>
          </div>

          {/* Grille de formations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {formations.map((formation) => (
              <Card key={formation.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-500">{formation.duration}</span>
                    <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded">{formation.level}</span>
                  </div>
                  <CardTitle className="text-lg">{formation.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{formation.description}</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                      Détails du parcours
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50">
                      Réserver un RDV
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2">
            <Button variant="outline" size="sm">Précédent</Button>
            <Button size="sm" className="bg-blue-600 text-white">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">Suivant</Button>
          </div>
        </div>
      </section>

      {/* Processus pédagogique personnalisé */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Processus pédagogique personnalisé</h2>
            <p className="text-lg text-gray-600 mb-8">
              Une approche structurée en 3 étapes pour garantir l'efficacité de votre formation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Rendez-vous de découverte</h3>
                <p className="text-gray-600 text-sm">
                  Évaluation de vos besoins et définition d'un parcours personnalisé adapté à vos objectifs professionnels.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Inscription et formation</h3>
                <p className="text-gray-600 text-sm">
                  Suivi de votre formation avec un accompagnement personnalisé et un support technique inclus.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Rendez-vous d'impact</h3>
                <p className="text-gray-600 text-sm">
                  Évaluation des acquis et planification de la suite de votre parcours de formation.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 mb-4">
              Démarrer votre parcours
            </Button>
            <p className="text-sm text-gray-500 mb-6">Rendez-vous de positionnement obligatoire avant toute inscription.</p>
            
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Formations personnalisées</h3>
              <p className="text-gray-600">
                Chaque formation est adaptée à votre niveau, vos objectifs et votre contexte professionnel. 
                Notre approche pédagogique flexible s'ajuste à vos contraintes et à votre rythme d'apprentissage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Questions fréquentes sur nos formations WordPress</h2>
            <p className="text-lg text-gray-600">
              Retrouvez les réponses aux questions les plus courantes sur nos formations WordPress.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setIsFaqOpen(isFaqOpen === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{item.question}</h3>
                    <ChevronDown 
                      className={`h-5 w-5 text-gray-500 transition-transform ${
                        isFaqOpen === index ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </CardHeader>
                {isFaqOpen === index && (
                  <CardContent>
                    <p className="text-gray-600">{item.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
