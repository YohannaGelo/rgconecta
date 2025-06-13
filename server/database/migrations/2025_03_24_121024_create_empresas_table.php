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
        Schema::create('empresas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique(); // Ej: "TechSolutions S.L."
            // $table->string('sector')->nullable(); // Opcional: "Tecnología", "Educación", etc.
            $table->foreignId('sector_id')->nullable()->constrained('sectores')->onDelete('set null');
            $table->string('web')->nullable(); // Opcional
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empresas');
    }
};
