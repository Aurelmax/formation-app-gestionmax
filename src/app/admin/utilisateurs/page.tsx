'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Mail, Shield, User, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'formateur' | 'apprenant';
  createdAt: Date;
  lastLogin?: Date;
}

export default function UtilisateursPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des utilisateurs depuis Payload
    const loadUsers = async () => {
      try {
        // TODO: Remplacer par l'appel API Payload
        const mockUsers: User[] = [
          {
            id: '1',
            name: 'Administrateur GestionMax',
            email: 'admin@gestionmax.fr',
            role: 'admin',
            createdAt: new Date('2024-01-01'),
            lastLogin: new Date(),
          },
          {
            id: '2',
            name: 'Aurélien LAVAYSSIERE',
            email: 'aurelien@gestionmax.fr',
            role: 'formateur',
            createdAt: new Date('2024-01-01'),
            lastLogin: new Date('2024-01-10'),
          },
        ];
        setUsers(mockUsers);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: 'destructive',
      formateur: 'default',
      apprenant: 'secondary',
    } as const;

    const labels = {
      admin: 'Admin',
      formateur: 'Formateur',
      apprenant: 'Apprenant',
    };

    return (
      <Badge variant={variants[role as keyof typeof variants] || 'secondary'}>
        {labels[role as keyof typeof labels] || role}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground">
            Chargement des utilisateurs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez les utilisateurs et leurs permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.open('/cms', '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Interface CMS
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvel utilisateur
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    {getRoleBadge(user.role)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>
                  Créé le {user.createdAt.toLocaleDateString('fr-FR')}
                </span>
              </div>

              {user.lastLogin && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>
                    Dernière connexion: {user.lastLogin.toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Modifier
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Permissions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun utilisateur</h3>
            <p className="text-muted-foreground text-center mb-4">
              Commencez par créer votre premier utilisateur
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Créer un utilisateur
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
