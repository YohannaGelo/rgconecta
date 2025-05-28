<?php

use Illuminate\Support\Facades\Route;


use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use App\Models\User;

Route::get('/email/verify/{id}/{hash}', function ($id, $hash, Request $request) {
    if (!$request->hasValidSignature()) {
        abort(403, 'Enlace de verificación no válido o expirado.');
    }

    $user = User::find($id);

    if (!$user) {
        abort(404, 'Usuario no encontrado.');
    }

    if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        abort(403, 'Enlace de verificación no válido.');
    }

    if ($user->hasVerifiedEmail()) {
        return redirect(env('FRONTEND_URL') . '/verificar?verified=true');
    }

    if ($user->markEmailAsVerified()) {
        event(new Verified($user));
    }

    return redirect(env('FRONTEND_URL') . '/verificar?verified=true');
})->middleware(['signed'])->name('verification.verify');


Route::get('/', function () {
    return view('welcome');
});
