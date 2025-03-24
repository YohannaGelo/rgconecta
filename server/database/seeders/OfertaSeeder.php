<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\{Oferta, Tecnologia};

class OfertaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

     public function run()
     {
         // 1. Crear tecnologías si no existen
         $tecnologias = [
             ['nombre' => 'Angular', 'tipo' => 'programacion'],
             ['nombre' => 'Laravel', 'tipo' => 'programacion'],
             ['nombre' => 'MySQL', 'tipo' => 'programacion']
         ];
     
         foreach ($tecnologias as $tech) {
             Tecnologia::firstOrCreate(
                 ['nombre' => $tech['nombre']],
                 ['tipo' => $tech['tipo']]
             );
         }
     
         // 2. Crear la oferta con TODOS los campos
         $oferta = Oferta::create([
             'titulo'          => 'Desarrollador FullStack Senior',
             'descripcion'     => 'Buscamos un desarrollador con experiencia en Angular y Laravel para proyecto internacional. Se valorarán conocimientos en Docker y AWS.',
             'empresa_nombre'  => 'TechSolutions S.L.',
             'sobre_empresa'   => 'Empresa líder en desarrollo de software con sede en Sevilla y clientes en 20 países.',
             'user_id'         => 2, // ID del profesor que publica
             'jornada'         => 'completa',
             'localizacion'    => 'Sevilla (híbrido)',
             'fecha_publicacion' => now()->subDays(3), // Publicada hace 3 días
             'fecha_expiracion'  => now()->addWeeks(6), // Expira en 6 semanas
         ]);
     
         // 3. Asignar tecnologías con niveles específicos
         $oferta->tecnologias()->attach([
             Tecnologia::where('nombre', 'Angular')->first()->id => ['nivel' => 'avanzado'],
             Tecnologia::where('nombre', 'Laravel')->first()->id  => ['nivel' => 'avanzado'],
             Tecnologia::where('nombre', 'MySQL')->first()->id    => ['nivel' => 'intermedio']
         ]);
     
         // Opcional: Crear segunda oferta de ejemplo
         Oferta::create([
             'titulo'          => 'Técnico de Soporte IT',
             'descripcion'     => 'Puesto para dar soporte técnico a usuarios en entorno Windows y Office.',
             'empresa_nombre'  => 'ServiTech',
             'sobre_empresa'   => null, // Campo opcional
             'user_id'         => 3, // ID de un alumno
             'jornada'         => 'media_jornada',
             'localizacion'    => 'Utrera (presencial)',
             'fecha_publicacion' => now()->subWeek(), // Publicada hace 1 semana
             'fecha_expiracion'  => now()->addMonth(), // Expira en 1 mes
         ])->tecnologias()->attach(
             Tecnologia::where('nombre', 'Excel')->first()->id,
             ['nivel' => 'intermedio']
         );
     }
     
}
