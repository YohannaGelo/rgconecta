<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Opinion extends Model
{
    protected $table = 'opiniones';

    // protected $fillable = [
    //     'alumno_id', 'empresa_id', 'contenido', 'valoracion', 'anios_en_empresa'
    // ];

    protected $fillable = [
        'user_id',
        'empresa_id',
        'contenido',
        'valoracion',
        'anios_en_empresa'
    ];

    // public function alumno() {
    //     return $this->belongsTo(Alumno::class);
    // }
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }
}
