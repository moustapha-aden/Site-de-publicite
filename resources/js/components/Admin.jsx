import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Users, Car, BarChart3, Settings, Plus, Edit, Trash2, Eye, LogOut, Loader2, Tag, Home
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DetailModal from './modal/DetailModal';
import VehicleModal from './modal/VehicleModal';
import ParcelleModal from './modal/ParcelleModal';
import ParcelleDetailModal from './modal/ParcelleDetailModal';
import BrandManagement from './BrandManagement';
import Pagination from './commun/Pagination'; // Assurez-vous que ce fichier existe
import { API_URL } from '../api';

// --- Composants Réutilisables ---
const StatCard = ({ icon: Icon, title, value, color, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center">
            <div className="flex-shrink-0">
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

const getStatusColor = (status) => {
    switch (status) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'inactive': return 'bg-red-100 text-red-800';
        case 'Disponible': return 'bg-green-100 text-green-800';
        case 'Vendu': return 'bg-blue-100 text-blue-800';
        case 'Réservé': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const formatPrice = (price) => {
    if (price === undefined || price === null) return 'N/A';
    return `€${Number(price).toLocaleString('fr-FR')}`;
};

// --- Composant Principal Admin ---
export default function Admin() {
    const { user, logout, token } = useAuth();
    const API_BASE_URL = API_URL;

    // --- États du composant ---
    const [activeTab, setActiveTab] = useState('dashboard');
    const [dashboardStats, setDashboardStats] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [parcelles, setParcelles] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [brandsError, setBrandsError] = useState(null); // Ajout pour gérer les erreurs de brands séparément
    const [filterOptions, setFilterOptions] = useState({ brands: [], fuel_types: [], transmission_types: [] });
    const [parcelleFilterOptions, setParcelleFilterOptions] = useState({ types: [], statuses: [] });

    // --- États de pagination ---
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });

    const [parcellePagination, setParcellePagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });

    // --- États des Modales de Véhicule ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' ou 'edit'
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [formData, setFormData] = useState({});
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // --- États des Modales de Parcelle ---
    const [isParcelleModalOpen, setIsParcelleModalOpen] = useState(false);
    const [showParcelleDetail, setShowParcelleDetail] = useState(false);
    const [parcelleModalMode, setParcelleModalMode] = useState('create');
    const [selectedParcelle, setSelectedParcelle] = useState(null);
    const [parcelleFormData, setParcelleFormData] = useState({});
    const [parcelleFormSubmitting, setParcelleFormSubmitting] = useState(false);
    const [parcelleFormErrors, setParcelleFormErrors] = useState({});

    // --- Fonctions de Récupération des Données ---
    const fetchBrands = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/brand`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            // Correction : vérifier la structure de réponse comme dans Vehicles.jsx
            if (response.data.success) {
                setBrands(response.data.data || []);
            } else {
                throw new Error(response.data.message || 'Erreur lors du chargement des marques');
            }
        } catch (err) {
            console.error("Erreur de chargement des marques:", err);
            setBrandsError("Impossible de charger les marques.");
        }
    }, [API_BASE_URL, token]);

    const fetchFilterOptions = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/vehicles/filter/options`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.data.success) {
                setFilterOptions(response.data.data);
            }
        } catch (err) {
            console.error("Erreur de chargement des options de filtres:", err);
        }
    }, [API_BASE_URL, token]);

    const fetchParcelles = useCallback(async (page = 1) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/parcelles?page=${page}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            const data = response.data.data || response.data;
            const meta = response.data.meta || {};

            setParcelles(data);
            setParcellePagination({
                current_page: meta.current_page || 1,
                last_page: meta.last_page || 1,
                per_page: meta.per_page || 10,
                total: meta.total || data.length,
            });

        } catch (err) {
            console.error("Erreur de chargement des parcelles:", err);
            setError("Impossible de charger la liste des parcelles.");
        }
    }, [API_BASE_URL, token]);

    const fetchParcelleFilterOptions = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/parcelles/filter/options`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.data.success) {
                setParcelleFilterOptions(response.data.data);
            }
        } catch (err) {
            console.error("Erreur de chargement des options de filtres parcelles:", err);
        }
    }, [API_BASE_URL, token]);

    const fetchDashboardStats = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard`, {
                 headers: { 'Authorization': `Bearer ${token}` }
            });

            const apiStats = response.data.stats;
            const formattedStats = [
                { name: 'total_vehicules', value: apiStats.total_vehicules?.toLocaleString() || '0', icon: Car, color: 'indigo' },
                { name: 'total_parcelles', value: apiStats.total_parcelles?.toLocaleString() || '0', icon: Home, color: 'indigo' },
            ];
            setDashboardStats(formattedStats);
        } catch (err) {
            console.error("Erreur de chargement des stats:", err);
            setError("Impossible de charger les statistiques.");
        }
    }, [API_BASE_URL, token]);

    const fetchVehicles = useCallback(async (page = 1) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/vehicles?page=${page}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            const data = response.data.data || response.data;
            const meta = response.data.meta || {}; // Laravel renvoie meta pour pagination

            setVehicles(data);
            setPagination({
                current_page: meta.current_page || 1,
                last_page: meta.last_page || 1,
                per_page: meta.per_page || 10,
                total: meta.total || data.length,
            });

        } catch (err) {
            console.error("Erreur de chargement des véhicules:", err);
            setError("Impossible de charger la liste des véhicules.");
        }
    }, [API_BASE_URL, token]);

    // --- Fonctions de Gestion des Modales/Actions ---
    const closeVehicleModal = () => {
        setIsModalOpen(false);
        setSelectedVehicle(null);
        setFormErrors({});
        fetchVehicles(pagination.current_page);
    };

    const closeDetailModal = () => {
        setShowDetail(false);
        setSelectedVehicle(null);
    };

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedVehicle({});
        setFormData({
            brand: '', model: '', year: '', price: '', mileage: '', fuel: '',
            transmission: '', color: '', description: '', is_featured: false,
            is_new: false, contact_number: '', status: 'active',
        });
        setFormErrors({});
        setIsModalOpen(true);
    };

    const openEditModal = (vehicle) => {
        setModalMode('edit');
        setSelectedVehicle(vehicle);
        // Assurez-vous d'avoir les données exactes du véhicule pour l'édition
        setFormData({
            id: vehicle.id,
            brand: vehicle.brand ?? '',
            model: vehicle.model ?? '',
            year: vehicle.year ?? '',
            price: vehicle.price ?? '',
            mileage: vehicle.mileage ?? '',
            fuel: vehicle.fuel ?? '',
            transmission: vehicle.transmission ?? '',
            color: vehicle.color ?? '',
            description: vehicle.description ?? '',
            is_featured: !!vehicle.is_featured,
            is_new: !!vehicle.is_new,
            contact_number: vehicle.contact_number ?? '',
            status: vehicle.status ?? 'active',
        });
        setFormErrors({});
        setIsModalOpen(true);
    };

    const openDetailModal = (vehicle) => {
        setSelectedVehicle(vehicle);
        setShowDetail(true);
    };

    const submitVehicle = async (e) => {
        e.preventDefault();

        if (!token) {
            setFormErrors({ general: ['Vous devez être connecté pour effectuer cette action.'] });
            return;
        }

        setFormSubmitting(true);
        setFormErrors({});

        try {
            const body = new FormData();

            // 1. Ajouter les champs de texte et numériques au FormData
            Object.entries(formData).forEach(([key, val]) => {
                // S'assurer que les booléens sont envoyés comme des chaînes '1' ou '0'
                if (key === 'is_featured' || key === 'is_new') {
                    body.append(key, val ? '1' : '0');
                } else if (val !== undefined && val !== null) {
                    body.append(key, String(val));
                }
            });

            // 2. GESTION DES FICHIERS : Ajouter les images au FormData (photos[])
            if (formData.photos && formData.photos.length > 0) {
                for (let i = 0; i < formData.photos.length; i++) {
                    body.append('photos[]', formData.photos[i]);
                }
            }

            // --- CORRECTION CLÉ POUR PUT/PATCH AVEC FormData ---
            let url = `${API_BASE_URL}/vehicles`;
            let method = 'POST'; // Doit être POST pour l'envoi de FormData (fichiers)

            if (modalMode === 'edit') {
                // Ajout du champ caché pour simuler la méthode PUT côté backend (ex: Laravel)
                body.append('_method', 'PUT');
                url = `${API_BASE_URL}/vehicles/${formData.id}`;
            }

            const response = await fetch(url, {
                method: method, // Utilise POST pour l'envoi de FormData
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    // IMPORTANT: Ne pas définir 'Content-Type' pour FormData!
                },
                body,
            });
            const data = await response.json();

            if (!response.ok || data.success === false) {
                // Gère le 401/422/etc.
                setFormErrors(data.errors || { general: [data.message || 'Erreur inconnue lors de la soumission.'] });
                return;
            }

            alert(`Véhicule ${modalMode === 'create' ? 'ajouté' : 'modifié'} avec succès !`);
            closeVehicleModal();

        } catch (err) {
            setFormErrors({ general: ['Erreur de connexion au serveur.'] });
            console.error('submitVehicle error:', err);
        } finally {
            setFormSubmitting(false);
        }
    };

