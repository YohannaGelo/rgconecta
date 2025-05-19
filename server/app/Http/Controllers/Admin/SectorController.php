<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sector;

class SectorController extends Controller
{
    // GET /api/admin/sectores
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Sector::orderBy('nombre')->get()
        ]);
    }

    // POST /api/admin/sectores
    public function store(Request $request)
    {
        $validated = $request->validate([
            'clave' => 'required|string|max:255|unique:sectores,clave',
            'nombre' => 'required|string|max:255'
        ]);

        $sector = Sector::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Sector creado correctamente.',
            'data' => $sector
        ], 201);
    }

    // PUT /api/admin/sectores/{sector}
    public function update(Request $request, Sector $sector)
    {
        $validated = $request->validate([
            'clave' => 'required|string|max:255|unique:sectores,clave,' . $sector->id,
            'nombre' => 'required|string|max:255'
        ]);

        $sector->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Sector actualizado correctamente.',
            'data' => $sector->fresh()
        ]);
    }

    // DELETE /api/admin/sectores/{sector}
    public function destroy(Sector $sector)
    {
        // (opcional) Validar que no esté siendo usado
        if ($sector->empresas()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar un sector con empresas asociadas.'
            ], 409);
        }

        $sector->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sector eliminado correctamente.'
        ]);
    }
}