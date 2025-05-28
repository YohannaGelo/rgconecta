<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use App\Interfaces\RoleCheck;
use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;
use App\Notifications\CustomVerifyEmail;

/**
 * @method bool isAdmin()
 */
class User extends Authenticatable implements MustVerifyEmail, RoleCheck
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'foto_perfil',
        'foto_perfil_public_id',
    ];

    // Relaciones
    public function alumno()
    {
        return $this->hasOne(Alumno::class);
    }

    public function profesor()
    {
        return $this->hasOne(Profesor::class);
    }

    public function ofertas()
    {
        return $this->hasMany(Oferta::class); // Un usuario puede publicar muchas ofertas
    }

    public function opiniones()
    {
        return $this->hasMany(Opinion::class);
    }

    public function preferencias()
    {
        return $this->hasOne(PreferenciaNotificacion::class);
    }

    // Verifica la foto de perfil
    public function getFotoPerfilAttribute($value)
    {
        return $value ?? 'default.jpg'; // Devuelve 'default.jpg' si el valor es null
    }


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    // protected function casts(): array
    // {
    //     return [
    //         'email_verified_at' => 'datetime',
    //         'password' => 'hashed',
    //     ];
    // }
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function sendEmailVerificationNotification()
    {
        $this->notify(new CustomVerifyEmail);
    }

    /**
     * Verificar si el usuario es un administrador.
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
