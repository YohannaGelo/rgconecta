<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Profesor;
use App\Models\User;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

use Cloudinary\Cloudinary;


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
            'user.foto_perfil' => 'nullable|string', // base64 desde frontend
        ]);

        DB::beginTransaction();

        try {
            $fotoUrl = 'default.jpg';
            $fotoPublicId = null;

            if ($request->user['foto_perfil']) {
                $cloudinary = new Cloudinary(config('cloudinary'));
                $uploadedImage = $cloudinary->uploadApi()->upload($request->user['foto_perfil'], [
                    'folder' => 'usuarios'
                ]);
                $fotoUrl = $uploadedImage['secure_url'];
                $fotoPublicId = $uploadedImage['public_id'];
            }

            $user = User::create([
                'name' => $request->user['name'],
                'email' => $request->user['email'],
                'password' => Hash::make($request->user['password']),
                'role' => 'profesor',
                'foto_perfil' => $fotoUrl,
                'foto_perfil_public_id' => $fotoPublicId,
            ]);

            $profesor = Profesor::create([
                'user_id' => $user->id,
                'departamento' => $request->departamento,
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
        $request->validate([
            'user.name' => 'sometimes|string|max:255',
            'user.email' => 'sometimes|email|unique:users,email,' . $profesor->user_id,
            'user.foto_perfil' => 'nullable|string', // base64
            'departamento' => 'sometimes|string|max:255',
        ]);

        \DB::beginTransaction();

        try {
            $userUpdates = [];

            if ($request->filled('user.name')) {
                $userUpdates['name'] = $request->input('user.name');
            }
            if ($request->filled('user.email')) {
                $userUpdates['email'] = $request->input('user.email');
            }

            if ($request->filled('user.foto_perfil')) {
                $cloudinary = new \Cloudinary\Cloudinary(config('cloudinary'));
                $uploadedImage = $cloudinary->uploadApi()->upload($request->input('user.foto_perfil'), [
                    'folder' => 'usuarios'
                ]);
                $userUpdates['foto_perfil'] = $uploadedImage['secure_url'];
                $userUpdates['foto_perfil_public_id'] = $uploadedImage['public_id'];
            }

            if (!empty($userUpdates)) {
                $profesor->user->update($userUpdates);
            }

            if ($request->filled('departamento')) {
                $profesor->update([
                    'departamento' => $request->input('departamento')
                ]);
            }

            \DB::commit();

            return response()->json([
                'message' => 'Profesor actualizado correctamente.',
                'data' => $profesor->fresh()->load('user'),
            ], 200);
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el profesor.',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Profesor $profesor)
    {
        $user = $profesor->user;

        // Si tiene public_id, eliminamos la foto de Cloudinary
        if ($user->foto_perfil_public_id) {
            $cloudinary = new Cloudinary(config('cloudinary'));
            try {
                $cloudinary->uploadApi()->destroy($user->foto_perfil_public_id);
            } catch (\Exception $e) {
                \Log::error('Error al eliminar foto de Cloudinary: ' . $e->getMessage());
            }
        }

        DB::transaction(function () use ($profesor, $user) {
            $user->delete();
            $profesor->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Profesor, usuario y foto eliminados correctamente.'
        ], 204);
    }
}
