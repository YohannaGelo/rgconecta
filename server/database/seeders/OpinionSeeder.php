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
        Opinion::insert([
            [
                'user_id' => 4,
                'empresa_id' => 1,
                'anios_en_empresa' => 2,
                'contenido' => 'Excelente ambiente laboral y aprendizaje continuo.',
                'valoracion' => 5
            ],
            [
                'user_id' => 3,
                'empresa_id' => 1,
                'anios_en_empresa' => 2,
                'contenido' => 'Muy buenas comunicaciones de transporte público',
                'valoracion' => 4
            ],
            [
                'user_id' => 5,
                'empresa_id' => 2,
                'anios_en_empresa' => 1,
                'contenido' => 'Buena empresa, aunque mucha carga de trabajo en picos.',
                'valoracion' => 3
            ]
        ]);
    }
}
