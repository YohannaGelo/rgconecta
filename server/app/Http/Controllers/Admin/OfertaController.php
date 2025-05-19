<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Oferta;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class OfertaController extends Controller
{
    // GET /api/admin/ofertas
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Oferta::with(['empresa:id,nombre', 'tecnologias', 'titulacion:id,nombre'])
                ->orderBy('id')
                ->get()
        ]);
    }

    // POST /api/admin/ofertas
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'empresa_id' => 'required|exists:empresas,id',
            'jornada' => ['required', Rule::in(['completa', 'media_jornada', '3_6_horas', 'menos_3_horas'])],
            'titulacion_id' => 'nullable|exists:titulos,id',
            'anios_experiencia' => 'nullable|integer|min:0',
            'localizacion' => 'required|string',
            'fecha_expiracion' => 'required|date|after:today',
            'tecnologias' => 'nullable|array',
        ]);

        $oferta = Oferta::create([
            ...$validated,
            'user_id' => Auth::id(),// o un user_id fijo si lo crea el admin
            'fecha_publicacion' => now(),
        ]);

        if ($request->tecnologias) {
            $oferta->tecnologias()->attach($request->tecnologias);
        }

        return response()->json([
            'success' => true,
            'message' => 'Oferta creada correctamente.',
            'data' => $oferta->load(['empresa', 'tecnologias', 'titulacion'])
        ], 201);
    }

    // PUT /api/admin/ofertas/{oferta}
    public function update(Request $request, Oferta $oferta)
    {
        $validated = $request->validate([
            'titulo' => 'sometimes|string|max:255',
            'descripcion' => 'sometimes|string',
            'jornada' => ['sometimes', Rule::in(['completa', 'media_jornada', '3_6_horas', 'menos_3_horas'])],
            'titulacion_id' => 'nullable|exists:titulos,id',
            'anios_experiencia' => 'nullable|integer|min:0',
            'localizacion' => 'sometimes|string',
            'fecha_expiracion' => 'sometimes|date|after:today',
            'tecnologias' => 'nullable|array',
        ]);

        $oferta->update($validated);

        if ($request->has('tecnologias')) {
            $oferta->tecnologias()->sync($request->tecnologias);
        }

        return response()->json([
            'success' => true,
            'message' => 'Oferta actualizada correctamente.',
            'data' => $oferta->load(['empresa', 'tecnologias', 'titulacion'])
        ]);
    }

    // DELETE /api/admin/ofertas/{oferta}
    public function destroy(Oferta $oferta)
    {
        $oferta->tecnologias()->detach();
        $oferta->delete();

        return response()->json([
            'success' => true,
            'message' => 'Oferta eliminada correctamente.'
        ]);
    }
}
