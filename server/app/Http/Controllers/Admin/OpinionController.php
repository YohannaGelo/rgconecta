<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Opinion;

class OpinionController extends Controller
{
    // GET /api/admin/opiniones
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Opinion::with(['empresa:id,nombre', 'user:id,name'])->orderBy('id')->get()
        ]);
    }

    // POST /api/admin/opiniones
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'empresa_id' => 'required|exists:empresas,id',
            'contenido' => 'required|string',
            'valoracion' => 'required|integer|min:1|max:5',
            'anios_en_empresa' => 'nullable|integer|min:0',
        ]);

        $opinion = Opinion::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Opinión creada correctamente.',
            'data' => $opinion->load(['empresa', 'user'])
        ], 201);
    }

    // PUT /api/admin/opiniones/{opinion}
    public function update(Request $request, Opinion $opinion)
    {
        $validated = $request->validate([
            'contenido' => 'required|string',
            'valoracion' => 'required|integer|min:1|max:5',
            'anios_en_empresa' => 'nullable|integer|min:0',
        ]);

        $opinion->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Opinión actualizada correctamente.',
            'data' => $opinion
        ]);
    }

    // DELETE /api/admin/opiniones/{opinion}
    public function destroy(Opinion $opinion)
    {
        $opinion->delete();

        return response()->json([
            'success' => true,
            'message' => 'Opinión eliminada correctamente.'
        ]);
    }
}
