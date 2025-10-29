# Formation App GestionMax

Application de gestion de formation WordPress développée avec Next.js 15 et Payload CMS.

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos valeurs

# Démarrer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3010](http://localhost:3010) dans votre navigateur.

## 📁 Structure du projet

```
formation-app-gestionmax/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── (app)/             # Routes publiques et dashboard
│   │   └── (payload)/         # Routes Payload CMS
│   ├── components/            # Composants React
│   │   ├── admin/             # Composants dashboard admin
│   │   ├── layouts/           # Layouts (public, auth)
│   │   ├── seo/               # Composants SEO (Schema Markup)
│   │   └── ui/                # Composants UI réutilisables
│   ├── collections/           # Collections Payload CMS
│   ├── endpoints/             # Endpoints API personnalisés
│   ├── hooks/                 # Hooks React personnalisés
│   ├── lib/                   # Bibliothèques et utilitaires
│   │   ├── apiClient.ts       # Client API centralisé
│   │   ├── apiClientWithToast.ts  # Client avec notifications
│   │   ├── blog-service.ts    # Service blog
│   │   └── toast.ts           # Système de notifications
│   └── types/                 # Types TypeScript
├── docs/                      # Documentation
│   ├── API_CLIENT_USAGE.md           # Guide utilisation API
│   └── VERCEL_DEPLOYMENT_CLEANUP.md  # Nettoyage Vercel
├── public/                    # Assets statiques
└── scripts/                   # Scripts utilitaires
```

## 🛠️ Technologies

