<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\User;
use App\Models\Alumno;
use App\Models\Profesor;

class UserSeeder extends Seeder
{


    public function run()
    {
        // Admin
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@iesruizgijon.es',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Profesor
        $profesor = User::create([
            'name' => 'Juan Pérez',
            'email' => 'juan.perez@iesruizgijon.es',
            'password' => bcrypt('password'),
            'role' => 'profesor',
        ]);
        Profesor::create([
            'user_id' => $profesor->id,
            'departamento' => 'Informática',
            'email_corporativo' => 'juan.perez@iesruizgijon.es',
        ]);

        // Alumno (no verificado)
        $alumno = User::create([
            'name' => 'María García',
            'email' => 'maria@example.com',
            'password' => bcrypt('password'),
            'role' => 'alumno',
        ]);
        Alumno::create([
            'user_id' => $alumno->id,
            'fecha_nacimiento' => '1995-05-15',
            'situacion_laboral' => 'trabajando',
            'is_verified' => false,
        ]);
    }
}
