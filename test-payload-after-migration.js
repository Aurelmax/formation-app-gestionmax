// Test de création d'un rendez-vous via l'API Payload APRÈS migration
// Ce test devrait maintenant FONCTIONNER car les programmes ont la bonne structure

const testData = {
  programmeId: '68ec787878922d65b9a2b3a5', // ID valide récupéré de MongoDB
  client: {
    nom: 'Martin',
    prenom: 'Sophie',
    email: 'sophie.martin@test.com',
    telephone: '06 98 76 54 32',
    entreprise: 'Test Migration Company',
  },
  type: 'positionnement',
  statut: 'enAttente',
  date: '2025-11-01T10:00:00.000Z',
  heure: '10:00',
  duree: 60,
  lieu: 'presentiel',
  notes: '✅ Test APRÈS migration - Structure programmes corrigée',
  createdBy: '1',
}

console.log('🧪 Test Payload CMS APRÈS migration des données\n')
console.log('📋 Données à envoyer:', JSON.stringify(testData, null, 2))
console.log('\n🔄 Envoi de la requête...\n')

fetch('http://localhost:3010/api/rendez-vous-payload', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData),
})
  .then(response => response.json())
  .then(data => {
    console.log('📥 Réponse reçue:', JSON.stringify(data, null, 2))
    console.log()

    if (data.success) {
      console.log('🎉🎉🎉 SUCCÈS ! Rendez-vous créé avec l\'ID:', data.data.id)
      console.log()
      console.log('✅ Payload CMS fonctionne maintenant correctement!')
      console.log('✅ Le problème de structure est résolu!')
      console.log('✅ Migration réussie!')
    } else {
      console.error('❌ Erreur:', data.error)
      if (data.details) {
        console.error('   Détails:', data.details)
      }
      if (data.stack) {
        console.error('   Stack:', data.stack.split('\n')[0])
      }
    }
  })
  .catch(error => {
    console.error('❌ Erreur réseau:', error)
  })
