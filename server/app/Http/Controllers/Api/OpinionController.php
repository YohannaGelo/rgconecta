<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Opinion;
use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class OpinionController extends Controller
{
    use AuthorizesRequests;
    // Listar opiniones (público)
    public function index()
    {
        return Opinion::with(['alumno.user:id,name', 'empresa:id,nombre'])
            ->latest()
            ->paginate(10);
    }

    // Listar opiniones de una empresa (público)
    public function indexByEmpresa(Empresa $empresa)
    {
        return $empresa->opiniones()->with('alumno.user')->latest()->paginate(10);
    }

    // Crear opinión (alumno/profesor/admin)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'empresa_id' => 'required|exists:empresas,id',
            'contenido' => 'required|string|max:500',
            'valoracion' => 'required|integer|between:1,5',
            'años_en_empresa' => 'nullable|numeric|min:0'
        ]);

        // Validar que el alumno no haya opinado antes
        if (Auth::user()->alumno->opiniones()->where('empresa_id', $request->empresa_id)->exists()) {
            return response()->json([
                'message' => 'Ya has opinado sobre esta empresa'
            ], 422);
        }

        $opinion = Auth::user()->alumno->opiniones()->create($validated);

        return response()->json($opinion->load('alumno.user'), 201);
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

        return response()->json($opinion);
    }

    // Eliminar opinión (autor/profesor/admin)
    public function destroy(Opinion $opinion)
    {
        $this->authorize('delete', $opinion);
        $opinion->delete();
        return response()->noContent();
    }
}
