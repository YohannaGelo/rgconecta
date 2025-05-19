<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Titulo;

class TituloController extends Controller
{
    // GET /api/admin/titulos
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Titulo::orderBy('id', 'asc')->get()
        ]);
    }

    // POST /api/admin/titulos
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:titulos,nombre',
            'tipo' => 'required|in:ciclo_medio,ciclo_superior,grado_universitario,master,doctorado,otros'
        ]);

        $titulo = Titulo::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Titulación creada correctamente.',
            'data' => $titulo
        ], 201);
    }

    // PUT /api/admin/titulos/{id}
    public function update(Request $request, Titulo $titulo)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:titulos,nombre,' . $titulo->id,
            'tipo' => 'required|in:ciclo_medio,ciclo_superior,grado_universitario,master,doctorado,otros'
        ]);

        $titulo->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Titulación actualizada correctamente.',
            'data' => $titulo
        ]);
    }

    // DELETE /api/admin/titulos/{id}
    public function destroy(Titulo $titulo)
    {
        $titulo->delete();

        return response()->json([
            'success' => true,
            'message' => 'Titulación eliminada correctamente.'
        ]);
    }
}
