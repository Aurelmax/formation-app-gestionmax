#!/usr/bin/env node

/**
 * Script de surveillance pour la configuration Payload
 * Génère automatiquement les types quand payload.config.ts change
 */

const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const CONFIG_FILE = path.join(process.cwd(), 'src', 'payload.config.ts')
const TYPES_FILE = path.join(process.cwd(), 'src', 'types', 'payload-generated.ts')

let isGenerating = false

function log(message) {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0]
  console.log(`[${timestamp}] ${message}`)
}

function generateTypes() {
  if (isGenerating) {
    log('⏳ Génération déjà en cours, ignoré')
    return
  }

  isGenerating = true
  log('🔄 Configuration Payload modifiée, génération des types...')

  exec('npm run sync:types', (error, stdout, stderr) => {
    isGenerating = false

    if (error) {
      log(`❌ Erreur lors de la génération: ${error.message}`)
      return
    }

    if (stderr) {
      log(`⚠️ Avertissements: ${stderr}`)
    }

    log('✅ Types générés avec succès')
    console.log(stdout)
  })
}

function watchConfigFile() {
  log('👀 Surveillance de la configuration Payload...')
  log(`📁 Fichier surveillé: ${CONFIG_FILE}`)

  if (!fs.existsSync(CONFIG_FILE)) {
    log(`❌ Fichier de configuration non trouvé: ${CONFIG_FILE}`)
    process.exit(1)
  }

  // Générer les types au démarrage
  generateTypes()

  // Surveiller les modifications
  fs.watchFile(CONFIG_FILE, { interval: 1000 }, (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
      log('📝 Configuration Payload modifiée')
      generateTypes()
    }
  })

  log('✅ Surveillance active. Appuyez sur Ctrl+C pour arrêter.')
}

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  log('🛑 Arrêt de la surveillance')
  fs.unwatchFile(CONFIG_FILE)
  process.exit(0)
})

// Démarrer la surveillance
watchConfigFile()
