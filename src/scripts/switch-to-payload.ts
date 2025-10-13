import { config } from 'dotenv'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

// Charger les variables d'environnement
config({ path: '.env.local' })

interface SwitchOptions {
  dryRun?: boolean
  backup?: boolean
  verbose?: boolean
}

class PayloadSwitchManager {
  private options: SwitchOptions
  private envPath: string
  private backupPath: string

  constructor(options: SwitchOptions = {}) {
    this.options = {
      dryRun: false,
      backup: true,
      verbose: true,
      ...options
    }
    this.envPath = join(process.cwd(), '.env.local')
    this.backupPath = join(process.cwd(), '.env.local.backup')
  }

  private log(message: string, level: 'info' | 'success' | 'warning' | 'error' = 'info') {
    if (!this.options.verbose && level === 'info') return
    
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    }
    
    console.log(`${icons[level]} ${message}`)
  }

  private readEnvFile(): string {
    if (!existsSync(this.envPath)) {
      throw new Error('Fichier .env.local non trouvé')
    }
    return readFileSync(this.envPath, 'utf-8')
  }

  private writeEnvFile(content: string) {
    if (!this.options.dryRun) {
      writeFileSync(this.envPath, content, 'utf-8')
    }
  }

  private createBackup() {
    if (this.options.backup && !this.options.dryRun) {
      const envContent = this.readEnvFile()
      writeFileSync(this.backupPath, envContent, 'utf-8')
      this.log(`📦 Sauvegarde créée: ${this.backupPath}`)
    }
  }

  private updateEnvVariable(key: string, value: string, description: string) {
    const envContent = this.readEnvFile()
    const lines = envContent.split('\n')
    
    let found = false
    const newLines = lines.map(line => {
      if (line.startsWith(`${key}=`)) {
        found = true
        this.log(`🔄 Mise à jour: ${key}=${value}`)
        return `${key}=${value}`
      }
      return line
    })
    
    if (!found) {
      newLines.push(`# ${description}`)
      newLines.push(`${key}=${value}`)
      this.log(`➕ Ajout: ${key}=${value}`)
    }
    
    this.writeEnvFile(newLines.join('\n'))
  }

  private checkPrerequisites(): boolean {
    this.log('🔍 Vérification des prérequis...')
    
    // Vérifier MongoDB URI
    if (!process.env.MONGODB_URI) {
      this.log('❌ MONGODB_URI non défini dans .env.local', 'error')
      return false
    }
    this.log('✅ MONGODB_URI défini')
    
    // Vérifier PAYLOAD_SECRET
    if (!process.env.PAYLOAD_SECRET) {
      this.log('❌ PAYLOAD_SECRET non défini dans .env.local', 'error')
      return false
    }
    this.log('✅ PAYLOAD_SECRET défini')
    
    // Vérifier que le fichier .env.local existe
    if (!existsSync(this.envPath)) {
      this.log('❌ Fichier .env.local non trouvé', 'error')
      return false
    }
    this.log('✅ Fichier .env.local trouvé')
    
    return true
  }

  private switchToPayload() {
    this.log('\n🔄 Basculement vers Payload CMS...')
    
    // Désactiver le mode mock
    this.updateEnvVariable(
      'NEXT_PUBLIC_USE_MOCK_DATA',
      'false',
      'Utiliser les données Payload au lieu des données mock'
    )
    
    // Activer Payload CMS
    this.updateEnvVariable(
      'NEXT_PUBLIC_USE_PAYLOAD',
      'true',
      'Activer l\'utilisation de Payload CMS'
    )
    
    // Configurer l'URL de l'API Payload
    this.updateEnvVariable(
      'NEXT_PUBLIC_PAYLOAD_API_URL',
      'http://localhost:3010/api',
      'URL de l\'API Payload'
    )
    
    // Configurer l'URL de l'admin Payload
    this.updateEnvVariable(
      'NEXT_PUBLIC_PAYLOAD_ADMIN_URL',
      'http://localhost:3010/admin',
      'URL de l\'interface d\'administration Payload'
    )
    
    this.log('✅ Configuration Payload activée', 'success')
  }

  private switchToMock() {
    this.log('\n🔄 Basculement vers les données mock...')
    
    // Activer le mode mock
    this.updateEnvVariable(
      'NEXT_PUBLIC_USE_MOCK_DATA',
      'true',
      'Utiliser les données mock au lieu de Payload'
    )
    
    // Désactiver Payload CMS
    this.updateEnvVariable(
      'NEXT_PUBLIC_USE_PAYLOAD',
      'false',
      'Désactiver l\'utilisation de Payload CMS'
    )
    
    this.log('✅ Configuration mock activée', 'success')
  }

  private showCurrentConfig() {
    this.log('\n📋 Configuration actuelle:')
    
    const envContent = this.readEnvFile()
    const lines = envContent.split('\n')
    
    const relevantVars = [
      'NEXT_PUBLIC_USE_MOCK_DATA',
      'NEXT_PUBLIC_USE_PAYLOAD',
      'NEXT_PUBLIC_PAYLOAD_API_URL',
      'NEXT_PUBLIC_PAYLOAD_ADMIN_URL',
      'MONGODB_URI',
      'PAYLOAD_SECRET'
    ]
    
    relevantVars.forEach(varName => {
      const line = lines.find(l => l.startsWith(`${varName}=`))
      if (line) {
        const value = line.split('=')[1]
        this.log(`  ${varName}=${value}`)
      } else {
        this.log(`  ${varName}=<non défini>`, 'warning')
      }
    })
  }

  private showInstructions() {
    this.log('\n📖 Instructions post-basculement:')
    this.log('1. Redémarrer le serveur de développement:')
    this.log('   npm run dev')
    this.log('')
    this.log('2. Accéder à l\'interface d\'administration Payload:')
    this.log('   http://localhost:3010/admin')
    this.log('')
    this.log('3. Vérifier que les données sont bien migrées:')
    this.log('   npx tsx src/scripts/test-migration.ts')
    this.log('')
    this.log('4. Tester l\'application:')
    this.log('   - Page d\'accueil: http://localhost:3010')
    this.log('   - Admin: http://localhost:3010/admin')
    this.log('   - Catalogue: http://localhost:3010/catalogue')
    this.log('')
    this.log('5. En cas de problème, revenir au mode mock:')
    this.log('   npx tsx src/scripts/switch-to-payload.ts --mock')
  }

  async switchToPayload() {
    this.log('🚀 Basculement vers Payload CMS')
    
    if (this.options.dryRun) {
      this.log('🧪 Mode DRY RUN - Aucune modification ne sera effectuée', 'warning')
    }
    
    // Vérifier les prérequis
    if (!this.checkPrerequisites()) {
      this.log('❌ Prérequis non satisfaits', 'error')
      return false
    }
    
    // Créer une sauvegarde
    this.createBackup()
    
    // Afficher la configuration actuelle
    this.showCurrentConfig()
    
    // Effectuer le basculement
    this.switchToPayload()
    
    // Afficher les instructions
    this.showInstructions()
    
    this.log('\n🎉 Basculement vers Payload CMS terminé!', 'success')
    return true
  }

  async switchToMock() {
    this.log('🔄 Retour aux données mock')
    
    if (this.options.dryRun) {
      this.log('🧪 Mode DRY RUN - Aucune modification ne sera effectuée', 'warning')
    }
    
    // Créer une sauvegarde
    this.createBackup()
    
    // Afficher la configuration actuelle
    this.showCurrentConfig()
    
    // Effectuer le basculement
    this.switchToMock()
    
    this.log('\n🎉 Retour aux données mock terminé!', 'success')
    this.log('Redémarrez le serveur pour appliquer les changements.')
    return true
  }

  async showStatus() {
    this.log('📊 Statut de la configuration')
    this.showCurrentConfig()
    
    const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
    const isPayloadMode = process.env.NEXT_PUBLIC_USE_PAYLOAD === 'true'
    
    this.log('\n🎯 Mode actuel:')
    if (isMockMode) {
      this.log('  📦 Mode MOCK activé', 'warning')
    } else if (isPayloadMode) {
      this.log('  🚀 Mode PAYLOAD activé', 'success')
    } else {
      this.log('  ❓ Mode indéterminé', 'warning')
    }
  }
}

