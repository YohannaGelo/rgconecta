<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Experiencia;

class ExperienciaController extends Controller
{
    // GET /api/admin/experiencias
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Experiencia::with(['alumno.user:id,name', 'empresa:id,nombre'])
                ->orderBy('id')
                ->get()
        ]);
    }

    // POST /api/admin/experiencias
    public function store(Request $request)
    {
        $validated = $request->validate([
            'alumno_id' => 'required|exists:alumnos,id',
            'empresa_id' => 'required|exists:empresas,id',
            'puesto' => 'required|string|max:255',
            'fecha_inicio' => 'required|digits:4|integer|min:1900|max:' . date('Y'),
            'fecha_fin' => 'nullable|digits:4|integer|min:1900|max:' . date('Y'),
            'descripcion' => 'nullable|string',
        ]);

        $experiencia = Experiencia::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Experiencia creada correctamente.',
            'data' => $experiencia->load(['alumno.user', 'empresa'])
        ], 201);
    }

    // PUT /api/admin/experiencias/{experiencia}
    public function update(Request $request, Experiencia $experiencia)
    {
        $validated = $request->validate([
            'puesto' => 'required|string|max:255',
            'fecha_inicio' => 'required|digits:4|integer|min:1900|max:' . date('Y'),
            'fecha_fin' => 'nullable|digits:4|integer|min:1900|max:' . date('Y'),
            'descripcion' => 'nullable|string',
        ]);

        $experiencia->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Experiencia actualizada correctamente.',
            'data' => $experiencia
        ]);
    }

    // DELETE /api/admin/experiencias/{experiencia}
    public function destroy(Experiencia $experiencia)
    {
        $experiencia->delete();

        return response()->json([
            'success' => true,
            'message' => 'Experiencia eliminada correctamente.'
        ]);
    }
}
