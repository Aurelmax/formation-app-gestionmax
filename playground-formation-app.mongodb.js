/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable camelcase */
// MongoDB Playground - Formation App GestionMax
// 📚 Base de données : formation-app-gestionmax
// ☁️  Cluster : clustergestionmaxformat.a9qrz87.mongodb.net

// Sélectionner la base de données
use('formation-app-gestionmax')

// ============================================
// 📊 STATISTIQUES GÉNÉRALES
// ============================================

console.log('📊 STATISTIQUES GÉNÉRALES')
console.log('═══════════════════════════════════════')

const stats = {
  programmes: db.programmes.countDocuments(),
  formations_personnalisees: db.formations_personnalisees.countDocuments(),
  users: db.users.countDocuments(),
  apprenants: db.apprenants.countDocuments(),
}

console.log('Programmes:', stats.programmes)
console.log('Formations personnalisées:', stats.formations_personnalisees)
console.log('Utilisateurs:', stats.users)
console.log('Apprenants:', stats.apprenants)

// ============================================
// 📚 LISTER TOUS LES PROGRAMMES
// ============================================

// Décommentez pour exécuter :
// db.programmes.find({})

// ============================================
// 🔍 CHERCHER UN PROGRAMME SPÉCIFIQUE
// ============================================

// Par code formation :
// db.programmes.findOne({ codeFormation: 'WPDIGITAL' })

// Par titre (recherche partielle) :
// db.programmes.find({ titre: /WordPress/i })

// ============================================
// 👥 LISTER TOUS LES UTILISATEURS
// ============================================

// Décommentez pour exécuter :
// db.users.find({}, { name: 1, email: 1, role: 1 })

// ============================================
// 📋 LISTER TOUS LES APPRENANTS
// ============================================

// Décommentez pour exécuter :
// db.apprenants.find({})

// ============================================
// 💰 PROGRAMMES TRIÉS PAR PRIX
// ============================================

// Du plus cher au moins cher :
// db.programmes.find({}).sort({ prix: -1 })

// ============================================
// 📊 STATISTIQUES PAR NIVEAU
// ============================================

// Décommentez pour exécuter :
// db.programmes.aggregate([
//   {
//     $group: {
//       _id: '$niveau',
//       count: { $sum: 1 },
//       prixMoyen: { $avg: '$prix' },
//       prixMin: { $min: '$prix' },
//       prixMax: { $max: '$prix' }
//     }
//   },
//   {
//     $sort: { count: -1 }
//   }
// ])

// ============================================
// 🆕 INSÉRER UN NOUVEAU PROGRAMME (EXEMPLE)
// ============================================

// ⚠️ ATTENTION : Décommentez uniquement si vous voulez ajouter un nouveau programme !
// db.programmes.insertOne({
//   codeFormation: 'TEST2024',
//   titre: 'Formation Test 2024',
//   description: 'Ceci est une formation de test',
//   duree: 14,
//   niveau: 'DEBUTANT',
//   modalites: 'DISTANCIEL',
//   prix: 1500,
//   competences: [
//     { competence: 'Compétence 1' },
//     { competence: 'Compétence 2' }
//   ],
//   statut: 'actif'
// })

// ============================================
// ✏️ METTRE À JOUR UN PROGRAMME (EXEMPLE)
// ============================================

// ⚠️ ATTENTION : Modifie les données !
// db.programmes.updateOne(
//   { codeFormation: 'TEST2024' },
//   { $set: { prix: 2000, description: 'Description mise à jour' } }
// )

// ============================================
// 🗑️ SUPPRIMER UN PROGRAMME (EXEMPLE)
// ============================================

// ⚠️ DANGER : Supprime définitivement !
// db.programmes.deleteOne({ codeFormation: 'TEST2024' })

// ============================================
// 🔍 REQUÊTES AVANCÉES
// ============================================

// Trouver les programmes entre 1000€ et 2000€ :
// db.programmes.find({
//   prix: { $gte: 1000, $lte: 2000 }
// })

// Trouver les programmes avec une compétence spécifique :
// db.programmes.find({
//   'competences.competence': /WordPress/i
// })

// Compter les programmes par modalité :
// db.programmes.aggregate([
//   {
//     $group: {
//       _id: '$modalites',
//       count: { $sum: 1 }
//     }
//   }
// ])
