<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\PreferenciaNotificacion;

class PreferenciaNotificacionController extends Controller
{
    public function index()
    {

        return response()->json([
            'success' => true,
            'data' => PreferenciaNotificacion::with('user')->get()
        ]);
    }


    public function update(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'responder_dudas' => 'boolean',
            'avisos_nuevas_ofertas' => 'boolean',
            'newsletter' => 'boolean',
        ]);

        // Crea o actualiza el registro
        $preferencias = $user->preferencias()->updateOrCreate([], $data);

        return response()->json([
            'message' => 'Preferencias actualizadas',
            'data' => $preferencias,
        ]);
    }

    public function show($id)
    {
        $preferencias = PreferenciaNotificacion::where('user_id', $id)->first();

        if (!$preferencias) {
            return response()->json([
                'responder_dudas' => false,
                'avisos_nuevas_ofertas' => true,
                'newsletter' => false
            ]);
        }

        return response()->json($preferencias);
    }
}
