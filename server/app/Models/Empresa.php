<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $fillable = ['nombre', 'sector_id', 'web'];

    public function opiniones()
    {
        return $this->hasMany(Opinion::class);
    }

    public function sector()
    {
        return $this->belongsTo(Sector::class);
    }


    public function ofertas()
    {
        return $this->hasMany(Oferta::class, 'empresa_id'); // Relación ESTÁNDAR por ID
    }
}
