<?php

namespace App\Http\Controllers;

use App\Mail\ContactoDesdeFormulario;
use App\Mail\MensajeOfertaMail;
use App\Mail\MensajeProfesorMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use App\Models\Oferta;

class ContactoController extends Controller
{
    public function enviar(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email',
            'mensaje' => 'required|string|min:10',
        ]);

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

    public function contactarAutorOferta(Request $request, $id)
    {
        $request->validate([
            'mensaje' => 'required|string|min:10',
        ]);

        $emisor = Auth::user();
        $oferta = Oferta::with('user.preferencias')->findOrFail($id);
        $receptor = $oferta->user;

        if (!$receptor->preferencias || !$receptor->preferencias->responder_dudas) {
            return response()->json(['error' => 'Este usuario no acepta mensajes.'], 403);
        }

        Mail::to($receptor->email)->send(new MensajeOfertaMail($emisor, $oferta, $request->mensaje));

        return response()->json(['message' => 'Mensaje enviado correctamente.']);
    }

    public function contactarProfesor(Request $request, $id)
    {
        $request->validate([
            'mensaje' => 'required|string|min:10',
        ]);

        $emisor = Auth::user();
        $profesor = \App\Models\Profesor::with('user')->findOrFail($id);
        $receptor = $profesor->user;

        Mail::to($receptor->email)->send(new MensajeProfesorMail($emisor, $receptor, $request->mensaje));

        return response()->json(['message' => 'Mensaje enviado correctamente al profesor.']);
    }
}
