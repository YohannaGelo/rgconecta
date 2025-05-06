<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('titulos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre'); // Ej: "DAW", "Ingeniería Informática"
            $table->enum('tipo', [
                'ciclo_medio',
                'ciclo_superior',
                'grado_universitario',
                'master',
                'doctorado',
                'otros'
            ]);
            $table->timestamps();
        });

        Schema::create('alumno_titulo', function (Blueprint $table) {
            $table->foreignId('alumno_id')->constrained()->onDelete('cascade');
            $table->foreignId('titulo_id')->constrained()->onDelete('cascade');
            $table->year('fecha_inicio'); // Año de inicio del estudio
            $table->year('fecha_fin')->nullable(); // Año de finalización (nullable si está en curso)
            $table->string('institucion')->default('IES Ruiz Gijón'); // Ej: "Universidad de Sevilla"
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('titulos');
    }
};
