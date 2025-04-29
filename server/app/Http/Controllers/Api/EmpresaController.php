<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use App\Enums\SectorEmpresa;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;


class EmpresaController extends Controller
{

    
    /**
     * Display a listing of the resource.
     */
    // Listar empresas con sus ofertas y opiniones
    public function index(Request $request)
    {
        $query = Empresa::withCount(['ofertas', 'opiniones'])
            ->with('ofertas');

        // Filtro por sector (si se envía ?sector=tecnologia)
        if ($request->has('sector')) {
            $query->where('sector', $request->sector);
        }

        // Ordenar por más activas (ej: ?sort=ofertas_count)
        if ($request->has('sort')) {
            $query->orderBy($request->sort, 'desc');
        }

        $empresas = $query->paginate(8);

        return response()->json([
            'success' => true,
            'message' => 'Empresas obtenidas correctamente.',
            'data' => $empresas->items(),
            'pagination' => $empresas->only(['total', 'current_page', 'per_page', 'last_page']),
            // Estadísticas globales
            'stats' => [
                'total_empresas' => Empresa::count(),
                'sectores' => Empresa::groupBy('sector')->pluck('sector')
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            // 'sector' => 'required|string|in:tecnologia,educacion,salud,otros',
            'sector' => ['required', 'string', Rule::in(Empresa::SECTORES)],
            'web' => 'nullable|url',
            'descripcion' => 'nullable|string'
        ]);

        $empresa = Empresa::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Empresa creada correctamente.',
            'data' => $empresa,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $empresa = Empresa::with([
            'ofertas' => function ($query) {
                $query->select('id', 'titulo', 'empresa_id', 'localizacion', 'fecha_publicacion')
                    ->where('fecha_expiracion', '>', now());
            },
            // 'opiniones.alumno.user:id,name,foto_perfil'
            'opiniones.alumno.user:id,name'
        ])->findOrFail($id);

        // Estadísticas adicionales
        $stats = [
            // 'avg_valoracion' => round($empresa->opiniones()->avg('valoracion'), 1),
            'avg_valoracion' => round($empresa->opiniones()->avg('valoracion') ?? 0, 1),
            'total_ofertas_activas' => $empresa->ofertas()->where('fecha_expiracion', '>', now())->count()
        ];

        return response()->json([
            'success' => true,
            'message' => 'Detalles de la empresa obtenidos correctamente.',
            'data' => array_merge($empresa->toArray(), $stats),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Empresa $empresa)
    {
        $validated = $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'sector' => 'sometimes|string|in:' . implode(',', SectorEmpresa::values()),
            'web' => 'nullable|url',
            'descripcion' => 'nullable|string'
        ]);

        // Actualizar solo los campos proporcionados
        $empresa->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Empresa actualizada correctamente.',
            'data' => $empresa->fresh() // Devuelve los datos actualizados
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
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
