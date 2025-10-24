async function testCreateUser() {
  try {
    console.log('🧪 Test de création d\'utilisateur via API Payload...')

    // D'abord se connecter en tant qu'admin
    console.log('\n1. Connexion admin...')
    const loginResponse = await fetch('http://localhost:3010/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@gestionmax.fr',
        password: 'AdminGestionMax2025!',
      }),
    })

    console.log('Login status:', loginResponse.status)
    const loginText = await loginResponse.text()
    console.log('Login response:', loginText.substring(0, 200))

    if (!loginResponse.ok) {
      console.error('❌ Échec de connexion')
      return
    }

    let loginData
    try {
      loginData = JSON.parse(loginText)
      console.log('✅ Connexion réussie!')
      console.log('Token:', loginData.token?.substring(0, 20) + '...')
    } catch (e) {
      console.error('❌ Réponse login non-JSON')
      return
    }

    // Créer un nouvel utilisateur
    console.log('\n2. Création d\'un nouvel utilisateur...')
    const createResponse = await fetch('http://localhost:3010/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${loginData.token}`,
      },
      body: JSON.stringify({
        email: 'test.user@gestionmax.fr',
        password: 'TestPassword123!',
        name: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        role: 'apprenant',
        status: 'active',
      }),
    })

    console.log('Create status:', createResponse.status)
    const createText = await createResponse.text()

    if (createResponse.ok) {
      const userData = JSON.parse(createText)
      console.log('✅ Utilisateur créé avec succès!')
      console.log('ID:', userData.doc?.id || userData.id)
      console.log('Email:', userData.doc?.email || userData.email)
      console.log('Role:', userData.doc?.role || userData.role)
    } else {
      console.error('❌ Échec de création:', createText.substring(0, 500))
    }

    // Vérifier la liste des utilisateurs
    console.log('\n3. Liste des utilisateurs...')
    const listResponse = await fetch('http://localhost:3010/api/users', {
      headers: {
        Authorization: `JWT ${loginData.token}`,
      },
    })

    if (listResponse.ok) {
      const listData = await listResponse.json()
      console.log(`✅ ${listData.docs?.length || 0} utilisateurs trouvés`)
      listData.docs?.forEach((user) => {
        console.log(`  - ${user.email} (${user.role})`)
      })
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

testCreateUser()
