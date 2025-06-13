<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\HtmlString;

class CustomVerifyEmail extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }



    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    // public function toMail($notifiable)
    // {
    //     $verificationUrl = URL::temporarySignedRoute(
    //         'verification.verify',
    //         Carbon::now()->addMinutes(60),
    //         [
    //             'id' => $notifiable->getKey(),
    //             'hash' => sha1($notifiable->getEmailForVerification()),
    //         ]
    //     );

    //     return (new MailMessage)
    //         ->subject('📮 Verifica tu dirección de correo')
    //         ->view('vendor.notifications.email', [ // Usa tu propia vista
    //             'url' => $verificationUrl,
    //             'user' => $notifiable,
    //         ]);
    // }
    public function toMail($notifiable)
    {
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(60),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );

        return (new MailMessage)
            ->subject('📮 Verifica tu dirección de correo')
            ->view('emails.verify', [ // Ahora usa tu vista personalizada
                'verificationUrl' => $verificationUrl,
                'url' => env('FRONTEND_URL'),
                'nombre' => $notifiable->name,
            ]);
    }




    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
