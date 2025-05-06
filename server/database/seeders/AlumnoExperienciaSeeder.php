<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\{Alumno, Empresa};


class AlumnoExperienciaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $alumnos = Alumno::all();
        $empresas = Empresa::all();

        foreach ($alumnos as $alumno) {
            $numExperiencias = rand(1, 3);

            $anioActual = date('Y');
            $anioInicio = rand(2010, $anioActual - 2); // dejamos margen de al menos 2 anios para la fecha_fin

            for ($i = 0; $i < $numExperiencias; $i++) {
                $empresa = $empresas->random();
                $anioFin = $anioInicio + rand(1, 3);

                if ($anioFin > $anioActual) {
                    $anioFin = null; // experiencia actual
                }

                $alumno->experiencias()->create([
                    'empresa_id' => $empresa->id,
                    'puesto' => $this->getPuestoAleatorio(),
                    'descripcion' => 'Desarrollo de aplicaciones web y mantenimiento de sistemas.',
                    'fecha_inicio' => $anioInicio,
                    'fecha_fin' => $anioFin,
                    'es_actual' => is_null($anioFin),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                // Preparar el próximo inicio (si hay otra experiencia)
                $anioInicio = $anioFin ? $anioFin + 1 : $anioInicio + 1;
            }
        }
    }

    private function getPuestoAleatorio()
    {
        $puestos = [
            'Desarrollador Backend',
            'Desarrollador Frontend',
            'Desarrollador Full Stack',
            'Analista Programador',
            'Técnico de Sistemas',
            'Diseñador Web',
            'Administrador de Bases de Datos'
        ];

        return $puestos[array_rand($puestos)];
    }
}

