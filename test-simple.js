const { MongoClient } = require('mongodb');

async function test() {
  const uri = 'mongodb+srv://aurelien_db_user:Test123456@clustergestionmaxformat.a9qrz87.mongodb.net/?retryWrites=true&w=majority';
  console.log('Test avec mot de passe simple: Test123456');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ CONNEXION RÉUSSIE !');
    
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    
    console.log('\nBases disponibles:');
    dbs.databases.forEach(db => console.log('  -', db.name));
    
  } catch (error) {
    console.log('❌ Échec:', error.message);
  } finally {
    await client.close();
  }
}

test();
