<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;



class Profesor extends Model
{
    /** @use HasFactory<\Database\Factories\ProfesorFactory> */
    use HasFactory;

    protected $table = 'profesores';

    // Campos que se pueden llenar masivamente
    protected $fillable = [
        'user_id',
        'departamento',
        // 'foto_perfil'
    ];

    // Relación 1:1 inversa con User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación 1:N con Oferta (un profesor puede publicar muchas ofertas)
    public function ofertas()
    {
        return $this->hasMany(Oferta::class, 'user_id', 'user_id');
        // Nota: 'user_id' es la FK en ofertas que apunta a 'user_id' en profesores
    }
}
