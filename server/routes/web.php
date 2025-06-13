<?php

use Illuminate\Support\Facades\Route;


use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use App\Models\User;
use App\Http\Controllers\AutoLoginController;

Route::get('/email/verify/{id}/{hash}', function ($id, $hash, Request $request) {

    if (!$request->hasValidSignature()) {
        abort(403, 'Enlace de verificación no válido o expirado.');
    }

    $user = User::find($id);

    if (!$user) {
        abort(404, 'Usuario no encontrado.');
    }

    Log::info("Iniciando verificación para usuario: {$id}");
    Log::info("Hash recibido: {$hash}");
    Log::info("Hash esperado: " . sha1($user->getEmailForVerification()));

    $frontendUrl = config('app.frontend_url');

    if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        abort(403, 'Enlace de verificación no válido.');
    }

    if ($user->hasVerifiedEmail()) {
        Log::info('Redirigiendo hasVerifiedEmail a: ' . $frontendUrl . '/verificar?verified=true');
        return redirect($frontendUrl . '/verificar?verified=true');
    }

    if ($user->markEmailAsVerified()) {
        Log::info("Email marcado como verificado, disparando evento");
        event(new Verified($user));
    } else {
        Log::error("No se pudo marcar el email como verificado");
    }

    Log::info('Redirigiendo a: ' . $frontendUrl . '/verificar?verified=true');
    return redirect($frontendUrl . '/verificar?verified=true');
})->middleware(['signed'])->name('verification.verify');


Route::get('/', function () {
    return view('welcome');
});

Route::get('/autologin/{user}', [AutologinController::class, 'handle'])
    ->name('autologin')
    ->middleware('signed');
