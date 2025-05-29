<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Profesor;
use Cloudinary\Cloudinary;
use Illuminate\Support\Facades\DB;



class ProfesorController extends Controller
{
    // GET /api/admin/profesores
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Profesor::with('user:id,name,email,role,email_verified_at')->orderBy('id')->get()
        ]);
    }

    // PUT /api/admin/profesores/{profesor}
    public function update(Request $request, Profesor $profesor)
    {
        $validated = $request->validate([
            'departamento' => 'required|string|max:255',
        ]);

        $profesor->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profesor actualizado correctamente.',
            'data' => $profesor
        ]);
    }

    // DELETE /api/admin/profesores/{profesor}
    public function destroy(Profesor $profesor)
    {
        // Asegurar que se cargue la relación con el usuario
        $profesor->load('user');

        $user = $profesor->user;

        // Verificamos si hay usuario antes de acceder a propiedades
        if ($user && $user->foto_perfil_public_id) {
            $cloudinary = new Cloudinary(config('cloudinary'));
            try {
                $cloudinary->uploadApi()->destroy($user->foto_perfil_public_id);
            } catch (\Exception $e) {
                \Log::error('Error al eliminar foto de Cloudinary: ' . $e->getMessage());
            }
        }

        DB::transaction(function () use ($profesor, $user) {
            // Primero se elimina el profesor
            $profesor->delete();

            // Luego el usuario (si existe)
            if ($user) {
                $user->delete();
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Profesor, usuario y foto eliminados correctamente.'
        ], 204);
    }
}
