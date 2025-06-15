# 🧰 Guía de Despliegue y Mantenimiento — Ruiz Gijón Conecta

_Autora: Yohanna Gelo (yohannagelo@gmail.com)_

Esta guía documenta todos los pasos necesarios para desplegar, mantener y actualizar el proyecto **Ruiz Gijón Conecta**, tanto en entorno local como en el servidor de producción.

---

## 📑 Índice

- [🧰 Guía de Despliegue y Mantenimiento — Ruiz Gijón Conecta](#-guía-de-despliegue-y-mantenimiento--ruiz-gijón-conecta)
  - [📑 Índice](#-índice)
  - [1. 🛠️ Primer Despliegue](#1-️-primer-despliegue)
    - [1.1 🧱 Estructura Local del Proyecto](#11--estructura-local-del-proyecto)
    - [1.2 📁 Estructura en el Servidor](#12--estructura-en-el-servidor)
    - [1.3 🔧 Configuración Inicial del Servidor](#13--configuración-inicial-del-servidor)
    - [1.4 ⚙️ Script de Despliegue Automático](#14-️-script-de-despliegue-automático)
    - [📌 Hazlo ejecutable:](#-hazlo-ejecutable)
  - [2. 🧪 Mantenimiento del Proyecto](#2--mantenimiento-del-proyecto)
    - [2.1 ✅ Trabajo en Local (`develop`)](#21--trabajo-en-local-develop)
    - [2.2 🔢 Actualizar Versión Visible (opcional)](#22--actualizar-versión-visible-opcional)
  - [3. 🚀 Despliegue en Producción](#3--despliegue-en-producción)
    - [3.1 ⬆️ Subir y Fusionar Cambios](#31-️-subir-y-fusionar-cambios)
    - [3.2 📡 Push a Producción y Autoejecución](#32--push-a-producción-y-autoejecución)
    - [3.3 🧠 Sistema de Versionado y Autoactualización](#33--sistema-de-versionado-y-autoactualización)
  - [4. ⚠️ Errores Comunes](#4-️-errores-comunes)
  - [5. 📎 Extras Útiles](#5--extras-útiles)
  - [6. ✅ Flujo Recomendado](#6--flujo-recomendado)

---

## 1. 🛠️ Primer Despliegue

### 1.1 🧱 Estructura Local del Proyecto

```

/rgconecta
├── client/ruiz-gijon-conecta     ← Angular
└── server/                       ← Laravel

```

---

### 1.2 📁 Estructura en el Servidor

Ruta de despliegue:

```

/var/www/yohannagelo/rgconecta/
├── server/                      ← Laravel API
│   ├── public/                  ← aquí irá el build de Angular
├── public/  → enlace simbólico a server/public/

```

URL resultante:

```

[https://yohannagelo.ruix.iesruizgijon.es/rgconecta/](https://yohannagelo.ruix.iesruizgijon.es/rgconecta/)

```

---

### 1.3 🔧 Configuración Inicial del Servidor

Conéctate por SSH y ejecuta:

```bash
ssh coliney@ruizgijon.ddns.net
mkdir -p /var/www/yohannagelo/rgconecta
cd /var/www/yohannagelo/rgconecta
ln -s server/public public
```

---

### 1.4 ⚙️ Script de Despliegue Automático

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

Crea `/rgconecta/deploy.sh` con permisos de ejecución:

```bash
chmod +x deploy.sh
```

Contenido del script:
(⚠️ Ya contiene: build Angular, Laravel, versionado, permisos...)

[Haz clic aquí para ver el script completo (contenido idéntico al que ya tenías)](!-- omitir inline por extensión, se asume que va en su archivo --)

---

## 2. 🧪 Mantenimiento del Proyecto

### 2.1 ✅ Trabajo en Local (`develop`)

```bash
cd ~/ruta/a/rgconecta
git checkout develop
git pull origin develop
```

Realiza cambios en Angular o Laravel, luego ejecuta:

```bash
php artisan serve
ng serve
```

---

### 2.2 🔢 Actualizar Versión Visible (opcional)

Modifica manualmente si hay cambios mayores:

```
client/ruiz-gijon-conecta/src/environments/environment.about.ts
```

```ts
version: "v1.3", // ⬅️ Actualizar aquí
```

Verifica que todo funciona en local:

```bash
php artisan serve
ng serve
```

---

## 3. 🚀 Despliegue en Producción

### 3.1 ⬆️ Subir y Fusionar Cambios

Desde `develop`:

```bash
git add .
git commit -m "💬 Descripción"
git push origin develop
```

Fusionar con squash a `main`:

```bash
git checkout main
git merge --squash develop
git commit -m "🚀 Deploy v1.3 - resumen"
```

---

### 3.2 📡 Push a Producción y Autoejecución

```bash
git push server main
```

Automáticamente se ejecutan:

- Clonado del repo
- `composer install`
- `php artisan migrate`
- `npm install`
- `ng build`
- Copia del build Angular
- Generación de `version.json`

---

### 3.3 🧠 Sistema de Versionado y Autoactualización

- Se compara el `commitHash` del `version.json` con el servidor.
- Si cambia, muestra modal de recarga.
- Info visible en el componente "Acerca de".

---

## 4. ⚠️ Errores Comunes

| Error                       | Solución                                         |
| --------------------------- | ------------------------------------------------ |
| Pantalla en blanco          | Verifica `baseHref` en `angular.json`            |
| 403 Forbidden               | Ejecuta `chmod -R 755`                           |
| No se actualiza el frontend | Verifica `ng build` + que se copien los archivos |

---

## 5. 📎 Extras Útiles

**API en Producción:**

```ts
apiUrl: "https://yohannagelo.ruix.iesruizgijon.es/rgc_api/api";
```

**Enlace simbólico si no existe:**

```bash
cd /var/www/yohannagelo
ln -s rgconecta/server/public rgc_api
```

**Sincronizar `develop` con `main`:**

```bash
git checkout develop
git reset --hard main
git push origin develop --force
```

> ⚠️ Solo si trabajas sola y has hecho un squash limpio.

---

## 6. ✅ Flujo Recomendado

1. Trabaja en rama `feature/*`
2. Merge a `develop`
3. Verifica en local
4. Squash a `main`
5. `git push server main` y ¡listo! 🚀

---
