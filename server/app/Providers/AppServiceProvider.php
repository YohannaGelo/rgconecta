<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;
use Illuminate\Notifications\Messages\MailMessage;

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
    // public function boot(): void
    // {
    //     $this->configureRateLimiting();

    //     Route::prefix('api')
    //         ->middleware('api')
    //         ->group(base_path('routes/api.php'));

    //     // Registra la política para el modelo Opinion
    //     Gate::policy(Opinion::class, OpinionPolicy::class);
    // }

    public function boot(): void
    {
        $this->configureRateLimiting();

        Route::prefix('api')
            ->middleware('api')
            ->group(base_path('routes/api.php'));

        // Política de opiniones
        Gate::policy(Opinion::class, OpinionPolicy::class);

        // ✅ OVERRIDE del correo de verificación
        VerifyEmail::toMailUsing(function ($notifiable, $url) {
            $customUrl = URL::temporarySignedRoute(
                'verification.verify',
                Carbon::now()->addMinutes(60),
                [
                    'id' => $notifiable->getKey(),
                    'hash' => sha1($notifiable->getEmailForVerification()),
                ]
            );

            $frontendUrl = env('FRONTEND_URL') . '/verificar?url=' . urlencode($customUrl);

            return (new MailMessage)
                ->subject('Verifica tu dirección de correo')
                ->line('Haz clic en el botón para verificar tu dirección de correo electrónico.')
                ->action('Verificar correo', $frontendUrl)
                ->line('Si no creaste esta cuenta, no necesitas hacer nada.');
        });
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
