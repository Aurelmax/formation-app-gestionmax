# 🚀 Guide de Déploiement Rapide - GestionMax Formation

## Prérequis

- Node.js 18+ installé
- Compte MongoDB Atlas configuré
- Compte Resend pour les emails (optionnel pour première mise en ligne)
- Serveur de déploiement (Vercel recommandé pour Next.js)

## Étape 1 : Configuration des variables d'environnement

Copiez `.env.example` vers `.env` sur votre serveur de production et remplissez :

```bash
# MongoDB (OBLIGATOIRE)
MONGODB_URI=mongodb+srv://votre_utilisateur:votre_mot_de_passe@cluster.mongodb.net/votre_base

# Payload CMS (OBLIGATOIRE)
PAYLOAD_SECRET=votre_clé_secrète_aléatoire_de_64_caractères_minimum

# Resend Email (OPTIONNEL - pour reset password)
RESEND_API_KEY=re_votre_clé_resend
RESEND_DEFAULT_EMAIL=noreply@votredomaine.com

# URL du site (OBLIGATOIRE)
NEXT_PUBLIC_SERVER_URL=https://votredomaine.com
```

## Étape 2 : Build de production

```bash
npm install
npm run build
```

## Étape 3 : Déploiement sur Vercel (Recommandé)

### Via CLI Vercel:
```bash
npm i -g vercel
vercel --prod
```

### Via Dashboard Vercel:
1. Connectez votre repo GitHub
2. Ajoutez les variables d'environnement dans Settings > Environment Variables
3. Déployez

## Étape 4 : Créer le premier utilisateur admin

Après le premier déploiement, utilisez le script :

```bash
node scripts/create-admin-user.ts
```

Ou créez-le manuellement via MongoDB:
- Allez sur `https://votredomaine.com/payload-cms`
- Créez le premier utilisateur admin

## ✅ Checklist pré-déploiement

- [ ] MongoDB Atlas configuré et accessible
- [ ] PAYLOAD_SECRET généré (64+ caractères aléatoires)
- [ ] NEXT_PUBLIC_SERVER_URL configuré avec votre domaine
- [ ] Build de production réussi (`npm run build`)
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Premier utilisateur admin créé

## 🔧 Commandes utiles

```bash
# Développement local
npm run dev

# Build de production
npm run build

# Lancer en production (après build)
npm start

# Tester le build localement
npm run build && npm start
```

## 📝 Notes importantes

1. **MongoDB Atlas** : Assurez-vous d'autoriser l'accès depuis toutes les IPs (0.0.0.0/0) dans Network Access
2. **Resend** : Peut être configuré après la mise en ligne pour activer la réinitialisation de mot de passe
3. **Images** : Les images sont stockées dans `/media` - configurez un stockage cloud si nécessaire
4. **Domaine personnalisé** : Configurez-le dans les paramètres Vercel après le déploiement

## 🆘 Support

En cas de problème :
1. Vérifiez les logs Vercel
2. Vérifiez la connexion MongoDB
3. Vérifiez que toutes les variables d'environnement sont définies
