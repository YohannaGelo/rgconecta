<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Oferta;
use App\Models\Empresa;
use App\Enums\SectorEmpresa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Interfaces\RoleCheck;


class OfertaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // Listar ofertas
    public function index()
    {
        return Oferta::with(['tecnologias', 'empresa:id,nombre'])
            ->select(['id', 'titulo', 'empresa_id', 'jornada', 'localizacion', 'fecha_publicacion'])
            ->paginate(8);
    }

    /**
     * Store a newly created resource in storage.
     */
    // Crear una nueva oferta
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'empresa_id' => 'nullable|integer|exists:empresas,id',
            'sobre_empresa' => 'nullable|string|required_without:empresa_id',
            'sector' => 'required_if:empresa_id,null|string|in:' . implode(',', SectorEmpresa::values()),
            'jornada' => 'required|in:completa,media_jornada,3_6_horas,menos_3_horas',
            'localizacion' => 'required|string',
            'tecnologias' => 'nullable|array',
            'fecha_expiracion' => 'required|date|after:today',
        ]);

        // Gestionar empresa
        $empresa = $request->empresa_id
            ? Empresa::find($request->empresa_id)
            : Empresa::firstOrCreate(['nombre' => $validated['sobre_empresa']], ['sector' => $validated['sector']]);

        // Crear oferta (con usuario autenticado)
        $oferta = Oferta::create([
            ...$validated,
            'empresa_id' => $empresa->id,
            'user_id' => Auth::id(),
            'fecha_publicacion' => now(),
        ]);

        if ($request->tecnologias) {
            $oferta->tecnologias()->attach($request->tecnologias);
        }

        return response()->json($oferta->load(['tecnologias', 'empresa']), 201);
    }

    /**
     * Display the specified resource.
     */
    // Mostrar una oferta específica
    public function show(Oferta $oferta)
    {
        // return response()->json($oferta->load('tecnologias'));

        // Solo usuarios autenticados ven detalles completos
        return response()->json(
            $oferta->load(['tecnologias', 'empresa', 'user:id,name'])
        );
    }

    /**
     * Update the specified resource in storage.
     */
    // Actualizar una oferta
    public function update(Request $request, Oferta $oferta)
    {
        // Validación (similar a store())
        $validated = $request->validate([
            'titulo' => 'sometimes|string|max:255',
            'descripcion' => 'sometimes|string',
            'jornada' => 'sometimes|in:completa,media_jornada,3_6_horas,menos_3_horas',
            'localizacion' => 'sometimes|string',
            'tecnologias' => 'nullable|array',
            'fecha_expiracion' => 'sometimes|date|after:today',
        ]);

        // Actualizar campos
        $oferta->update($validated);

        // Sync tecnologías
        if ($request->has('tecnologias')) {
            $oferta->tecnologias()->sync($request->tecnologias);
        }

        return response()->json($oferta->fresh()->load('tecnologias', 'empresa'));
    }

    /**
     * Remove the specified resource from storage.
     */
    // Eliminar una oferta
    public function destroy(Oferta $oferta)
    {
        // Validar que el usuario es el creador o admin
        if (Auth::id() !== $oferta->user_id && !(Auth::user() instanceof RoleCheck && Auth::user()->isAdmin())) {
            return response()->json(['message' => 'No autorizado'], 403);
        }


        $oferta->delete();
        return response()->json(null, 204);
    }
}