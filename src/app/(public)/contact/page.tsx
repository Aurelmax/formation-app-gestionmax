import { PublicLayout } from '@/components/layouts/public/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';

export default function ContactPage() {
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
          <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-lg text-gray-100">
            Une question ? Un projet de formation ? Nous sommes là pour vous aider
          </p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulaire */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Envoyez-nous un message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nom">Nom *</Label>
                        <Input id="nom" placeholder="Votre nom" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prenom">Prénom *</Label>
                        <Input id="prenom" placeholder="Votre prénom" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" placeholder="votre@email.com" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input id="telephone" type="tel" placeholder="06 XX XX XX XX" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sujet">Sujet *</Label>
                      <Input id="sujet" placeholder="Objet de votre demande" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Décrivez votre projet ou votre question..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Envoyer le message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Informations de contact */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Coordonnées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Adresse</p>
                      <p className="text-sm text-muted-foreground">
                        123 Avenue de la Formation<br />
                        06000 Nice, France
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Téléphone</p>
                      <p className="text-sm text-muted-foreground">
                        +33 (0)4 XX XX XX XX
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-sm text-muted-foreground">
                        contact@gestionmax.fr
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Horaires</p>
                      <p className="text-sm text-muted-foreground">
                        Lundi - Vendredi<br />
                        9h00 - 18h00
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary text-white">
                <CardHeader>
                  <CardTitle>Besoin d'un devis ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-100 mb-4">
                    Obtenez un devis personnalisé pour votre projet de formation.
                  </p>
                  <Button variant="secondary" className="w-full">
                    Demander un devis
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
