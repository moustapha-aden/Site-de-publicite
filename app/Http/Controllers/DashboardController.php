<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vehicule;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Gère la logique et les données du tableau de bord d'administration.
 */
class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $userRole = 'admin'; // Fixe à 'admin'

        // Calcul des statistiques
        $totalVehicules = Vehicule::count();
        // // Exemple: Nous allons supposer une table "Reparation"
        // $reparationsEnCours = DB::table('reparations')->where('status', 'en_cours')->count();
        // ✅ La remplacer par une valeur par défaut de 0
        $reparationsEnCours = 0;

        $stats = [
            // Clés utilisées par le Frontend React (voir ci-dessous)
            'total_vehicules' => $totalVehicules,
            'reparations_en_cours' => $reparationsEnCours,
            // etc.
        ];

        $message = "Bienvenue sur le tableau de bord de l'administration, {$user->name} !";

        return response()->json([
            'message' => $message,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $userRole,
            ],
            'stats' => $stats,
        ]);
    }
}
