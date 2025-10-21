<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Models\User;
use App\Notifications\SendTemporaryPasswordNotification;
use Illuminate\Support\Facades\Hash;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Test du nouveau système de mot de passe temporaire ===\n\n";

// Vérifier s'il y a des utilisateurs
$user = User::first();
if (!$user) {
    echo "❌ Aucun utilisateur trouvé dans la base de données.\n";
    echo "Créez d'abord un utilisateur avec: php artisan make:seeder UserSeeder\n";
    exit(1);
}

echo "✅ Utilisateur trouvé: {$user->email}\n";
echo "🔐 Ancien mot de passe hashé: " . substr($user->password, 0, 20) . "...\n\n";

echo "📧 Test de génération et envoi du mot de passe temporaire...\n\n";

try {
    // Générer un mot de passe temporaire (même logique que dans le contrôleur)
    $uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $lowercase = 'abcdefghijklmnopqrstuvwxyz';
    $numbers = '0123456789';
    $symbols = '!@#$%^&*';

    $temporaryPassword = '';

    // Assurer au moins un caractère de chaque type
    $temporaryPassword .= $uppercase[rand(0, strlen($uppercase) - 1)];
    $temporaryPassword .= $lowercase[rand(0, strlen($lowercase) - 1)];
    $temporaryPassword .= $numbers[rand(0, strlen($numbers) - 1)];
    $temporaryPassword .= $symbols[rand(0, strlen($symbols) - 1)];

    // Remplir le reste avec des caractères aléatoires
    $allChars = $uppercase . $lowercase . $numbers . $symbols;
    for ($i = 4; $i < 12; $i++) {
        $temporaryPassword .= $allChars[rand(0, strlen($allChars) - 1)];
    }

    // Mélanger les caractères
    $temporaryPassword = str_shuffle($temporaryPassword);

    echo "🔑 Mot de passe temporaire généré: {$temporaryPassword}\n";

    // Mettre à jour le mot de passe de l'utilisateur
    $user->password = Hash::make($temporaryPassword);
    $user->save();

    echo "✅ Mot de passe mis à jour dans la base de données\n";

    // Envoyer l'email avec le mot de passe temporaire
    $user->notify(new SendTemporaryPasswordNotification($temporaryPassword));

    echo "✅ Email envoyé avec succès!\n\n";

    echo "📋 Instructions de test:\n";
    echo "1. Vérifiez les logs Laravel: storage/logs/laravel.log\n";
    echo "2. Cherchez l'email avec le mot de passe temporaire\n";
    echo "3. Utilisez ce mot de passe pour vous connecter: {$temporaryPassword}\n";
    echo "4. Allez sur http://localhost:5173/login\n";
    echo "5. Connectez-vous avec l'email: {$user->email}\n";
    echo "6. Et le mot de passe temporaire: {$temporaryPassword}\n\n";

} catch (Exception $e) {
    echo "❌ Erreur lors de l'envoi de l'email: " . $e->getMessage() . "\n";
    exit(1);
}

echo "🎉 Test terminé avec succès!\n";
echo "💡 Le système envoie maintenant directement le mot de passe par email au lieu d'un lien de réinitialisation.\n";
