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
        Schema::create('ofertas', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('descripcion');
            // $table->string('empresa_nombre'); // Texto libre
            $table->foreignId('empresa_id')->nullable()->constrained();
            $table->text('sobre_empresa')->nullable();
            $table->foreignId('user_id')->constrained(); // Publicado por (profesor/alumno)
            $table->enum('jornada', ['completa', 'media_jornada', '3_6_horas', 'menos_3_horas']);
            $table->foreignId('titulacion_id')->nullable()->constrained('titulos')->nullOnDelete();
            $table->integer('anios_experiencia')->nullable()->default(0);
            $table->string('localizacion');
            $table->date('fecha_publicacion');
            $table->date('fecha_expiracion');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ofertas');
    }
};
