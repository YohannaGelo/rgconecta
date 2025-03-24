<?php

namespace Database\Seeders;

use App\Models\User;
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


        $this->call([
            UserSeeder::class,        // 1. Usuarios (admin, profesor, alumno)
            TituloSeeder::class,      // 2. Títulos (ciclos, grados)
            AlumnoTituloSeeder::class,// 3. Relaciones alumno-título
            TecnologiaSeeder::class,  // 4. Tecnologías
            OfertaSeeder::class,      // 5. Ofertas (depende de usuarios y tecnologías)
        ]);
    }
}
