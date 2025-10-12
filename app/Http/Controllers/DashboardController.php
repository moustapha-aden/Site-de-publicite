<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Parcelle;
use App\Models\User;
use App\Models\Vehicule;
use Illuminate\Http\Request;
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
        $totalParcelles = Parcelle::count();
        $totalLocations = DB::table('locations')->where('status', 'active')->count();
        $totalUtilisateurs = User::count();
        // // Exemple: Nous allons supposer une table "Reparation"
        // $reparationsEnCours = DB::table('reparations')->where('status', 'en_cours')->count();
        // ✅ La remplacer par une valeur par défaut de 0
        $reparationsEnCours = 0;

        $stats = [
            // Clés utilisées par le Frontend React (voir ci-dessous)
            'total_vehicules' => $totalVehicules,
            'total_parcelles' => $totalParcelles,
            'total_locations' => $totalLocations,
            'total_utilisateurs' => $totalUtilisateurs,
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
