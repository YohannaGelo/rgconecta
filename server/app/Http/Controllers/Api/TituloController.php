<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Titulo;
use App\Models\Alumno;
use Illuminate\Http\Request;

class TituloController extends Controller
{
    // Listar todos los títulos
    public function index()
    {
        return response()->json(Titulo::all());
    }

    // Crear un nuevo título (relacionado con un alumno)
    public function store(Request $request, Alumno $alumno)
    {
        // Validación de entrada
        $validated = $request->validate([
            'nombre' => 'required|string|unique:titulo,nombre',
            'tipo' => 'required|in:ciclo_medio,ciclo_superior,grado_universitario,master,doctorado',
            'fecha_inicio' => 'required|date_format:Y',
            'fecha_fin' => 'nullable|date_format:Y',
            'institucion' => 'required|string',
        ]);

        // Crear el título
        $titulo = Titulo::create([
            'nombre' => $validated['nombre'],
            'tipo' => $validated['tipo']
        ]);

        // Relacionar el título con el alumno y la tabla pivot
        $alumno->titulos()->attach($titulo->id, [
            'fecha_inicio' => $validated['fecha_inicio'],
            'fecha_fin' => $validated['fecha_fin'],
            'institucion' => $validated['institucion'],
        ]);

        return response()->json($titulo, 201);
    }

    // Mostrar detalles de un título específico (incluyendo la relación con los alumnos)
    public function show(Titulo $titulo)
    {
        return response()->json(
            $titulo->load(['alumnos:id,fecha_nacimiento,situacion_laboral'])
        );
    }

    // Borrar un título específico
    public function destroy(Titulo $titulo)
    {
        // Si el título tiene registros en la tabla pivot, primero los eliminamos
        $titulo->alumnos()->detach();

        // Luego podemos eliminar el título
        $titulo->delete();

        return response()->json([
            'success' => true,
            'message' => 'Título eliminado correctamente.'
        ], 204);
    }
}
