<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sector;

class SectorController extends Controller
{
    // GET /api/sectores
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Sector::select('id', 'nombre')->orderBy('nombre')->get()
        ]);
    }
}
