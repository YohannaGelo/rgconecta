<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\{Oferta, Tecnologia, Empresa};

class OfertaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    public function run()
    {
        // Asegurar que las tecnologías ya existen (ya insertadas en TecnologiaSeeder)

        // 1. Obtener empresas
        $empresa1 = Empresa::firstWhere('nombre', 'TechSolutions S.L.');
        $empresa2 = Empresa::firstWhere('nombre', 'GeloTech');

        // 2. Crear primera oferta
        $oferta1 = Oferta::create([
            'titulo'          => 'Desarrollador FullStack Senior',
            'descripcion'     => 'Buscamos un desarrollador con experiencia en Angular y Laravel. Se valorarán conocimientos en Docker y AWS.',
            'empresa_id'      => $empresa1->id,
            'sobre_empresa'   => 'Empresa líder en desarrollo de software con sede en Sevilla y clientes en 20 países.',
            'user_id'         => 2, // Profesor
            'jornada'         => 'completa',
            'titulacion_id' => 5, // DAW
            'anios_experiencia' => 5,
            'localizacion'    => 'Sevilla',
            'fecha_publicacion' => now()->subDays(3),
            'fecha_expiracion'  => now()->addWeeks(6),
        ]);

        $oferta1->tecnologias()->attach([
            Tecnologia::where('nombre', 'Angular')->first()->id => ['nivel' => 'avanzado'],
            Tecnologia::where('nombre', 'Laravel')->first()->id => ['nivel' => 'avanzado'],
            Tecnologia::where('nombre', 'MySQL')->first()->id   => ['nivel' => 'intermedio'],
        ]);

        // 3. Segunda oferta
        $oferta2 = Oferta::create([
            'titulo'          => 'Técnico de Soporte IT',
            'descripcion'     => 'Puesto para dar soporte técnico a usuarios en entorno Windows y Office.',
            'empresa_id'      => $empresa2->id,
            'sobre_empresa'   => null,
            'user_id'         => 3, // Alumno
            'jornada'         => 'media_jornada',
            'titulacion_id' => 1, // SMR
            'anios_experiencia' => 2,
            'localizacion'    => 'Utrera',
            'fecha_publicacion' => now()->subWeek(),
            'fecha_expiracion'  => now()->addMonth(),
        ]);

        $oferta2->tecnologias()->attach([
            Tecnologia::where('nombre', 'Excel')->first()->id => ['nivel' => 'intermedio'],
            Tecnologia::where('nombre', 'Microsoft Office')->first()->id => ['nivel' => 'intermedio'],
        ]);

    }
}
