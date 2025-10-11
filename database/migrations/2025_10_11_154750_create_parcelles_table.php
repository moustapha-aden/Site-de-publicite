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
        Schema::create('parcelles', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // Titre de la parcelle
            $table->string('location'); // Localisation
            $table->decimal('price', 12, 2); // Prix
            $table->enum('type', ['terrain', 'maison', 'appartement', 'villa', 'bureau', 'commerce']); // Type de propriété
            $table->decimal('surface', 8, 2)->nullable(); // Surface en m²
            $table->integer('rooms')->nullable(); // Nombre de pièces
            $table->integer('bedrooms')->nullable(); // Nombre de chambres
            $table->integer('bathrooms')->nullable(); // Nombre de salles de bain
            $table->text('description')->nullable(); // Description
            $table->json('photos')->nullable(); // Photos
            $table->string('contact_number')->nullable(); // Numéro de contact
            $table->enum('status', ['active', 'inactive'])->default('active'); // Statut
            $table->boolean('is_featured')->default(false); // En vedette
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parcelles');
    }
};
