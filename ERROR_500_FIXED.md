# Correction de l'erreur 500 - Module not found: Can't resolve 'net'

## Problème identifié

L'erreur 500 était causée par l'utilisation du driver MongoDB directement dans les composants React côté client. Le driver MongoDB nécessite des modules Node.js comme `net` qui ne sont pas disponibles dans le navigateur.

### Erreur spécifique :

```
Module not found: Can't resolve 'net'
./node_modules/mongodb/lib/client-side-encryption/auto_encrypter.js (6:1)
```

## Solution implémentée

### 1. Séparation client/serveur

- **Côté client** : Utilisation uniquement des services mock
- **Côté serveur** : Utilisation des services MongoDB via les routes API

### 2. Modifications apportées

#### `src/hooks/useApiService.ts`

- Suppression des imports MongoDB côté client
- Retour aux services mock uniquement côté client
- Les vraies données MongoDB sont accessibles via les routes API

#### `src/lib/client-api-service.ts` (nouveau)

- Service côté client pour récupérer les données via les routes API
- Méthodes pour programmes, apprenants, utilisateurs, rendez-vous, blog, statistiques

#### Routes API créées :

- `src/app/api/programmes/route.ts`
- `src/app/api/programmes/[id]/route.ts`
- `src/app/api/apprenants/route.ts`
- `src/app/api/apprenants/[id]/route.ts`
- `src/app/api/users/route.ts`
- `src/app/api/users/email/[email]/route.ts`
- `src/app/api/stats/route.ts`

#### `src/lib/api-route-service.ts`

- Ajout des méthodes manquantes : `getProgramme`, `getApprenant`, `getUserByEmail`

#### `src/lib/mock-service.ts`

- Ajout de la méthode `getUserByEmail`

#### `src/lib/mongodb-service.ts`

- Ajout de la méthode `getUserByEmail`

## Architecture finale

```
Client (Navigateur)
├── Services Mock (données locales)
└── ClientApiService (appels HTTP vers routes API)

Serveur (Node.js)
├── Routes API (/api/*)
├── ApiRouteService (orchestrateur)
├── MockService (fallback)
└── MongoDBService (données réelles)
```

## Tests de validation

✅ Page d'accueil : `200 OK`
✅ API programmes : `200 OK`
✅ API apprenants : `200 OK`
✅ API statistiques : `200 OK`
✅ Interface admin : `200 OK`
✅ Page programmes admin : `200 OK`

## Avantages de cette approche

1. **Sécurité** : Pas d'exposition directe de MongoDB côté client
2. **Performance** : Cache côté client avec les services mock
3. **Flexibilité** : Basculement facile entre mock et données réelles
4. **Maintenabilité** : Séparation claire des responsabilités
5. **Évolutivité** : Ajout facile de nouvelles routes API

## Prochaines étapes

1. Tester l'interface utilisateur complète
2. Vérifier que toutes les fonctionnalités marchent
3. Optionnel : Implémenter le basculement dynamique entre mock et API
4. Optionnel : Ajouter la gestion d'erreurs côté client
