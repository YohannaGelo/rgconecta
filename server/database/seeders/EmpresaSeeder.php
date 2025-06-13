<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Empresa;
use App\Models\Sector;

class EmpresaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $sectorTecnologia = Sector::where('clave', 'tecnologia')->first();

        Empresa::insert([
            [
                'nombre' => 'TechSolutions S.L.',
                'sector_id' => $sectorTecnologia->id,
                'web' => 'https://techsolutions.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'GeloTech',
                'sector_id' => $sectorTecnologia->id,
                'web' => 'https://gelotech.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
