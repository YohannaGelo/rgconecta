<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Oferta;
use App\Models\Empresa;
use App\Enums\SectorEmpresa;
use App\Models\User;
use App\Models\Tecnologia;
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
    // public function index()
    // {
    //     return Oferta::with(['tecnologias', 'empresa:id,nombre,sector'])
    //         ->select(['id', 'titulo', 'empresa_id', 'jornada', 'localizacion', 'descripcion', 'fecha_publicacion', 'fecha_expiracion'])
    //         ->paginate(8);

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Ofertas obtenidas correctamente.',
    //         'data' => $ofertas->items(),
    //         'pagination' => $ofertas->only(['total', 'current_page', 'per_page', 'last_page']),
    //     ]);
    // }
    public function index(Request $request)
    {
        $query = Oferta::with(['tecnologias', 'empresa:id,nombre,sector'])
            ->select([
                'id',
                'titulo',
                'empresa_id',
                'jornada',
                'localizacion',
                'descripcion',
                'fecha_publicacion',
                'fecha_expiracion'
            ]);

        // Filtro: localización
        if ($request->filled('localizacion')) {
            $query->where('localizacion', 'LIKE', '%' . $request->localizacion . '%');
        }

        // Filtro: categoría (tipo de tecnología)
        if ($request->filled('categoria')) {
            $query->whereHas('tecnologias', function ($q) use ($request) {
                $q->where('tipo', $request->categoria);
            });
        }

        // Orden por fecha
        if ($request->filled('fecha')) {
            if ($request->fecha === 'recientes') {
                $query->orderByDesc('fecha_publicacion');
            } elseif ($request->fecha === 'antiguas') {
                $query->orderBy('fecha_publicacion');
            }
        } else {
            $query->orderByDesc('fecha_publicacion'); // orden por defecto
        }

        $ofertas = $query->paginate(8);

        return response()->json([
            'success' => true,
            'message' => 'Ofertas obtenidas correctamente.',
            'data' => $ofertas->items(),
            'pagination' => [
                'total' => $ofertas->total(),
                'current_page' => $ofertas->currentPage(),
                'per_page' => $ofertas->perPage(),
                'last_page' => $ofertas->lastPage(),
            ],
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
        // Validación
        $validated = $request->validate([
            'titulo' => 'sometimes|string|max:255',
            'descripcion' => 'sometimes|string',
            'jornada' => [
                'sometimes',
                Rule::in(['completa', 'media_jornada', '3_6_horas', 'menos_3_horas']),
            ],
            'localizacion' => 'sometimes|string',
            'fecha_expiracion' => 'sometimes|date|after:today',
            'tecnologias' => 'nullable|array',
        ]);

        // Actualizar campos principales
        $oferta->update($validated);

        // Sincronizar tecnologías
        if ($request->has('tecnologias')) {
            $oferta->tecnologias()->detach();

            foreach ($request->tecnologias as $tecno) {
                // Si es solo un ID (caso simplificado)
                if (is_numeric($tecno)) {
                    $oferta->tecnologias()->attach($tecno);
                    continue;
                }

                // Crear o encontrar la tecnología por nombre/tipo
                $tec = Tecnologia::firstOrCreate(
                    ['nombre' => $tecno['nombre']],
                    ['tipo' => $tecno['tipo']]
                );

                $oferta->tecnologias()->attach($tec->id, [
                    'nivel' => $tecno['pivot']['nivel'] ?? null,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Oferta actualizada correctamente.',
            'data' => $oferta->fresh()->load('tecnologias', 'empresa'),
        ]);
    }

    /**
     * Get unique localizaciones.
     */
    // Obtener localizaciones únicas
    public function localizacionesUnicas()
    {
        $localizaciones = Oferta::select('localizacion')
            ->distinct()
            ->orderBy('localizacion')
            ->pluck('localizacion');

        return response()->json($localizaciones);
    }

    /**
     * Get ofertas of the authenticated user.
     */
    // Obtener ofertas del usuario autenticado
    public function misOfertas()
    {
        $userId = Auth::id();

        $ofertas = Oferta::with(['empresa:id,nombre', 'tecnologias']) // puedes añadir más relaciones si necesitas
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Ofertas del usuario obtenidas correctamente.',
            'data' => $ofertas,
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
