# Guía de Usuario de la API RuizGijon-Conecta

Esta guía proporciona una documentación completa sobre cómo interactuar con la API RuizGijon-Conecta, que permite gestionar ofertas de empleo, alumnos, profesores, empresas y opiniones.

## URL Base

Todas las peticiones deben dirigirse a:  
`https://yohannagelo.ruix.iesruizgijon.es/rgconecta_api/`

---

## Autenticación
La API utiliza tokens Bearer para la autenticación. Para obtener un token, realiza una solicitud al endpoint `/api/login` con tus credenciales.

### Ejemplo de Login:
```http
POST /api/login HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
    "email": "juan.perez@iesruizgijon.es",
    "password": "password"
}
```

**Respuesta:**
```json
{
    "token": "1|W2TJCUyg3tkGXZbCjF2B6uYZ3jobXVYGWqMjk9Ar616aebb5"
}
```

Incluye el token en el header `Authorization` de las solicitudes que lo requieran:
```http
Authorization: Bearer 1|W2TJCUyg3tkGXZbCjF2B6uYZ3jobXVYGWqMjk9Ar616aebb5
```

---

## Endpoints Disponibles

### 1. Ofertas

#### Obtener todas las ofertas
```http
GET /api/ofertas HTTP/1.1
Host: localhost:8000
```

#### Obtener una oferta por ID
```http
GET /api/ofertas/2 HTTP/1.1
Host: localhost:8000
Authorization: Bearer [token]
```

#### Crear una oferta (empresa existente)
```http
POST /api/ofertas HTTP/1.1
Host: localhost:8000
Authorization: Bearer [token]
Content-Type: application/json

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

#### Crear una oferta y empresa nueva
```http
POST /api/ofertas HTTP/1.1
Host: localhost:8000
Authorization: Bearer [token]
Content-Type: application/json

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

#### Actualizar una oferta
```http
PUT /api/ofertas/3 HTTP/1.1
Host: localhost:8000
Authorization: Bearer [token]
Content-Type: application/json

{
    "titulo": "Desarrollador Backend PHP",
    "descripcion": "Experto en Laravel y APIs para proyecto remoto"
}
```

#### Eliminar una oferta
```http
DELETE /api/ofertas/4 HTTP/1.1
Host: localhost:8000
Authorization: Bearer [token]
```

---

### 2. Alumnos

#### Obtener todos los alumnos
```http
GET /api/alumnos HTTP/1.1
Host: localhost:8000
```

#### Obtener un alumno por ID
```http
GET /api/alumnos/2 HTTP/1.1
Host: localhost:8000
Authorization: Bearer [token]
```

#### Crear un alumno
```http
POST /api/alumnos HTTP/1.1
Host: localhost:8000
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

#### Actualizar un alumno
```http
PUT /api/alumnos/1 HTTP/1.1
Host: localhost:8000
Authorization: Bearer [token]
Content-Type: application/json

{
    "fecha_nacimiento": "2000-05-30",
    "promocion": "2019/2021"
}
```

#### Eliminar un alumno
```http
DELETE /api/alumnos/3 HTTP/1.1
Host: localhost:8000
Authorization: Bearer [token]
```

#### Filtrar alumnos por tecnología
```http
GET /api/alumnos?tecnologia=ingles HTTP/1.1
Host: localhost:8000
```

---

### 3. Profesores

#### Obtener todos los profesores
```http
GET /api/profesores HTTP/1.1
Host: localhost:8000
Authorization: Bearer [token]
```

#### Obtener un profesor por ID
```http
GET /api/profesores/2 HTTP/1.1
Host: localhost:8000
Authorization: Bearer [token]
```

#### Crear un profesor
```http
POST /api/profesores HTTP/1.1
Host: localhost:8000
Content-Type: application/json

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

#### Actualizar un profesor
```http
PUT /api/profesores/2 HTTP/1.1
Host: localhost:8000
Authorization: Bearer [token]
Content-Type: application/json

{
    "departamento": "Historia"
}
```

#### Eliminar un profesor
```http
DELETE /api/profesores/3 HTTP/1.1
Host: localhost:8000
Authorization: Bearer [token]
```

#### Filtrar profesores por departamento
```http
GET /api/profesores?departamento=informatica HTTP/1.1
Host: localhost:8000
Authorization: Bearer [token]
```

---

### 4. Empresas

#### Obtener todas las empresas
```http
GET /api/empresas HTTP/1.1
Host: localhost:8000
```

#### Crear una empresa
```http
POST /api/empresas HTTP/1.1
Host: localhost:8000
Authorization: Bearer [token]
Content-Type: application/json

{
    "nombre": "GestiónPro Consulting",
    "sector": "otros",
    "web": "https://gestionpro.com",
    "descripcion": "Consultora que ofrece asesoramiento a emprendedores, pymes y autónomos en el ámbito de la gestión empresarial y fiscal."
}
```

#### Obtener una empresa por ID
```http
GET /api/empresas/2 HTTP/1.1
Host: localhost:8000
Authorization: Bearer [token]
```

#### Filtrar empresas por sector
```http
GET /api/empresas?sector=tecnologia HTTP/1.1
Host: localhost:8000
Authorization: Bearer [token]
```

#### Actualizar una empresa
```http
PUT /api/empresas/1 HTTP/1.1
Host: localhost:8000
Authorization: Bearer [token]
Content-Type: application/json

{
    "web": "https://tech-updated.com"
}
```

#### Eliminar una empresa
```http
DELETE /api/empresas/5 HTTP/1.1
Host: localhost:8000
Authorization: Bearer [token]
```

---

### 5. Opiniones

#### Obtener todas las opiniones
```http
GET /api/opiniones HTTP/1.1
Host: localhost:8000
```

#### Obtener opiniones de una empresa
```http
GET /api/empresas/1/opiniones HTTP/1.1
Host: localhost:8000
```

#### Crear una opinión
```http
POST /api/opiniones HTTP/1.1
Host: localhost:8000
Authorization: Bearer [token]
Content-Type: application/json

{
    "empresa_id": 3,
    "contenido": "Buen salario pero horarios largos",
    "valoracion": 4,
    "anios_en_empresa": 2
}
```

#### Actualizar una opinión
```http
PUT /api/opiniones/3 HTTP/1.1
Host: localhost:8000
Authorization: Bearer [token]
Content-Type: application/json

{
    "contenido": "Buen salario pero horarios largos en invierno",
    "valoracion": 4
}
```

#### Eliminar una opinión
```http
DELETE /api/opiniones/3 HTTP/1.1
Host: localhost:8000
Authorization: Bearer [token]
```

---

## Consideraciones Finales
- Asegúrate de incluir el token de autenticación en los headers cuando sea necesario.
- Utiliza el método HTTP adecuado para cada operación (GET, POST, PUT, DELETE).
- Verifica los datos enviados en el body para evitar errores.

Para cualquier duda o problema, contacta con el equipo de soporte. ¡Gracias por usar la API REST RuizGijon-Conecta!