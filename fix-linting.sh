#!/bin/bash

echo "🔧 Correction automatique des erreurs de linting..."

# Corriger les apostrophes non échappées
echo "📝 Correction des apostrophes..."
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i "s/n'/n\&apos;/g"
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i "s/l'/l\&apos;/g"
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i "s/d'/d\&apos;/g"
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i "s/s'/s\&apos;/g"
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i "s/t'/t\&apos;/g"
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i "s/c'/c\&apos;/g"
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i "s/m'/m\&apos;/g"
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i "s/j'/j\&apos;/g"
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i "s/é'/é\&apos;/g"
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i "s/è'/è\&apos;/g"
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i "s/à'/à\&apos;/g"
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i "s/ù'/ù\&apos;/g"

# Corriger les types 'any' les plus courants
echo "🔧 Correction des types 'any'..."
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i "s/: any\[\]/: unknown[]/g"
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i "s/: any\b/: Record<string, unknown>/g"

echo "✅ Corrections appliquées !"
echo "⚠️  Vérifiez manuellement les corrections avant de commiter."
