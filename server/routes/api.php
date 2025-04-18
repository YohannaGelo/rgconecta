<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\Api\{OfertaController, AlumnoController};
use App\Http\Controllers\Api\OfertaController;
use App\Http\Controllers\Api\ProfesorController;
use App\Http\Controllers\Api\AlumnoController;
use App\Http\Controllers\Api\EmpresaController;
use App\Http\Controllers\Api\OpinionController;
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

// Rutas PÚBLICAS
Route::post('/login', [AuthController::class, 'login']);

Route::get('/ofertas', [OfertaController::class, 'index']);

Route::get('/alumnos', [AlumnoController::class, 'index']);
Route::post('/alumnos', [AlumnoController::class, 'store']);

Route::post('/profesores', [ProfesorController::class, 'store']);

Route::get('/opiniones', [OpinionController::class, 'index']);

Route::get('/empresas/{empresa}/opiniones', [OpinionController::class, 'indexByEmpresa']);

// Rutas PROTEGIDAS
Route::middleware('auth:sanctum')->group(function () {
    // Ofertas
    Route::post('/ofertas', [OfertaController::class, 'store']);
    Route::get('/ofertas/{oferta}', [OfertaController::class, 'show']);
    Route::put('/ofertas/{oferta}', [OfertaController::class, 'update']);
    Route::delete('/ofertas/{oferta}', [OfertaController::class, 'destroy']);

    // Alumnos
    Route::post('/alumnos/{alumno}/verify', [AlumnoController::class, 'verify']);
    Route::get('/alumnos/{alumno}', [AlumnoController::class, 'show']); // Detalle protegido
    Route::put('/alumnos/{alumno}', [AlumnoController::class, 'update']);
    Route::delete('/alumnos/{alumno}', [AlumnoController::class, 'destroy']);

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);

    // Empresas
    Route::get('/empresas', [EmpresaController::class, 'index']);
    Route::get('/empresas/{empresa}', [EmpresaController::class, 'show']);
    Route::post('/empresas', [EmpresaController::class, 'store']);
    Route::put('/empresas/{empresa}', [EmpresaController::class, 'update']);
    Route::delete('/empresas/{empresa}', [EmpresaController::class, 'destroy']);

    // Opiniones
    Route::post('/opiniones', [OpinionController::class, 'store']);
    Route::put('/opiniones/{opinion}', [OpinionController::class, 'update']);
    Route::delete('/opiniones/{opinion}', [OpinionController::class, 'destroy']);

    // Profesores
    Route::get('/profesores', [ProfesorController::class, 'index']); 
    Route::get('/profesores/{profesor}', [ProfesorController::class, 'show']);
    Route::put('/profesores/{profesor}', [ProfesorController::class, 'update']);
    Route::delete('/profesores/{profesor}', [ProfesorController::class, 'destroy']); 
});
