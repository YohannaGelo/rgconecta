#!/bin/bash

# === CONFIGURACIÓN ===
USER=coliney
HOST=ruizgijon.ddns.net
REMOTE_BASE=/var/www/yohannagelo/rgconecta
REMOTE_PUBLIC=$REMOTE_BASE/server/public

echo "==============================="
echo "🚀 DEPLOYING RG CONECTA"
echo "==============================="

# === 1. COMPILAR ANGULAR ===
echo "📦 Compilando Angular..."
cd client/ruiz-gijon-conecta || exit 1
npm install
ng build --configuration=production
cd ../../

# === 2. SUBIR BACKEND (Laravel SIN sobrescribir public/) ===
echo "📤 Subiendo Laravel (sin vendor/node_modules)..."
rsync -avz --delete \
  --exclude vendor \
  --exclude node_modules \
  --exclude public \
  ./server/ $USER@$HOST:$REMOTE_BASE/server/

# === 3. LIMPIAR Y SUBIR ANGULAR A public/ ===
echo "🧹 Limpiando public/ en servidor..."
ssh $USER@$HOST "rm -rf $REMOTE_PUBLIC/*"

echo "📤 Subiendo Angular a public/..."
rsync -avz ./client/ruiz-gijon-conecta/dist/ruiz-gijon-conecta/browser/ \
  $USER@$HOST:$REMOTE_PUBLIC/

# === 4. CONFIGURAR LARAVEL EN SERVIDOR ===
echo "🔧 Ejecutando comandos en servidor..."
ssh $USER@$HOST << EOF
  cd $REMOTE_BASE/server
  composer install --no-dev --optimize-autoloader
  npm install
  npm run build
  rm -rf node_modules
  chmod -R 777 storage bootstrap/cache
EOF

echo "✅ DEPLOY COMPLETADO"
echo "🌐 App disponible en: https://yohannagelo.ruix.iesruizgijon.es/ruiz-gijon-conecta/"
