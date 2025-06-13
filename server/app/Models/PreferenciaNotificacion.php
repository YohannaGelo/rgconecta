<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PreferenciaNotificacion extends Model
{
    protected $table = 'preferencia_notificacions';

    protected $fillable = [
        'user_id',
        'responder_dudas',
        'avisos_nuevas_ofertas',
        'newsletter',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
