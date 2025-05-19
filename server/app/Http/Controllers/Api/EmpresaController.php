<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\Sector;

class EmpresaController extends Controller
{


    /**
     * Display a listing of the resource.
     */
    // Listar empresas con sus ofertas y opiniones
    public function index(Request $request)
    {
        $query = Empresa::withCount(['ofertas', 'opiniones'])
            ->with(['ofertas', 'sector']);

        // Filtro por sector_id (ej: ?sector_id=3)
        if ($request->has('sector_id')) {
            $query->where('sector_id', $request->sector_id);
        }

        // Ordenar por más activas
        if ($request->has('sort')) {
            $query->orderBy($request->sort, 'desc');
        }

        $empresas = $query->paginate(8);

        return response()->json([
            'success' => true,
            'message' => 'Empresas obtenidas correctamente.',
            'data' => $empresas->items(),
            'pagination' => $empresas->only(['total', 'current_page', 'per_page', 'last_page']),
            'stats' => [
                'total_empresas' => Empresa::count(),
                'sectores' => Sector::select('id', 'nombre')->orderBy('nombre')->get()
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
            'sector_id' => ['required', 'exists:sectores,id'],
            'web' => 'nullable|url',
            'descripcion' => 'nullable|string',
        ]);

        $empresa = Empresa::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Empresa creada correctamente.',
            'data' => $empresa->load('sector'),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $empresa = Empresa::with([
            'sector',
            'ofertas' => function ($query) {
                $query->select('id', 'titulo', 'empresa_id', 'localizacion', 'fecha_publicacion')
                    ->where('fecha_expiracion', '>', now());
            },
            'opiniones.alumno.user:id,name,foto_perfil'
        ])->findOrFail($id);

        $stats = [
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
            'sector_id' => ['sometimes', 'exists:sectores,id'],
            'web' => 'nullable|url',
            'descripcion' => 'nullable|string',
        ]);

        $empresa->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Empresa actualizada correctamente.',
            'data' => $empresa->fresh()->load('sector'),
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