// --- Fonctions de Gestion des Parcelles ---
const closeParcelleModal = () => {
    setIsParcelleModalOpen(false);
    setSelectedParcelle(null);
    setParcelleFormErrors({});
    fetchParcelles(parcellePagination.current_page);
};

const closeParcelleDetailModal = () => {
    setShowParcelleDetail(false);
    setSelectedParcelle(null);
};

const openCreateParcelleModal = () => {
    setParcelleModalMode('create');
    setSelectedParcelle({});
    setParcelleFormData({
        title: '', location: '', price: '', type: '', surface: '', rooms: '',
        bedrooms: '', bathrooms: '', description: '', is_featured: false,
        contact_number: '', status: 'active',
    });
    setParcelleFormErrors({});
    setIsParcelleModalOpen(true);
};

const openEditParcelleModal = (parcelle) => {
    setParcelleModalMode('edit');
    setSelectedParcelle(parcelle);
    setParcelleFormData({
        id: parcelle.id,
        title: parcelle.title ?? '',
        location: parcelle.location ?? '',
        price: parcelle.price ?? '',
        type: parcelle.type ?? '',
        surface: parcelle.surface ?? '',
        rooms: parcelle.rooms ?? '',
        bedrooms: parcelle.bedrooms ?? '',
        bathrooms: parcelle.bathrooms ?? '',
        description: parcelle.description ?? '',
        is_featured: !!parcelle.is_featured,
        contact_number: parcelle.contact_number ?? '',
        status: parcelle.status ?? 'active',
    });
    setParcelleFormErrors({});
    setIsParcelleModalOpen(true);
};

