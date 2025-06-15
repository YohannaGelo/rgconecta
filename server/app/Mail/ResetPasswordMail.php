<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $url;

    /**
     * Create a new message instance.
     */
        public function __construct(string $resetUrl)
    {
        $this->url = $resetUrl;
    }

    public function build()
    {
        $frontendUrl = config('app.frontend_url');

        return $this->subject('🔐 Recupera tu contraseña - RG Conecta')
            ->html("
            <div style='font-family: Arial, sans-serif; background-color: #eaeff4; padding: 15px;'>

                <!-- Banner -->
                <div style='background-color: #ffffff; border-radius: 12px; padding: 20px; text-align: center; max-width: 500px; margin: 0 auto 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);'>
                    <a href='{$frontendUrl}'>
                        <img src='https://res.cloudinary.com/dnyqgpinf/image/upload/v1748027218/banner_RG_web_veaxjr.png'
                            alt='Ruiz Gijón Conecta' style='max-width: 160px;' />
                    </a>
                </div>

                <!-- Cuerpo -->
                <div style='background-color: #ffffff; color: #444; border-radius: 12px; padding: 20px; max-width: 500px; margin: 0 auto 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);'>
                    <h2 style='color: #2b4e84; text-align: center;'>¿Olvidaste tu contraseña?</h2>
                    <p>Hemos recibido una solicitud para restablecer tu contraseña en <strong>Ruiz Gijón Conecta</strong>.</p>
                    <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>

                    <div style='text-align: center; margin: 30px 0;'>
                        <a href='{$this->url}' style='display: inline-block; padding: 12px 24px; background-color: #2b4e84; color: white;
                                            text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;'>
                            Restablecer contraseña
                        </a>

                    </div>

                    <p style='font-size: 14px; color: #777;'>Si no solicitaste este cambio, puedes ignorar este correo.</p>
                </div>

                <!-- Footer -->
                <div style='background-color: #ffffff; border-radius: 12px; padding: 20px; text-align: center; max-width: 500px; margin: 0 auto; font-size: 13px; color: #999; box-shadow: 0 2px 5px rgba(0,0,0,0.05);'>
                    Ruiz Gijón Conecta · IES Ruiz Gijón · © " . date('Y') . "
                    <p style='margin-top: 10px; color: #a0aec0; font-size: 12px;'>Este es un mensaje automático. Por favor no respondas a este correo.</p>
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
            subject: '🔐 Recupera tu contraseña - RG Conecta',
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
