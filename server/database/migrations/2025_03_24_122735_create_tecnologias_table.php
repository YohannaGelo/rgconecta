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
        Schema::create('tecnologias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre'); // Ej: "PHP", "Angular"
            $table->enum('tipo', [
                'frontend',
                'backend',
                'fullstack',
                'database',
                'devops',
                'ofimatica',
                'idioma',
                'marketing',
                'gestion',
                'disenio',
                'otros'
            ])->default('otros');
            $table->timestamps();

            // Evita duplicados tipo: PHP + programacion repetido
            $table->unique(['nombre', 'tipo']);
        });

        // Tabla pivot para ofertas
        Schema::create('requisitos_oferta', function (Blueprint $table) {
            $table->foreignId('oferta_id')->constrained()->onDelete('cascade');
            $table->foreignId('tecnologia_id')->constrained()->onDelete('cascade');
            $table->enum('nivel', ['basico', 'intermedio', 'avanzado'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tecnologias');
    }
};
