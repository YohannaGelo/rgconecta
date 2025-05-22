<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Alumno;

use Cloudinary\Cloudinary;

class AlumnoController extends Controller
{
    // GET /api/admin/alumnos
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Alumno::with('user:id,name,email,role')->orderBy('id')->get()
        ]);
    }

    // PUT /api/admin/alumnos/{alumno}
    public function update(Request $request, Alumno $alumno)
    {
        $validated = $request->validate([
            'situacion_laboral' => 'required|in:trabajando,buscando_empleo,desempleado',
            'promocion' => 'required|string|max:255',
            'titulo_profesional' => 'nullable|string|max:255',
            'is_verified' => 'required|boolean',
        ]);

        $alumno->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Alumno actualizado correctamente.',
            'data' => $alumno
        ]);
    }

    // DELETE /api/admin/alumnos/{alumno}
        public function destroy(Alumno $alumno)
    {
        $user = $alumno->user;

        // Si tiene public_id, eliminamos la foto de Cloudinary
        if ($user->foto_perfil_public_id) {
            $cloudinary = new Cloudinary(config('cloudinary'));
            try {
                $cloudinary->uploadApi()->destroy($user->foto_perfil_public_id);
            } catch (\Exception $e) {
                \Log::error('Error al eliminar foto de Cloudinary: ' . $e->getMessage());
            }
        }

        $alumno->tecnologias()->detach();
        $alumno->experiencias()->delete();
        $user->delete();
        $alumno->delete();

        return response()->json([
            'success' => true,
            'message' => 'Alumno, usuario y foto eliminados correctamente.'
        ], 204);
    }

}
