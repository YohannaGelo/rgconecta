# IMPLEMENTADAS

## cloudinay en laravel para imagenes

sube imagenes y recupera la url

## toastr en angular

para mostrar alert personalizados

---

## POSIBILIDADES

## Crear app android e iOS

Perfecto, ¡vas con ventaja entonces! 👏 Si ya tienes el diseño hecho en Bootstrap + Sass, eso te permite avanzar muy rápido en Angular sin preocuparte demasiado por el estilado.

Te comento punto por punto:

---

### ✅ **Lo que puedes aprovechar en Angular**

Sí puedes reutilizar:

- ✅ **Bootstrap completo** (solo instalas `bootstrap` en Angular y listo).
- ✅ Tus **clases CSS personalizadas**, ya que Angular permite añadir tu propio SCSS.
- ✅ La **estructura visual** y diseño, simplemente copiando tus componentes HTML a los componentes Angular.

---

### 🧱 ¿Cómo lo montas en Angular (con tu diseño)?

1. **Crear proyecto Angular**

   ```bash
   ng new conecta-frontend --style=scss
   cd conecta-frontend
   ```

2. **Instalar Bootstrap**

   ```bash
   npm install bootstrap
   ```

3. **Importar Bootstrap en tu `angular.json`**
   En `angular.json`, busca `styles` y añade:

   ```json
   "styles": [
     "node_modules/bootstrap/dist/css/bootstrap.min.css",
     "src/styles.scss"
   ]
   ```

4. **Copiar tus archivos SASS/SCSS**

   - Si tenías un `main.scss`, lo puedes fusionar con `src/styles.scss`.
   - O modularizarlo en varias partes (`_buttons.scss`, `_layout.scss`, etc.).

5. **Copiar las plantillas HTML**
   - Cada página que tenías (home, login, registro…) se convierte en un componente Angular (`ng generate component nombre`).
   - Copias el contenido HTML y lo adaptas si es necesario (enrutamiento, componentes dinámicos, etc.).

---

### 📱 ¿Y si luego te da tiempo para app móvil?

Como ya estás usando Bootstrap + Angular:

- ✅ Puedes añadir **Capacitor** más adelante sin cambiar casi nada.
- ✅ Tu diseño ya es **responsive**, así que con pequeños ajustes podrás tenerlo decente en móvil.
- 🚀 En el futuro solo necesitarías:
  
  ```bash
  npm install @capacitor/core @capacitor/cli
  npx cap init
  npx cap add android
  npx cap open android
  ```

---

### 👉 Recomendación final

- Empieza ahora el frontend Angular usando **tu diseño actual con Bootstrap**.
- Si luego te da tiempo, lo empaquetas como app móvil con Capacitor, sin perder nada de lo hecho.

¡Sí, también sirve para **iOS**! 🚀

Cuando usas **Angular + Capacitor**, puedes generar **apps nativas** tanto para **Android como para iOS** desde el mismo proyecto web. Te explico cómo va:

---

### ✅ ¿Qué es Capacitor?

Es una herramienta de **Ionic** que permite empaquetar cualquier aplicación web (como tu frontend en Angular) en una **app nativa para Android e iOS**. Así puedes usar una sola base de código para web y móvil.

---

### 📱 ¿Cómo se genera para iOS?

1. **Instala Capacitor en tu proyecto Angular (solo una vez):**

   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init
   ```

2. **Compila tu app Angular:**

   ```bash
   ng build --prod
   ```

3. **Añade la plataforma iOS:**

   ```bash
   npx cap add ios
   ```

4. **Abre el proyecto en Xcode:**

   ```bash
   npx cap open ios
   ```

   > Esto abrirá Xcode, desde donde puedes probarlo en simulador, testear en tu iPhone o subirlo a la App Store.

---

### 🔒 Importante para iOS

- Necesitas un **Mac con Xcode** para compilar y probar en iOS.
- Para publicar en la App Store, necesitas una **cuenta de desarrollador de Apple** (99 $/año).

---

### 🧠 Conclusión

- Sí, **tu app Angular con Bootstrap puede convertirse en app iOS** fácilmente.
- Si te centras primero en el diseño responsive, luego lo empaquetas con Capacitor sin problemas.
- Si no tienes Mac ahora, puedes avanzar con Android y web. Si te da tiempo o tienes acceso, ¡iOS también cae!

No, para **Android no necesitas pagar nada** para desarrollar ni probar tu app en dispositivos o emuladores. Solo pagarías si quieres **publicarla en Google Play**. Te detallo:

---

### ✅ Gratis para

- **Desarrollar apps.**
- **Probar en emuladores o dispositivos físicos.**
- **Distribuir manualmente tu APK** (por ejemplo, a amigos, en tu web, o para pruebas).

---

### 💰 Solo pagas si quieres

- **Publicar en Google Play Store.**
  - Tarifa única: **25 USD** (una sola vez en la vida).
  - Después puedes subir todas las apps que quieras.

---

### 🚀 En resumen

- ✅ **Desarrollo Android = Gratis**
- ✅ **Pruebas en móvil = Gratis**
- 💵 **Subir al Play Store = 25 USD una vez**

---
