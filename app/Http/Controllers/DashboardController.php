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
    /**
     * Récupère et retourne les données nécessaires pour le tableau de bord (Admin uniquement).
     * Cette route est protégée par le middleware 'auth:sanctum'.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // L'objet $request->user() est disponible grâce à 'auth:sanctum'
        $user = $request->user();

        // Le rôle est fixe à 'admin' car il n'y a pas d'autres rôles implémentés actuellement.
        $userRole = 'admin';

        // Statistiques dynamiques depuis la base
        $totalVehicules = Vehicule::count();
        $vehiculesVedettes = Vehicule::where('is_featured', true)->count();
        $vehiculesNeufs = Vehicule::where('is_new', true)->count();
        $prixMoyen = Vehicule::avg('price');
        $prixMin = Vehicule::min('price');
        $prixMax = Vehicule::max('price');

        $clientsTotal = User::count();
        $clientsDerniers30Jours = User::where('created_at', '>=', now()->subDays(30))->count();

        $stats = [
            'total_vehicules' => $totalVehicules,
            'vehicules_vedettes' => $vehiculesVedettes,
            'vehicules_neufs' => $vehiculesNeufs,
            'prix_moyen' => round((float) $prixMoyen, 2),
            'prix_min' => $prixMin ? (float) $prixMin : 0,
            'prix_max' => $prixMax ? (float) $prixMax : 0,
            'clients_total' => $clientsTotal,
            'nouveaux_clients_30j' => $clientsDerniers30Jours,
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
