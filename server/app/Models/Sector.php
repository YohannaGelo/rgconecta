<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sector extends Model
{
    protected $table = 'sectores';

    protected $fillable = ['clave', 'nombre'];
    
    public function empresas()
    {
        return $this->hasMany(Empresa::class);
    }
}
