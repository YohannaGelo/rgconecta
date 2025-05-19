<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Profesor;

class ProfesorController extends Controller
{
    // GET /api/admin/profesores
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Profesor::with('user:id,name,email,role')->orderBy('id')->get()
        ]);
    }

    // PUT /api/admin/profesores/{profesor}
    public function update(Request $request, Profesor $profesor)
    {
        $validated = $request->validate([
            'departamento' => 'required|string|max:255',
        ]);

        $profesor->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profesor actualizado correctamente.',
            'data' => $profesor
        ]);
    }

    // DELETE /api/admin/profesores/{profesor}
    public function destroy(Profesor $profesor)
    {
        $profesor->delete();

        return response()->json([
            'success' => true,
            'message' => 'Profesor eliminado correctamente.'
        ]);
    }
}
