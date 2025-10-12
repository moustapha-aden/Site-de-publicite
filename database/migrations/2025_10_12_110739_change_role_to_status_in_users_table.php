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
        Schema::table('users', function (Blueprint $table) {
            // Supprimer la colonne role
            $table->dropColumn('role');
            // Ajouter la colonne status
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active')->after('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Supprimer la colonne status
            $table->dropColumn('status');
            // Remettre la colonne role
            $table->string('role')->default('user')->after('email');
        });
    }
};
