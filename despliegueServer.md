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
    git clone --branch $BRANCH $REPO_DIR $WORK_TREE
  else
    git --work-tree=$WORK_TREE --git-dir=$REPO_DIR checkout -f $BRANCH
  fi

  echo ">>> Backend (Laravel)..."
  cd $WORK_TREE/server
  composer install --no-dev --optimize-autoloader
  php artisan config:cache
  php artisan migrate --force

  echo ">>> Frontend (Angular)..."
  cd $WORK_TREE/client/ruiz-gijon-conecta
  npm install
  ng build --configuration=production --output-path=/var/www/yohannagelo/rgconecta
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
"outputPath": "../../",
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

* **403 Forbidden:** Archivos sin permisos. Ejecutar:

  ```bash
  chmod -R 755 /var/www/yohannagelo/rgconecta
  ```

* **Pantalla en blanco / Solo fondo:** Angular no encuentra `baseHref`. Verificar `angular.json`.

* **No se ve nada tras el push:** Verificar que el hook esté en la rama `develop` y que el `WORK_TREE` sea correcto.

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
