<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alumno extends Model
{
    /** @use HasFactory<\Database\Factories\AlumnoFactory> */
    use HasFactory;

    protected $fillable = ['user_id', 'fecha_nacimiento', 'situacion_laboral', 'is_verified'];

    // Relación con títulos
    public function titulos()
    {
        return $this->belongsToMany(Titulo::class)->withPivot('año_graduacion');
    }

    // Relación con opiniones
    public function opiniones() {
        return $this->hasMany(Opinion::class);
    }
}
