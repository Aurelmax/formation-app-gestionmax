const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('🔍 Test de connexion MongoDB...\n');

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI n\'est pas défini dans .env.local');
    process.exit(1);
  }

  console.log('📝 URI utilisé (masqué):');
  const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
  console.log(maskedUri);
  console.log('');

  const client = new MongoClient(uri);

  try {
    console.log('🔌 Tentative de connexion...');
    await client.connect();
    console.log('✅ Connexion réussie!\n');

    const db = client.db();
    console.log(`📦 Base de données: ${db.databaseName}`);

    const collections = await db.listCollections().toArray();
    console.log(`📂 Collections trouvées (${collections.length}):`);

    if (collections.length > 0) {
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    } else {
      console.log('   (Aucune collection - base vide)');
    }

    console.log('\n🔍 Test de requête sur la collection "programmes"...');
    const programmesCollection = db.collection('programmes');
    const count = await programmesCollection.countDocuments();
    console.log(`✅ ${count} documents trouvés dans "programmes"`);

    if (count > 0) {
      const sampleDoc = await programmesCollection.findOne();
      console.log('\n📄 Exemple de document:');
      console.log(JSON.stringify(sampleDoc, null, 2).substring(0, 500) + '...');
    }

  } catch (error) {
    console.error('\n❌ Erreur de connexion:');
    console.error(error.message);

    if (error.message.includes('authentication failed')) {
      console.error('\n💡 Suggestions:');
      console.error('   1. Vérifiez votre nom d\'utilisateur et mot de passe');
      console.error('   2. Assurez-vous que le mot de passe est URL-encodé (! devient %21)');
      console.error('   3. Vérifiez les droits de l\'utilisateur dans MongoDB Atlas');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 Suggestions:');
      console.error('   1. Vérifiez le nom du cluster');
      console.error('   2. Vérifiez votre connexion internet');
    } else if (error.message.includes('IP')) {
      console.error('\n💡 Suggestions:');
      console.error('   1. Ajoutez votre IP dans MongoDB Atlas → Network Access');
      console.error('   2. Ou autorisez 0.0.0.0/0 pour toutes les IPs');
    }

    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion fermée');
  }
}

testConnection();
