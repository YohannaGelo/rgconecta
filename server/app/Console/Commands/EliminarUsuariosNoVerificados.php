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
        $limite = Carbon::now()->subDays(30);

        $this->info("⏳ Buscando usuarios no verificados creados antes del: " . $limite->toDateString());

        $usuarios = User::whereNull('email_verified_at')
            ->where('created_at', '<', $limite)
            ->get();

        if ($usuarios->isEmpty()) {
            $this->info('✅ No hay usuarios pendientes de verificación para eliminar.');
            return;
        }

        $this->info("🔍 Encontrados {$usuarios->count()} usuarios no verificados para eliminar.");

        foreach ($usuarios as $usuario) {
            $this->line("🗑️ Eliminando usuario ID {$usuario->id} - {$usuario->email}");

            if ($usuario->role === 'alumno' && $usuario->alumno) {
                $this->line("📚 Eliminando datos de alumno asociados...");
                $usuario->alumno->tecnologias()->detach();
                $usuario->alumno->experiencias()->delete();
                $usuario->alumno->delete();
            }

            if ($usuario->foto_perfil_public_id) {
                $this->line("🖼️ Eliminando foto de Cloudinary...");
                try {
                    $cloudinary = new Cloudinary(config('cloudinary'));
                    $cloudinary->uploadApi()->destroy($usuario->foto_perfil_public_id);
                    $this->info("✅ Foto Cloudinary eliminada para el usuario ID {$usuario->id}");
                } catch (\Exception $e) {
                    \Log::error("❌ Error eliminando foto Cloudinary: " . $e->getMessage());
                    $this->warn("⚠️ No se pudo eliminar la foto en Cloudinary.");
                }
            }

            $usuario->delete();
        }

        $this->info("🏁 Proceso completado.");
    }
}
