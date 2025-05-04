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



class AlumnoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // Obtener todos los alumnos (con relaciones opcionales)
    public function index(Request $request)
    {
        $query = Alumno::with(['user:id,name', 'tecnologias:nombre'])
            ->select(['id', 'user_id', 'situacion_laboral']);

        if ($request->filled('tecnologia')) {
            $query->whereHas('tecnologias', function ($q) use ($request) {
                $q->where('nombre', 'like', '%' . $request->tecnologia . '%');
            });
        }

        // Paginación
        $alumnos = $query->paginate(8);

        return response()->json([
            'success' => true,
            'data' => $alumnos->items(),
            'pagination' => $alumnos->only(['total', 'current_page', 'per_page', 'last_page']),
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
            // 'foto_perfil' => 'nullable|string',
            'user.foto_perfil' => 'nullable|string',

            'titulos' => 'array',
            'titulos.*.nombre' => 'required|string',
            'titulos.*.tipo' => 'required|string',
            'titulos.*.pivot.año_inicio' => 'required|string',
            'titulos.*.pivot.año_fin' => 'required|string',
            'titulos.*.pivot.institucion' => 'required|string',

            'tecnologias' => 'array',
            'tecnologias.*.nombre' => 'required|string',
            'tecnologias.*.tipo' => 'required|string',
            'tecnologias.*.pivot.nivel' => 'required|string',

            'experiencias' => 'array',
            'experiencias.*.empresa.nombre' => 'required|string',
            'experiencias.*.empresa.sector' => ['nullable', 'string', Rule::in(Empresa::SECTORES)],
            'experiencias.*.puesto' => 'required|string',
            'experiencias.*.fecha_inicio' => 'required|date',
            'experiencias.*.fecha_fin' => 'nullable|date',
        ]);

        DB::beginTransaction();

        try {
            // 1. Crear usuario
            $user = User::create([
                'name' => $request->user['name'],
                'email' => $request->user['email'],
                'password' => Hash::make($request->user['password']),
                'role' => 'alumno',
                'user.foto_perfil' => $request->user['foto_perfil'] ?? null,

            ]);

            // 2. Crear alumno
            $alumno = Alumno::create([
                'user_id' => $user->id,
                'fecha_nacimiento' => $request->fecha_nacimiento,
                'situacion_laboral' => $request->situacion_laboral,
                // 'foto_perfil' => $request->foto_perfil ?? null,
                'is_verified' => $request->is_verified ?? false,
                'promocion' => $request->promocion ?? null,
            ]);

            // 3. Títulos
            foreach ($request->titulos as $titulo) {
                $tituloModel = Titulo::firstOrCreate([
                    'nombre' => $titulo['nombre'],
                    'tipo' => $titulo['tipo']
                ]);

                $alumno->titulos()->attach($tituloModel->id, [
                    'año_inicio' => $titulo['pivot']['año_inicio'],
                    'año_fin' => $titulo['pivot']['año_fin'],
                    'institucion' => $titulo['pivot']['institucion'],
                ]);
            }

            // 4. Tecnologías
            foreach ($request->tecnologias as $tecno) {
                $tecnologia = Tecnologia::firstOrCreate([
                    'nombre' => $tecno['nombre'],
                    'tipo' => $tecno['tipo']
                ]);

                $nivel = $tecno['pivot']['nivel'];

                // Validar nivel según tipo
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

            // 5. Experiencias
            foreach ($request->experiencias as $exp) {
                $empresa = Empresa::firstOrCreate(
                    ['nombre' => $exp['empresa']['nombre']],
                    [
                        'sector' => $exp['empresa']['sector'] ?? null,
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
                'user:id,name,email',
                'titulos',
                'tecnologias',
                'opiniones.empresa:id,nombre',
                'experiencias.empresa:id,nombre'
            ])
        );
    }

    /**
     * Update the specified resource in storage.
     */
    // Actualizar perfil de alumno (ej: tecnologías o situación laboral)
    public function update(Request $request, Alumno $alumno)
    {
        // 1. Validación con todos los campos posibles
        $validated = $request->validate([
            'fecha_nacimiento' => 'sometimes|date',
            'situacion_laboral' => 'sometimes|in:trabajando,buscando_empleo,desempleado',
            'promocion' => 'sometimes|string|max:9',
            'titulo_profesional' => 'sometimes|string|max:100',
            'tecnologias' => 'sometimes|array',
            'experiencias' => 'sometimes|array'
        ]);

        // 2. Debug: Ver datos recibidos
        // \Log::info('Datos recibidos para actualización:', $validated);

        // 3. Actualizar relaciones si existen
        if (isset($validated['tecnologias'])) {
            $syncData = collect($validated['tecnologias'])
                ->mapWithKeys(fn($tech) => [$tech['id'] => ['nivel' => $tech['nivel']]])
                ->toArray();
            $alumno->tecnologias()->sync($syncData);
            unset($validated['tecnologias']);
        }

        if (isset($validated['experiencias'])) {
            $alumno->experiencias()->delete();
            $alumno->experiencias()->createMany($validated['experiencias']);
            unset($validated['experiencias']);
        }

        // 4. Actualizar campos directos (SOLUCIÓN CLAVE)
        if (!empty($validated)) {
            $alumno->fill($validated);

            // Debug: Ver cambios detectados
            // \Log::info('Cambios detectados:', $alumno->getDirty());

            if ($alumno->isDirty()) {
                $alumno->save();
            }
        }

        // 5. Respuesta con datos frescos
        return response()->json([
            'message' => 'Alumno actualizado correctamente',
            'changes' => $alumno->getChanges(),
            'data' => $alumno->fresh()->load(['user', 'tecnologias', 'experiencias'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Alumno $alumno)
    {
        // Eliminar relaciones relacionadas
        $alumno->tecnologias()->detach();         // Eliminar tecnologías de la tabla pivote
        $alumno->experiencias()->delete();        // Eliminar experiencias asociadas

        // Eliminar el usuario relacionado
        $alumno->user()->delete();

        // Eliminar el alumno
        $alumno->delete();

        return response()->json([
            'success' => true,
            'message' => 'Alumno y usuario asociado eliminados correctamente.'
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
        }

        // Responder con éxito y los datos del alumno
        return response()->json([
            'success' => true,
            'message' => 'Alumno verificado correctamente.',
            'data' => $alumno
        ]);
    }
}
