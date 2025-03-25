<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AlumnoTecnologiaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('alumno_tecnologia')->insert([
            [
                'alumno_id' => 1,
                'tecnologia_id' => 1, // PHP
                'nivel' => 'avanzado',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'alumno_id' => 1,
                'tecnologia_id' => 2, // Angular
                'nivel' => 'intermedio',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
