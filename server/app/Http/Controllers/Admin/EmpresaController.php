<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Empresa;

class EmpresaController extends Controller
{
    // GET /api/admin/empresas
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Empresa::orderBy('id')->get()
        ]);
    }

    // POST /api/admin/empresas
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:empresas,nombre',
            'sector' => 'nullable|string|max:255',
            'web' => 'nullable|url',
        ]);

        $empresa = Empresa::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Empresa creada correctamente.',
            'data' => $empresa
        ], 201);
    }

    // PUT /api/admin/empresas/{empresa}
    public function update(Request $request, Empresa $empresa)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:empresas,nombre,' . $empresa->id,
            'sector' => 'nullable|string|max:255',
            'web' => 'nullable|url',
        ]);

        $empresa->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Empresa actualizada correctamente.',
            'data' => $empresa
        ]);
    }

    // DELETE /api/admin/empresas/{empresa}
    public function destroy(Empresa $empresa)
    {
        $empresa->delete();

        return response()->json([
            'success' => true,
            'message' => 'Empresa eliminada correctamente.'
        ]);
    }
}
