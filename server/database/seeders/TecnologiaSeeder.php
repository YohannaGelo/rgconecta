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
            // Informática y programación
            ['nombre' => 'PHP', 'tipo' => 'backend'],
            ['nombre' => 'Laravel', 'tipo' => 'backend'],
            ['nombre' => 'JavaScript', 'tipo' => 'frontend'],
            ['nombre' => 'Angular', 'tipo' => 'frontend'],
            ['nombre' => 'React', 'tipo' => 'frontend'],
            ['nombre' => 'MySQL', 'tipo' => 'database'],
            ['nombre' => 'Git', 'tipo' => 'devops'],
            ['nombre' => 'Docker', 'tipo' => 'devops'],
            ['nombre' => 'Inglés', 'tipo' => 'idioma'],
            ['nombre' => 'Excel', 'tipo' => 'ofimatica'],

            // Empresas, gestión y otros
            ['nombre' => 'Contasol', 'tipo' => 'gestion'],   // Aplicaciones de contabilidad
            ['nombre' => 'Sage', 'tipo' => 'gestion'],       // Software de gestión empresarial
            ['nombre' => 'Factusol', 'tipo' => 'gestion'],   // Facturación y gestión de empresa
            ['nombre' => 'Project Management', 'tipo' => 'gestion'], // Gestión de proyectos
            ['nombre' => 'Trello', 'tipo' => 'gestion'],     // Herramienta de gestión de proyectos
            ['nombre' => 'Microsoft Office', 'tipo' => 'ofimatica'], // Ofimática, incluye Word, Excel, etc.
            ['nombre' => 'Google Suite', 'tipo' => 'ofimatica'], // Herramientas colaborativas

            // FOL / Empretecimiento
            ['nombre' => 'Prevención de riesgos laborales', 'tipo' => 'otros'], // FOL
            ['nombre' => 'Derecho laboral', 'tipo' => 'otros'], // FOL
            ['nombre' => 'Gestión de nóminas', 'tipo' => 'otros'], // FOL
            ['nombre' => 'Emprendimiento', 'tipo' => 'otros'], // Habilidades emprendedoras
            ['nombre' => 'Marketing Digital', 'tipo' => 'otros'], // Emprendimiento y ventas
            ['nombre' => 'Gestión financiera', 'tipo' => 'gestion'], // Finanzas para empresas
        ];

        Tecnologia::insert($tecnologias);
    }
}
