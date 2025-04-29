<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use App\Models\Experiencia;

use Illuminate\Http\Request;

class ExperienciaController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'alumno_id' => 'required|integer|exists:alumnos,id',
            'empresa_id' => 'nullable|integer|exists:empresas,id',
            'empresa_nombre' => 'nullable|string|required_without:empresa_id|max:255',
            'sector' => 'required_if:empresa_id,null|string|in:tecnologia,educacion,salud,otros',
            'puesto' => 'required|string|max:255',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'nullable|date|after:fecha_inicio',
            'descripcion' => 'nullable|string',
        ]);

        // Obtener o crear empresa
        $empresa = $validated['empresa_id']
            ? Empresa::find($validated['empresa_id'])
            : Empresa::firstOrCreate(
                ['nombre' => $validated['empresa_nombre']],
                ['sector' => $validated['sector']]
            );

        // Crear experiencia
        $experiencia = Experiencia::create([
            'alumno_id' => $validated['alumno_id'],
            'empresa_id' => $empresa->id,
            'puesto' => $validated['puesto'],
            'fecha_inicio' => $validated['fecha_inicio'],
            'fecha_fin' => $validated['fecha_fin'] ?? null,
            'descripcion' => $validated['descripcion'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'data' => $experiencia->load('empresa'),
        ], 201);
    }
}
