'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  FileText,
  Settings,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Programmes', href: '/admin/programmes', icon: BookOpen },
  { name: 'Apprenants', href: '/admin/apprenants', icon: Users },
  { name: 'Rendez-vous', href: '/admin/rendez-vous', icon: Calendar },
  { name: 'Documents', href: '/admin/documents', icon: FileText },
  { name: 'Paramètres', href: '/admin/parametres', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-primary">GestionMax</h1>
        <p className="text-sm text-muted-foreground">Formation Pro</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
            MD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Marie Dubois</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
