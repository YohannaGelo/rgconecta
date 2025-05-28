<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MensajeOfertaMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public $emisor,
        public $oferta,
        public $mensaje
    ) {}

    public function build()
    {
        $frontendUrl = env('FRONTEND_URL');

        return $this->subject("🧑🏻‍💻 Nueva consulta sobre tu oferta - RG Conecta")
            ->html("
                <div style='font-family: Arial, sans-serif; background-color: #eaeff4; padding: 15px;'>

                    <!-- Cabecera (Card 1) -->
                    <div style='background-color: #ffffff; margin: 0 auto; border-radius: 12px; padding: 20px; text-align: center;
                                        box-shadow: 0 2px 5px rgba(0,0,0,0.05); margin-bottom: 15px; max-width: 500px;'>
                        <a href='{$frontendUrl}'>
                            <img src='https://res.cloudinary.com/dnyqgpinf/image/upload/v1748027218/banner_RG_web_veaxjr.png'
                                alt='Ruiz Gijón Conecta' style='max-width: 160px; height: auto;' />
                        </a>
                    </div>

                    <!-- Cuerpo principal (Card 2) -->
                    <div style='background-color: #ffffff; color: #999ea2; margin: 0 auto; border-radius: 12px; padding: 20px;
                                        box-shadow: 0 2px 5px rgba(0,0,0,0.05); margin-bottom: 15px; max-width: 500px;'>
                        <h2 style='color: #2b4e84;'>Hola, {$this->oferta->user->name}</h2>
                        <p style='margin-top: 1rem;'>Has recibido un nuevo mensaje sobre tu oferta:</p>

                        <div style='background-color: #f0f0f0; padding: 15px; border-radius: 6px; margin: 20px 0;'>
                            {$this->mensaje}
                        </div>

                        <p><strong>Remitente:</strong> {$this->emisor->name} ({$this->emisor->email})</p>

                        <hr style='margin: 30px 0;'>

                        <p style='font-size: 14px; color: #888;'>Oferta: <strong>{$this->oferta->titulo}</strong></p>
                        <p style='font-size: 14px; color: #888;'>Fecha de publicación: {$this->oferta->created_at->format('d/m/Y')}</p>

                        <div style='text-align: center; margin-top: 30px;'>
                            <a href='{$frontendUrl}/ofertas/{$this->oferta->id}' style='background-color: #2b4e84; color: white; padding: 10px 20px;
                                                border-radius: 6px; text-decoration: none; font-weight: bold;'>
                                Ver oferta
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
            subject: '🧑🏻‍💻 Nueva consulta sobre tu oferta - RG Conecta',
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
