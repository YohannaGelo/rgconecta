<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $fillable = ['nombre', 'sector', 'web'];

    public const SECTORES = [
        'tecnologia',
        'educacion',
        'salud',
        'construccion',
        'comercio',
        'hosteleria',
        'finanzas',
        'logistica',
        'marketing',
        'industria',
        'diseno',
        'otros'
    ];

    public function opiniones() {
        return $this->hasMany(Opinion::class);
    }

    // public function ofertas() {
    //     return $this->hasMany(Oferta::class, 'empresa_nombre', 'nombre'); // Relación por nombre
    // }

    public function ofertas() {
        return $this->hasMany(Oferta::class, 'empresa_id'); // Relación ESTÁNDAR por ID
    }
}
