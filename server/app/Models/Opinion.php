<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Opinion extends Model
{
    protected $table = 'opiniones';

    protected $fillable = ['empresa_id', 'años_en_empresa', 'contenido', 'valoracion'];

    public function alumno() {
        return $this->belongsTo(Alumno::class);
    }

    public function empresa() {
        return $this->belongsTo(Empresa::class);
    }
}
