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
    // Listar empresas con sus ofertas y opiniones
    // public function index()
    // {
    //     $empresas = Empresa::withCount(['ofertas', 'opiniones'])
    //         ->with('ofertas') // carga relaciones necesarias
    //         ->paginate(8); // El número que necesitamos para el front (8)

    //     return response()->json([
    //         'success' => true,
    //         'data' => $empresas->items(),
    //         'pagination' => [
    //             'total' => $empresas->total(),
    //             'current_page' => $empresas->currentPage(),
    //             'per_page' => $empresas->perPage(),
    //             'last_page' => $empresas->lastPage(),
    //         ],
    //     ]);
    // }
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
            'sector' => 'required|string|in:tecnologia,educacion,salud,otros',
            'web' => 'nullable|url',
            'descripcion' => 'nullable|string'
        ]);

        $empresa = Empresa::create($validated);

        return response()->json([
            'success' => true,
            'data' => $empresa,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    // public function show($id)
    // {
    //     $empresa = Empresa::with(['ofertas', 'opiniones.alumno.user:id,name'])
    //         ->findOrFail($id);

    //     return response()->json([
    //         'success' => true,
    //         'data' => $empresa,
    //     ]);
    // }
    public function show($id)
    {
        $empresa = Empresa::with([
            'ofertas' => function ($query) {
                $query->select('id', 'titulo', 'empresa_id', 'localizacion', 'fecha_publicacion')
                    ->where('fecha_expiracion', '>', now());
            },
            'opiniones.alumno.user:id,name,foto_perfil'
        ])->findOrFail($id);

        // Estadísticas adicionales
        $stats = [
            'avg_valoracion' => round($empresa->opiniones()->avg('valoracion'), 1),
            'total_ofertas_activas' => $empresa->ofertas()->where('fecha_expiracion', '>', now())->count()
        ];

        return response()->json([
            'success' => true,
            'data' => array_merge($empresa->toArray(), $stats),
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
