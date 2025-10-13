/**
 * Script pour mettre à jour la structure des programmes existants
 * avec les nouveaux champs réglementaires
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

async function updateProgrammesStructure() {
  console.log('🔄 Mise à jour de la structure des programmes...');

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ MONGODB_URI n\'est pas défini dans .env.local');
    return;
  }

  let client: MongoClient | undefined;
  try {
    client = new MongoClient(mongoUri);
    await client.connect();
    console.log('✅ Connexion MongoDB établie');

    const db = client.db();
    const collection = db.collection('programmes');

    // Récupérer tous les programmes existants
    const programmes = await collection.find({}).toArray();
    console.log(`📋 ${programmes.length} programmes trouvés`);

    let updatedCount = 0;

    for (const programme of programmes) {
      const updateData: any = {};

      // Ajouter les champs manquants avec des valeurs par défaut
      if (!programme.objectifs) {
        updateData.objectifs = `Objectifs pédagogiques pour ${programme.titre}`;
      }
      
      if (!programme.prerequis) {
        updateData.prerequis = 'Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur.';
      }
      
      if (!programme.publicConcerne) {
        updateData.publicConcerne = 'Artisans, commerçants, professions libérales et entrepreneurs.';
      }
      
      if (!programme.horaires) {
        updateData.horaires = '9h à 13h et de 14h à 17h';
      }
      
      if (!programme.delaisMiseEnPlace) {
        updateData.delaisMiseEnPlace = 'À réception de l\'accord de prise en charge';
      }
      
      if (!programme.modalitesReglement) {
        updateData.modalitesReglement = 'Chèque ou virement à réception de facture';
      }
      
      if (!programme.ressources) {
        updateData.ressources = [
          'Salle de formation équipée',
          'Support de cours',
          'Matériel informatique'
        ];
      }
      
      if (!programme.modalitesEvaluation) {
        updateData.modalitesEvaluation = 'Évaluation des connaissances théoriques et travaux pratiques';
      }
      
      if (!programme.sanctionFormation) {
        updateData.sanctionFormation = 'Certificat de réalisation de formation';
      }
      
      if (!programme.niveauCertification) {
        updateData.niveauCertification = 'Aucune';
      }
      
      if (!programme.accessibiliteHandicap) {
        updateData.accessibiliteHandicap = 'Entretien téléphonique pour évaluer les besoins spécifiques au regard d\'une situation de handicap, mise en œuvre des adaptations pédagogiques, organisationnelles et matérielles nécessaires.';
      }
      
      if (!programme.cessationAbandon) {
        updateData.cessationAbandon = 'En cas de renonciation avant le début de la formation, aucune facturation. En cas de renonciation en cours de formation, la facturation se fera au prorata de l\'assiduité.';
      }

      // Informations formateur par défaut
      if (!programme.formateurNom) {
        updateData.formateurNom = 'Aurélien LAVAYSSIERE';
      }
      
      if (!programme.formateurEmail) {
        updateData.formateurEmail = 'aurelien@gestionmax.fr';
      }
      
      if (!programme.formateurTelephone) {
        updateData.formateurTelephone = '06.46.02.24.68';
      }
      
      if (!programme.formateurRole) {
        updateData.formateurRole = 'Consultant formateur en informatique de gestion';
      }
      
      if (!programme.formateurBiographie) {
        updateData.formateurBiographie = 'Aurélien LAVAYSSIERE est un consultant formateur en informatique de gestion, spécialisé dans la formation des adultes. Doté d\'une solide expérience dans le domaine de la formation, Aurélien possède une expertise approfondie en matière de technologies web et de gestion d\'entreprise.';
      }

      // Mettre à jour le programme s'il y a des champs à ajouter
      if (Object.keys(updateData).length > 0) {
        await collection.updateOne(
          { _id: programme._id },
          { $set: updateData }
        );
        
        console.log(`✅ Programme mis à jour: ${programme.codeFormation} - ${programme.titre}`);
        updatedCount++;
      } else {
        console.log(`ℹ️ Programme déjà à jour: ${programme.codeFormation}`);
      }
    }

    console.log(`\n📊 Résumé de la mise à jour:`);
    console.log(`   ✅ Programmes mis à jour: ${updatedCount}`);
    console.log(`   📋 Total programmes: ${programmes.length}`);

  } catch (error: any) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

updateProgrammesStructure();
