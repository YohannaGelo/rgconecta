<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Cloudinary\Cloudinary;
use App\Models\PreferenciaNotificacion;

class UsuarioController extends Controller
{
    // GET /api/admin/usuarios
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => User::select('id', 'foto_perfil', 'name', 'email', 'role', 'created_at', 'email_verified_at')->orderBy('id')->get()
        ]);
    }

    // PUT /api/admin/usuarios/{user}
    // public function update(Request $request, User $user)
    // {
    //     $validated = $request->validate([
    //         'name' => 'sometimes|string|max:255',
    //         'email' => 'sometimes|email|unique:users,email,' . $user->id,
    //         'role' => 'sometimes|in:admin,profesor,alumno',
    //     ]);

    //     if (empty($validated)) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'No se enviaron datos para actualizar.',
    //         ], 400);
    //     }

    //     $resultado = $user->update($validated);

    //     return response()->json([
    //         'success' => $resultado,
    //         'message' => $resultado ? 'Usuario actualizado correctamente.' : 'Falló la actualización.',
    //         'data' => $user->fresh() // Forzamos recarga desde DB
    //     ]);
    // }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'role' => 'sometimes|in:admin,profesor,alumno',
            'preferencias' => 'sometimes|array',
            'preferencias.responder_dudas' => 'nullable|boolean',
            'preferencias.avisos_nuevas_ofertas' => 'nullable|boolean',
            'preferencias.newsletter' => 'nullable|boolean',
        ]);

        if (empty($validated)) {
            return response()->json([
                'success' => false,
                'message' => 'No se enviaron datos para actualizar.',
            ], 400);
        }

        $user->update($validated);

        // 🆕 Actualizar o crear preferencias si se incluyeron
        if ($request->has('preferencias')) {
            PreferenciaNotificacion::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'responder_dudas' => $request->preferencias['responder_dudas'] ?? false,
                    'avisos_nuevas_ofertas' => $request->preferencias['avisos_nuevas_ofertas'] ?? false,
                    'newsletter' => $request->preferencias['newsletter'] ?? false,
                ]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Usuario actualizado correctamente.',
            'data' => $user->fresh()
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
        // Si tiene relaciones con profesor o alumno
        // $user->alumno()?->delete();
        // $user->profesor()?->delete();

        $user->forceDelete(); // Si usas softDeletes, esto lo borra de verdad

        return response()->json([
            'success' => true,
            'message' => 'Usuario eliminado correctamente.'
        ]);
    }
}
