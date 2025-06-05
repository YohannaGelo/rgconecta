<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\{Alumno, Titulo};

class AlumnoTituloSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $alumnos = Alumno::all();
        $titulos = Titulo::all();

        foreach ($alumnos as $alumno) {
            $titulosAleatorios = $titulos->random(rand(1, 3));

            foreach ($titulosAleatorios as $titulo) {
                $añoInicio = rand(2015, 2020);
                $duracion = $this->getDuracionPorTipo($titulo->tipo);

                $alumno->titulos()->attach($titulo->id, [
                    'fecha_inicio' => $añoInicio,
                    'fecha_fin' => $añoInicio + $duracion,
                    'institucion' => $this->getInstitucionAleatoria(),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }
    }

    private function getDuracionPorTipo($tipo)
    {
        return match ($tipo) {
            'ciclo_medio' => 2,
            'ciclo_superior' => 2,
            'grado_universitario' => 4,
            'master' => 1,
            default => 2
        };
    }

    private function getInstitucionAleatoria()
    {
        $instituciones = [
            'IES Ruiz Gijón',
            'Universidad de Sevilla',
            'Universidad Pablo de Olavide',
            'IES Polígono Sur',
            'Universidad de Málaga'
        ];

        return $instituciones[array_rand($instituciones)];
    }
}
       
