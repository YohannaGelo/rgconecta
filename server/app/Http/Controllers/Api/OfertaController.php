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
use Illuminate\Validation\Rule;


class OfertaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // Listar ofertas
    public function index()
    {
        return Oferta::with(['tecnologias', 'empresa:id,nombre,sector'])
            ->select(['id', 'titulo', 'empresa_id', 'jornada', 'localizacion', 'fecha_publicacion', 'fecha_expiracion'])
            ->paginate(8);

        return response()->json([
            'success' => true,
            'message' => 'Ofertas obtenidas correctamente.',
            'data' => $ofertas->items(),
            'pagination' => $ofertas->only(['total', 'current_page', 'per_page', 'last_page']),
        ]);
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
            // 'sector' => 'required_if:empresa_id,null|string|in:' . implode(',', SectorEmpresa::values()),
            'sector' => ['required_if:empresa_id,null', 'string', Rule::in(Empresa::SECTORES)],
            'web' => 'nullable|url|required_if:empresa_id,null',
            'jornada' => 'required|in:completa,media_jornada,3_6_horas,menos_3_horas',
            'anios_experiencia' => 'nullable|integer|min:0',
            'localizacion' => 'required|string',
            'tecnologias' => 'nullable|array',
            'fecha_expiracion' => 'required|date|after:today',
        ]);

        // Gestionar empresa
        $empresa = $request->empresa_id
            ? Empresa::find($request->empresa_id)
            : Empresa::firstOrCreate(['nombre' => $validated['sobre_empresa']], ['sector' => $validated['sector'], 'web' => $validated['web'] ?? null]);

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

        return response()->json([
            'success' => true,
            'message' => 'Oferta creada correctamente.',
            'data' => $oferta->load(['tecnologias', 'empresa'])
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    // Mostrar una oferta específica
    public function show(Oferta $oferta)
    {
        // return response()->json($oferta->load('tecnologias'));

        // Solo usuarios autenticados ven detalles completos
        return response()->json([ // Añadido mensaje de éxito
            'success' => true,
            'message' => 'Oferta obtenida correctamente.',
            'data' => $oferta->load(['tecnologias', 'empresa', 'user:id,name']),
        ]);
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

        return response()->json([
            'success' => true,
            'message' => 'Oferta actualizada correctamente.',
            'data' => $oferta->fresh()->load('tecnologias', 'empresa')
        ]);
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
        return response()->json([
            'success' => true,
            'message' => 'Oferta eliminada correctamente.',
        ], 204);
    }
}
