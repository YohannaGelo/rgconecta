<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// 🧹 Comando para eliminar usuarios no verificados
Schedule::command('app:eliminar-usuarios-no-verificados')->daily();

// 🧹 Comando para eliminar ofertas expiradas
Schedule::command('app:eliminar-ofertas-expiradas')->daily();