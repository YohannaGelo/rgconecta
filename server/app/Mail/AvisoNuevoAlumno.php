<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AvisoNuevoAlumno extends Mailable
{
    use Queueable, SerializesModels;

    public $url;

    /**
     * Create a new message instance.
     */
    public function __construct(public $alumno, $url)
    {
        $alumno->load('user');
        $this->url = $url;
    }

    public function build()
    {
        $frontendUrl = config('app.frontend_url');

        return $this->subject('👤 Nuevo alumno registrado - RG Conecta')
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
                        <h2 style='color: #2b4e84; text-align: center;'>Nuevo alumno registrado</h2>
                        <p style='margin: 1rem;'>Se ha registrado un nuevo alumno en la plataforma. A continuación sus datos:</p>

                        <ul style='padding: 0 2.5rem; margin: 0 0 25px 0;'>
                            <li style='margin-bottom: 8px;'><strong>Nombre:</strong> {$this->alumno->user->name}</li>
                            <li style='margin-bottom: 8px;'><strong>Email:</strong> {$this->alumno->user->email}</li>
                        </ul>
                        <p style='margin: 1rem;'>Este alumno está pendiente de verificación. Si tienes un momento, accede a la
                            plataforma para revisar su perfil.</p>
                        <div style='text-align: center; margin-top: 30px;'>
                            <a href='{$this->url}' style='display: inline-block; padding: 12px 24px; background-color: #2b4e84; color: white;
                                            text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;'>
                                Verificar alumno
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
            subject: '👤 Nuevo alumno registrado - RG Conecta',
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
