'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Catalogue', href: '/catalogue' },
  { name: 'À propos', href: '/apropos' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center">
            <Image
              src="/visuel-formation-gestionmax-antibes.png"
              alt="GestionMax - Consultant formateur indépendant"
              width={400}
              height={120}
              className="h-20 w-auto"
              priority
            />
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'text-sm font-semibold leading-6 transition-colors',
                pathname === item.href
                  ? 'text-primary'
                  : 'text-gray-900 hover:text-primary'
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
          <Button variant="ghost" asChild>
            <Link href="/admin">Connexion</Link>
          </Button>
          <Button asChild>
            <Link href="/contact">Inscription</Link>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-2 px-6 pb-6 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block rounded-lg px-3 py-2 text-base font-semibold leading-7',
                  pathname === item.href
                    ? 'bg-gray-50 text-primary'
                    : 'text-gray-900 hover:bg-gray-50'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/admin">Connexion</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/contact">Inscription</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
