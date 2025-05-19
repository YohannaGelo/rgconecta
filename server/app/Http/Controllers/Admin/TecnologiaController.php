<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tecnologia;

class TecnologiaController extends Controller
{
    // GET /api/admin/tecnologias
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Tecnologia::orderBy('id')->get()
        ]);
    }

    // POST /api/admin/tecnologias
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo' => 'required|in:frontend,backend,fullstack,database,devops,ofimatica,idioma,marketing,gestion,disenio,otros',
        ]);

        $tecnologia = Tecnologia::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tecnología creada correctamente.',
            'data' => $tecnologia
        ], 201);
    }

    // PUT /api/admin/tecnologias/{tecnologia}
    public function update(Request $request, Tecnologia $tecnologia)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:tecnologias,nombre,' . $tecnologia->id . ',id,tipo,' . $tecnologia->tipo,
            'tipo' => 'required|in:frontend,backend,fullstack,database,devops,ofimatica,idioma,marketing,gestion,disenio,otros',
        ]);

        $tecnologia->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tecnología actualizada correctamente.',
            'data' => $tecnologia
        ]);
    }

    // DELETE /api/admin/tecnologias/{tecnologia}
    public function destroy(Tecnologia $tecnologia)
    {
        $tecnologia->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tecnología eliminada correctamente.'
        ]);
    }
}
