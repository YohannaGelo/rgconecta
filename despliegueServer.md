# Despliegue automático con Git Push en el servidor

Esta guía explica cómo configurar y utilizar un sistema de despliegue automático para un proyecto fullstack (Laravel + Angular) mediante un repositorio Git remoto en un servidor.

---

## 📂 Estructura esperada del proyecto en el servidor

Ruta base: `/var/www/yohannagelo/rgconecta`

```bash
/rgconecta
├── client/ruiz-gijon-conecta         # Proyecto Angular
├── server/                           # API Laravel
├── index.html, main.js...            # Archivos generados por Angular
```

---

## 🔧 Paso 1: Crear el repositorio bare en el servidor

```bash
mkdir -p /home/coliney/repo/rgconecta.git
cd /home/coliney/repo/rgconecta.git
git init --bare
```

---

## ✍️ Paso 2: Crear el hook `post-receive`

Archivo: `/home/coliney/repo/rgconecta.git/hooks/post-receive`

```bash
#!/bin/bash

BRANCH="develop"
WORK_TREE="/var/www/yohannagelo/rgconecta"
REPO_DIR="/home/coliney/repo/rgconecta.git"

echo "### Recibiendo cambios..."

read oldrev newrev ref
if [[ $ref = refs/heads/$BRANCH ]]; then
  echo ">>> Desplegando rama '$BRANCH'..."

  if [ ! -d "$WORK_TREE/.git" ]; then
    echo ">>> Clonando repo por primera vez..."
    git clone --branch $BRANCH $REPO_DIR $WORK_TREE
  else
    echo ">>> Actualizando código..."
    git --work-tree=$WORK_TREE --git-dir=$REPO_DIR checkout -f $BRANCH
  fi

  echo ">>> Backend (Laravel)..."
  cd $WORK_TREE/server
  composer install --no-dev --optimize-autoloader
  php artisan migrate --force

  # Limpieza y recompilación de caché
  php artisan optimize:clear
  php artisan migrate --force
  php artisan optimize

  # Permisos
  chmod -R 777 storage bootstrap/cache

  echo ">>> Frontend (Angular)..."
  cd $WORK_TREE/client/ruiz-gijon-conecta
  npm install
  ng build --configuration=production

  if [ -d "dist/ruiz-gijon-conecta/browser" ]; then
    echo "✅ Copiando build Angular a raíz del proyecto..."
    cp -r dist/ruiz-gijon-conecta/browser/* $WORK_TREE/
  else
    echo "❌ ERROR: Build de Angular no encontrado en dist/ruiz-gijon-conecta/browser"
  fi

  echo ">>> Corrigiendo permisos finales..."
  chmod -R 755 $WORK_TREE
  chmod -R 777 storage bootstrap/cache
fi

echo "✅ Despliegue completo."

```

Dar permisos de ejecución:

```bash
chmod +x hooks/post-receive
```

---

## 💾 Paso 3: En local, añadir remoto y desplegar

Desde el PC local, en la carpeta del proyecto:

```bash
git remote add server ssh://coliney@ruix.iesruizgijon.es/home/coliney/repo/rgconecta.git
git push server develop
```

---

## 📊 Angular: Configuración en `angular.json`

### build > options:

```json
"outputPath": "dist/ruiz-gijon-conecta",
"baseHref": "/rgconecta/"
```

Esto asegura que los archivos generados se ubiquen directamente en la carpeta servida públicamente.

---

## 🚀 Flujo de trabajo habitual

1. Trabajar en una rama de desarrollo (por ejemplo `feature/frontend`)
2. Hacer cambios, `commit`, etc.
3. Fusionar a `develop`:

   ```bash
   git checkout develop
   git merge feature/frontend
   ```

4. Subir al servidor:

   ```bash
   git push server develop
   ```

5. El servidor actualizará frontend y backend automáticamente.

---

## 🚫 Posibles errores y soluciones

- **403 Forbidden:** Archivos sin permisos. Ejecutar:

  ```bash
  chmod -R 755 /var/www/yohannagelo/rgconecta
  ```

- **Pantalla en blanco / Solo fondo:** Angular no encuentra `baseHref`. Verificar `angular.json`.

- **No se ve nada tras el push:** Verificar que el hook esté en la rama `develop` y que el `WORK_TREE` sea correcto.

---

## 🌟 Comando para eliminar completamente el proyecto en el servidor

```bash
rm -rf /var/www/yohannagelo/rgconecta
```

---

## 📖 Archivo `.env` de Laravel

Debe estar en: `/var/www/yohannagelo/rgconecta/server/.env`

Variables clave:

```env
APP_URL=https://yohannagelo.ruix.iesruizgijon.es/rgconecta
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=nombre_db
DB_USERNAME=usuario
DB_PASSWORD=contraseña
```

Luego ejecutar:

```bash
php artisan config:cache
php artisan migrate --force
```

---

✅ Tu despliegue está listo para ser actualizado automáticamente con cada `git push server develop`.

---

Hacer el Api funcional

```bash
cd /var/www/yohannagelo
ln -s rgconecta/server/public rgc_api

```

Ajustar archivo environments.prod.ts:

```js
export const environment = {
  production: true,
  apiUrl: "https://yohannagelo.ruix.iesruizgijon.es/rgc_api/api",
};
```

Funciona -> https://yohannagelo.ruix.iesruizgijon.es/rgc_api/api/ofertas

y el .env -> APP_URL=https://yohannagelo.ruix.iesruizgijon.es/rgc_api

Hacer push en el server o lanzar:

```bash
cd /var/www/yohannagelo/rgconecta/server
php artisan config:clear

```

---

## INTENTO 2

Perfecto. Aquí va una **guía completa paso a paso** para:

