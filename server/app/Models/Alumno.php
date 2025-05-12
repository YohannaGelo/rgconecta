<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alumno extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'fecha_nacimiento',
        'situacion_laboral',
        'is_verified',
        // 'foto_perfil',
        'promocion',
        'titulo_profesional'
    ];

    // Relación con usuarios
    public function user()
    {
        return $this->belongsTo(User::class);
    }


    // Relación con títulos
    public function titulos()
    {
        return $this->belongsToMany(Titulo::class, 'alumno_titulo')
            ->withPivot(['fecha_inicio', 'fecha_fin', 'institucion']);
    }

    // Relación con experiencias
    public function experiencias()
    {
        return $this->hasMany(Experiencia::class);
    }

    // Relación con tecnologías
    public function tecnologias()
    {
        return $this->belongsToMany(Tecnologia::class, 'alumno_tecnologia')
            ->withPivot('nivel');
    }

    // Relación con opiniones
    public function opiniones()
    {
        return $this->hasManyThrough(Opinion::class, User::class, 'id', 'user_id', 'user_id', 'id');
    }
}
