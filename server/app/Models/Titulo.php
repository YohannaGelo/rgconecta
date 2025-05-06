<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Titulo extends Model
{
    /** @use HasFactory<\Database\Factories\TituloFactory> */
    use HasFactory;

    protected $fillable = [
        'nombre',
        'tipo' // 'medio' o 'superior'
    ];

    // Relación N:M con Alumno (a través de la tabla pivot 'alumno_titulo')
    public function alumnos() {
        return $this->belongsToMany(Alumno::class)
                    ->withPivot(['fecha_inicio', 'fecha_fin', 'institucion'])
                    ->withTimestamps();
    }
}
