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

    /**
     * Create a new message instance.
     */
    public function __construct(public $alumno)
    {
        $alumno->load('user');
    }

    public function build()
    {
        return $this->subject('👤 Nuevo alumno registrado')
            ->html("
            <p>Se ha registrado un nuevo alumno:</p>
            <ul>
              <li>Nombre: {$this->alumno->user->name}</li>
              <li>Email: {$this->alumno->user->email}</li>
            </ul>
            <p>Revisa y verifica su perfil desde el panel de administración.</p>
        ");
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '👤 Nuevo alumno registrado',
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
