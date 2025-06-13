<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AutoLoginController extends Controller
{
    // Permite hacer autologin a los profes cuando van a validar a un alumno desde Gmail
    public function handle(Request $request)
    {
        $user = User::findOrFail($request->user);

        // Verifica roles válidos
        if (!in_array($user->role, ['admin', 'profesor'])) {
            abort(403);
        }

        Auth::login($user);

        $frontendUrl = config('app.frontend_url');

        return redirect("{$frontendUrl}/verificar-alumnos");
    }
}