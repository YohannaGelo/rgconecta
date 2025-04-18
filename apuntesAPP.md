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
                "año_inicio": "2018",
                "año_fin": "2020",
                "institucion": "IES Ruiz Gijón"
            }
        },
        {
            "nombre": "Técnico Superior en Desarrollo de Aplicaciones Web",
            "tipo": "ciclo_superior",
            "pivot": {
                "año_inicio": "2020",
                "año_fin": "2024",
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
            $table->year('año_inicio'); // Año de inicio del estudio
            $table->year('año_fin')->nullable(); // Año de finalización (nullable si está en curso)
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
 