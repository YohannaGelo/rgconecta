<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Profesor;
use App\Models\User;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class ProfesorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // Listar profesores con sus usuarios
    public function index(Request $request)
    {
        $query = Profesor::with('user:id,name,email');

        // Filtro por departamento (ej: ?departamento=Informatica)
        if ($request->filled('departamento')) {
            $query->where('departamento', 'like', '%' . $request->departamento . '%');
        }

        // Paginación
        $profesores = $query->paginate(8);

        return response()->json([
            'success' => true,
            'data' => $profesores->items(),
            'pagination' => $profesores->only(['total', 'current_page', 'per_page', 'last_page']),
            'stats' => [
                'total_profesores' => Profesor::count(),
                'departamentos' => Profesor::groupBy('departamento')->pluck('departamento')
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    // Crear un nuevo profesor
    public function store(Request $request)
    {
        $request->validate([
            'user.name' => 'required|string|max:255',
            'user.email' => 'required|email|unique:users,email',
            'user.password' => 'required|string|min:6',

            'departamento' => 'required|string|max:255',
            'foto_perfil' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            // 1. Crear el usuario
            $user = User::create([
                'name' => $request->user['name'],
                'email' => $request->user['email'],
                'password' => Hash::make($request->user['password']),
                'role' => 'profesor'
            ]);

            // 2. Crear el profesor
            $profesor = Profesor::create([
                'user_id' => $user->id,
                'departamento' => $request->departamento,
                'foto_perfil' => $request->foto_perfil ?? null
            ]);

            DB::commit();

            return response()->json($profesor->load('user'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([ 
                'success' => false,
                'message' => 'Error al crear el profesor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    // Mostrar los detalles de un profesor
    public function show(Profesor $profesor)
    {
        return response()->json($profesor->load('user'), 200);
    }

    // Actualizar la información de un profesor
    public function update(Request $request, Profesor $profesor)
    {
        $validated = $request->validate([
            'departamento' => 'required|string',
            'foto_perfil' => 'nullable|url',
        ]);

        $profesor->update($validated);

        return response()->json([ 
            'success' => true,
            'message' => 'Profesor actualizado correctamente.',
            'data' => $profesor->load('user')
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    // Eliminar un profesor y su usuario asociado
    public function destroy(Profesor $profesor)
    {
        DB::transaction(function () use ($profesor) {
            $profesor->user()->delete();
            $profesor->delete();
        });

        return response()->json([ 
            'success' => true,
            'message' => 'Profesor y usuario asociado eliminados correctamente.'
        ], 204);
    }
}
