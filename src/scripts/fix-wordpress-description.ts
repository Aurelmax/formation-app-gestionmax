import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import path from 'path'

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

async function fixWordPressDescription() {
  const mongoUri = process.env['MONGODB_URI']
  if (!mongoUri) {
    throw new Error('MONGODB_URI not defined')
  }

  const client = new MongoClient(mongoUri)
  await client.connect()
  const db = client.db()

  console.log('🔧 Correction de la description du programme WordPress...\n')

  // Description complète du programme WordPress
  const wordpressDescription = `Formation complète en 2 jours pour artisans, commerçants et professions libérales.

PRÉREQUIS : Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur.

PUBLIC CONCERNÉ : Artisans, commerçants ou professions libérales.

DURÉE : 14 heures ou 2 jours
HORAIRES : 9h à 13h et de 14h à 17h

OBJECTIFS PÉDAGOGIQUES :
Jour 1 : Apprendre à créer, personnaliser et gérer un site internet avec WordPress, en mettant l'accent sur la gestion du contenu, la personnalisation du design et l'ajout de fonctionnalités essentielles.

Jour 2 : Développer une stratégie de développement digital complète incluant le référencement naturel (SEO), la présence sur les réseaux sociaux et les techniques de publicité en ligne pour maximiser la visibilité et l'impact commercial du site.

PROGRAMME DÉTAILLÉ :

JOUR 1 - CRÉATION ET GESTION DU SITE WORDPRESS (7h)
• Installation et configuration de WordPress
• Personnalisation du thème et du design
• Gestion des pages et articles
• Ajout de fonctionnalités avec des plugins
• Optimisation des performances
• Sécurisation du site

JOUR 2 - STRATÉGIE DE DÉVELOPPEMENT DIGITAL (7h)
• Optimisation SEO (référencement naturel)
• Configuration des réseaux sociaux
• Stratégies de contenu et marketing
• Publicité en ligne (Google Ads, Facebook Ads)
• Analytics et suivi des performances
• Plan d'action personnalisé

MODALITÉS PÉDAGOGIQUES :
Formation en présentiel individuel (méthode expositive et démonstrative) avec alternance d'exposés théoriques et de cas pratiques.

RESSOURCES DISPONIBLES :
• Salle de formation équipée
• Support de cours et ressources téléchargeables
• Accès à un environnement de test WordPress
• Fiches pratiques et guides de référence

ÉVALUATION :
• Quizz de validation des acquis
• Mise en pratique sur un projet personnel
• Évaluation continue tout au long de la formation

SANCTION DE LA FORMATION :
Certificat de réalisation de formation délivré à l'issue de la formation.`

  // Mettre à jour le programme WordPress
  const result = await db.collection('programmes').updateOne(
    { codeFormation: 'A001-WP-DD' },
    {
      $set: {
        description: wordpressDescription,
        updatedAt: new Date(),
      },
    }
  )

  if (result.matchedCount > 0) {
    console.log('✅ Description du programme WordPress restaurée avec succès !')
    console.log(`📝 ${wordpressDescription.length} caractères ajoutés`)
  } else {
    console.log('❌ Programme WordPress non trouvé')
  }

  // Vérifier le résultat
  const updatedProgramme = await db
    .collection('programmes')
    .findOne({ codeFormation: 'A001-WP-DD' })
  if (updatedProgramme) {
    console.log('\n📋 Vérification :')
    console.log(`Titre: ${updatedProgramme['titre']}`)
    console.log(`Description: ${updatedProgramme['description']?.substring(0, 100)}...`)
    console.log(`Longueur: ${updatedProgramme['description']?.length || 0} caractères`)
  }

  await client.close()
  console.log('\n🎉 Correction terminée !')
}

// Exécuter le script
fixWordPressDescription().catch(console.error)
