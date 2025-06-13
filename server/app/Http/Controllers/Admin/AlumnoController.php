<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Alumno;

use Cloudinary\Cloudinary;

use App\Mail\AlumnoVerificado;
use App\Mail\AlumnoRechazado;
use Illuminate\Support\Facades\Mail;

class AlumnoController extends Controller
{
    // GET /api/admin/alumnos
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Alumno::with('user:id,name,email,role,email_verified_at')->orderBy('id')->get()
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
            'fecha_nacimiento' => 'sometimes|date'
        ]);

        
        $verificando = !$alumno->is_verified && $validated['is_verified'];

        $alumno->update($validated);

        if ($verificando) {
            Mail::to($alumno->user->email)->send(new AlumnoVerificado($alumno));
        }


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

    /**
     * Verificar el alumno (ej: al registrarse)
     *
     * @param Alumno $alumno
     * @return \Illuminate\Http\JsonResponse
     */
    // Método para verificar el alumno
    public function verify(Alumno $alumno)
    {
        // Verificar si ya está verificado
        if (!$alumno->is_verified) {
            $alumno->is_verified = true;
            $alumno->save();

            // Enviar correo de confirmación
            Mail::to($alumno->user->email)->send(new AlumnoVerificado($alumno));
        }

        // Responder con éxito y los datos del alumno
        return response()->json([
            'success' => true,
            'message' => 'Alumno verificado correctamente.',
            'data' => $alumno
        ]);
    }

    /**
     * Rechazar el alumno (ej: al registrarse)
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    // Método para rechazar el alumno
    public function rechazar($id)
    {
        $user = request()->user();
        $role = $user->role ?? $user->user->role ?? null;

        if (!in_array($role, ['profesor', 'admin'])) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $alumno = Alumno::findOrFail($id);

        // Enviar aviso antes de eliminar
        Mail::to($alumno->user->email)->send(new AlumnoRechazado($alumno));

        $alumno->user()->delete(); // elimina también el usuario asociado
        $alumno->delete();         // y elimina el alumno

        return response()->json(['message' => 'Alumno rechazado y eliminado']);
    }
}
