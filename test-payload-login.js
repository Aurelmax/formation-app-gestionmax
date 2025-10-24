async function testLogin() {
  try {
    console.log('Testing Payload CMS login...');
    const response = await fetch('http://localhost:3010/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@gestionmax.fr',
        password: 'Admin123!',
      }),
    });

    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers));

    const text = await response.text();
    console.log('Response body:', text);

    if (text) {
      try {
        const json = JSON.parse(text);
        console.log('Parsed JSON:', JSON.stringify(json, null, 2));
      } catch (e) {
        console.log('Not JSON response');
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLogin();
