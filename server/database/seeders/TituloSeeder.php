<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Titulo;

class TituloSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

     public function run() {
        $titulos = [
            ['nombre' => 'SMR', 'tipo' => 'ciclo_medio'],
            ['nombre' => 'DAW', 'tipo' => 'ciclo_superior'],
            ['nombre' => 'DAM', 'tipo' => 'ciclo_superior'],
            ['nombre' => 'Ingeniería Informática', 'tipo' => 'grado_universitario'],
            ['nombre' => 'Máster en Desarrollo Web', 'tipo' => 'master'],
        ];
        Titulo::insert($titulos);
    }
}
