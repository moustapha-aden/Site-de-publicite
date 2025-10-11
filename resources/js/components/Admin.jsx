import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Users,
    Car,
    BarChart3,
    Settings,
    Plus,
    Edit,
    Trash2,
    Eye,
    LogOut,
    Loader2,
    Tag // 1. ⚠️ Ajout de l'icône Tag pour les marques
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// 2. ⚠️ Import du composant de gestion des marques
import BrandManagement from './BrandManagement';
import { API_URL } from '../api';

// --- Composants Réutilisables ---

// StatCard réutilisé (inchangé)
const StatCard = ({ icon: Icon, title, value, color, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center">
            <div className="flex-shrink-0">
                {/* NOTE: Les classes Tailwind dynamiques comme 'text-${color}-600' doivent être définies explicitement
                    dans un fichier de configuration pour fonctionner correctement dans une application React */}
                <Icon className={`h-8 w-8 text-${color}-600`} />
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
                {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
            </div>
        </div>
    </div>
);

// --- Composant Principal Admin ---

export default function Admin() {
    // 3. ⚠️ Récupération du token
    const { user, logout, token } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');

    const [dashboardStats, setDashboardStats] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL de base de votre API Laravel
    const API_BASE_URL=API_URL;

    // 1. Fonction de chargement des statistiques du Dashboard
    const fetchDashboardStats = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard`);

            const apiStats = response.data.stats;

            console.log('les donnees :',apiStats);

            const formattedStats = [
                { name: 'total_vehicules', value: apiStats.total_vehicules?.toLocaleString() || '0', icon: Car, color: 'indigo' },
                // Vous pouvez ajouter d'autres stats ici
            ];

            setDashboardStats(formattedStats);
        } catch (err) {
            console.error("Erreur de chargement des stats:", err);
            setError("Impossible de charger les statistiques.");
        }
    }, [API_BASE_URL]); // Ajout de API_BASE_URL dans les dépendances pour useCallback


    // 2. Fonction de chargement des Véhicules
    const fetchVehicles = useCallback(async () => {
        try {
            // Utiliser le token pour les endpoints protégés
            const response = await axios.get(`${API_BASE_URL}/vehicles`, {
                 headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setVehicles(response.data.data || response.data);
        } catch (err) {
            console.error("Erreur de chargement des véhicules:", err);
            setError("Impossible de charger la liste des véhicules.");
        }
    }, [API_BASE_URL, token]);


    // Effet pour charger les données lors du changement d'onglet
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);

            // Charger les données spécifiques à l'onglet actif
            if (activeTab === 'dashboard') {
                await fetchDashboardStats();
            } else if (activeTab === 'vehicles') {
                await fetchVehicles();
            }
            // L'onglet 'brands' est géré par son propre hook (BrandManagement),
            // donc on ne fait rien ici pour 'brands' à part enlever le loader général.

            setIsLoading(false);
        };

        // On charge les données uniquement pour les onglets qui nécessitent un chargement initial
        if (activeTab === 'dashboard' || activeTab === 'vehicles') {
            loadData();
        } else {
             setIsLoading(false);
        }

    }, [activeTab, fetchDashboardStats, fetchVehicles]);


    // 4. Les onglets mis à jour AVEC 'Marques'
    const tabs = [
        { id: 'dashboard', name: 'Tableau de bord', icon: BarChart3 },
        { id: 'vehicles', name: 'Véhicules', icon: Car },
        { id: 'brands', name: 'Marques', icon: Tag }, // NOUVEAU
        { id: 'users', name: 'Utilisateurs', icon: Users },
        { id: 'settings', name: 'Paramètres', icon: Settings },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Disponible': return 'bg-green-100 text-green-800';
            case 'Vendu': return 'bg-blue-100 text-blue-800';
            case 'Réservé': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getIconColor = (color) => {
        const colors = {
            blue: 'text-blue-600',
            green: 'text-green-600',
            purple: 'text-purple-600',
            yellow: 'text-yellow-600',
        };
        return colors[color] || 'text-gray-600';
    };

    // Affichage du loader seulement si on est sur un onglet qui charge des données ici
    if (isLoading && (activeTab === 'dashboard' || activeTab === 'vehicles')) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600 mr-3" />
                <p className="text-lg text-gray-700">Chargement des données...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header avec informations utilisateur (inchangé) */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Administration
                    </h1>
                    <p className="text-gray-600">
                        Bienvenue, **{user?.name || 'Administrateur'}**. Gérez votre plateforme.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                    <button
                        onClick={logout}
                        className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition duration-200"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                    </button>
                </div>
            </div>

            {error && <p className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</p>}


            {/* Stats Cards DYNAMIQUES (Affichées uniquement sur l'onglet dashboard) */}
            {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {dashboardStats.map((stat) => (
                        <StatCard
                            key={stat.name}
                            icon={stat.icon}
                            title={stat.name}
                            value={stat.value}
                            color={stat.color}
                        />
                    ))}
                </div>
            )}

            {/* Navigation Tabs (inchangé) */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const IconComponent = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <IconComponent className="h-5 w-5" />
                                {tab.name}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'dashboard' && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold mb-4">Tableau de bord</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Ventes récentes */}
                        <div>
                            <h3 className="text-lg font-medium mb-3">Ventes récentes</h3>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium">BMW X5</p>
                                            <p className="text-sm text-gray-600">Client: Jean Dupont</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">€45,000</p>
                                            <p className="text-sm text-gray-600">Hier</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Activité récente */}
                        <div>
                            <h3 className="text-lg font-medium mb-3">Activité récente</h3>
                            <div className="space-y-3">
                                {[
                                    'Nouveau véhicule ajouté: Audi A6',
                                    'Client connecté: Marie Martin',
                                    'Véhicule vendu: BMW X5',
                                    'Réservation annulée: Mercedes C-Class'
                                ].map((activity, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                        <p className="text-sm">{activity}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'vehicles' && (
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Gestion des véhicules ({vehicles.length})</h2>
                            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <Plus className="h-4 w-4" />
                                Ajouter un véhicule
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Véhicule
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Prix
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {vehicles.length > 0 ? (
                                    vehicles.map((vehicle) => (
                                        <tr key={vehicle.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {vehicle.brand || 'N/A'} {vehicle.model || 'N/A'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {vehicle.id}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                €{vehicle.price ? vehicle.price.toLocaleString() : '0'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.status)}`}>
                                                    {vehicle.status || 'Inconnu'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button className="text-blue-600 hover:text-blue-900"><Eye className="h-4 w-4" /></button>
                                                    <button className="text-yellow-600 hover:text-yellow-900"><Edit className="h-4 w-4" /></button>
                                                    <button className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                            Aucun véhicule trouvé.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 5. ⚠️ NOUVEL ONGLET: Gestion des Marques */}
            {activeTab === 'brands' && (
                <BrandManagement
                    API_BASE_URL={API_BASE_URL}
                    token={token}
                />
            )}

            {/* Onglets 'users' et 'settings' (inchangés) */}
            {activeTab === 'users' && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold mb-4">Gestion des utilisateurs</h2>
                    <p className="text-gray-600">Fonctionnalité en cours de développement...</p>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold mb-4">Paramètres</h2>
                    <p className="text-gray-600">Fonctionnalité en cours de développement...</p>
                </div>
            )}
        </div>
    );
}
