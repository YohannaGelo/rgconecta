<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Oferta extends Model
{
    /** @use HasFactory<\Database\Factories\OfertaFactory> */
    use HasFactory;

    protected $fillable = [
        'titulo',
        'descripcion',
        'empresa_id',
        'user_id',
        'jornada',
        'titulacion_id',
        'anios_experiencia',
        'localizacion',
        'fecha_publicacion',
        'fecha_expiracion'
    ];

    // Dentro de la clase Oferta:
    protected $appends = ['empresa_nombre']; // Añade este campo a las respuestas JSON

    public function getEmpresaNombreAttribute()
    {
        return $this->empresa->nombre; // Devuelve el nombre desde la relación
    }

    // Relación con tecnologías (N:M)
    public function tecnologias()
    {
        return $this->belongsToMany(Tecnologia::class, 'requisitos_oferta')
            ->withPivot('nivel');
    }


    // Relación con empresa (1:N)
    public function empresa()
    {
        return $this->belongsTo(Empresa::class); // ¡Simple y limpio!
    }

    // Relación con usuario (1:N)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function titulacion()
    {
        return $this->belongsTo(Titulo::class, 'titulacion_id');
    }


    // // Evento que se dispara al crear una oferta
    // protected static function booted()
    // {
    //     static::created(function ($oferta) {
    //         // Enviar email de forma asíncrona (usa colas)
    //         Mail::to('admin@iesruizgijon.es') // Email del admin
    //             ->cc('moderacion@iesruizgijon.es') // Opcional: CC a otros
    //             ->queue(new OfertaPublicadaMail($oferta));
    //     });
    // }

    // // Método para ver si la oferta está "aprobada" (si no fue eliminada/oculta)
    // public function isAprobada()
    // {
    //     return $this->deleted_at === null; // Si usas soft deletes
    // }
}
