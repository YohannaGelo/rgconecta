<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Opinion;
use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\DB;


class OpinionController extends Controller
{
    use AuthorizesRequests;
    // Listar opiniones (público)
    public function index()
    {
        $opiniones = Opinion::with(['alumno.user:id,name', 'empresa:id,nombre'])
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Opiniones obtenidas correctamente.',
            'data' => $opiniones->items(),
            'pagination' => $opiniones->only(['total', 'current_page', 'per_page', 'last_page']),
        ]);
    }

    // Listar opiniones de una empresa (público)
    public function indexByEmpresa(Empresa $empresa)
    {
        return $empresa->opiniones()->with('alumno.user')->latest()->paginate(10);
    }

    public function store(Request $request)
    {
        // $alumno = Auth::user()->alumno;

        // if (!$alumno) {
        //     return response()->json(['message' => 'El usuario no está registrado como alumno'], 403);
        // }
        $user = Auth::user();

        // Detectar si es alumno o profesor
        $alumno = $user->alumno;
        $profesor = $user->profesor;

        if (!$alumno && !$profesor) {
            return response()->json(['message' => 'Solo alumnos o profesores pueden dejar opiniones'], 403);
        }

        // Definir el autor de la opinión
        // $autorType = $alumno ? 'alumno' : 'profesor';
        // $autorId = $alumno ? $alumno->id : $profesor->id;


        DB::beginTransaction();

        try {
            // Si viene una empresa nueva, buscarla o crearla
            if ($request->has('empresa')) {
                $empresaData = $request->input('empresa');

                $empresa = Empresa::firstOrCreate(
                    ['nombre' => $empresaData['nombre']],
                    [
                        'sector' => $empresaData['sector'] ?? null,
                        'web' => $empresaData['web'] ?? null,
                        'descripcion' => $empresaData['descripcion'] ?? null
                    ]
                );

                $empresaId = $empresa->id;
            } else {
                // Si viene empresa_id directamente
                $empresaId = $request->input('empresa_id');
            }

            // Validación común
            $validated = $request->validate([
                'contenido' => 'required|string|max:500',
                'valoracion' => 'required|integer|between:1,5',
                'anios_en_empresa' => 'nullable|numeric|min:0'
            ]);

            if (!$empresaId) {
                return response()->json(['message' => 'No se pudo determinar la empresa'], 422);
            }

            // Validar que no haya opinado antes
            if ($alumno->opiniones()->where('empresa_id', $empresaId)->exists()) {
                return response()->json([
                    'message' => 'Ya has opinado sobre esta empresa'
                ], 422);
            }

            // Crear la opinión
            $opinion = $alumno->opiniones()->create([
                'empresa_id' => $empresaId,
                'contenido' => $validated['contenido'],
                'valoracion' => $validated['valoracion'],
                'anios_en_empresa' => $validated['anios_en_empresa'] ?? null
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Opinión creada correctamente.',
                'data' => $opinion->load('alumno.user', 'empresa')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error al guardar la opinión',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // Actualizar opinión (autor/profesor/admin)
    public function update(Request $request, Opinion $opinion)
    {

        $this->authorize('update', $opinion);

        $validated = $request->validate([
            'contenido' => 'sometimes|string|max:500',
            'valoracion' => 'sometimes|integer|between:1,5'
        ]);

        $opinion->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Opinión actualizada correctamente.',
            'data' => $opinion
        ]);
    }

    public function misOpiniones(Request $request)
    {
        $alumno = Auth::user()->alumno;

        if (!$alumno) {
            return response()->json(['message' => 'No estás registrado como alumno'], 403);
        }

        $opiniones = $alumno->opiniones()->with('empresa')->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Opiniones del usuario obtenidas correctamente.',
            'data' => $opiniones
        ]);
    }


    // Eliminar opinión (autor/profesor/admin)
    public function destroy(Opinion $opinion)
    {
        $this->authorize('delete', $opinion);
        $opinion->delete();

        return response()->json([
            'success' => true,
            'message' => 'Opinión eliminada correctamente.'
        ], 204);
    }
}
