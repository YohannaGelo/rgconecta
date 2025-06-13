<?php

namespace App\Console\Commands;


use Illuminate\Console\Command;
use App\Models\Oferta;
use Carbon\Carbon;

class EliminarOfertasExpiradas extends Command
{


    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:eliminar-ofertas-expiradas';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Elimina ofertas que hayan expirado hace más de 7 días';


    /**
     * Execute the console command.
     */
    public function handle()
    {
        $limite = Carbon::now()->subDays(15); // hace más de 15 días

        $this->info("⏳ Buscando ofertas expiradas antes del: " . $limite->toDateString());

        $ofertas = Oferta::where('fecha_expiracion', '<', $limite)->get();

        if ($ofertas->isEmpty()) {
            $this->info('✅ No hay ofertas que eliminar.');
            return;
        }

        $this->info("🔍 Ofertas encontradas para eliminar: " . $ofertas->count());

        // Opcional: listar IDs o títulos
        foreach ($ofertas as $oferta) {
            $this->line(" - [ID {$oferta->id}] {$oferta->titulo}");
        }

        $eliminadas = Oferta::whereIn('id', $ofertas->pluck('id'))->delete();

        $this->info("🗑️ Ofertas eliminadas: $eliminadas");
    }
}
