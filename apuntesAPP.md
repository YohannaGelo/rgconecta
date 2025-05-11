Buen compañerismo aunque poca flexibilidad en los horarios y jornadas largas.

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

## Comprobaciones

### Endpoints comprobados y funcionando correctamente
- Ofertas
- Alumnos
- Profesores
- Empresa
- Opiniones


---
---

## ACTUALIZAR PROYECTOS AL CLONAR O SYNC DESDE GITHUB

* **Angular (Client):**
```bash
npm install
```

* **Laravel (Server):**
```bash
composer install
```

---

Si en Laravel además tienes paquetes npm (por ejemplo, para `vite` o frontend con Blade), también haz en la carpeta `server`:

```bash
npm install
```


## NUEVA MIGRACIÓN + SEEDERS
```bash
php artisan migrate:fresh --seed
```


## VER LOG ERRORES

```bash
tail -n 50 storage/logs/laravel.log

# Buscar línea:
[2025-04-18 08:32:40] local.ERROR: Route [login] not defined. {"exception":"[object] (Symfony\\Component\\Routing\\Exception\\RouteNotFoundException(code: 0): Route [login] not defined. at /home/usuario/rgconecta/server/vendor/laravel/framework/src/Illuminate/Routing/UrlGenerator.php:527)
[stacktrace]
```

---
## ACTUALIZAR CONTRASEÑA DESDE TINKER
```bash
php artisan tinker
>>> $user = User::find(1);
>>> $user->password = Hash::make('NuevaContraseñaSegura1!');
>>> $user->save();
```


---


## ACTUALIZAR ANGULAR

```bash
ng update @angular/core @angular/cli

# necesario para el modal
ng add @ng-bootstrap/ng-bootstrap

rm -rf node_modules package-lock.json
npm install
```

## Para pedir ejemplos de nuevos alumnos

dame un ejemplo como este de un nuevo alumno con experiencia en una nueva empresa de hosteleria:
{
    "user": {
        "name": "Pepe Pérez",
        "email": "pepe@example.com",
        "password": "password"
    },
    "fecha_nacimiento": "1985-05-15",
    "situacion_laboral": "trabajando",
    "foto_perfil": null,
    "is_verified": false,
    "promocion": "2018/2020",
    "titulos": [
        {
            "nombre": "Técnico en Sistemas Microinformáticos y Redes",
            "tipo": "ciclo_medio",
            "pivot": {
                "fecha_inicio": "2018",
                "fecha_fin": "2020",
                "institucion": "IES Ruiz Gijón"
            }
        },
        {
            "nombre": "Técnico Superior en Desarrollo de Aplicaciones Web",
            "tipo": "ciclo_superior",
            "pivot": {
                "fecha_inicio": "2020",
                "fecha_fin": "2024",
                "institucion": "Universidad de Sevilla"
            }
        }
    ],
    "tecnologias": [
        {
            "nombre": "Angular",
            "tipo": "frontend",
            "pivot": {
                "nivel": "intermedio"
            }
        },
        {
            "nombre": "Inglés",
            "tipo": "idioma",
            "pivot": {
                "nivel": "B1"
            }
        }
    ],
    "experiencias": [
        {
            "empresa": {
                "nombre": "CodeFactory S.L.",
                "sector": "Tecnología",
                "web": "https://codefactory.com"
            },
            "puesto": "Desarrolladora Backend",
            "fecha_inicio": "2022-01-01",
            "fecha_fin": "2024-03-01"
        }
    ]
}

posibles titulos:     public function up(): void
    {
        Schema::create('titulos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre'); // Ej: "DAW", "Ingeniería Informática"
            $table->enum('tipo', [
                'ciclo_medio',
                'ciclo_superior',
                'grado_universitario',
                'master',
                'doctorado'
            ]);
            $table->timestamps();
        });

        Schema::create('alumno_titulo', function (Blueprint $table) {
            $table->foreignId('alumno_id')->constrained()->onDelete('cascade');
            $table->foreignId('titulo_id')->constrained()->onDelete('cascade');
            $table->year('fecha_inicio'); // Año de inicio del estudio
            $table->year('fecha_fin')->nullable(); // Año de finalización (nullable si está en curso)
            $table->string('institucion')->default('IES Ruiz Gijón'); // Ej: "Universidad de Sevilla"
            $table->timestamps();
        });

    }

posibles tecnologias:
    public function up(): void
    {
        Schema::create('tecnologias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre'); // Ej: "PHP", "Angular"
            $table->enum('tipo', [
                'frontend',
                'backend',
                'fullstack',
                'database',
                'devops',
                'ofimatica',
                'idioma',
                'marketing',
                'gestion',
                'disenio',
                'otros'
            ])->default('otros');
            $table->timestamps();

            // Evita duplicados tipo: PHP + programacion repetido
            $table->unique(['nombre', 'tipo']);
        });

        // Tabla pivot para ofertas
        Schema::create('requisitos_oferta', function (Blueprint $table) {
            $table->foreignId('oferta_id')->constrained()->onDelete('cascade');
            $table->foreignId('tecnologia_id')->constrained()->onDelete('cascade');
            $table->enum('nivel', ['basico', 'intermedio', 'avanzado'])->nullable();
            $table->timestamps();
        });
    }
 

# GitHub RAMAS

### ✅ **1. Fusionar `feature/controladores` a `develop` y `main`**

Asumiendo que estás en tu proyecto local, carpeta raiz:

```bash
# 1. Cambia a la rama develop
git checkout develop

# 2. Trae los últimos cambios del remoto (opcional pero recomendable)
git pull origin develop

# 3. Fusiona la rama feature/controladores
git merge feature/controladores

# 4. Sube los cambios al remoto
git push origin develop
```

### ✅ **2. Crear una nueva rama para el frontend**

Sí, es buena práctica. Puedes crear una rama desde `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/frontend
git push -u origin feature/frontend
```

Esto te deja listo para empezar a trabajar en Angular dentro de la carpeta `Client` sin mezclar aún los cambios con `develop` ni `main`.


## FUSIÓN LIMPIA

- **`develop`**: con todo el historial, útil para seguimiento técnico.  
- **`main`**: limpio, solo cambios estables y resumidos.

### Para fusionar a `main` de forma limpia:

Desde la raíz del repo (o cualquier subcarpeta dentro del mismo):

```bash
git checkout main
git pull origin main
git merge --squash develop
git commit -m "Versión estable: controladores API añadidos"
git push origin main
```

Con eso tendrás en `main` un único commit que representa todos los cambios funcionales sin ruido.
