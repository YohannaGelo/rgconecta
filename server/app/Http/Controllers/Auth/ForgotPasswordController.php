<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMail;

class ForgotPasswordController extends Controller
{
        public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['error' => 'No encontramos ningún usuario con ese correo'], 404);
        }

        // ✅ Generar token de recuperación
        $token = app('auth.password.broker')->createToken($user);

        // ✅ Construir URL para el frontend
        $url = config('app.frontend_url') . "/resetear-clave?token={$token}&email=" . urlencode($user->email);

        // ✅ Enviar tu propio email personalizado
        Mail::to($user->email)->send(new ResetPasswordMail($url));

        return response()->json(['message' => 'Te hemos enviado un enlace de recuperación por correo']);
    }
}
