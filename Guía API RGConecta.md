# Guía de Usuario de la API RuizGijon-Conecta

Esta guía proporciona una documentación completa sobre cómo interactuar con la API RuizGijon-Conecta, que permite gestionar ofertas de empleo, alumnos, empresas y opiniones.

## URL Base

Todas las peticiones deben dirigirse a:  
`https://yohannagelo.ruix.iesruizgijon.es/rgconecta_api/`

## Autenticación

La mayoría de los endpoints requieren autenticación mediante token Bearer. Para obtener un token:

```http
POST /api/login
Content-Type: application/json

{
    "email": "admin@iesruizgijon.es",
    "password": "password"
}
```

Respuesta exitosa:
```json
{
    "token": "2|2izmV79aFMFrCkFIyqVpIoixuNjzEQi5tUTzHBFqfec09881"
}
```

Incluye el token en las cabeceras de las peticiones:
```
Authorization: Bearer [tu_token]
```

## Ofertas

### Obtener todas las ofertas

```http
GET /api/ofertas
```

### Obtener una oferta por ID

```http
GET /api/ofertas/3
Authorization: Bearer 2|2izmV79aFMFrCkFIyqVpIoixuNjzEQi5tUTzHBFqfec09881
```

### Crear una oferta para empresa existente

```http
POST /api/ofertas
Authorization: Bearer 2|2izmV79aFMFrCkFIyqVpIoixuNjzEQi5tUTzHBFqfec09881
Content-Type: application/json
Accept: application/json

{
    "titulo": "Desarrollador Backend",
    "descripcion": "Experto en Laravel y APIs",
    "empresa_id": 1,
    "jornada": "completa",
    "localizacion": "Sevilla",
    "fecha_expiracion": "2025-12-15",
    "tecnologias": [1, 2]
}
```

### Crear una oferta con nueva empresa

```http
POST /api/ofertas
Authorization: Bearer 2|2izmV79aFMFrCkFIyqVpIoixuNjzEQi5tUTzHBFqfec09881
Content-Type: application/json
Accept: application/json

{
    "titulo": "Secretarío y Contable",
    "descripcion": "Gestión de nóminas",
    "sobre_empresa": "Nomineando",
    "sector": "educacion",
    "jornada": "completa",
    "localizacion": "Madrid",
    "fecha_expiracion": "2025-09-20"
}
```

### Actualizar una oferta

```http
PUT /api/ofertas/3
Authorization: Bearer 3|DoW0rkocSboDzQ03o5Gz9aMGRM3IO9fDIU5bUaA73be18657
Content-Type: application/json

{
    "titulo": "Desarrollador Angular",
    "descripcion": "Buscamos experto en Angular para proyecto remoto",
    "jornada": "media_jornada",
    "tecnologias": [2, 6]
}
```

### Eliminar una oferta

```http
DELETE /api/ofertas/7
Authorization: Bearer 3|DoW0rkocSboDzQ03o5Gz9aMGRM3IO9fDIU5bUaA73be18657
```

## Alumnos

### Obtener todos los alumnos

```http
GET /api/alumnos
```

### Obtener un alumno por ID

```http
GET /api/alumnos/1
Authorization: Bearer 2|2izmV79aFMFrCkFIyqVpIoixuNjzEQi5tUTzHBFqfec09881
```

### Filtrar alumnos por tecnología

```http
GET /api/alumnos?tecnologia=php
```

## Empresas

### Obtener todas las empresas

```http
GET /api/empresas
```

### Filtrar empresas por sector

```http
GET /api/empresas?sector=tecnologia
```

### Actualizar una empresa

```http
PUT /api/empresas/1
Authorization: Bearer 3|DoW0rkocSboDzQ03o5Gz9aMGRM3IO9fDIU5bUaA73be18657
Content-Type: application/json

{
    "web": "https://tech-updated.com"
}
```

### Eliminar una empresa

```http
DELETE /api/empresas/4
Authorization: Bearer 3|DoW0rkocSboDzQ03o5Gz9aMGRM3IO9fDIU5bUaA73be18657
```

## Opiniones

### Obtener todas las opiniones

```http
GET /api/opiniones
```

### Obtener opiniones por empresa

```http
GET /api/empresas/1/opiniones
```

### Crear una nueva opinión

```http
POST /api/opiniones
Authorization: Bearer 4|sIHCIFkmvB50JjAj7rlLtuBmxeodtMkhd2AwQ53C33e920e3
Content-Type: application/json

{
    "empresa_id": 3,
    "contenido": "Buen salario pero horarios largos",
    "valoracion": 4,
    "años_en_empresa": 2
}
```

### Actualizar una opinión

```http
PUT /api/opiniones/3
Authorization: Bearer 4|sIHCIFkmvB50JjAj7rlLtuBmxeodtMkhd2AwQ53C33e920e3
Content-Type: application/json

{
    "contenido": "Buen salario pero horarios largos en invierno",
    "valoracion": 4
}
```

### Eliminar una opinión

```http
DELETE /api/opiniones/2
Authorization: Bearer 3|DoW0rkocSboDzQ03o5Gz9aMGRM3IO9fDIU5bUaA73be18657
```

## Consideraciones

1. Los endpoints marcados como protegidos requieren autenticación mediante token Bearer.
2. Para operaciones de creación (POST) y actualización (PUT), asegúrate de incluir la cabecera `Content-Type: application/json`.
3. Algunos endpoints aceptan parámetros de consulta para filtrar resultados.
4. Los IDs en las URLs (como `/api/ofertas/3`) deben ser reemplazados por los IDs reales de los recursos.

Esta guía cubre todas las operaciones disponibles en la API RuizGijon-Conecta. Para cualquier duda o problema, contacta con el administrador del sistema.