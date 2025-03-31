<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\Api\{OfertaController, AlumnoController};
use App\Http\Controllers\Api\OfertaController;
use App\Http\Controllers\Api\AlumnoController;
use App\Http\Controllers\AuthController;

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

// Route::post('/ofertas', [OfertaController::class, 'store'])->middleware('auth:sanctum');
// Route::apiResource('alumnos', AlumnoController::class);

// Route::post('/login', [AuthController::class, 'login']);
// Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Rutas PÚBLICAS
Route::post('/login', [AuthController::class, 'login']);
Route::get('/ofertas', [OfertaController::class, 'index']); // Listado público
Route::get('/alumnos', [AlumnoController::class, 'index']); // Listado público

// Rutas PROTEGIDAS
Route::middleware('auth:sanctum')->group(function () {
    // Ofertas
    Route::post('/ofertas', [OfertaController::class, 'store']);
    Route::get('/ofertas/{oferta}', [OfertaController::class, 'show']); 
    Route::put('/ofertas/{oferta}', [OfertaController::class, 'update']); 
    Route::delete('/ofertas/{oferta}', [OfertaController::class, 'destroy']); 
    
    // Alumnos
    Route::get('/alumnos/{alumno}', [AlumnoController::class, 'show']); // Detalle protegido
    Route::apiResource('alumnos', AlumnoController::class)->except(['index', 'show']);
    
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
});