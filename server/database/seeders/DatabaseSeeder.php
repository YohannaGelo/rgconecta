<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Sector;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        collect([
            ['clave' => 'tecnologia', 'nombre' => 'Tecnología'],
            ['clave' => 'educacion', 'nombre' => 'Educación'],
            ['clave' => 'salud', 'nombre' => 'Salud'],
            ['clave' => 'construccion', 'nombre' => 'Construcción'],
            ['clave' => 'comercio', 'nombre' => 'Comercio'],
            ['clave' => 'hosteleria', 'nombre' => 'Hostelería'],
            ['clave' => 'finanzas', 'nombre' => 'Finanzas'],
            ['clave' => 'logistica', 'nombre' => 'Logística'],
            ['clave' => 'marketing', 'nombre' => 'Marketing'],
            ['clave' => 'industria', 'nombre' => 'Industria'],
            ['clave' => 'diseno', 'nombre' => 'Diseño'],
            ['clave' => 'otros', 'nombre' => 'Otros'],
        ])->each(fn($data) => Sector::create($data));


        $this->call([
            UserSeeder::class,              // 1. Usuarios (admin, profesor, alumnos)
            TituloSeeder::class,           // 2. Títulos (grados, ciclos, etc.)
            TecnologiaSeeder::class,       // 3. Tecnologías (todas las categorías)

            AlumnoTituloSeeder::class,     // 4. Relaciones alumno-título
            AlumnoTecnologiaSeeder::class, // 5. Relaciones alumno-tecnología (con niveles)

            EmpresaSeeder::class,          // 6. Empresas
            OfertaSeeder::class,           // 7. Ofertas (depende de empresa y tecnologías)
            OpinionSeeder::class,          // 8. Opiniones (depende de alumno y empresa)
        ]);
    }
}
