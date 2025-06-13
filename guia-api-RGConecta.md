# Guía de Usuario de la API RuizGijon-Conecta

Esta guía documenta todos los endpoints de la API REST de RuizGijon-Conecta. Esta versión está actualizada con la nueva URL base y refleja tanto los endpoints existentes como las rutas recientemente añadidas.

> Desarrolladora responsable: **Yohanna Gelo**
> Contacto: [yohannagelo@gmail.com](mailto:yohannagelo@gmail.com)

---

## URL Base

```
https://yohannagelo.ruix.iesruizgijon.es/rgc_api/
```

---

## Autenticación

La API utiliza autenticación mediante tokens Bearer. Para obtener un token:

### Login

```http
POST /api/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "contraseña"
}
```

**Respuesta**:

```json
{
  "token": "<token_bearer>"
}
```

Incluye este token en todas las peticiones protegidas:

```http
Authorization: Bearer <token_bearer>
```

---

## Índice de Módulos

1. [Ofertas](#1-ofertas)
2. [Alumnos](#2-alumnos)
3. [Profesores](#3-profesores)
4. [Empresas](#4-empresas)
5. [Opiniones](#5-opiniones)
6. [Tecnologías](#6-tecnologías)
7. [Títulos](#7-títulos)
8. [Contacto](#8-contacto)
9. [Preferencias de notificación](#9-preferencias)
10. [Verificación de email](#10-verificación-de-email)
11. [Autenticación / Perfil](#11-autenticación-perfil)
12. [Rutas Admin](#12-administración)

---

## 1. Ofertas

### Obtener todas las ofertas

```http
GET /api/ofertas
```

### Obtener una oferta por ID

```http
GET /api/ofertas/{id}
Authorization: Bearer <token>
```

### Crear una oferta (con empresa existente)

```http
POST /api/ofertas
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Administrador de Bases de Datos",
  "descripcion": "MySQL y backups",
  "empresa_id": 1,
  "jornada": "completa",
  "anios_experiencia": 3,
  "localizacion": "Huelva",
  "fecha_expiracion": "2025-05-16",
  "tecnologias": [6]
}
```

### Crear oferta con nueva empresa

```http
POST /api/ofertas
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Especialista Marketing",
  "descripcion": "SEO/SEM, RRSS",
  "sobre_empresa": "MarketLab",
  "sector": "marketing",
  "web": "https://marketlab.agency",
  "jornada": "completa",
  "anios_experiencia": 2,
  "localizacion": "Barcelona",
  "fecha_expiracion": "2025-08-15"
}
```

### Actualizar una oferta

```http
PUT /api/ofertas/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "fecha_expiracion": "2025-05-01"
}
```

### Eliminar una oferta

```http
DELETE /api/ofertas/{id}
Authorization: Bearer <token>
```

### Ofertas creadas por el usuario

```http
GET /api/mis-ofertas
Authorization: Bearer <token>
```

### Localizaciones únicas (sin token)

```http
GET /api/ofertas/localizaciones
```

### Contactar con el autor de una oferta

```http
POST /api/ofertas/{id}/contactar
Authorization: Bearer <token>
Content-Type: application/json

{
  "mensaje": "Estoy interesado/a en esta oferta. ¿Podemos hablar?"
}
```

---

## 2. Alumnos

### Obtener todos los alumnos

```http
GET /api/alumnos
```

### Obtener alumno por ID

```http
GET /api/alumnos/{id}
Authorization: Bearer <token>
```

### Crear un nuevo alumno

```http
POST /api/alumnos
Content-Type: application/json

{
  "user": {
    "name": "Samuel Gómez",
    "email": "samuel.gomez@example.com",
    "password": "contraseñaSegura123"
  },
  "fecha_nacimiento": "1993-03-10",
  "situacion_laboral": "trabajando",
  "promocion": "2011/2013",
  "titulos": [...],
  "tecnologias": [...],
  "experiencias": [...]
}
```

### Actualizar alumno

```http
PUT /api/alumnos/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "fecha_nacimiento": "2000-05-15",
  "promocion": "2023/2025"
}
```

### Eliminar alumno

```http
DELETE /api/alumnos/{id}
Authorization: Bearer <token>
```

### Filtrar alumnos por tecnología

```http
GET /api/alumnos?tecnologia=ingles
```

### Obtener alumnos no verificados

```http
GET /api/alumnos/no-verificados
Authorization: Bearer <token>
```

### Verificar alumno

```http
POST /api/alumnos/{id}/verify
Authorization: Bearer <token>
```

### Rechazar alumno

```http
POST /api/alumnos/{id}/rechazar
Authorization: Bearer <token>
```

---

## 3. Profesores

### Obtener todos los profesores

```http
GET /api/profesores
Authorization: Bearer <token>
```

### Obtener profesor por ID

```http
GET /api/profesores/{id}
Authorization: Bearer <token>
```

### Crear profesor

```http
POST /api/profesores
Content-Type: application/json

{
  "user": {
    "name": "Nombre del profesor",
    "email": "correo@iesruizgijon.es",
    "password": "password"
  },
  "departamento": "Informática"
}
```

### Actualizar profesor

```http
PUT /api/profesores/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "departamento": "Literatura"
}
```

### Eliminar profesor

```http
DELETE /api/profesores/{id}
Authorization: Bearer <token>
```

### Filtrar profesores por departamento

```http
GET /api/profesores?departamento=informatica
Authorization: Bearer <token>
```

---

## 4. Empresas

### Obtener todas las empresas

```http
GET /api/empresas
```

### Obtener empresa por ID

```http
GET /api/empresas/{id}
Authorization: Bearer <token>
```

### Crear una empresa

```http
POST /api/empresas
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "GestiónPro Consulting",
  "sector": "otros",
  "web": "https://gestionpro.com",
  "descripcion": "Consultora que ofrece asesoramiento a emprendedores, pymes y autónomos en el ámbito de la gestión empresarial y fiscal."
}
```

### Actualizar una empresa

```http
PUT /api/empresas/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "web": "https://tech-updated.com"
}
```

### Eliminar una empresa

```http
DELETE /api/empresas/{id}
Authorization: Bearer <token>
```

### Filtrar empresas por sector

```http
GET /api/empresas?sector=tecnologia
Authorization: Bearer <token>
```

---

## 5. Opiniones

### Obtener todas las opiniones

```http
GET /api/opiniones
```

### Obtener opiniones de una empresa

```http
GET /api/empresas/{empresa_id}/opiniones
```

### Crear una opinión

```http
POST /api/opiniones
Authorization: Bearer <token>
Content-Type: application/json

{
  "empresa_id": 3,
  "contenido": "Buen salario pero horarios largos",
  "valoracion": 4,
  "anios_en_empresa": 2
}
```

### Actualizar una opinión

```http
PUT /api/opiniones/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "contenido": "Buen salario pero horarios largos en invierno",
  "valoracion": 4
}
```

### Eliminar una opinión

```http
DELETE /api/opiniones/{id}
Authorization: Bearer <token>
```

### Obtener opiniones creadas por el usuario

```http
GET /api/mis-opiniones
Authorization: Bearer <token>
```

---

## 6. Tecnologías

### Obtener todas las tecnologías

```http
GET /api/tecnologias
```

### Crear una nueva tecnología

```http
POST /api/tecnologias
Content-Type: application/json

{
  "nombre": "Figma",
  "tipo": "disenio"
}
```

---

## 7. Títulos

### Obtener todos los títulos

```http
GET /api/titulos
```

### Obtener título por ID

```http
GET /api/titulos/{id}
```

### Añadir título a un alumno

```http
POST /api/alumnos/{id}/titulos
Content-Type: application/json
Authorization: Bearer <token>

{
  "nombre": "Técnico Superior en Desarrollo de Aplicaciones Web",
  "tipo": "ciclo_superior",
  "pivot": {
    "fecha_inicio": "2022",
    "fecha_fin": "2024",
    "institucion": "IES Ruiz Gijón"
  }
}
```

### Eliminar un título

```http
DELETE /api/titulos/{id}
Authorization: Bearer <token>
```

---

## 8. Contacto

### Enviar mensaje de contacto general

```http
POST /api/contacto
Content-Type: application/json

{
  "name": "Nombre del remitente",
  "mail": "email@example.com",
  "mensaje": "Hola, quería consultar..."
}
```

### Contactar con el autor de una oferta

```http
POST /api/ofertas/{id}/contactar
Authorization: Bearer <token>
Content-Type: application/json

{
  "mensaje": "Estoy interesado/a en esta oferta."
}
```

### Contactar con un profesor

```http
POST /api/profesores/{id}/contactar
Authorization: Bearer <token>
Content-Type: application/json

{
  "mensaje": "Me gustaría saber más sobre..."
}
```

---

## 9. Preferencias de notificación

### Obtener preferencias del usuario actual

```http
GET /api/preferencias
Authorization: Bearer <token>
```

### Obtener preferencias de un usuario específico (admin)

```http
GET /api/preferencias/{userId}
Authorization: Bearer <token>
```

### Crear o actualizar preferencias del usuario

```http
PUT /api/preferencias
Authorization: Bearer <token>
Content-Type: application/json

{
  "responder_dudas": true
}
```

### Actualizar preferencias desde rol admin

```http
PUT /api/preferencias/{userId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "responder_dudas": false
}
```

---

## 10. Verificación de email

### Enviar email de verificación

```http
POST /api/email/verification-notification
Authorization: Bearer <token>
```

### Verificar email (enlace firmado desde correo)

```http
GET /api/email/verify/{id}/{hash}
```

---

## 11. Autenticación / Perfil

### Obtener datos del usuario logueado

```http
GET /api/me
Authorization: Bearer <token>
```

### Cerrar sesión

```http
POST /api/logout
Authorization: Bearer <token>
```

### Actualizar contraseña del usuario logueado

```http
PATCH /api/profile/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "current_password": "password",
  "new_password": "NuevaPassword1",
  "new_password_confirmation": "NuevaPassword1"
}
```

---

## 12. Administración (requiere middleware `admin`)

Los endpoints se encuentran bajo el prefijo `/api/admin`.

### Usuarios (CRUD)

```http
GET /api/admin/usuarios
POST /api/admin/usuarios
PUT /api/admin/usuarios/{id}
DELETE /api/admin/usuarios/{id}
DELETE /api/admin/usuarios/{id}/foto
```

### Empresas (CRUD)

```http
GET /api/admin/empresas
POST /api/admin/empresas
PUT /api/admin/empresas/{id}
DELETE /api/admin/empresas/{id}
```

### Sectores (CRUD)

```http
GET /api/admin/sectores
POST /api/admin/sectores
PUT /api/admin/sectores/{id}
DELETE /api/admin/sectores/{id}
```

### Ofertas, Títulos, Tecnologías, Opiniones, Experiencias, Profesores y Alumnos (CRUD)

Mismo esquema para cada uno:

```http
GET /api/admin/{recurso}
POST /api/admin/{recurso}
PUT /api/admin/{recurso}/{id}
DELETE /api/admin/{recurso}/{id}
```

Donde `{recurso}` puede ser:

- ofertas
- titulos
- tecnologias
- opiniones
- experiencias
- profesores
- alumnos

---

## Consideraciones Finales

- Usa siempre el token Bearer en rutas protegidas.
- Revisa la estructura de los datos según el modelo correspondiente.
- La autenticación de administración requiere estar identificado como usuario con permisos admin.

Para cualquier duda, contacta con el equipo de soporte.

---

**¡Gracias por usar la API REST de RuizGijon-Conecta!**
