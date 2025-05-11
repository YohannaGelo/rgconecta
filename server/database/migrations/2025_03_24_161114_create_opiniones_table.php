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
        // Schema::create('opiniones', function (Blueprint $table) {
        //     $table->id();
        //     $table->foreignId('alumno_id')->constrained()->onDelete('cascade');
        //     $table->foreignId('empresa_id')->constrained()->onDelete('cascade'); 
        //     $table->integer('anios_en_empresa');
        //     $table->text('contenido'); 
        //     $table->unsignedTinyInteger('valoracion')->between(1, 5); // Opcional: puntuación
        //     $table->timestamps();
        // });
        Schema::create('opiniones', function (Blueprint $table) {
            $table->id();

            // Nuevo: relación directa con usuarios
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->foreignId('empresa_id')->constrained()->onDelete('cascade');
            $table->integer('anios_en_empresa')->default(0);
            $table->text('contenido');
            $table->unsignedTinyInteger('valoracion'); // puntuación de 1 a 5
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opiniones');
    }
};
