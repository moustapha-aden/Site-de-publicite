<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Models\User;
use App\Notifications\SendRealPasswordNotification;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Test du système de mot de passe réel ===\n\n";

// Récupérer un utilisateur
$user = User::first();
if (!$user) {
    echo "❌ Aucun utilisateur trouvé dans la base de données.\n";
    exit(1);
}

echo "✅ Utilisateur trouvé: {$user->email}\n";
echo "🔐 Mot de passe en clair stocké: {$user->plain_password}\n\n";

echo "📧 Test de l'envoi de l'email avec le vrai mot de passe...\n\n";

try {
    // Envoyer l'email avec le vrai mot de passe
    $user->notify(new SendRealPasswordNotification($user->plain_password));

    echo "✅ Email envoyé avec succès!\n\n";

    echo "📋 Instructions de test:\n";
    echo "1. Vérifiez les logs Laravel: storage/logs/laravel.log\n";
    echo "2. Cherchez l'email avec le mot de passe réel\n";
    echo "3. L'email devrait contenir: {$user->plain_password}\n";
    echo "4. Allez sur http://localhost:5173/login\n";
    echo "5. Connectez-vous avec:\n";
    echo "   - Email: {$user->email}\n";
    echo "   - Mot de passe: {$user->plain_password}\n\n";

} catch (Exception $e) {
    echo "❌ Erreur lors de l'envoi de l'email: " . $e->getMessage() . "\n";
    exit(1);
}

echo "🎉 Test terminé avec succès!\n";
echo "💡 Le système envoie maintenant le VRAI mot de passe de l'utilisateur par email!\n";
