# 📘 Guía de Usuario de la API RuizGijon-Conecta

_Autora: Yohanna Gelo (yohannagelo@gmail.com)_

Esta guía proporciona una documentación completa sobre cómo interactuar con la API **RuizGijon-Conecta**, la cual permite gestionar ofertas de empleo, alumnos, profesores, empresas y opiniones.

---

## 📑 Índice

- [📘 Guía de Usuario de la API RuizGijon-Conecta](#-guía-de-usuario-de-la-api-ruizgijon-conecta)
  - [📑 Índice](#-índice)
  - [1. 🌐 URL Base](#1--url-base)
  - [2. 🔐 Autenticación](#2--autenticación)
    - [▶️ Ejemplo de Login](#️-ejemplo-de-login)
    - [✅ Respuesta](#-respuesta)
  - [3. 📡 Endpoints Disponibles](#3--endpoints-disponibles)
    - [3.1 📁 Ofertas](#31--ofertas)
    - [3.2 👨‍🎓 Alumnos](#32--alumnos)
    - [3.3 👩‍🏫 Profesores](#33--profesores)
    - [3.4 🏢 Empresas](#34--empresas)
    - [3.5 💬 Opiniones](#35--opiniones)
  - [4. 📝 Consideraciones Finales](#4--consideraciones-finales)

---

## 1. 🌐 URL Base

Todas las peticiones deben dirigirse a:

```

[https://yohannagelo.ruix.iesruizgijon.es/rgconecta\_api/](https://yohannagelo.ruix.iesruizgijon.es/rgconecta_api/)

```

---

## 2. 🔐 Autenticación

La API utiliza tokens **Bearer**. Para obtener uno, realiza una solicitud `POST` al endpoint `/api/login` con tus credenciales.

### ▶️ Ejemplo de Login

```http
POST /api/login HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "email": "juan.perez@iesruizgijon.es",
  "password": "password"
}
```

### ✅ Respuesta

```json
{
  "token": "1|W2TJCUyg3tkGXZbCjF2B6uYZ3jobXVYGWqMjk9Ar616aebb5"
}
```

Usa el token en el header de autenticación:

```http
Authorization: Bearer 1|W2TJCUyg3tkGXZbCjF2B6uYZ3jobXVYGWqMjk9Ar616aebb5
```

---

## 3. 📡 Endpoints Disponibles

### 3.1 📁 Ofertas

- **Obtener todas las ofertas**

```http
GET /api/ofertas
```

- **Obtener una oferta por ID**

```http
GET /api/ofertas/2
Authorization: Bearer [token]
```

- **Crear una oferta (empresa existente)**

```http
POST /api/ofertas
Authorization: Bearer [token]
Content-Type: application/json
```

```json
{
  "titulo": "Desarrollador Backend",
  "descripcion": "Experto en Laravel y APIs",
  "empresa_id": 1,
  "jornada": "completa",
  "anios_experiencia": 3,
  "localizacion": "Sevilla",
  "fecha_expiracion": "2025-12-15",
  "tecnologias": [1, 2]
}
```

- **Crear una oferta con empresa nueva**

```json
{
  "titulo": "Especialista en Marketing Digital",
  "descripcion": "Planificación y ejecución de campañas SEO/SEM, redes sociales y email marketing.",
  "sobre_empresa": "MarketLab",
  "sector": "marketing",
  "web": "https://marketlab.agency",
  "jornada": "completa",
  "anios_experiencia": 2,
  "localizacion": "Barcelona",
  "fecha_expiracion": "2025-08-15"
}
```

- **Actualizar una oferta**

```http
PUT /api/ofertas/3
Authorization: Bearer [token]
```

```json
{
  "titulo": "Desarrollador Backend PHP",
  "descripcion": "Experto en Laravel y APIs para proyecto remoto"
}
```

- **Eliminar una oferta**

```http
DELETE /api/ofertas/4
Authorization: Bearer [token]
```

---

### 3.2 👨‍🎓 Alumnos

- **Obtener todos los alumnos**

```http
GET /api/alumnos
```

- **Obtener un alumno por ID**

```http
GET /api/alumnos/2
Authorization: Bearer [token]
```

- **Crear un alumno**

```json
{
  "user": {
    "name": "Samuel Gómez",
    "email": "samuel.gomez@example.com",
    "password": "contraseñaSegura123"
  },
  "fecha_nacimiento": "1993-03-10",
  "situacion_laboral": "trabajando",
  "promocion": "2011/2013",
  "titulos": [
    {
      "nombre": "Técnico en Sistemas de Información",
      "tipo": "ciclo_medio",
      "pivot": {
        "fecha_inicio": "2011",
        "fecha_fin": "2013",
        "institucion": "IES La Albuera"
      }
    }
  ],
  "tecnologias": [
    {
      "nombre": "Microsoft Office",
      "tipo": "ofimatica",
      "pivot": {
        "nivel": "avanzado"
      }
    }
  ]
}
```

- **Actualizar un alumno**

```http
PUT /api/alumnos/1
Authorization: Bearer [token]
```

```json
{
  "fecha_nacimiento": "2000-05-30",
  "promocion": "2019/2021"
}
```

- **Eliminar un alumno**

```http
DELETE /api/alumnos/3
Authorization: Bearer [token]
```

- **Filtrar por tecnología**

```http
GET /api/alumnos?tecnologia=ingles
```

---

### 3.3 👩‍🏫 Profesores

- **Obtener todos los profesores**

```http
GET /api/profesores
Authorization: Bearer [token]
```

- **Obtener un profesor por ID**

```http
GET /api/profesores/2
Authorization: Bearer [token]
```

- **Crear un profesor**

```json
{
  "user": {
    "name": "Javier Soldado",
    "email": "javier.soldado@iesruizgijon.es",
    "password": "password"
  },
  "departamento": "Informática",
  "foto_perfil": null
}
```

- **Actualizar un profesor**

```http
PUT /api/profesores/2
Authorization: Bearer [token]
```

```json
{
  "departamento": "Historia"
}
```

- **Eliminar un profesor**

```http
DELETE /api/profesores/3
Authorization: Bearer [token]
```

- **Filtrar por departamento**

```http
GET /api/profesores?departamento=informatica
Authorization: Bearer [token]
```

---

### 3.4 🏢 Empresas

- **Obtener todas las empresas**

```http
GET /api/empresas
```

- **Crear una empresa**

```json
{
  "nombre": "GestiónPro Consulting",
  "sector": "otros",
  "web": "https://gestionpro.com",
  "descripcion": "Consultora que ofrece asesoramiento a emprendedores, pymes y autónomos en el ámbito de la gestión empresarial y fiscal."
}
```

- **Obtener una empresa por ID**

```http
GET /api/empresas/2
Authorization: Bearer [token]
```

- **Filtrar por sector**

```http
GET /api/empresas?sector=tecnologia
Authorization: Bearer [token]
```

- **Actualizar una empresa**

```http
PUT /api/empresas/1
Authorization: Bearer [token]
```

```json
{
  "web": "https://tech-updated.com"
}
```

- **Eliminar una empresa**

```http
DELETE /api/empresas/5
Authorization: Bearer [token]
```

---

### 3.5 💬 Opiniones

- **Obtener todas las opiniones**

```http
GET /api/opiniones
```

- **Obtener opiniones de una empresa**

```http
GET /api/empresas/1/opiniones
```

- **Crear una opinión**

```json
{
  "empresa_id": 3,
  "contenido": "Buen salario pero horarios largos",
  "valoracion": 4,
  "anios_en_empresa": 2
}
```

- **Actualizar una opinión**

```http
PUT /api/opiniones/3
Authorization: Bearer [token]
```

```json
{
  "contenido": "Buen salario pero horarios largos en invierno",
  "valoracion": 4
}
```

- **Eliminar una opinión**

```http
DELETE /api/opiniones/3
Authorization: Bearer [token]
```

---

## 4. 📝 Consideraciones Finales

- Asegúrate de incluir siempre el token de autenticación.
- Usa correctamente los métodos HTTP: `GET`, `POST`, `PUT`, `DELETE`.
- Valida bien los datos enviados para evitar errores.

Para cualquier duda o incidencia, contacta con el equipo de soporte.

**¡Gracias por usar la API REST RuizGijon-Conecta!**
