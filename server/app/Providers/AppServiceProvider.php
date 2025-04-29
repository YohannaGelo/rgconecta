<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\Gate;
use App\Models\Opinion;
use App\Policies\OpinionPolicy;

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
    public function boot(): void
    {
        $this->configureRateLimiting();

        Route::prefix('api')
            ->middleware('api')
            ->group(base_path('routes/api.php'));

        // Registra la política para el modelo Opinion
        Gate::policy(Opinion::class, OpinionPolicy::class);
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
