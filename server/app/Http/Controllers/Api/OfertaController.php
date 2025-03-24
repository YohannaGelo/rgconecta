<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Oferta;
use Illuminate\Http\Request;

class OfertaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // Obtener todas las ofertas (con tecnologías)
    public function index()
    {
        $ofertas = Oferta::with('tecnologias')->get();
        return response()->json($ofertas);
    }

    /**
     * Store a newly created resource in storage.
     */
    // Crear una nueva oferta
    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'empresa_nombre' => 'required|string',
            'jornada' => 'required|in:completa,media_jornada,3_6_horas,menos_3_horas',
            'localizacion' => 'required|string',
            'tecnologias' => 'nullable|array', // IDs de tecnologías con niveles
        ]);

        $oferta = Oferta::create($request->except('tecnologias'));

        // Asignar tecnologías si existen
        if ($request->tecnologias) {
            $oferta->tecnologias()->attach($request->tecnologias);
        }

        return response()->json($oferta->load('tecnologias'), 201);
    }

    /**
     * Display the specified resource.
     */
    // Mostrar una oferta específica
    public function show(Oferta $oferta)
    {
        return response()->json($oferta->load('tecnologias'));
    }

    /**
     * Update the specified resource in storage.
     */
    // Actualizar una oferta
    public function update(Request $request, Oferta $oferta)
    {
        $oferta->update($request->except('tecnologias'));

        // Sync tecnologías (actualiza las relaciones)
        if ($request->tecnologias) {
            $oferta->tecnologias()->sync($request->tecnologias);
        }

        return response()->json($oferta->load('tecnologias'));
    }

    /**
     * Remove the specified resource from storage.
     */
    // Eliminar una oferta
    public function destroy(Oferta $oferta)
    {
        $oferta->delete();
        return response()->json(null, 204);
    }
}
