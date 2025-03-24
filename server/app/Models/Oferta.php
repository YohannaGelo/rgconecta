<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Oferta extends Model
{
    /** @use HasFactory<\Database\Factories\OfertaFactory> */
    use HasFactory;

    protected $fillable = ['titulo', 'descripcion', 'empresa_nombre', 'user_id'];

    // Relación con tecnologías (N:M)
    public function tecnologias()
    {
        return $this->belongsToMany(Tecnologia::class, 'requisitos_oferta')
            ->withPivot('nivel');
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