1. ✅ Hacer el primer despliegue de tu app (Angular + Laravel API)
2. 🔁 Poder seguir trabajando en local y desplegar cambios fácilmente

---

## 🧱 1. ESTRUCTURA DEL PROYECTO LOCAL

```
/rgconecta
├── client/ruiz-gijon-conecta     ← Angular
└── server/                       ← Laravel
```

---

## 📁 2. ESTRUCTURA EN EL SERVIDOR

Vamos a subir todo a:

```
/var/www/yohannagelo/rgconecta/
├── server/                      ← Laravel API
│   ├── public/                  ← aquí irá el frontend Angular (build)
├── public/  → enlace simbólico a server/public/
```

Para que la URL sea:

```
https://yohannagelo.ruix.iesruizgijon.es/rgconecta/
```

---

## 🧰 3. CONFIGURAR EL SERVIDOR (una vez)

Conéctate por SSH:

```bash
ssh coliney@ruizgijon.ddns.net
```

Y ejecuta esto solo una vez:

```bash
mkdir -p /var/www/yohannagelo/rgconecta
cd /var/www/yohannagelo/rgconecta

# El enlace simbólico al public de Laravel
ln -s server/public public
```

Esto hace que el navegador acceda directamente al `public/` de Laravel, donde Angular colocará sus archivos compilados.

---

## ⚙️ 4. SCRIPT DE DESPLIEGUE LOCAL

Crea un archivo en la raíz del proyecto local `/rgconecta/deploy.sh`:

```bash
#!/bin/bash

BRANCH="develop"
WORK_TREE="/var/www/yohannagelo/rgconecta"
REPO_DIR="/home/coliney/repo/rgconecta.git"

echo "### Recibiendo cambios..."

read oldrev newrev ref
if [[ $ref = refs/heads/$BRANCH ]]; then
  echo ">>> Desplegando rama '$BRANCH'..."

  if [ ! -d "$WORK_TREE/.git" ]; then
    git clone --branch $BRANCH $REPO_DIR $WORK_TREE
  else
    git --work-tree=$WORK_TREE --git-dir=$REPO_DIR checkout -f $BRANCH
  fi

  echo ">>> Backend (Laravel)..."
  cd $WORK_TREE/server
  composer install --no-dev --optimize-autoloader
  php artisan migrate --force

  # Limpieza y recompilación de caché
  php artisan optimize:clear
  php artisan migrate --force
  php artisan optimize

  # Permisos
  chmod -R 777 storage bootstrap/cache



### ✅ BLOQUE NUEVO: version.json con versión manual y hash
echo ">>> Generando archivo de versión..."

cd $WORK_TREE

# Obtener hash del último commit
COMMIT_HASH=$(git --git-dir=$REPO_DIR rev-parse --short HEAD)

# Obtener mensaje
COMMIT_MESSAGE=$(git --git-dir=$REPO_DIR log -1 --pretty=%s)

# Obtener fecha actual
BUILD_DATE=$(date +'%Y-%m-%d %H:%M:%S')

# Leer versión actual si existe (elige uno de estos métodos)
VERSION_FILE="$WORK_TREE/client/ruiz-gijon-conecta/src/assets/version.json"

# Crear el archivo JSON con toda la info
echo "{
  \"commitHash\": \"$COMMIT_HASH\",
  \"commitMessage\": \"$COMMIT_MESSAGE\",
  \"buildDate\": \"$BUILD_DATE\"
}" > "$VERSION_FILE"

echo "✅ version.json generado con:"
cat "$VERSION_FILE"
### FIN BLOQUE NUEVO


  echo ">>> Frontend (Angular)..."
  cd $WORK_TREE/client/ruiz-gijon-conecta
  npm install
  ng build --configuration=production

   echo ">>> Copiando build de Angular a raíz del proyecto..."
   if [ -d "dist/ruiz-gijon-conecta" ]; then
        echo "✅ Build generado, copiando a raíz del proyecto..."
        cp -r dist/ruiz-gijon-conecta/browser/* $WORK_TREE/
   else
        echo "❌ ERROR: No se encontró el build de Angular. Revisa 'outputPath'."
   fi





  echo ">>> Corrigiendo permisos finales..."
  chmod -R 755 $WORK_TREE

  # Volvemos a ajustar los permisos del server
  cd $WORK_TREE/server
  chmod -R 777 storage bootstrap/cache

fi

echo "✅ Despliegue completo."

```

### 📌 Hazlo ejecutable:

```bash
chmod +x deploy.sh
```

---

## 🚀 5. CÓMO DESPLEGAR CAMBIOS

Cuando trabajes en local y quieras subir cambios:

### 1. Asegúrate de estar en la rama `develop`:

```bash
git checkout develop
git pull origin develop
```

### 2. Ejecuta el script:

```bash
./deploy.sh
```

Este script:

- Sube cambios del backend (Laravel)
- Hace `ng build` del frontend y lo sube al `public/` del backend
- Ejecuta los comandos necesarios en el servidor para instalar dependencias y preparar Laravel

---

## 🔄 6. FLUJO DE TRABAJO DIARIO (RECOMENDADO)

1. Trabajas en ramas `feature/*`
2. Haces `merge` a `develop`
3. Ejecutas `./deploy.sh` para desplegar a producción

---

## ✅ VERIFICACIÓN FINAL

Cuando abras en navegador:

```
https://yohannagelo.ruix.iesruizgijon.es/rgconecta/
```

Deberías ver tu frontend funcionando, y cuando Angular haga peticiones como:

```
GET /api/usuarios
```

Laravel responderá correctamente.

---

¿Quieres que te cree yo ese `deploy.sh` con nombres adaptados y te lo deje listo para copiar/pegar?
