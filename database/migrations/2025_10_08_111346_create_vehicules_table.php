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
        Schema::create('vehicules', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('brand');
            $table->string('model');
            $table->year('year');
            $table->decimal('price', 12, 2);
            $table->integer('mileage');
            $table->string('fuel');
            $table->string('transmission');
            $table->string('color');
            $table->text('description')->nullable();
            $table->json('photos')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new')->default(true);
            $table->string('contact_number')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicules');
    }
};
