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

        // Profesores
        $profesor1 = User::create([
            'name' => 'Juan Pérez',
            'email' => 'juan.perez@iesruizgijon.es',
            'password' => bcrypt('password'),
            'role' => 'profesor',
        ]);

        Profesor::create([
            'user_id' => $profesor1->id,
            'departamento' => 'Informática',
            'email_corporativo' => 'juan.perez@iesruizgijon.es',
        ]);

        $profesor2 = User::create([
            'name' => 'Ana López',
            'email' => 'ana.lopez@iesruizgijon.es',
            'password' => bcrypt('password'),
            'role' => 'profesor',
        ]);

        Profesor::create([
            'user_id' => $profesor2->id,
            'departamento' => 'Matemáticas',
            'email_corporativo' => 'ana.lopez@iesruizgijon.es',
        ]);

        // Alumno (no verificado)
        $alumnos = [
            [
                'name' => 'María García',
                'email' => 'maria.garcia@alumno.iesruizgijon.es',
                'password' => bcrypt('password'),
                'role' => 'alumno',
                'fecha_nacimiento' => '1995-05-15',
                'situacion_laboral' => 'trabajando',
                'is_verified' => true,
                'foto_perfil' => null,
                'promocion' => '2018/2020'
            ],
            [
                'name' => 'Carlos Martínez',
                'email' => 'carlos.martinez@alumno.iesruizgijon.es',
                'password' => bcrypt('password'),
                'role' => 'alumno',
                'fecha_nacimiento' => '1998-08-22',
                'situacion_laboral' => 'buscando_empleo',
                'is_verified' => true,
                'foto_perfil' => null,
                'promocion' => '2020/2022',
            ]
        ];

        foreach ($alumnos as $alumnoData) {
            // Crear el usuario
            $user = User::create([
                'name' => $alumnoData['name'],
                'email' => $alumnoData['email'],
                'password' => $alumnoData['password'],
                'role' => $alumnoData['role'],
            ]);

            // Crear el alumno y asignar la promoción
            Alumno::create([
                'user_id' => $user->id, // Se asigna el user_id del usuario creado
                'fecha_nacimiento' => $alumnoData['fecha_nacimiento'],
                'situacion_laboral' => $alumnoData['situacion_laboral'],
                'is_verified' => $alumnoData['is_verified'],
                'foto_perfil' => $alumnoData['foto_perfil'],
                'promocion' => $alumnoData['promocion'], // Se asigna la promoción correctamente
            ]);
        }
    }
}
