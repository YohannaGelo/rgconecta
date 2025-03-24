<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\OfertaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Grupo para rutas API con prefijo '/api'
Route::middleware('api')->group(function () {
    // Rutas para Ofertas
    Route::apiResource('ofertas', OfertaController::class);
    
    // Más rutas aquí
});