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
    public function run()
    {
        $titulos = [
            // Ciclos Formativos de Grado Medio
            ['nombre' => 'Técnico en Sistemas Microinformáticos y Redes', 'tipo' => 'ciclo_medio'],
            ['nombre' => 'Técnico en Gestión Administrativa', 'tipo' => 'ciclo_medio'],
            ['nombre' => 'Técnico en Cocina y Gastronomía', 'tipo' => 'ciclo_medio'],
            ['nombre' => 'Técnico en Cuidados Auxiliares de Enfermería', 'tipo' => 'ciclo_medio'],

            // Ciclos Formativos de Grado Superior
            ['nombre' => 'Técnico Superior en Desarrollo de Aplicaciones Web', 'tipo' => 'ciclo_superior'],
            ['nombre' => 'Técnico Superior en Desarrollo de Aplicaciones Multiplataforma', 'tipo' => 'ciclo_superior'],
            ['nombre' => 'Técnico Superior en Administración de Sistemas Informáticos en Red', 'tipo' => 'ciclo_superior'],
            ['nombre' => 'Técnico Superior en Educación Infantil', 'tipo' => 'ciclo_superior'],
            ['nombre' => 'Técnico Superior en Laboratorio Clínico y Biomédico', 'tipo' => 'ciclo_superior'],

            // Grados universitarios
            ['nombre' => 'Grado en Ingeniería Informática', 'tipo' => 'grado_universitario'],
            ['nombre' => 'Grado en Medicina', 'tipo' => 'grado_universitario'],
            ['nombre' => 'Grado en Derecho', 'tipo' => 'grado_universitario'],
            ['nombre' => 'Grado en Psicología', 'tipo' => 'grado_universitario'],
            ['nombre' => 'Grado en Educación Primaria', 'tipo' => 'grado_universitario'],

            // Másters
            ['nombre' => 'Máster en Desarrollo Web y Aplicaciones', 'tipo' => 'master'],
            ['nombre' => 'Máster en Profesorado de Secundaria', 'tipo' => 'master'],
            ['nombre' => 'Máster en Psicología General Sanitaria', 'tipo' => 'master'],
            ['nombre' => 'Máster en Dirección de Empresas (MBA)', 'tipo' => 'master'],

            // Otros
            ['nombre' => 'Graduado en ESO', 'tipo' => 'otros'],
            ['nombre' => 'Bachillerato en Ciencias', 'tipo' => 'otros'],
            ['nombre' => 'Certificado de Profesionalidad en Gestión Contable', 'tipo' => 'otros'],
        ];

        Titulo::insert($titulos);
    }
}
