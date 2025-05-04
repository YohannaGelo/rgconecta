<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Cloudinary\Cloudinary; // Import the Cloudinary namespace

class PerfilController extends Controller
{
    public function subirFoto(Request $request)
    {
        $request->validate([
            'foto' => 'required|image|max:2048' // máx 2MB
        ]);

        $user = $request->user(); // obtiene el usuario autenticado

        $config = config('cloudinary');
        // Verifica si la configuración de Cloudinary está presente
        if (empty($config['cloud']['api_key']) || empty($config['cloud']['api_secret'])) {
            return response()->json(['error' => 'Cloudinary no está configurado correctamente'], 500);
        }
        // Inicia Cloudinary
        // $cloudinary = new Cloudinary(config('cloudinary'));
        $cloudinary = new Cloudinary($config);

        try {
            $uploadedImage = $cloudinary->uploadApi()->upload($request->file('foto')->getRealPath(), [
                'folder' => 'usuarios'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al subir la imagen', 'details' => $e->getMessage()], 500);
        }

        // Guardar la URL en el modelo user
        $user->foto_perfil = $uploadedImage['secure_url'];
        $user->save();

        return response()->json([
            'success' => true,
            'url' => $user->foto_perfil
        ]);
    }
}
