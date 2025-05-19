<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user) {
            return response()->json(['error' => 'El usuario no existe.'], 404);
        }

        if (!Hash::check($credentials['password'], $user->password)) {
            return response()->json(['error' => 'La contraseña es incorrecta.'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'alumno') {
            $alumno = $user->alumno()->with([
                'user:id,name,email,foto_perfil,role',
                'titulos',
                'tecnologias',
                'opiniones.empresa:id,nombre',
                'experiencias.empresa:id,nombre,sector_id',
                'experiencias.empresa.sector:id,nombre',
                'opiniones.empresa:id,nombre,sector_id',
                'opiniones.empresa.sector:id,nombre',
            ])->first();

            return response()->json($alumno);
        }

        if ($user->role === 'profesor') {
            $profesor = $user->profesor()->with([
                'user:id,name,email,foto_perfil,role'
            ])->first();

            return response()->json($profesor);
        }

        return response()->json($user); // fallback: solo los datos básicos
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => [
                'required',
                'string',
                'min:8',
                'regex:/[A-Z]/',    // al menos una mayúscula
                'regex:/[a-z]/',    // al menos una minúscula
                'regex:/[0-9]/',    // al menos un número
                'regex:/[\W_]/' // al menos un símbolo
            ],
            'new_password_confirmation' => 'required|same:new_password'
        ]);

        $user = $request->user();

        // Verifica la contraseña actual
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['error' => 'La contraseña actual es incorrecta'], 403);
        }

        // Cambia la contraseña
        $user->password = Hash::make($request->new_password);
        $user->save();

        // Revoca todos los tokens actuales
        $user->tokens()->delete();

        // Genera un nuevo token automáticamente
        $newToken = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Contraseña actualizada correctamente',
            'token' => $newToken,
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada']);
    }
}
