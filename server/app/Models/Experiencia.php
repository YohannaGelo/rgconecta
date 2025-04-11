<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Experiencia extends Model
{
    use HasFactory;

    protected $fillable = [
        'alumno_id',
        'empresa_id',
        'puesto',
        'fecha_inicio',
        'fecha_fin',
        'descripcion'
    ];

    public function alumno()
    {
        return $this->belongsTo(Alumno::class);
    }

    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }
}
