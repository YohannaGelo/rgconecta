## Mantenimineto - RG Conecta

### ✅ 1. **Actualizar y trabajar en local**

1. 🖥️ Abre la app en VS Code:

   ```bash
   cd ~/ruta/a/rgconecta
   code .
   ```

2. 🧪 Asegúrate de estar en la rama `develop`:

   ```bash
   git checkout develop
   ```

3. 🔄 Actualiza tu rama (por si hay cambios nuevos en GitHub):

   ```bash
   git pull origin develop
   ```

Perfecto, aquí tienes la sección actualizada con esa indicación incluida:

---

### 4. 🧑‍💻 Realiza los cambios necesarios en el código (Angular, Laravel o ambos)

- Edita componentes, servicios, vistas o rutas según lo que necesites.
- Asegúrate de probar los cambios localmente (`ng serve` y/o `php artisan serve`).

📝 **IMPORTANTE**:
Si es un **cambio relevante o mayor**, **actualiza manualmente la versión numérica** para reflejarlo en la app (por ejemplo, pasar de `1.2` a `1.3`).

📁 Ruta del archivo a modificar:

```
client/ruiz-gijon-conecta/src/environments/environment.about.ts
```

```ts
export const ABOUT_INFO = {
  appName: "Ruiz Gijón Conecta",
  version: "v.1.3", // ⬅️ actualiza aquí si es necesario
  supportEmail: "juanamaria.gelo-coline@iesruizgijon.com",
  personalEmail: "yohannagelo@gmail.com",
  author: "Yohanna Gelo",
  linkedin: "https://www.linkedin.com/in/yohannagelo",
  year: new Date().getFullYear(),
};
```

Así, la versión visual que aparece en el modal de "Acerca de" y otros puntos públicos queda alineada con tus despliegues importantes.

1. ✅ Verifica que todo funciona en local:

   - Backend (Laravel): `php artisan serve`
   - Frontend (Angular): `ng serve`

---

### 🚀 2. **Subir cambios a GitHub desde `develop`**

1. 📦 Añade y haz commit de los cambios:

   ```bash
   git add .
   git commit -m "💬 Breve descripción de los cambios"
   ```

2. ⬆️ Haz push a la rama remota:

   ```bash
   git push origin develop
   ```

---

### 🔀 3. **Fusionar cambios en `main`**

1. 🛡️ Cambia a la rama `main`:

   ```bash
   git checkout main
   ```

2. 🔃 Fusiona `develop` de forma limpia:

   ```bash
   git merge --squash develop
   git commit -m "🚀 Deploy versión X.X - resumen del cambio"
   ```

3. 💡 Opcional: puedes probar el proyecto localmente en `main` si lo deseas (`ng serve` o `php artisan serve`).

---

### 📡 4. **Desplegar al servidor**

1. 🛰️ Lanza el push al repo bare del servidor:

   ```bash
   git push server main
   ```

2. 🧾 Durante el despliegue:

   - Se generará automáticamente el nuevo `version.json` con hash y fecha de compilación.
   - Se hará build del frontend Angular.
   - Si todo está bien configurado, el navegador detectará la nueva versión cuando los usuarios recarguen o naveguen.

---

### 🧹 5. **(Opcional) Limpiar historial de commits en `develop`**

Para mantener `main` limpio, puedes borrar los commits de `develop` una vez hecho el squash (si lo consideras necesario):

```bash
git checkout develop
git reset --hard main
git push origin develop --force
```

⚠️ _¡Haz esto solo si estás 100% segura de que `main` está como debe y nadie más trabaja sobre `develop`!_

---

## 📝 Notas y Recomendaciones

- 💾 Haz commit y push frecuentemente en `develop` para evitar pérdida de trabajo.
- 🔐 Recuerda nunca subir `.env`, contraseñas o claves privadas.
- 🛟 Si hay errores en el deploy: entra al servidor y revisa los logs (`storage/logs/laravel.log`, consola del navegador, etc.).
- 📁 Asegúrate de que el `version.json` final se copie bien al root (`/rgconecta/assets/`).

---
