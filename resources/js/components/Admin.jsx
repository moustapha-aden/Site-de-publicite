import React, { useState } from 'react';
import {
    Users,
    Car,
    BarChart3,
    Settings,
    Plus,
    Edit,
    Trash2,
    Eye,
    LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Admin() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [vehicles, setVehicles] = useState([
        { id: 1, brand: 'BMW', model: 'X5', price: 45000, status: 'Disponible' },
        { id: 2, brand: 'Audi', model: 'A4', price: 35000, status: 'Vendu' },
        { id: 3, brand: 'Mercedes', model: 'C-Class', price: 40000, status: 'Réservé' },
    ]);

    const stats = [
        { name: 'Total Véhicules', value: '156', icon: Car, color: 'blue' },
        { name: 'Clients', value: '342', icon: Users, color: 'green' },
        { name: 'Ventes ce mois', value: '23', icon: BarChart3, color: 'purple' },
        { name: 'Revenus', value: '€1.2M', icon: BarChart3, color: 'yellow' },
    ];

    const tabs = [
        { id: 'dashboard', name: 'Tableau de bord', icon: BarChart3 },
        { id: 'vehicles', name: 'Véhicules', icon: Car },
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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header avec informations utilisateur */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Administration
                    </h1>
                    <p className="text-gray-600">
                        Gérez votre plateforme de véhicules
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                            {user?.name || 'Administrateur'}
                        </p>
                        <p className="text-xs text-gray-500">
                            {user?.email || ''}
                        </p>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition duration-200"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => {
                    const IconComponent = stat.icon;
                    return (
                        <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <IconComponent className={`h-8 w-8 ${getIconColor(stat.color)}`} />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Navigation Tabs */}
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
                            <h2 className="text-xl font-semibold">Gestion des véhicules</h2>
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
                                {vehicles.map((vehicle) => (
                                    <tr key={vehicle.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {vehicle.brand} {vehicle.model}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    ID: {vehicle.id}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            €{vehicle.price.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.status)}`}>
                                                {vehicle.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <button className="text-blue-600 hover:text-blue-900">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button className="text-yellow-600 hover:text-yellow-900">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button className="text-red-600 hover:text-red-900">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

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
