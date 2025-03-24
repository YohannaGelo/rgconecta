<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tecnologia;

class TecnologiaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $tecnologias = [
            ['nombre' => 'PHP', 'tipo' => 'programacion'],
            ['nombre' => 'Angular', 'tipo' => 'programacion'],
            ['nombre' => 'Excel', 'tipo' => 'ofimatica'],
            ['nombre' => 'Inglés', 'tipo' => 'idioma'],
        ];
        Tecnologia::insert($tecnologias);
    }
}
