# Tareas pendientes o futuras mejoras

## HACER 100% SEGURO

- ~~Página perfil de profe y perfil de admin - REVISAR~~
- ~~Ver profes?... pestaña permanente para contacto y ver desde ahí?~~
- ~~Poner Otros en primera posición para crear nuevas cosas, que se pueda escribir en los select~~
- ~~Comprobar registros de e-mail repetidos?? -> si esta repetido que haya notficación~~
- ~~Volver a revisar el registro-alumno y las comprobaciones del formulario (no insertar fecha, insertar tecnologia y nivel)~~
- ~~Revisar página de no-verificado y ver el mail~~
- ~~Implemetar gestión de correos... avisos al registrar, verificar...~~
- ~~Ajustar textos con tildes~~
- ~~Ajustar el necesitar https:// en la creación de empresa... o no, pero igual siempre~~
- ~~Que los desplegabes aparezcan en orden alfabético~~
- ~~Alumnos: mostrar solo los verificados~~
- ~~En verificar alumnos, link mailto en los correos - descartado~~
- ~~¡ REVISAR LOS CONSOLE LOG Y QUITAR LOS DATOS !~~
- ~~Revisar los enlaces de los mails~~
- ~~¿Que pas con la fecha de expiracion de las ofertas (console)?~~
- ~~PANTALLA CARGA!!!!~~
- ~~¿Pq al actualizar página siempre vuelve al login?~~
- ~~En años... poner un minimo? por la edad...~~
- ~~Añadir en Admin y en perfiles la opción de modificar las preferencias~~
- ~~Ajustar el toggle del navbar~~
- ~~Poder poner 0 años de experiencia~~
- ~~Implementar logica filtros en mis opiniones y mis ofertas -> o quitar flechas~~

---

## MEJORAS CONVENIENTES

- ~~Filtrado y paginación en verificar-alumnos~~
- ~~Botón volver en detalles alumno y detalles oferta~~
- ~~Revisar navbar (Ofertas - Alumnado)~~
- ~~Filtrado en admin~~
- ~~Poner en los perfiles que para cambiar el email se pongan en contacto con el admin~~
- ~~Ajustar tamaño de imagenes al subirla~~

---

## MEJORAS NO IMPRESCINDIBLES

- ~~Eliminar usuarios con email no verificados al transcurrir un tiempo~~
- ~~Mejorar las preferencias, poder elegir si recibir dudas segun cada oferta~~
- Mejorar la organizacion de carpetas
- Implementar más tablas con su apartado CRUD en el Panel Admin (Por ejemplo: Tipo de tecnologías)
- Crear la aplicación para Android e iOS
- Paginación en los paneles Admin
- Poder dejar el año de fin en blanco para simular que aún está en curso
- Implementar aviso de ofertas por mail (ya está en la tabla de preferencias... pero lo ideal sería poder filtrar el tipo de oferta a recibir)
- Que se eliminen ofertas tras cierto tiempo de estar expiradas.

## A TENER EN CUENTA PARA PRESENTACIÓN

- Uso de middleware (laravel)
- Uso de Guards (angular): gestión de tokens, control de cambios en form para no salir sin guarar y control de clave de profesor
- Listener -> Cuando un alumno verifica el mail se envia mensaje de bienvenida y al profe aviso para validar
- Sistema de Mail con mailable para notificaciones y contacto (usa correo de gmail)
- Interceptor para cuando se hacen llamadas mostrar pantalla de carga
- Pipe para detectar url en texto y hacerla linkeable
- Pipe para detectar url en texto y recoratar para que no sea útil (vista ofertas - usuarios no registrados)
- Comando para eliminar alumnos con mail no verificados (2 meses)
- Programación diaria para lanzar el comando.
- Rutas, controladores, servicios y componentes diferentes para el Admin.
- Rutas enviroment en angular para gestionar la versión de desarrollo y de producción
- Componentes compartidos para usar como plantillas globales
- Interceptor para gestionar las pantallas de carga cuando se hace solicitudes que tardan algo más de medio seg en llevar.
- Uso de repo --bare para subir cambios a producción con un commit

# ✅ A TENER EN CUENTA PARA LA PRESENTACIÓN

## 🔧 Backend (Laravel)

- **Uso de middleware:** protección de rutas (verificación de email, roles, etc.).
- **Listeners:** al verificar un alumno su email:
  - Se envía un mensaje de bienvenida.
  - Se avisa a los profesores/admin para su validación.
- **Sistema de mails con `Mailable`:**
  - Notificaciones automáticas.
  - Formulario de contacto.
  - Configurado para enviar desde cuenta de Gmail.
- **Comando Artisan:** elimina usuarios con email no verificado después de 2 meses.
- **Tarea programada diaria:** ejecuta automáticamente el comando con `schedule`.
- **Estructura organizada:** rutas, controladores y servicios diferenciados para el rol administrador.
- **Sistema de despliegue con Git:** uso de repositorio `--bare` y `post-receive hook` para desplegar en producción al hacer `git push`.

---

## 🎨 Frontend (Angular)

- **Uso de Guards:**
  - Control de tokens y sesión.
  - Prevención de salida con formularios sin guardar.
  - Control de acceso por clave de profesor.
- **HTTP Interceptor:**
  - Muestra pantalla de carga cuando se realizan solicitudes HTTP.
  - Optimizado para aparecer solo si la solicitud tarda más de medio segundo.
- **Pipes personalizados:**
  - Convierte URLs en texto a enlaces clicables.
  - Recorta URLs para que no sean funcionales (vista pública de ofertas).
- **Variables de entorno:** configuración diferenciada para desarrollo y producción (API, rutas, etc.).
- **Componentes compartidos:** usados como plantillas o bloques globales reutilizables.
