<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tecnologia extends Model
{
    /** @use HasFactory<\Database\Factories\TecnologiaFactory> */
    use HasFactory;

    protected $fillable = [
        'nombre',
        'tipo' // 'programacion', 'ofimatica', 'idioma', 'otros'
    ];

    // Relación N:M con Oferta (requisitos)
    public function ofertas()
    {
        return $this->belongsToMany(Oferta::class, 'requisitos_oferta')
            ->withPivot('nivel') // 'basico', 'intermedio', 'avanzado'
            ->withTimestamps();
    }
    

    // Relación N:M con Alumno (habilidades)
    public function alumnos()
    {
        return $this->belongsToMany(Alumno::class, 'alumno_tecnologia')
            ->withPivot('nivel')
            ->withTimestamps();
    }
}
