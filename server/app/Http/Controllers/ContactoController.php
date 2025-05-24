<?php

namespace App\Http\Controllers;

use App\Mail\ContactoDesdeFormulario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactoController extends Controller
{
    public function enviar(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email',
            'mensaje' => 'required|string|min:10',        ]);

        // Definir destinatario (admin principal)
        $adminEmail = config('mail.contact_admin');

        // Enviar el correo
        Mail::to($adminEmail)->send(new ContactoDesdeFormulario(
            $validated['nombre'],
            $validated['email'],
            $validated['mensaje']
        ));

        return response()->json(['ok' => true, 'mensaje' => 'Mensaje enviado correctamente']);
    }
}
