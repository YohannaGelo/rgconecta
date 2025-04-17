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
            ['nombre' => 'Técnico en Sistemas Microinformáticos y Redes', 'tipo' => 'ciclo_medio'],
            ['nombre' => 'Técnico Superior en Desarrollo de Aplicaciones Web', 'tipo' => 'ciclo_superior'],
            ['nombre' => 'Técnico Superior en Desarrollo de Aplicaciones Multiplataforma', 'tipo' => 'ciclo_superior'],
            ['nombre' => 'Técnico Superior en Administración de Sistemas Informáticos en Red', 'tipo' => 'ciclo_superior'],
            ['nombre' => 'Grado en Ingeniería Informática', 'tipo' => 'grado_universitario'],
            ['nombre' => 'Máster en Desarrollo Web y Aplicaciones', 'tipo' => 'master'],
        ];
        Titulo::insert($titulos);
    }
}
