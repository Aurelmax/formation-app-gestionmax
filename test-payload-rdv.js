// Test de création d'un rendez-vous via l'API Payload
const testData = {
  programmeId: "1",
  client: {
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@test.com",
    telephone: "06 12 34 56 78",
    entreprise: "Test Company"
  },
  type: "information",
  statut: "enAttente",
  date: "2025-10-15",
  heure: "14:00",
  duree: 30,
  lieu: "visio",
  notes: "Test de création via API Payload",
  createdBy: "1"
};

fetch('http://localhost:3010/api/rendez-vous-payload', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData),
})
.then(response => response.json())
.then(data => {
  console.log('✅ Rendez-vous créé:', data);
  if (data.success) {
    console.log('🎉 Succès ! Rendez-vous créé avec l\'ID:', data.data.id);
  } else {
    console.error('❌ Erreur:', data.error);
  }
})
.catch(error => {
  console.error('❌ Erreur réseau:', error);
});
