'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mail, 
  Phone, 
  Calendar, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

// Import de nos nouveaux hooks et composants
import { useListManagement, useDialog, useAsyncOperation } from '@/hooks';
import { FormField, FormSection, FormActions } from '@/components/forms';
import { ContactBusinessLogic } from '@/lib/business-logic';
import { ContactMessage } from '@/types/forms';

const mockMessages: ContactMessage[] = [
  {
    id: '1',
    nom: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    telephone: '06 12 34 56 78',
    type: 'formation',
    sujet: 'Demande d\'information sur la formation WordPress',
    message: 'Bonjour, je souhaiterais obtenir des informations sur vos formations WordPress. Quels sont les prérequis et les dates disponibles ?',
    statut: 'nouveau',
    dateReception: new Date('2024-10-10'),
    priorite: 'normale'
  },
  {
    id: '2',
    nom: 'Marie Martin',
    email: 'marie.martin@email.com',
    type: 'reclamation',
    sujet: 'Problème avec la formation',
    message: 'J\'ai suivi votre formation WordPress mais j\'ai rencontré des difficultés avec l\'accès aux ressources en ligne.',
    statut: 'en_cours',
    dateReception: new Date('2024-10-09'),
    priorite: 'haute'
  },
  {
    id: '3',
    nom: 'Pierre Durand',
    email: 'pierre.durand@email.com',
    telephone: '06 98 76 54 32',
    type: 'devis',
    sujet: 'Demande de devis pour formation personnalisée',
    message: 'Nous souhaiterions organiser une formation WordPress personnalisée pour notre équipe de 8 personnes.',
    statut: 'traite',
    dateReception: new Date('2024-10-08'),
    dateReponse: new Date('2024-10-09'),
    reponse: 'Merci pour votre demande. Je vous envoie un devis personnalisé sous 24h.',
    priorite: 'normale'
  }
];

const typeLabels = {
  question: 'Question générale',
  reclamation: 'Réclamation',
  formation: 'Demande de formation',
  devis: 'Demande de devis'
};

const statutLabels = {
  nouveau: 'Nouveau',
  en_cours: 'En cours',
  traite: 'Traité',
  ferme: 'Fermé'
};

const statutColors = {
  nouveau: 'bg-blue-100 text-blue-800',
  en_cours: 'bg-yellow-100 text-yellow-800',
  traite: 'bg-green-100 text-green-800',
  ferme: 'bg-gray-100 text-gray-800'
};

const prioriteColors = {
  basse: 'bg-gray-100 text-gray-800',
  normale: 'bg-blue-100 text-blue-800',
  haute: 'bg-orange-100 text-orange-800',
  urgente: 'bg-red-100 text-red-800'
};

