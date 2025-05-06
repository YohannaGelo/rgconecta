<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            /** @var User $user */
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => $user
            ]);
        }

        return response()->json(['error' => 'Credenciales inválidas'], 401);
    }

    public function me(Request $request)
    {
        $user = $request->user(); // Obtiene el usuario autenticado

        // Puedes cargar relaciones si quieres, por ejemplo si el user tiene relación con profesor o alumno
        // $user->load('alumno', 'profesor');

        return response()->json($user);
    }


    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada']);
    }
}
