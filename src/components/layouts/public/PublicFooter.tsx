import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">GestionMax Formation</h3>
            <p className="text-sm mb-4">
              Organisme de formation professionnelle certifié Qualiopi, expert en développement des compétences.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalogue" className="hover:text-white transition">Catalogue formations</Link></li>
              <li><Link href="/apropos" className="hover:text-white transition">À propos</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/reglement-interieur" className="hover:text-white transition">Règlement intérieur</Link></li>
            </ul>
          </div>

          {/* Formations populaires */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Formations populaires</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalogue" className="hover:text-white transition">Développement Web</Link></li>
              <li><Link href="/catalogue" className="hover:text-white transition">Data Science</Link></li>
              <li><Link href="/catalogue" className="hover:text-white transition">UX/UI Design</Link></li>
              <li><Link href="/catalogue" className="hover:text-white transition">Gestion de projet</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Nice, France</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+33 (0)4 XX XX XX XX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contact@gestionmax.fr</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} GestionMax Formation. Tous droits réservés. | Certifié Qualiopi</p>
        </div>
      </div>
    </footer>
  );
}
