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
        Schema::create('alumno_tecnologia', function (Blueprint $table) {
            $table->foreignId('alumno_id')->constrained()->onDelete('cascade');
            $table->foreignId('tecnologia_id')->constrained()->onDelete('cascade');
            $table->enum('nivel', ['basico', 'intermedio', 'avanzado']);
            $table->timestamps();
            
            // Clave primaria compuesta
            $table->primary(['alumno_id', 'tecnologia_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alumno_tecnologia');
    }
};
