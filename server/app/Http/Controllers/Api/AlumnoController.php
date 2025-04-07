<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alumno;
use Illuminate\Http\Request;


class AlumnoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // Obtener todos los alumnos (con relaciones opcionales)
    // public function index(Request $request)
    // {
    //     $query = Alumno::with(['user:id,name,email', 'tecnologias']);

    //     if ($request->has('tecnologia')) {
    //         $query->whereHas('tecnologias', function ($q) use ($request) {
    //             $q->where('nombre', 'like', '%' . $request->tecnologia . '%');
    //         });
    //     }

    //     return $query->paginate(8);
    // }

    public function index(Request $request)
    {
        $query = Alumno::with(['user:id,name', 'tecnologias:nombre'])
            ->select(['id', 'user_id', 'situacion_laboral']);

        if ($request->tecnologia) {
            $query->whereHas(
                'tecnologias',
                fn($q) =>
                $q->where('nombre', 'like', '%' . $request->tecnologia . '%')
            );
        }

        return $query->paginate(8);
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
    // Mostrar alumno específico con todas sus relaciones
    public function show(Alumno $alumno)
    {
        // Detalle solo para autenticados
        return response()->json(
            $alumno->load([
                'user:id,name,email',
                'titulos',
                'tecnologias',
                'opiniones.empresa:id,nombre'
            ])
        );
    }

    /**
     * Update the specified resource in storage.
     */
    // Actualizar perfil de alumno (ej: tecnologías o situación laboral)
    public function update(Request $request, Alumno $alumno)
    {
        $validated = $request->validate([
            'situacion_laboral' => 'sometimes|in:trabajando,buscando_empleo,desempleado',
            'tecnologias' => 'sometimes|array', // Formato: [ [id, nivel], ... ]
        ]);

        if (isset($validated['tecnologias'])) {
            $syncData = [];
            foreach ($validated['tecnologias'] as $tech) {
                $syncData[$tech['id']] = ['nivel' => $tech['nivel']];
            }
            $alumno->tecnologias()->sync($syncData);
        }

        $alumno->update($validated);
        return response()->json($alumno->fresh()->load('tecnologias'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Alumno $alumno)
    {
        //
    }
}
