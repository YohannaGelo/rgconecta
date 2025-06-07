<?php

namespace App\Listeners;

use IlluminateAuthEventsVerified;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Mail;
use App\Mail\BienvenidaAlumnoPendiente;
use App\Mail\AvisoNuevoAlumno;
use App\Models\Alumno;
use App\Models\User;
use Illuminate\Support\Facades\URL;

class NotificarNuevoAlumnoVerificado
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Verified $event): void
    {
        $user = $event->user;

        // Solo si es alumno
        if ($user->role !== 'alumno') return;

        $alumno = Alumno::where('user_id', $user->id)->first();
        if (!$alumno) return;

        // Enviar bienvenida al alumno
        Mail::to($user->email)->send(new BienvenidaAlumnoPendiente($alumno));

        // Enviar aviso a profes y admin
        // $destinatarios = User::whereIn('role', ['profesor', 'admin'])->pluck('email')->toArray();
        // Mail::to($destinatarios)->send(new AvisoNuevoAlumno($alumno));
        // Generar URL firmada de autologin (puedes ajustar el user que la recibe)
        $admin = User::where('role', 'admin')->first(); // o cualquier otro
        // $url = URL::signedRoute('autologin', ['user' => $admin->id]);
        $url = URL::temporarySignedRoute(
            'autologin',
            now()->addMinutes(30),
            ['user' => $admin->id]
        );

        $url = str_replace('/rgc_api', '', $url);

        // Enviar aviso a profes y admin
        $destinatarios = User::whereIn('role', ['profesor', 'admin'])->pluck('email')->toArray();
        Mail::to($destinatarios)->send(new AvisoNuevoAlumno($alumno, $url));
    }
}
