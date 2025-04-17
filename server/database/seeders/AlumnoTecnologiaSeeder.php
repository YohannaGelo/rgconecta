<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AlumnoTecnologiaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('alumno_tecnologia')->insert([
            // Alumno 1 - tecnologías generales
            [
                'alumno_id' => 1,
                'tecnologia_id' => 1, // PHP
                'nivel' => 'avanzado',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'alumno_id' => 1,
                'tecnologia_id' => 3, // JavaScript
                'nivel' => 'intermedio',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'alumno_id' => 1,
                'tecnologia_id' => 11, // Excel
                'nivel' => 'intermedio',
                'created_at' => now(),
                'updated_at' => now()
            ],

            // Alumno 1 - idioma
            [
                'alumno_id' => 1,
                'tecnologia_id' => 9, // Inglés
                'nivel' => 'B2',
                'created_at' => now(),
                'updated_at' => now()
            ],

            // Alumno 2 - tecnologías generales
            [
                'alumno_id' => 2,
                'tecnologia_id' => 2, // Laravel
                'nivel' => 'intermedio',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'alumno_id' => 2,
                'tecnologia_id' => 6, // MySQL
                'nivel' => 'basico',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'alumno_id' => 2,
                'tecnologia_id' => 12, // Contasol
                'nivel' => 'avanzado',
                'created_at' => now(),
                'updated_at' => now()
            ],

            // Alumno 2 - idioma
            [
                'alumno_id' => 2,
                'tecnologia_id' => 9, // Inglés
                'nivel' => 'C1',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
