<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Models\User;
use App\Notifications\SendRealPasswordNotification;
use Illuminate\Support\Facades\Hash;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Configuration des mots de passe en clair ===\n\n";

// Récupérer tous les utilisateurs
$users = User::all();

if ($users->isEmpty()) {
    echo "❌ Aucun utilisateur trouvé dans la base de données.\n";
    exit(1);
}

echo "👥 Utilisateurs trouvés: " . $users->count() . "\n\n";

foreach ($users as $user) {
    echo "📧 Traitement de: {$user->email}\n";

    // Si l'utilisateur n'a pas de mot de passe en clair, on en génère un
    if (!$user->plain_password) {
        // Générer un mot de passe simple pour la démonstration
        $plainPassword = 'password123'; // Vous pouvez changer ceci

        // Mettre à jour le mot de passe hashé et le mot de passe en clair
        $user->password = Hash::make($plainPassword);
        $user->plain_password = $plainPassword;
        $user->save();

        echo "  ✅ Mot de passe en clair défini: {$plainPassword}\n";
    } else {
        echo "  ℹ️  Mot de passe en clair déjà défini: {$user->plain_password}\n";
    }
}

echo "\n🎉 Configuration terminée!\n";
echo "\n📋 Instructions de test:\n";
echo "1. Allez sur http://localhost:5173/login\n";
echo "2. Cliquez sur 'Mot de passe oublié ?'\n";
echo "3. Entrez l'email d'un utilisateur\n";
echo "4. Vérifiez les logs Laravel pour voir l'email avec le vrai mot de passe\n";
echo "5. Utilisez ce mot de passe pour vous connecter\n\n";

echo "🔐 Mots de passe configurés:\n";
foreach ($users as $user) {
    echo "• {$user->email} : {$user->plain_password}\n";
}
