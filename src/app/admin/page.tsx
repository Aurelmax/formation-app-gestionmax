import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import { MockService } from '@/lib/mock-service';

export default async function AdminDashboard() {
  const stats = await MockService.getStats();

  const cards = [
    {
      title: 'Apprenants actifs',
      value: stats.apprenantActifs,
      total: stats.totalApprenants,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Programmes actifs',
      value: stats.programmesActifs,
      total: stats.totalProgrammes,
      icon: BookOpen,
      color: 'text-green-600',
    },
    {
      title: 'Prochains RDV',
      value: stats.prochainRendezVous,
      icon: Calendar,
      color: 'text-orange-600',
    },
    {
      title: 'Taux de réussite',
      value: `${stats.tauxReussite}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de votre activité
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                {card.total && (
                  <p className="text-xs text-muted-foreground">
                    sur {card.total} total
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Aucune activité récente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prochains rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Aucun rendez-vous planifié
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
