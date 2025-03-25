<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    // public function boot(): void
    // {
    //     Route::prefix('api')
    //     ->middleware('api')
    //     ->group(function () {
    //         Route::apiResource('ofertas', \App\Http\Controllers\Api\OfertaController::class);
    //         Route::apiResource('alumnos', \App\Http\Controllers\Api\AlumnoController::class);
    //     });
    // }

    public function boot(): void
    {
        $this->configureRateLimiting();

        Route::prefix('api')
            ->middleware('api')
            ->group(base_path('routes/api.php'));
    }

     /**
     * Configure the rate limiting for the application.
     */
    protected function configureRateLimiting(): void
    {
        // Definir la lógica de limitación de velocidad aquí (opcional)
        // Ejemplo:
        // RateLimiter::for('api', function (Request $request) {
        //     return Limit::perMinute(60);
        // });
    }
}
