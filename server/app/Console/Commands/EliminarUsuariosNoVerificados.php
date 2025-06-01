<?php

namespace App\Console\Commands;

use Cloudinary\Cloudinary;
use Carbon\Carbon;
use App\Models\User;

use Illuminate\Console\Command;


class EliminarUsuariosNoVerificados extends Command
{

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:eliminar-usuarios-no-verificados';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $limite = Carbon::now()->subDays(60);

        $usuarios = User::whereNull('email_verified_at')
            ->where('created_at', '<', $limite)
            ->get();

        $this->info("Encontrados {$usuarios->count()} usuarios no verificados para eliminar.");

        foreach ($usuarios as $usuario) {
            $this->info("Eliminando usuario ID {$usuario->id} - {$usuario->email}");

            // Si es alumno, elimina también su modelo y relaciones
            if ($usuario->role === 'alumno' && $usuario->alumno) {
                $usuario->alumno->tecnologias()->detach();
                $usuario->alumno->experiencias()->delete();
                $usuario->alumno->delete();
            }

            // Elimina foto de Cloudinary si aplica
            if ($usuario->foto_perfil_public_id) {
                try {
                    $cloudinary = new Cloudinary(config('cloudinary'));
                    $cloudinary->uploadApi()->destroy($usuario->foto_perfil_public_id);
                    $this->info("Foto Cloudinary eliminada para el usuario ID {$usuario->id}");
                } catch (\Exception $e) {
                    \Log::error("Error eliminando foto Cloudinary: " . $e->getMessage());
                }
            }

            $usuario->delete();
        }

        $this->info("Proceso completado.");
    }
}