export function ContactManagementRefactored() {
  // Utilisation de nos nouveaux hooks
  const {
    items: messages,
    searchTerm,
    filters,
    setSearchTerm,
    setFilter,
    clearFilters,
    updateItem
  } = useListManagement<ContactMessage>({
    initialItems: mockMessages,
    searchFields: ['nom', 'email', 'sujet', 'message']
  });

  const responseDialog = useDialog<ContactMessage>();
  const { execute: executeResponse, isLoading: isResponding } = useAsyncOperation();

  const [reponse, setReponse] = useState('');

  // Filtrage avec la logique métier
  const filteredMessages = ContactBusinessLogic.filterMessages(messages, {
    searchTerm,
    statut: filters.statut,
    type: filters.type,
    priorite: filters.priorite
  });

  // Statistiques calculées par la logique métier
  const stats = ContactBusinessLogic.calculateMessageStats(messages);

  const handleStatutChange = (messageId: string, newStatut: ContactMessage['statut']) => {
    updateItem(messageId, { 
      statut: newStatut, 
      dateReponse: newStatut === 'traite' ? new Date() : undefined 
    });
  };

  const handleRepondre = async (message: ContactMessage) => {
    if (!reponse.trim()) return;

    await executeResponse(
      async () => {
        // Simulation d'un appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
      },
      {
        onSuccess: () => {
          updateItem(message.id, {
            statut: 'traite',
            reponse: reponse,
            dateReponse: new Date()
          });
          setReponse('');
          responseDialog.close();
        },
        successMessage: 'Réponse envoyée avec succès'
      }
    );
  };


  const getStatutIcon = (statut: ContactMessage['statut']) => {
    switch (statut) {
      case 'nouveau':
        return <AlertCircle className="h-4 w-4" />;
      case 'en_cours':
        return <Clock className="h-4 w-4" />;
      case 'traite':
        return <CheckCircle className="h-4 w-4" />;
      case 'ferme':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des contacts</h1>
          <p className="text-gray-600 mt-2">Gérez les messages reçus via le formulaire de contact</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {filteredMessages.length} message{filteredMessages.length > 1 ? 's' : ''}
          </Badge>
          <Badge variant="outline" className="text-sm">
            {stats.nonTraites} non traités
          </Badge>
        </div>
      </div>

      {/* Filtres et recherche */}
      <FormSection title="Filtres et recherche">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField label="Recherche">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </FormField>
          
          <FormField label="Statut">
            <Select value={filters.statut || 'all'} onValueChange={(value) => setFilter('statut', value === 'all' ? undefined : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="nouveau">Nouveau</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="traite">Traité</SelectItem>
                <SelectItem value="ferme">Fermé</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Type">
            <Select value={filters.type || 'all'} onValueChange={(value) => setFilter('type', value === 'all' ? undefined : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="question">Question générale</SelectItem>
                <SelectItem value="reclamation">Réclamation</SelectItem>
                <SelectItem value="formation">Demande de formation</SelectItem>
                <SelectItem value="devis">Demande de devis</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <div className="flex items-end">
            <Button variant="outline" className="flex items-center gap-2" onClick={clearFilters}>
              <Filter className="h-4 w-4" />
              Effacer
            </Button>
          </div>
        </div>
      </FormSection>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des messages */}
        <div className="lg:col-span-1 space-y-4">
          {filteredMessages.map((message: ContactMessage) => (
            <Card 
              key={message.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                responseDialog.data?.id === message.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => responseDialog.open(message)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">{message.nom}</h3>
                    <p className="text-sm text-gray-600 truncate">{message.email}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatutIcon(message.statut)}
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{message.sujet}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${statutColors[message.statut]}`}>
                      {statutLabels[message.statut]}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${prioriteColors[message.priorite]}`}>
                      {message.priorite}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500">
                    {message.dateReception.toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Détail du message sélectionné */}
        <div className="lg:col-span-2">
          {responseDialog.data ? (
            <FormSection title={`Message de ${responseDialog.data.nom}`}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Informations de contact</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{responseDialog.data.email}</span>
                      </div>
                      {responseDialog.data.telephone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{responseDialog.data.telephone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Statut et priorité</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={statutColors[responseDialog.data.statut as keyof typeof statutColors]}>
                        {statutLabels[responseDialog.data.statut as keyof typeof statutLabels]}
                      </Badge>
                      <Badge variant="outline" className={prioriteColors[responseDialog.data.priorite as keyof typeof prioriteColors]}>
                        {responseDialog.data.priorite}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Type de demande</h4>
                  <Badge variant="outline">{typeLabels[responseDialog.data.type as keyof typeof typeLabels]}</Badge>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Sujet</h4>
                  <p className="text-gray-700">{responseDialog.data.sujet}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Message</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{responseDialog.data.message}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Reçu le {responseDialog.data.dateReception.toLocaleString('fr-FR')}</span>
                </div>

                {responseDialog.data.reponse && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Réponse envoyée</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{responseDialog.data.reponse}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Répondu le {responseDialog.data.dateReponse?.toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <FormActions
                  onSave={() => handleRepondre(responseDialog.data!)}
                  onCancel={() => responseDialog.close()}
                  isLoading={isResponding}
                  saveLabel="Envoyer la réponse"
                  cancelLabel="Fermer"
                >
                  <Select 
                    value={responseDialog.data.statut} 
                    onValueChange={(value) => handleStatutChange(responseDialog.data!.id, value as ContactMessage['statut'])}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nouveau">Nouveau</SelectItem>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="traite">Traité</SelectItem>
                      <SelectItem value="ferme">Fermé</SelectItem>
                    </SelectContent>
                  </Select>

                </FormActions>

                {/* Zone de réponse */}
                {responseDialog.data.statut !== 'traite' && (
                  <div className="pt-4 border-t">
                    <FormField label="Répondre au message">
                      <Textarea
                        placeholder="Tapez votre réponse..."
                        value={reponse}
                        onChange={(e) => setReponse(e.target.value)}
                        rows={4}
                      />
                    </FormField>
                  </div>
                )}
              </div>
            </FormSection>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sélectionnez un message</h3>
                <p className="text-gray-600">Choisissez un message dans la liste pour voir les détails et y répondre.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