- **Framework** : [Next.js 15.5.4](https://nextjs.org/) (App Router)
- **CMS** : [Payload CMS v3](https://payloadcms.com/)
- **Base de données** : MongoDB Atlas
- **UI** : React 19, Tailwind CSS, shadcn/ui
- **Authentification** : Payload Auth (JWT)
- **Déploiement** : Vercel
- **Notifications** : Sonner
- **Analytics** : Plausible

## 📚 Documentation

- **[Guide d'utilisation de l'API Client](docs/API_CLIENT_USAGE.md)** - Comment utiliser le client API centralisé pour interagir avec Payload CMS
- **[Nettoyage des déploiements Vercel](docs/VERCEL_DEPLOYMENT_CLEANUP.md)** - Comment supprimer les déploiements échoués sur Vercel
- **[Sécurité - Page de connexion](docs/SECURITY_LOGIN.md)** - Isolation des outils de développement et bonnes pratiques de sécurité
- **[Configuration Payload CMS](PAYLOAD_CMS_SETUP.md)** - Configuration et collections Payload

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# Payload CMS
PAYLOAD_SECRET=your-secret-key
NEXT_PUBLIC_SERVER_URL=http://localhost:3010

# Email (Resend)
RESEND_API_KEY=your-resend-api-key
RESEND_DEFAULT_EMAIL=noreply@gestionmax.fr

# Analytics (Plausible)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=gestionmax.fr

# SEO
NEXT_PUBLIC_BASE_URL=https://gestionmax.fr
```

## 🎯 Fonctionnalités principales

### Frontend public
- ✅ Page d'accueil avec présentation des formations
- ✅ Catalogue de formations
- ✅ Pages de détail formation
- ✅ Formulaire de contact
- ✅ Blog / Articles
- ✅ SEO optimisé (robots.txt, sitemap.xml, Schema Markup)

### Dashboard administration
- ✅ Gestion des programmes de formation
- ✅ Gestion des apprenants
- ✅ Gestion des rendez-vous
- ✅ Gestion du blog (articles, catégories, tags)
- ✅ Gestion des contacts
- ✅ Gestion des médias
- ✅ Système de notifications toast
- ✅ Client API centralisé

### Architecture
- ✅ Client API centralisé avec gestion d'erreurs
- ✅ Système de notifications toast (Sonner)
- ✅ Hook d'authentification (`useAuth`)
- ✅ Types TypeScript stricts
- ✅ Composants UI réutilisables (shadcn/ui)

## 📦 Scripts disponibles

```bash
# Développement
npm run dev              # Démarrer le serveur de développement (port 3010)

# Production
npm run build            # Construire l'application
npm run start            # Démarrer en production

# Payload CMS
npm run payload          # Générer les types Payload

# Nettoyage
npm run clean            # Nettoyer les fichiers de build

# Linting
npm run lint             # Vérifier le code avec ESLint
```

## 🚀 Déploiement

### Vercel (Recommandé)

1. **Connecter le projet à Vercel**
   ```bash
   vercel link
   ```

2. **Configurer les variables d'environnement**
   - Aller sur le dashboard Vercel
   - Settings → Environment Variables
   - Ajouter toutes les variables de `.env.local`

3. **Déployer**
   ```bash
   vercel --prod
   ```

### Nettoyage des déploiements échoués

Voir la [documentation complète](docs/VERCEL_DEPLOYMENT_CLEANUP.md).

**Méthode rapide** :
```bash
# Interface Web (Recommandé)
https://vercel.com/dashboard → Deployments → Supprimer manuellement

# CLI
vercel login
vercel ls formation-app-gestionmax
vercel rm <deployment-id> --yes

# Script automatique
./clean-vercel-deployments.sh
```

## 🔌 API Client

Le projet utilise un client API centralisé pour toutes les requêtes vers Payload CMS.

### Utilisation basique

```typescript
import { api } from '@/lib/apiClient'

// Récupérer des programmes
const programmes = await api.programmes.list()

// Créer un apprenant
const apprenant = await api.apprenants.create({
  nom: 'Dupont',
  prenom: 'Jean',
  email: 'jean@example.com'
})
```

### Avec notifications toast

```typescript
import { apiWithToast } from '@/lib/apiClientWithToast'

// Créer avec notification automatique
await apiWithToast.programmes.create(data)
// → Toast : "Formation créée avec succès" ✅
```

Voir la [documentation complète de l'API Client](docs/API_CLIENT_USAGE.md).

## 🎨 Collections Payload CMS

- **users** : Utilisateurs et authentification
- **programmes** : Programmes de formation
- **formations** : Formations standards
- **formations_personnalisees** : Formations sur mesure
- **apprenants** : Gestion des apprenants
- **rendez-vous** : Planification des RDV
- **articles** : Articles de blog
- **categories** : Catégories d'articles
- **tags** : Tags pour articles
- **contacts** : Messages de contact
- **media** : Bibliothèque de médias

## 🔐 Authentification

L'authentification utilise Payload CMS avec JWT :

```typescript
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { user, login, logout, isLoading } = useAuth()

  // Connexion
  await login('email@example.com', 'password')

  // Déconnexion
  await logout()
}
```

## 🧪 Tests

```bash
# Tests unitaires (à venir)
npm run test

# Tests E2E (à venir)
npm run test:e2e
```

## 📈 SEO

Le projet inclut une optimisation SEO complète :

- **Metadata** : Titles, descriptions, Open Graph, Twitter Cards
- **robots.txt** : Configuration des crawlers
- **sitemap.xml** : Dynamique (18+ URLs)
- **Schema Markup** : Organization, LocalBusiness, FAQPage, Course
- **Alt attributes** : Images optimisées
- **Performance** : Next.js Image, optimisation des fonts

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'feat: add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Conventions de commit

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/) :

```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: modification de documentation
style: formatage, point-virgules manquants, etc.
refactor: refactorisation du code
test: ajout de tests
chore: mise à jour des tâches de build, config, etc.
```

## 📝 Licence

Ce projet est la propriété de GestionMax Formation - Aurélien LAVAYSSIERE.

## 🆘 Support

- **Documentation** : Consultez le dossier `/docs`
- **Issues** : [GitHub Issues](https://github.com/Aurelmax/formation-app-gestionmax/issues)
- **Email** : contact@gestionmax.fr

## 🔗 Liens utiles

- **Site web** : https://gestionmax.fr
- **Dashboard** : https://gestionmax.fr/dashboard
- **Documentation Next.js** : https://nextjs.org/docs
- **Documentation Payload CMS** : https://payloadcms.com/docs
- **Documentation Vercel** : https://vercel.com/docs

---

**Développé avec ❤️ par GestionMax Formation**
