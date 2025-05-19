<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Cloudinary\Cloudinary;


class UsuarioController extends Controller
{
    // GET /api/admin/usuarios
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => User::select('id', 'foto_perfil', 'name', 'email', 'role', 'created_at')->orderBy('id')->get()
        ]);
    }

    // PUT /api/admin/usuarios/{user}
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'role' => 'sometimes|in:admin,profesor,alumno',
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Usuario actualizado correctamente.',
            'data' => $user
        ]);
    }

    public function destroyFoto(User $user)
    {
        if ($user->foto_perfil_public_id) {
            $cloudinary = new Cloudinary(config('cloudinary'));

            try {
                $cloudinary->uploadApi()->destroy($user->foto_perfil_public_id);
            } catch (\Exception $e) {
                \Log::error('Error al eliminar foto de Cloudinary: ' . $e->getMessage());
            }

            $user->update([
                'foto_perfil' => null,
                'foto_perfil_public_id' => null,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Imagen de usuario eliminada correctamente.',
        ]);
    }


    // DELETE /api/admin/usuarios/{user}
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Usuario eliminado correctamente.'
        ]);
    }
}
