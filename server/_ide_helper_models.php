<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $user_id
 * @property string $fecha_nacimiento
 * @property string $situacion_laboral
 * @property string|null $foto_perfil
 * @property int $is_verified
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Opinion> $opiniones
 * @property-read int|null $opiniones_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tecnologia> $tecnologias
 * @property-read int|null $tecnologias_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Titulo> $titulos
 * @property-read int|null $titulos_count
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\AlumnoFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alumno newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alumno newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alumno query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alumno whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alumno whereFechaNacimiento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alumno whereFotoPerfil($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alumno whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alumno whereIsVerified($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alumno whereSituacionLaboral($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alumno whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alumno whereUserId($value)
 */
	class Alumno extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $nombre
 * @property string|null $sector
 * @property string|null $web
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Oferta> $ofertas
 * @property-read int|null $ofertas_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Opinion> $opiniones
 * @property-read int|null $opiniones_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa whereNombre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa whereSector($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Empresa whereWeb($value)
 */
	class Empresa extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $titulo
 * @property string $descripcion
 * @property int|null $empresa_id
 * @property string|null $sobre_empresa
 * @property int $user_id
 * @property string $jornada
 * @property string $localizacion
 * @property string $fecha_publicacion
 * @property string $fecha_expiracion
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Empresa|null $empresa
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tecnologia> $tecnologias
 * @property-read int|null $tecnologias_count
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\OfertaFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereDescripcion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereEmpresaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereFechaExpiracion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereFechaPublicacion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereJornada($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereLocalizacion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereSobreEmpresa($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereTitulo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Oferta whereUserId($value)
 */
	class Oferta extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $alumno_id
 * @property int $empresa_id
 * @property int $anios_en_empresa
 * @property string $contenido
 * @property int $valoracion
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Alumno $alumno
 * @property-read \App\Models\Empresa $empresa
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Opinion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Opinion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Opinion query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Opinion whereAlumnoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Opinion whereAñosEnEmpresa($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Opinion whereContenido($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Opinion whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Opinion whereEmpresaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Opinion whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Opinion whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Opinion whereValoracion($value)
 */
	class Opinion extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $user_id
 * @property string $departamento
 * @property string $email_corporativo
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Oferta> $ofertas
 * @property-read int|null $ofertas_count
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\ProfesorFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profesor newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profesor newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profesor query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profesor whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profesor whereDepartamento($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profesor whereEmailCorporativo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profesor whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profesor whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Profesor whereUserId($value)
 */
	class Profesor extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $nombre
 * @property string $tipo
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Alumno> $alumnos
 * @property-read int|null $alumnos_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Oferta> $ofertas
 * @property-read int|null $ofertas_count
 * @method static \Database\Factories\TecnologiaFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tecnologia newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tecnologia newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tecnologia query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tecnologia whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tecnologia whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tecnologia whereNombre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tecnologia whereTipo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tecnologia whereUpdatedAt($value)
 */
	class Tecnologia extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $nombre
 * @property string $tipo
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Alumno> $alumnos
 * @property-read int|null $alumnos_count
 * @method static \Database\Factories\TituloFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Titulo newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Titulo newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Titulo query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Titulo whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Titulo whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Titulo whereNombre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Titulo whereTipo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Titulo whereUpdatedAt($value)
 */
	class Titulo extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property string $role
 * @method bool isAdmin()
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Alumno|null $alumno
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Oferta> $ofertas
 * @property-read int|null $ofertas_count
 * @property-read \App\Models\Profesor|null $profesor
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent {}
}

