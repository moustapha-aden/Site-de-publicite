import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LayoutDashboard, LogOut, Car, Wrench, Users, User
    // Fichiers non utilisés pour l'admin sont retirés: FileText, Briefcase
} from 'lucide-react';

// Le composant StatCard reste le même
const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className={`p-3 inline-flex items-center justify-center rounded-full bg-${color}-100 text-${color}-600 mb-4`}
        >
            <Icon className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-extrabold text-slate-900 mt-1">{value.toLocaleString('fr-FR')}</p>
    </div>
);

// --- Composant Dashboard (Optimisé pour Admin) ---

const Dashboard = ({ userData, handleLogout }) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Le rôle est ADMIN par défaut, pas besoin de logique conditionnelle complexe
    const userRole = userData.user.role || 'admin';
    const isAdmin = userRole === 'admin';
    // Si l'utilisateur n'est pas admin, il devrait être redirigé avant d'atteindre ce composant.

    // Si l'utilisateur n'est pas admin, on affiche un message d'erreur/redirection immédiat (bonne pratique)
    if (!isAdmin) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50">
                <p className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    Accès refusé. Ce tableau de bord est réservé aux administrateurs.
                </p>
            </div>
        );
    }


    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Appel vers le backend (qui retourne les stats ADMIN)
                const response = await axios.get("http://127.0.0.1:8000/api/dashboard");

                setDashboardData({
                    user: userData.user,
                    stats: response.data.stats,
                    message: response.data.message
                });

            } catch (err) {
                console.error("Erreur lors de la récupération du tableau de bord:", err);
                if (err.response && err.response.status === 401) {
                    setError("Session expirée ou non autorisée. Veuillez vous reconnecter.");
                    handleLogout();
                } else {
                    setError("Impossible de charger les données du tableau de bord.");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
        // On n'a plus besoin de 'userRole' ou d'autres variables de rôle dans les dépendances
    }, [userData.user.name, handleLogout]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50">
                <div className="text-center p-10 bg-white rounded-xl shadow-lg">
                    <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-lg font-medium text-slate-700">Chargement du Tableau de Bord...</p>
                </div>
            </div>
        );
    }

    const stats = dashboardData?.stats || {};
    const userName = dashboardData?.user?.name || "Administrateur";
    const dashboardTitle = 'Tableau de Bord Admin'; // Le titre est fixe


    return (
        <div className="min-h-screen bg-slate-50" style={{ fontFamily: 'Inter, sans-serif' }}>

            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center">
                        <LayoutDashboard className="w-6 h-6 text-indigo-600 mr-3" />
                        <h1 className="text-2xl font-bold text-slate-900">{dashboardTitle}</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-slate-700 hidden sm:inline">Bienvenue, <span className="font-semibold text-indigo-600">{userName}</span></span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 transition duration-200 shadow-md"
                        >
                            <LogOut className="w-4 h-4 mr-2" /> Déconnexion
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0">

                    {error && <p className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</p>}

                    {/* Message de bienvenue */}
                    <div className="mb-8 p-6 bg-indigo-50 border border-indigo-200 rounded-xl shadow-sm">
                        <p className="text-lg font-semibold text-indigo-800">{dashboardData?.message || `Bienvenue sur votre espace, ${userName}.`}</p>
                    </div>

                    {/* Grille de Statistiques (Fixée pour Admin) */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {/* ⚠️ Assurez-vous que le backend renvoie bien ces clés : total_vehicules, reparations_en_cours, nouveaux_clients, techniciens_actifs */}
                        <StatCard icon={Car} title="Total Véhicules" value={stats.total_vehicules || 0} color="indigo" />
                        <StatCard icon={Wrench} title="Réparations en Cours" value={stats.reparations_en_cours || 0} color="amber" />
                        <StatCard icon={Users} title="Nouveaux Clients (Mois)" value={stats.nouveaux_clients || 0} color="emerald" />
                        <StatCard icon={User} title="Techniciens Actifs" value={stats.techniciens_actifs || 0} color="pink" />
                    </div>

                    {/* Section rapide d'actions (Fixée pour Admin) */}
                    <div className="mt-12">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Actions Rapides</h2>
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                             <div className="flex space-x-4">
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Gérer les Utilisateurs</button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Ajouter un Véhicule</button>
                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Voir tous les Devis</button>
                             </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;
