<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Test du système de mot de passe oublié ===\n\n";

// Vérifier s'il y a des utilisateurs
$user = User::first();
if (!$user) {
    echo "❌ Aucun utilisateur trouvé dans la base de données.\n";
    echo "Créez d'abord un utilisateur avec: php artisan make:seeder UserSeeder\n";
    exit(1);
}

echo "✅ Utilisateur trouvé: {$user->email}\n";
echo "📧 Test de l'envoi d'email de mot de passe oublié...\n\n";

try {
    // Générer un token de reset
    $token = Str::random(64);

    // Supprimer les anciens tokens pour cet email
    DB::table('password_resets')->where('email', $user->email)->delete();

    // Insérer le nouveau token
    DB::table('password_resets')->insert([
        'email' => $user->email,
        'token' => Hash::make($token),
        'created_at' => now()
    ]);

    // Envoyer l'email de notification
    $user->notify(new ResetPasswordNotification($token));

    echo "✅ Email envoyé avec succès!\n";
    echo "🔗 Token généré: {$token}\n";
    echo "📝 URL de réinitialisation: http://localhost:5173/reset-password?token={$token}&email=" . urlencode($user->email) . "\n\n";

    echo "📋 Instructions:\n";
    echo "1. Vérifiez les logs Laravel: storage/logs/laravel.log\n";
    echo "2. Copiez l'URL de réinitialisation ci-dessus\n";
    echo "3. Ouvrez cette URL dans votre navigateur\n";
    echo "4. Testez la réinitialisation du mot de passe\n\n";

} catch (Exception $e) {
    echo "❌ Erreur lors de l'envoi de l'email: " . $e->getMessage() . "\n";
    exit(1);
}

echo "🎉 Test terminé avec succès!\n";
