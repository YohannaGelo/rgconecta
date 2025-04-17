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

            for ($i = 0; $i < $numExperiencias; $i++) {
                $empresa = $empresas->random();
                $mesInicio = rand(1, 12);
                $añoInicio = rand(2018, 2023);

                $alumno->experiencias()->create([
                    'empresa_id' => $empresa->id,
                    'puesto' => $this->getPuestoAleatorio(),
                    'descripcion' => 'Desarrollo de aplicaciones web y mantenimiento de sistemas.',
                    'fecha_inicio' => "$añoInicio-$mesInicio-01",
                    'fecha_fin' => ($i === $numExperiencias - 1) ? null : date('Y-m-d', strtotime("+" . rand(6, 24) . " months", strtotime("$añoInicio-$mesInicio-01"))),
                    'es_actual' => ($i === $numExperiencias - 1),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
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
