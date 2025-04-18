## Apartado ver empresa

- Quitaré el componente negro de 'Front-end'
- Cambiar 'Conoce la empresa' y 'Sobre la empresa' por 'Sector' y 'web'


---

## Apartado Opiniones

- Añadir valoración a la visualización de la opinión, con algun icono por ejemplo

---

## Apartado Alumnado

- Faltan campos: 
        - Título
        - Experiencia (empresas)
        - Promoción

---
---

## VER LOG ERRORES

```bash
tail -n 50 storage/logs/laravel.log

# Buscar línea:
[2025-04-18 08:32:40] local.ERROR: Route [login] not defined. {"exception":"[object] (Symfony\\Component\\Routing\\Exception\\RouteNotFoundException(code: 0): Route [login] not defined. at /home/usuario/rgconecta/server/vendor/laravel/framework/src/Illuminate/Routing/UrlGenerator.php:527)
[stacktrace]
```