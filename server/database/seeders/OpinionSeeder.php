<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Opinion;


class OpinionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Opinion::create([
            'alumno_id' => 1,
            'empresa_id' => 1,
            'años_en_empresa' => 2,
            'contenido' => 'Excelente ambiente laboral',
            'valoracion' => 5
        ]);
    }
}
