<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alumno;
use App\Models\User;
use App\Models\Titulo;
use App\Models\Tecnologia;
use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

use Cloudinary\Cloudinary;

use App\Mail\AvisoNuevoAlumno;
use App\Mail\BienvenidaAlumnoPendiente;
use App\Mail\AlumnoVerificado;
use App\Mail\AlumnoRechazado;
use Illuminate\Support\Facades\Mail;

class AlumnoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // Obtener todos los alumnos (con relaciones opcionales)
    public function index(Request $request)
    {
        $query = Alumno::with([
            'user:id,name,foto_perfil',
            'tecnologias:nombre',
            'experiencias:id,alumno_id,fecha_inicio,fecha_fin'
        ])
            ->whereHas('user', function ($q) {
                $q->where('is_verified', 1);
            })
            ->select(['id', 'user_id', 'situacion_laboral', 'fecha_nacimiento', 'titulo_profesional']);

        if ($request->filled('tecnologia')) {
            $query->whereHas('tecnologias', function ($q) use ($request) {
                $q->where('nombre', 'like', '%' . $request->tecnologia . '%');
            });
        }

        if ($request->filled('situacion')) {
            $query->whereRaw('LOWER(situacion_laboral) = ?', [strtolower(trim($request->situacion))]);
        }


        if ($request->filled('experiencia')) {
            $query->whereHas('experiencias', function ($q) use ($request) {
                // $q->whereRaw('TIMESTAMPDIFF(YEAR, fecha_inicio, fecha_fin) >= ?', [$request->experiencia]);
                $q->whereRaw('(IFNULL(fecha_fin, YEAR(CURDATE())) - fecha_inicio) >= ?', [$request->experiencia]);
            });
        }

        $alumnos = $query->paginate(8);

        return response()->json([
            'success' => true,
            'data' => $alumnos->items(),
            'pagination' => [
                'total' => $alumnos->total(),
                'current_page' => $alumnos->currentPage(),
                'per_page' => $alumnos->perPage(),
                'last_page' => $alumnos->lastPage(),
            ],

            'stats' => [
                'total_alumnos' => Alumno::count(),
                'tecnologias' => Tecnologia::groupBy('nombre')->pluck('nombre')
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user.name' => 'required|string|max:255',
            'user.email' => 'required|email|unique:users,email',
            'user.password' => 'required|string|min:6',

            'fecha_nacimiento' => 'required|date',
            'situacion_laboral' => 'required|string',
            'promocion' => 'nullable|string',
            'titulo_profesional' => 'nullable|string',
            'user.foto_perfil' => 'nullable|string',

            'titulos' => 'array',
            'titulos.*.nombre' => 'required|string',
            'titulos.*.tipo' => 'required|string',
            'titulos.*.pivot.fecha_inicio' => 'required|string',
            'titulos.*.pivot.fecha_fin' => 'required|string',
            'titulos.*.pivot.institucion' => 'required|string',

            'tecnologias' => 'array',
            'tecnologias.*.nombre' => 'required|string',
            'tecnologias.*.tipo' => 'required|string',
            'tecnologias.*.pivot.nivel' => 'required|string',

            'experiencias' => 'array',
            'experiencias.*.empresa.nombre' => 'required|string',
            'experiencias.*.empresa.sector_id' => 'nullable|exists:sectores,id',
            'experiencias.*.puesto' => 'required|string',
            'experiencias.*.fecha_inicio' => 'required|string',
            'experiencias.*.fecha_fin' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            // Subir foto a Cloudinary si viene en base64
            $fotoUrl = 'default.jpg';
            $fotoPublicId = null;

            // if ($request->user['foto_perfil']) {
            if ($request->input('user.foto_perfil')) {

                $cloudinary = new Cloudinary(config('cloudinary'));
                $uploadedImage = $cloudinary->uploadApi()->upload($request->user['foto_perfil'], [
                    'folder' => 'usuarios'
                ]);
                $fotoUrl = $uploadedImage['secure_url'];
                $fotoPublicId = $uploadedImage['public_id'];
            }

            // Crear usuario
            $user = User::create([
                'name' => $request->input('user.name'),
                'email' => $request->input('user.email'),
                'password' => Hash::make($request->input('user.password')),
                'role' => 'alumno',
                'foto_perfil' => $fotoUrl,
                'foto_perfil_public_id' => $fotoPublicId,
            ]);

            // Crear alumno
            $alumno = Alumno::create([
                'user_id' => $user->id,
                'fecha_nacimiento' => $request->fecha_nacimiento,
                'situacion_laboral' => $request->situacion_laboral,
                'is_verified' => $request->is_verified ?? false,
                'promocion' => $request->promocion ?? null,
                'titulo_profesional' => $request->titulo_profesional ?? null,
            ]);

            // Títulos
            foreach ($request->titulos as $titulo) {
                $tituloModel = Titulo::firstOrCreate([
                    'nombre' => $titulo['nombre'],
                    'tipo' => $titulo['tipo']
                ]);

                $alumno->titulos()->attach($tituloModel->id, [
                    'fecha_inicio' => $titulo['pivot']['fecha_inicio'],
                    'fecha_fin' => $titulo['pivot']['fecha_fin'],
                    'institucion' => $titulo['pivot']['institucion'],
                ]);
            }

            // Tecnologías
            foreach ($request->tecnologias as $tecno) {
                $tecnologia = Tecnologia::firstOrCreate([
                    'nombre' => $tecno['nombre'],
                    'tipo' => $tecno['tipo']
                ]);

                $nivel = $tecno['pivot']['nivel'];

                if ($tecnologia->tipo === 'idioma') {
                    $nivelesValidos = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
                } else {
                    $nivelesValidos = ['basico', 'intermedio', 'avanzado'];
                }

                if (!in_array($nivel, $nivelesValidos)) {
                    throw new \Exception("Nivel '{$nivel}' no válido para la tecnología '{$tecnologia->nombre}' de tipo '{$tecnologia->tipo}'");
                }

                $alumno->tecnologias()->attach($tecnologia->id, [
                    'nivel' => $nivel
                ]);
            }

            // Experiencias
            foreach ($request->experiencias as $exp) {
                $empresa = Empresa::firstOrCreate(
                    ['nombre' => $exp['empresa']['nombre']],
                    [
                        'sector_id' => $exp['empresa']['sector_id'] ?? null,
                        'web' => $exp['empresa']['web'] ?? null
                    ]
                );

                $alumno->experiencias()->create([
                    'empresa_id' => $empresa->id,
                    'puesto' => $exp['puesto'],
                    'fecha_inicio' => $exp['fecha_inicio'],
                    'fecha_fin' => $exp['fecha_fin'] ?? null
                ]);
            }

            DB::commit();

            // 1. Enviar correo al alumno
            Mail::to($user->email)->send(new BienvenidaAlumnoPendiente($alumno));

            // 2. Enviar aviso a profesores y admin
            $destinatarios = User::whereIn('role', ['profesor', 'admin'])->pluck('email')->toArray();
            Mail::to($destinatarios)->send(new AvisoNuevoAlumno($alumno));


            return response()->json($alumno->load(['user', 'titulos', 'tecnologias', 'experiencias']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el alumno.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    // Mostrar alumno específico con todas sus relaciones
    public function show(Alumno $alumno)
    {
        // Detalle solo para autenticados
        return response()->json(
            $alumno->load([
                'user:id,name,email,foto_perfil',
                'titulos',
                'tecnologias',
                'opiniones.empresa:id,nombre',
                'experiencias.empresa:id,nombre',
                'experiencias.empresa.sector:id,nombre'
            ])
        );
    }

    /**
     * Update the specified resource in storage.
     */
    // Actualizar perfil de alumno (ej: tecnologías o situación laboral)
    public function update(Request $request, Alumno $alumno)
    {
        $request->validate([
            'user.name' => 'sometimes|string|max:255',
            'user.email' => 'sometimes|email|unique:users,email,' . $alumno->user_id,
            'user.foto_perfil' => 'nullable|string',

            'fecha_nacimiento' => 'sometimes|date',
            'situacion_laboral' => 'sometimes|string',
            'promocion' => 'nullable|string',
            'titulo_profesional' => 'nullable|string',

            'titulos' => 'array',
            'titulos.*.nombre' => 'required|string',
            'titulos.*.tipo' => 'required|string',
            'titulos.*.pivot.fecha_inicio' => 'required|string',
            'titulos.*.pivot.fecha_fin' => 'required|string',
            'titulos.*.pivot.institucion' => 'required|string',

            'tecnologias' => 'array',
            'tecnologias.*.nombre' => 'required|string',
            'tecnologias.*.tipo' => 'required|string',
            'tecnologias.*.pivot.nivel' => 'required|string',

            'experiencias' => 'array',
            'experiencias.*.empresa.nombre' => 'required|string',
            'experiencias.*.empresa.sector_id' => 'nullable|exists:sectores,id',
            'experiencias.*.puesto' => 'required|string',
            'experiencias.*.fecha_inicio' => 'required|string',
            'experiencias.*.fecha_fin' => 'nullable|string',
        ]);

        \DB::beginTransaction();

        try {
            // Actualizar datos del usuario
            if ($request->has('user')) {
                $userUpdates = [];

                if ($request->filled('user.name')) {
                    $userUpdates['name'] = $request->input('user.name');
                }
                if ($request->filled('user.email')) {
                    $userUpdates['email'] = $request->input('user.email');
                }
                if ($request->filled('user.foto_perfil')) {
                    $fotoPerfil = $request->input('user.foto_perfil');

                    if (str_starts_with($fotoPerfil, 'data:image')) {
                        // Si viene base64, sube a Cloudinary
                        $cloudinary = new Cloudinary(config('cloudinary'));
                        $uploadedImage = $cloudinary->uploadApi()->upload($fotoPerfil, [
                            'folder' => 'usuarios'
                        ]);
                        $fotoUrl = $uploadedImage['secure_url'];
                        $fotoPublicId = $uploadedImage['public_id'];

                        $userUpdates['foto_perfil'] = $fotoUrl;
                        $userUpdates['foto_perfil_public_id'] = $fotoPublicId;
                    } else {
                        // Si ya es URL, mantenla
                        $userUpdates['foto_perfil'] = $fotoPerfil;
                    }
                }

                if (!empty($userUpdates)) {
                    $alumno->user->update($userUpdates);
                }
            }


            // Actualizar datos del alumno
            $alumno->update([
                'fecha_nacimiento' => $request->fecha_nacimiento,
                'situacion_laboral' => $request->situacion_laboral,
                'promocion' => $request->promocion,
                'titulo_profesional' => $request->titulo_profesional,
            ]);

            // Sincronizar títulos
            if ($request->has('titulos')) {
                $alumno->titulos()->detach();
                foreach ($request->titulos as $titulo) {
                    $tituloModel = \App\Models\Titulo::firstOrCreate([
                        'nombre' => $titulo['nombre'],
                        'tipo' => $titulo['tipo'],
                    ]);

                    $alumno->titulos()->attach($tituloModel->id, [
                        'fecha_inicio' => $titulo['pivot']['fecha_inicio'],
                        'fecha_fin' => $titulo['pivot']['fecha_fin'],
                        'institucion' => $titulo['pivot']['institucion'],
                    ]);
                }
            }

            // Sincronizar tecnologías
            if ($request->has('tecnologias')) {
                $alumno->tecnologias()->detach();
                foreach ($request->tecnologias as $tecno) {
                    $tec = \App\Models\Tecnologia::firstOrCreate([
                        'nombre' => $tecno['nombre'],
                        'tipo' => $tecno['tipo'],
                    ]);

                    $alumno->tecnologias()->attach($tec->id, [
                        'nivel' => $tecno['pivot']['nivel'],
                    ]);
                }
            }

            // Sincronizar experiencias
            if ($request->has('experiencias')) {
                $alumno->experiencias()->delete();
                foreach ($request->experiencias as $exp) {
                    $empresa = \App\Models\Empresa::firstOrCreate(
                        ['nombre' => $exp['empresa']['nombre']],
                        [
                            'sector_id' => $exp['empresa']['sector_id'] ?? null,
                            'web' => $exp['empresa']['web'] ?? null,
                        ]
                    );

                    $alumno->experiencias()->create([
                        'empresa_id' => $empresa->id,
                        'puesto' => $exp['puesto'],
                        'fecha_inicio' => $exp['fecha_inicio'],
                        'fecha_fin' => $exp['fecha_fin'] ?? null,
                    ]);
                }
            }

            \DB::commit();

            return response()->json([
                'message' => 'Alumno actualizado correctamente',
                'data' => $alumno->fresh()->load(['user', 'titulos', 'tecnologias', 'experiencias']),
            ]);
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el alumno.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Alumno $alumno)
    {
        $user = $alumno->user;

        // Si tiene public_id, eliminamos la foto de Cloudinary
        if ($user->foto_perfil_public_id) {
            $cloudinary = new Cloudinary(config('cloudinary'));
            try {
                $cloudinary->uploadApi()->destroy($user->foto_perfil_public_id);
            } catch (\Exception $e) {
                \Log::error('Error al eliminar foto de Cloudinary: ' . $e->getMessage());
            }
        }

        $alumno->tecnologias()->detach();
        $alumno->experiencias()->delete();
        $user->delete();
        $alumno->delete();

        return response()->json([
            'success' => true,
            'message' => 'Alumno, usuario y foto eliminados correctamente.'
        ], 204);
    }


    /**
     * Verificar el alumno (ej: al registrarse)
     *
     * @param Alumno $alumno
     * @return \Illuminate\Http\JsonResponse
     */
    // Método para verificar el alumno
    public function verify(Alumno $alumno)
    {
        // Verificar si ya está verificado
        if (!$alumno->is_verified) {
            $alumno->is_verified = true;
            $alumno->save();

            // Enviar correo de confirmación
            Mail::to($alumno->user->email)->send(new AlumnoVerificado($alumno));
        }

        // Responder con éxito y los datos del alumno
        return response()->json([
            'success' => true,
            'message' => 'Alumno verificado correctamente.',
            'data' => $alumno
        ]);
    }

    /**
     * Rechazar el alumno (ej: al registrarse)
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    // Método para rechazar el alumno
    public function rechazar($id)
    {
        $user = request()->user();
        $role = $user->role ?? $user->user->role ?? null;

        if (!in_array($role, ['profesor', 'admin'])) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $alumno = Alumno::findOrFail($id);

        // Enviar aviso antes de eliminar
        Mail::to($alumno->user->email)->send(new AlumnoRechazado($alumno));

        $alumno->user()->delete(); // elimina también el usuario asociado
        $alumno->delete();         // y elimina el alumno

        return response()->json(['message' => 'Alumno rechazado y eliminado']);
    }


    /**
     * Obtener alumnos no verificados (solo para admin y profesor)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    // Método para obtener alumnos no verificados
    public function noVerificados(Request $request)
    {
        $user = $request->user();

        $role = method_exists($user, 'user') && $user->user ? $user->user->role : $user->role;

        if (!in_array($role, ['profesor', 'admin'])) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $alumnos = Alumno::with('user')
            ->where('is_verified', 0)
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['data' => $alumnos]);
    }
}
