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

        return $query->paginate(8);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            // 1. Crear usuario
            $user = User::create([
                'name' => $request->user['name'],
                'email' => $request->user['email'],
                'password' => Hash::make('password')
            ]);

            // 2. Crear alumno
            $alumno = Alumno::create([
                'user_id' => $user->id,
                'fecha_nacimiento' => $request->fecha_nacimiento,
                'situacion_laboral' => $request->situacion_laboral,
                'foto_perfil' => $request->foto_perfil ?? null,
                'is_verified' => $request->is_verified ?? false,
                'promocion' => $request->promocion ?? null,
            ]);

            // 3. TÍTULOS
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

            // 4. TECNOLOGÍAS
            foreach ($request->tecnologias as $tecno) {
                $tecnologia = Tecnologia::firstOrCreate([
                    'nombre' => $tecno['nombre'],
                    'tipo' => $tecno['tipo']
                ]);

                $nivel = $tecno['pivot']['nivel'];

                // Validar el nivel según el tipo
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

            // 5. EXPERIENCIAS
            foreach ($request->experiencias as $exp) {
                $empresa = Empresa::firstOrCreate([
                    'nombre' => $exp['empresa']['nombre']
                ], [
                    'sector' => $exp['empresa']['sector'] ?? null,
                    'web' => $exp['empresa']['web'] ?? null
                ]);

                $alumno->experiencias()->create([
                    'empresa_id' => $empresa->id,
                    'puesto' => $exp['puesto'],
                    'fecha_inicio' => $exp['fecha_inicio'],
                    'fecha_fin' => $exp['fecha_fin']
                ]);
            }

            DB::commit();

            return response()->json($alumno->load(['user', 'titulos', 'tecnologias', 'experiencias']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al crear el alumno', 'message' => $e->getMessage()], 500);
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



    // public function update(Request $request, Alumno $alumno)
    // {
    //     $validated = $request->validate([
    //         'situacion_laboral' => 'sometimes|in:trabajando,buscando_empleo,desempleado',
    //         'tecnologias' => 'sometimes|array', // Formato: [ [id, nivel], ... ]
    //         'titulo_profesional' => 'sometimes|string|max:100',
    //         'promocion' => 'sometimes|string|max:9', // Formato: "AAAA/AAAA"
    //         'experiencias' => 'sometimes|array'  // Formato: [ {empresa_id, puesto, fecha_inicio...} ]
    //     ]);

    //     if (isset($validated['tecnologias'])) {
    //         $syncData = [];
    //         foreach ($validated['tecnologias'] as $tech) {
    //             $syncData[$tech['id']] = ['nivel' => $tech['nivel']];
    //         }
    //         $alumno->tecnologias()->sync($syncData);
    //     }

    //     if (isset($validated['experiencias'])) {
    //         $alumno->experiencias()->delete(); // Eliminar existentes
    //         $alumno->experiencias()->createMany($validated['experiencias']);
    //     }


    //     $alumno->update($validated);
    //     return response()->json($alumno->fresh()->load(['tecnologias', 'experiencias']));
    // }

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
        ]);
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
            'data' => $alumno
        ]);
    }
}
