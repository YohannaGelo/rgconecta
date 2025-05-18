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
        $opiniones = Opinion::with(['user:id,name,role', 'empresa:id,nombre'])
            ->whereHas('user.alumno', function ($query) {
                $query->where('is_verified', 1);
            })
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
        return $empresa->opiniones()
            ->whereHas('user.alumno', function ($query) {
                $query->where('is_verified', 1);
            })
            ->with('alumno.user')
            ->latest()
            ->paginate(10);
    }



    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 403);
        }

        DB::beginTransaction();

        try {
            // Manejo de empresa (nueva o existente)
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
                $empresaId = $request->input('empresa_id');
            }

            $validated = $request->validate([
                'contenido' => 'required|string|max:500',
                'valoracion' => 'required|integer|between:1,5',
                'anios_en_empresa' => 'nullable|numeric|min:0'
            ]);

            // Validar que el usuario no haya opinado antes sobre esa empresa
            if ($user->opiniones()->where('empresa_id', $empresaId)->exists()) {
                return response()->json([
                    'message' => 'Ya has opinado sobre esta empresa'
                ], 422);
            }

            $opinion = Opinion::create([
                'user_id' => $user->id,
                'empresa_id' => $empresaId,
                'contenido' => $validated['contenido'],
                'valoracion' => $validated['valoracion'],
                'anios_en_empresa' => $validated['anios_en_empresa'] ?? 0
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Opinión creada correctamente.',
                'data' => $opinion->load('user', 'empresa')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error al guardar la opinión',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
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
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'No estás registrado como alumno'], 403);
        }

        $opiniones = $user->opiniones()->with('empresa')->latest()->get();

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
