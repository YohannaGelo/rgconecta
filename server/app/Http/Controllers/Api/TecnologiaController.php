<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tecnologia;

class TecnologiaController extends Controller
{
    // Listar todas las tecnologías
    public function index()
    {
        // return Tecnologia::all();
        return response()->json(Tecnologia::orderBy('nombre')->get());

    }

    // Crear una nueva tecnología (si no existe)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo' => 'required|string|in:frontend,backend,fullstack,database,devops,ofimatica,idioma,marketing,gestion,disenio,otros',
        ]);

        // Busca si ya existe antes de crearla
        $tecnologia = Tecnologia::firstOrCreate([
            'nombre' => $validated['nombre'],
            'tipo' => $validated['tipo']
        ]);

        return response()->json($tecnologia, 201);
    }
}
