<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Empresa;


class EmpresaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Empresa::insert([
            [
                'nombre' => 'TechSolutions S.L.',
                'sector' => 'Tecnología',
                'web' => 'https://techsolutions.com'
            ],
            [
                'nombre' => 'GeloTech',
                'sector' => 'Tecnología y Aprendizaje',
                'web' => 'https://gelotech.com'
            ]
        ]);
    }
}
