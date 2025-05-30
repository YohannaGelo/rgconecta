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
            'data' => Empresa::with('sector')->orderBy('id')->get()
        ]);
    }

    // POST /api/admin/empresas
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:empresas,nombre',
            'sector_id' => 'required|exists:sectores,id',
            'web' => 'nullable|url',
        ]);

        $empresa = Empresa::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Empresa creada correctamente.',
            'data' => $empresa->load('sector'),
        ], 201);
    }

    // PUT /api/admin/empresas/{empresa}
    public function update(Request $request, Empresa $empresa)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:empresas,nombre,' . $empresa->id,
            'sector_id' => 'required|exists:sectores,id',
            'web' => 'nullable|url',
        ]);

        $empresa->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Empresa actualizada correctamente.',
            'data' => $empresa->fresh()->load('sector'),
        ]);
    }

    // DELETE /api/admin/empresas/{empresa}
    public function destroy(Empresa $empresa)
    {
        // Validar que la empresa no tenga ofertas u opiniones asociadas
        if ($empresa->ofertas()->exists() || $empresa->opiniones()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar la empresa porque tiene ofertas u opiniones asociadas.'
            ], 422);
        }

        $empresa->delete();

        return response()->json([
            'success' => true,
            'message' => 'Empresa eliminada correctamente.'
        ], 204);
    }
}
