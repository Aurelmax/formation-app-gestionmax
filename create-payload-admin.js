async function createAdmin() {
  try {
    console.log("🔨 Création de l'utilisateur admin via l'API Payload...")

    const response = await fetch('http://localhost:3010/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@gestionmax.fr',
        password: 'AdminGestionMax2025!',
        name: 'Administrateur',
        firstName: 'Admin',
        lastName: 'GestionMax',
        role: 'superAdmin',
        status: 'active',
      }),
    })

    console.log('Status:', response.status)

    const text = await response.text()
    console.log('Response:', text)

    if (response.ok) {
      const data = JSON.parse(text)
      console.log('\n✅ Utilisateur admin créé avec succès!')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📧 Email: admin@gestionmax.fr')
      console.log('🔑 Mot de passe: AdminGestionMax2025!')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('\n🌐 Connectez-vous sur: http://localhost:3010/payload-cms')
    } else {
      console.error('❌ Erreur lors de la création:', text)
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

createAdmin()
