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
        // Obtener el primer alumno y títulos de ejemplo
        $alumno = Alumno::first(); // Asegúrate de que el UserSeeder y AlumnoSeeder ya se ejecutaron
        $tituloCiclo = Titulo::where('nombre', 'DAW')->first();
        $tituloGrado = Titulo::where('nombre', 'Ingeniería Informática')->first();

        // Relacionar alumno con títulos (datos de ejemplo)
        if ($alumno && $tituloCiclo) {
            $alumno->titulos()->attach($tituloCiclo->id, [
                'año_inicio' => 2018,
                'año_fin' => 2020,
                'institucion' => 'IES Ruiz Gijón'
            ]);
        }

        if ($alumno && $tituloGrado) {
            $alumno->titulos()->attach($tituloGrado->id, [
                'año_inicio' => 2020,
                'año_fin' => 2024,
                'institucion' => 'Universidad de Sevilla'
            ]);
        }

        $this->command->info('Relaciones alumno-título creadas correctamente!');
    }
}