const openParcelleDetailModal = (parcelle) => {
    setSelectedParcelle(parcelle);
    setShowParcelleDetail(true);
};

const submitParcelle = async (e) => {
    e.preventDefault();

    if (!token) {
        setParcelleFormErrors({ general: ['Vous devez être connecté pour effectuer cette action.'] });
        return;
    }

    setParcelleFormSubmitting(true);
    setParcelleFormErrors({});

    try {
        const body = new FormData();

        Object.entries(parcelleFormData).forEach(([key, val]) => {
            if (key === 'is_featured') {
                body.append(key, val ? '1' : '0');
            } else if (val !== undefined && val !== null) {
                body.append(key, String(val));
            }
        });

        if (parcelleFormData.photos && parcelleFormData.photos.length > 0) {
            for (let i = 0; i < parcelleFormData.photos.length; i++) {
                body.append('photos[]', parcelleFormData.photos[i]);
            }
        }

        let url = `${API_BASE_URL}/parcelles`;
        let method = 'POST';

        if (parcelleModalMode === 'edit') {
            body.append('_method', 'PUT');
            url = `${API_BASE_URL}/parcelles/${parcelleFormData.id}`;
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body,
        });
        const data = await response.json();

        if (!response.ok || data.success === false) {
            setParcelleFormErrors(data.errors || { general: [data.message || 'Erreur inconnue lors de la soumission.'] });
            return;
        }

        alert(`Parcelle ${parcelleModalMode === 'create' ? 'ajoutée' : 'modifiée'} avec succès !`);
        closeParcelleModal();

    } catch (err) {
        setParcelleFormErrors({ general: ['Erreur de connexion au serveur.'] });
        console.error('submitParcelle error:', err);
    } finally {
        setParcelleFormSubmitting(false);
    }
};

// Fonction pour gérer les changements dans le formulaire
const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    if (type === 'file' && name === 'images') {
        setFormData(prev => ({ ...prev, photos: files }));
        return;
    }

    setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
    }));
};

