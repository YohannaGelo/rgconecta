<?php

namespace Database\Seeders;

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
            'foto_perfil' => 'default.jpg',
            'foto_perfil_public_id' => null,
        ]);

        // Profesores
        $profesor1 = User::create([
            'name' => 'Juan Pérez',
            'email' => 'juan.perez@iesruizgijon.es',
            'password' => bcrypt('password'),
            'role' => 'profesor',
            'foto_perfil' => 'default.jpg',
            'foto_perfil_public_id' => null,
        ]);

        Profesor::create([
            'user_id' => $profesor1->id,
            'departamento' => 'Informática',
        ]);

        $profesor2 = User::create([
            'name' => 'Ana López',
            'email' => 'ana.lopez@iesruizgijon.es',
            'password' => bcrypt('password'),
            'role' => 'profesor',
            'foto_perfil' => 'default.jpg',
            'foto_perfil_public_id' => null,
        ]);

        Profesor::create([
            'user_id' => $profesor2->id,
            'departamento' => 'Matemáticas',
        ]);

        // Alumnos
        $alumnos = [
            [
                'name' => 'María García',
                'email' => 'maria.garcia@alumno.iesruizgijon.es',
                'password' => bcrypt('password'),
                'role' => 'alumno',
                'fecha_nacimiento' => '1995-05-15',
                'situacion_laboral' => 'trabajando',
                'is_verified' => true,
                'promocion' => '2018/2020',
            ],
            [
                'name' => 'Carlos Martínez',
                'email' => 'carlos.martinez@alumno.iesruizgijon.es',
                'password' => bcrypt('password'),
                'role' => 'alumno',
                'fecha_nacimiento' => '1998-08-22',
                'situacion_laboral' => 'buscando_empleo',
                'is_verified' => true,
                'promocion' => '2020/2022',
            ],
        ];

        foreach ($alumnos as $alumnoData) {
            $user = User::create([
                'name' => $alumnoData['name'],
                'email' => $alumnoData['email'],
                'password' => $alumnoData['password'],
                'role' => $alumnoData['role'],
                'foto_perfil' => 'default.jpg',
                'foto_perfil_public_id' => null,
            ]);

            Alumno::create([
                'user_id' => $user->id,
                'fecha_nacimiento' => $alumnoData['fecha_nacimiento'],
                'situacion_laboral' => $alumnoData['situacion_laboral'],
                'is_verified' => $alumnoData['is_verified'],
                'promocion' => $alumnoData['promocion'],
            ]);
        }
    }
}
