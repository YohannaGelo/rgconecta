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
use App\Http\Controllers\Api\TituloController;
use App\Http\Controllers\Api\TecnologiaController;
use App\Http\Controllers\Api\SectorController;
use App\Http\Controllers\ContactoController;

use App\Http\Middleware\AdminMiddleware;
// Admin
use App\Http\Controllers\Admin\TituloController as AdminTituloController;
use App\Http\Controllers\Admin\TecnologiaController as AdminTecnologiaController;
use App\Http\Controllers\Admin\EmpresaController as AdminEmpresaController;
use App\Http\Controllers\Admin\ExperienciaController as AdminExperienciaController;
use App\Http\Controllers\Admin\UsuarioController as AdminUsuarioController;
use App\Http\Controllers\Admin\OpinionController as AdminOpinionController;
use App\Http\Controllers\Admin\AlumnoController as AdminAlumnoController;
use App\Http\Controllers\Admin\ProfesorController as AdminProfesorController;
use App\Http\Controllers\Admin\OfertaController as AdminOfertaController;
use App\Http\Controllers\Admin\SectorController as AdminSectorController;


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
Route::get('/ofertas/localizaciones', [OfertaController::class, 'localizacionesUnicas']);

Route::get('/alumnos', [AlumnoController::class, 'index']);
Route::post('/alumnos', [AlumnoController::class, 'store']);

Route::post('/profesores', [ProfesorController::class, 'store']);

Route::get('/empresas', [EmpresaController::class, 'index']);

Route::get('/opiniones', [OpinionController::class, 'index']);

Route::get('/sectores', [SectorController::class, 'index']);

Route::get('/empresas/{empresa}/opiniones', [OpinionController::class, 'indexByEmpresa']);
Route::post('/empresas', [EmpresaController::class, 'store']);

Route::get('/titulos', [TituloController::class, 'index']);
Route::post('/alumnos/{alumno}/titulos', [TituloController::class, 'store']);
Route::get('/titulos/{titulo}', [TituloController::class, 'show']);
Route::delete('/titulos/{titulo}', [TituloController::class, 'destroy']);

Route::get('/tecnologias', [TecnologiaController::class, 'index']);
Route::post('/tecnologias', [TecnologiaController::class, 'store']);



// Rutas PROTEGIDAS
Route::middleware('auth:sanctum')->group(function () {
    // Ofertas
    Route::post('/ofertas', [OfertaController::class, 'store']);
    Route::get('/ofertas/{oferta}', [OfertaController::class, 'show']);
    Route::get('/mis-ofertas', [OfertaController::class, 'misOfertas']);
    Route::put('/ofertas/{oferta}', [OfertaController::class, 'update']);
    Route::delete('/ofertas/{oferta}', [OfertaController::class, 'destroy']);

    // Alumnos
    Route::post('/alumnos/{alumno}/verify', [AlumnoController::class, 'verify']);
    Route::post('/alumnos/{alumno}/rechazar', [AlumnoController::class, 'rechazar']);
    Route::get('/alumnos/no-verificados', [AlumnoController::class, 'noVerificados']);
    Route::get('/alumnos/{alumno}', [AlumnoController::class, 'show']); // Detalle protegido
    Route::put('/alumnos/{alumno}', [AlumnoController::class, 'update']);
    Route::delete('/alumnos/{alumno}', [AlumnoController::class, 'destroy']);

    // Auth
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::patch('/profile/password', [AuthController::class, 'updatePassword'])->middleware('auth:sanctum');
    Route::post('/contacto', [ContactoController::class, 'enviar']);


    // Empresas
    // Route::get('/empresas', [EmpresaController::class, 'index']);
    Route::get('/empresas/{empresa}', [EmpresaController::class, 'show']);
    Route::put('/empresas/{empresa}', [EmpresaController::class, 'update']);
    Route::delete('/empresas/{empresa}', [EmpresaController::class, 'destroy']);

    // Opiniones
    Route::get('/mis-opiniones', [OpinionController::class, 'misOpiniones']);
    Route::post('/opiniones', [OpinionController::class, 'store']);
    Route::put('/opiniones/{opinion}', [OpinionController::class, 'update']);
    Route::delete('/opiniones/{opinion}', [OpinionController::class, 'destroy']);

    // Profesores
    Route::get('/profesores', [ProfesorController::class, 'index']);
    Route::get('/profesores/{profesor}', [ProfesorController::class, 'show']);
    Route::put('/profesores/{profesor}', [ProfesorController::class, 'update']);
    Route::delete('/profesores/{profesor}', [ProfesorController::class, 'destroy']);
});

// Rutas ADMIN
// Rutas ADMIN
Route::middleware(['auth:sanctum', AdminMiddleware::class])
    ->prefix('admin')
    ->group(function () {
        Route::apiResource('usuarios', AdminUsuarioController::class)
            ->parameters(['usuarios' => 'user'])
            ->except(['show']);

        Route::delete('usuarios/{user}/foto', [AdminUsuarioController::class, 'destroyFoto']);

        Route::apiResource('empresas', AdminEmpresaController::class)
            ->parameters(['empresas' => 'empresa']);

        Route::apiResource('sectores', AdminSectorController::class)
            ->parameters(['sectores' => 'sector'])
            ->except(['show']);

        Route::apiResource('ofertas', AdminOfertaController::class)
            ->parameters(['ofertas' => 'oferta']);

        Route::apiResource('titulos', AdminTituloController::class)
            ->parameters(['titulos' => 'titulo']);

        Route::apiResource('tecnologias', AdminTecnologiaController::class)
            ->parameters(['tecnologias' => 'tecnologia']);

        Route::apiResource('opiniones', AdminOpinionController::class)
            ->parameters(['opiniones' => 'opinion']);

        Route::apiResource('experiencias', AdminExperienciaController::class)
            ->parameters(['experiencias' => 'experiencia']);

        Route::apiResource('profesores', AdminProfesorController::class)
            ->parameters(['profesores' => 'profesor']);

        Route::apiResource('alumnos', AdminAlumnoController::class)
            ->parameters(['alumnos' => 'alumno']);
    });