// Fonction principale
async function runSwitch() {
  const args = process.argv.slice(2)
  const options: SwitchOptions = {
    dryRun: args.includes('--dry-run'),
    backup: !args.includes('--no-backup'),
    verbose: !args.includes('--quiet'),
  }

  if (args.includes('--help')) {
    console.log(`
🔄 Script de basculement Payload CMS

Usage: npx tsx src/scripts/switch-to-payload.ts [command] [options]

Commands:
  payload     Basculer vers Payload CMS (défaut)
  mock        Revenir aux données mock
  status      Afficher le statut actuel

Options:
  --dry-run   Mode test (aucune modification)
  --no-backup Ne pas créer de sauvegarde
  --quiet     Mode silencieux
  --help      Afficher cette aide

Exemples:
  npx tsx src/scripts/switch-to-payload.ts
  npx tsx src/scripts/switch-to-payload.ts payload --dry-run
  npx tsx src/scripts/switch-to-payload.ts mock
  npx tsx src/scripts/switch-to-payload.ts status
`)
    process.exit(0)
  }

  const manager = new PayloadSwitchManager(options)
  const command = args[0] || 'payload'
  
  let success = false
  
  switch (command) {
    case 'payload':
      success = await manager.switchToPayload()
      break
    case 'mock':
      success = await manager.switchToMock()
      break
    case 'status':
      await manager.showStatus()
      success = true
      break
    default:
      console.error(`❌ Commande inconnue: ${command}`)
      console.error('Utilisez --help pour voir les commandes disponibles')
      process.exit(1)
  }
  
  process.exit(success ? 0 : 1)
}

// Exécuter le basculement
runSwitch().catch(error => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})