// Fonction pour gérer les changements dans le formulaire des parcelles
const handleParcelleChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    if (type === 'file' && name === 'images') {
        setParcelleFormData(prev => ({ ...prev, photos: files }));
        return;
    }

    setParcelleFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
    }));
};


    // --- Effet de Chargement Initial ---
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            await fetchBrands();
            await fetchFilterOptions();
            await fetchParcelleFilterOptions();

            if (activeTab === 'dashboard') {
                await fetchDashboardStats();
            } else if (activeTab === 'vehicles') {
                await fetchVehicles(pagination.current_page);
            } else if (activeTab === 'parcelles') {
                await fetchParcelles(parcellePagination.current_page);
            }

            setIsLoading(false);
        };

        loadData();
    }, [activeTab, fetchDashboardStats, fetchVehicles, fetchBrands, fetchFilterOptions, fetchParcelles, fetchParcelleFilterOptions, pagination.current_page, parcellePagination.current_page]);

    const tabs = [
        { id: 'dashboard', name: 'Tableau de bord', icon: BarChart3 },
        { id: 'vehicles', name: 'Véhicules', icon: Car },
        { id: 'parcelles', name: 'Parcelles', icon: Home },
        { id: 'brands', name: 'Marques', icon: Tag },
        { id: 'users', name: 'Utilisateurs', icon: Users },
        { id: 'settings', name: 'Paramètres', icon: Settings },
    ];

    if (isLoading && (activeTab === 'dashboard' || activeTab === 'vehicles' || activeTab === 'parcelles')) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600 mr-3" />
                <p className="text-lg text-gray-700">Chargement des données...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration</h1>
                    <p className="text-gray-600">Bienvenue, <strong>{user?.name || 'Administrateur'}</strong>. Gérez votre plateforme.</p>
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

            {(error || brandsError) && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
                    <strong>Erreur :</strong> {error || brandsError}
                </div>
            )}

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

            {/* Tab Content: Dashboard */}
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

            {/* Tab Content: Vehicles */}
            {activeTab === 'vehicles' && (
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Gestion des véhicules ({pagination.total})</h2>
                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Ajouter un véhicule
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Véhicule</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {vehicles.length > 0 ? vehicles.map(vehicle => (
                                    <tr key={vehicle.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{vehicle.brand || 'N/A'} {vehicle.model || 'N/A'}</div>
                                            <div className="text-sm text-gray-500">ID: {vehicle.id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(vehicle.price)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.status)}`}>
                                                {vehicle.status === 'active' ? 'Actif' : vehicle.status === 'inactive' ? 'Inactif' : vehicle.status || 'Inconnu'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => openDetailModal(vehicle)} className="text-blue-600 hover:text-blue-900"><Eye className="h-4 w-4" /></button>
                                                <button onClick={() => openEditModal(vehicle)} className="text-yellow-600 hover:text-yellow-900"><Edit className="h-4 w-4" /></button>
                                                <button className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Aucun véhicule trouvé.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {vehicles.length > 0 && (
                        <div className="p-4">
                            <Pagination pagination={pagination} fetchVehicles={fetchVehicles} />
                        </div>
                    )}
                </div>
            )}

            {/* Tab Content: Parcelles */}
            {activeTab === 'parcelles' && (
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Gestion des parcelles ({parcellePagination.total})</h2>
                        <button
                            onClick={openCreateParcelleModal}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Ajouter une parcelle
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parcelle</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {parcelles.length > 0 ? parcelles.map(parcelle => (
                                    <tr key={parcelle.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{parcelle.title || 'N/A'}</div>
                                            <div className="text-sm text-gray-500">{parcelle.location || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                {parcelle.type ? parcelle.type.charAt(0).toUpperCase() + parcelle.type.slice(1) : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(parcelle.price)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(parcelle.status)}`}>
                                                {parcelle.status === 'active' ? 'Actif' : parcelle.status === 'inactive' ? 'Inactif' : parcelle.status || 'Inconnu'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => openParcelleDetailModal(parcelle)} className="text-blue-600 hover:text-blue-900"><Eye className="h-4 w-4" /></button>
                                                <button onClick={() => openEditParcelleModal(parcelle)} className="text-yellow-600 hover:text-yellow-900"><Edit className="h-4 w-4" /></button>
                                                <button className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Aucune parcelle trouvée.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {parcelles.length > 0 && (
                        <div className="p-4">
                            <Pagination pagination={parcellePagination} fetchVehicles={fetchParcelles} />
                        </div>
                    )}
                </div>
            )}

            {/* Tab Content: Brands */}
            {activeTab === 'brands' && (
                <BrandManagement API_BASE_URL={API_BASE_URL} token={token} />
            )}

            {/* --- MODALES --- */}
            {isModalOpen && (
                <VehicleModal
                    modalMode={modalMode}
                    formData={formData}
                    formErrors={formErrors}
                    formSubmitting={formSubmitting}
                    filterOptions={filterOptions} // Utilise les vraies options de filtres
                    brands={brands}
                    closeModal={closeVehicleModal}
                    handleChange={handleChange}
                    submitVehicle={submitVehicle}
                />
            )}


            {showDetail && selectedVehicle && (
                <DetailModal
                    vehicule={selectedVehicle}
                    onClose={closeDetailModal}
                    formatPrice={formatPrice}
                />
            )}

            {/* Modales des Parcelles */}
            {isParcelleModalOpen && (
                <ParcelleModal
                    modalMode={parcelleModalMode}
                    formData={parcelleFormData}
                    formErrors={parcelleFormErrors}
                    formSubmitting={parcelleFormSubmitting}
                    filterOptions={parcelleFilterOptions}
                    closeModal={closeParcelleModal}
                    handleChange={handleParcelleChange}
                    submitParcelle={submitParcelle}
                />
            )}

            {showParcelleDetail && selectedParcelle && (
                <ParcelleDetailModal
                    parcelle={selectedParcelle}
                    onClose={closeParcelleDetailModal}
                    formatPrice={formatPrice}
                />
            )}
        </div>
    );
}
