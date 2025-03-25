<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use Illuminate\Http\Request;

class EmpresaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // app/Http/Controllers/Api/EmpresaController.php
    public function index()
    {
        $empresas = Empresa::withCount(['ofertas', 'opiniones'])
            ->with('ofertas') // Opcional: carga relaciones necesarias
            ->paginate(8); // Justo el número que necesitas para el front (8)

        return response()->json([
            'success' => true,
            'data' => $empresas->items(),
            'pagination' => [
                'total' => $empresas->total(),
                'current_page' => $empresas->currentPage(),
                'per_page' => $empresas->perPage(),
                'last_page' => $empresas->lastPage(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id) {
        $empresa = Empresa::with(['ofertas', 'opiniones.alumno.user:id,name'])
            ->findOrFail($id);
    
        return response()->json([
            'success' => true,
            'data' => $empresa,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Empresa $empresa)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Empresa $empresa)
    {
        //
    }
}
