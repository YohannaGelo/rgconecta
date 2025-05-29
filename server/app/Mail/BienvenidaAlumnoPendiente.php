<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BienvenidaAlumnoPendiente extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(public $alumno)
    {
        $alumno->load('user');
    }

    public function build()
    {
        $frontendUrl = config('app.frontend_url');

        return $this->subject('🪪 Registro recibido - En revisión - RG Conecta')
            ->html("
        <div style='font-family: Arial, sans-serif; background-color: #eaeff4; padding: 15px;'>

            <!-- Navbar (Card 1) -->
            <div style='background-color: #ffffff; margin: 0 auto; border-radius: 12px; padding: 20px; text-align: center;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.05); margin-bottom: 15px; max-width: 500px;'>
                <a href='{$frontendUrl}'>
                    <img src='https://res.cloudinary.com/dnyqgpinf/image/upload/v1748027218/banner_RG_web_veaxjr.png'
                        alt='Ruiz Gijón Conecta' style='max-width: 160px; height: auto;' />
                </a>
            </div>

            <!-- Body principal (Card 2) -->
            <div style='background-color: #ffffff; color: #999ea2; margin: 0 auto; border-radius: 12px; padding: 20px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.05); margin-bottom: 15px; max-width: 500px;'>
                <h2 style='color: #2b4e84; text-align: center;'>¡Hola, {$this->alumno->user->name}!</h2>
                <p style='margin: 1rem;'>Gracias por registrarte en <strong>Ruiz Gijón Conecta</strong>.</p>
                <p style='margin: 1rem;'>Tu perfil ha sido recibido y será revisado para confirmar que eres antiguo alumno del centro.</p>
                <p style='margin: 1rem;'>Te enviaremos un correo cuando tu cuenta haya sido verificada.</p>

                <div style='text-align: center; margin-top: 30px;'>
                    <a href='{$frontendUrl}'
                    style='display: inline-block; padding: 12px 24px; background-color: #2b4e84; color: white;
                            text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;'>
                    Ir a la plataforma
                    </a>
                </div>
            </div>

            <!-- Footer (Card 3) -->
            <div style='background-color: #ffffff; margin: 0 auto; border-radius: 12px; padding: 20px; text-align: center;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.05); font-size: 13px; color: #999; max-width: 500px;'>
                Ruiz Gijón Conecta · IES Ruiz Gijón · © " . date('Y') . "
                <p style='margin: 15px 0 0 0; color: #a0aec0; font-size: 12px;'>
                    Este es un mensaje automático. Por favor no respondas a este correo.
                </p>
            </div>

        </div>
    ");
    }


    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🪪 Registro recibido - En revisión - RG Conecta',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'view.name',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
