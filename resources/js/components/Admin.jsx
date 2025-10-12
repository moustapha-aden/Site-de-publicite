import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Users, Car, BarChart3, Settings, Plus, Edit, Trash2, Eye, LogOut, Loader2, Tag, Home, Building
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DetailModal from './modal/DetailModal';
import VehicleModal from './modal/VehicleModal';
import ParcelleModal from './modal/ParcelleModal';
import ParcelleDetailModal from './modal/ParcelleDetailModal';
import LocationModal from './modal/LocationModal';
import LocationDetailModal from './modal/LocationDetailModal';
import UserModal from './modal/UserModal';
import UserDetailModal from './modal/UserDetailModal';
import ConfirmModal from './modal/ConfirmModal';
import BrandManagement from './BrandManagement';
import Pagination from './commun/Pagination'; // Assurez-vous que ce fichier existe
import Toast from './commun/Toast';
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
    const [locations, setLocations] = useState([]);
    const [users, setUsers] = useState([]);
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

    const [locationPagination, setLocationPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });

    const [userPagination, setUserPagination] = useState({
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

    // --- États des Modales de Location ---
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [showLocationDetail, setShowLocationDetail] = useState(false);
    const [locationModalMode, setLocationModalMode] = useState('create');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [locationFormData, setLocationFormData] = useState({});
    const [locationFormSubmitting, setLocationFormSubmitting] = useState(false);
    const [locationFormErrors, setLocationFormErrors] = useState({});

    // --- États des Modales d'Utilisateur ---
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [showUserDetail, setShowUserDetail] = useState(false);
    const [userModalMode, setUserModalMode] = useState('create');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userFormData, setUserFormData] = useState({});
    const [userFormSubmitting, setUserFormSubmitting] = useState(false);
    const [userFormErrors, setUserFormErrors] = useState({});

    // --- États pour le Modal de Confirmation ---
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmModalData, setConfirmModalData] = useState({
        title: '',
        message: '',
        onConfirm: null,
        type: 'danger'
    });

    // --- États pour le Toast ---
    const [toast, setToast] = useState({
        isVisible: false,
        message: '',
        type: 'success'
    });

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
                { name: 'Véhicules', value: apiStats.total_vehicules?.toLocaleString() || '0', icon: Car, color: 'blue' },
                { name: 'Parcelles', value: apiStats.total_parcelles?.toLocaleString() || '0', icon: Home, color: 'green' },
                { name: 'Locations', value: apiStats.total_locations?.toLocaleString() || '0', icon: Building, color: 'purple' },
                { name: 'Utilisateurs', value: apiStats.total_utilisateurs?.toLocaleString() || '0', icon: Users, color: 'orange' },
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

    const fetchLocations = useCallback(async (page = 1) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/locations?page=${page}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            const data = response.data.data || response.data;
            const meta = response.data.meta || {};

            setLocations(data);
            setLocationPagination({
                current_page: meta.current_page || 1,
                last_page: meta.last_page || 1,
                per_page: meta.per_page || 10,
                total: meta.total || data.length,
            });

        } catch (err) {
            console.error("Erreur de chargement des locations:", err);
            setError("Impossible de charger la liste des locations.");
        }
    }, [API_BASE_URL, token]);

    const fetchUsers = useCallback(async (page = 1) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users?page=${page}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            const data = response.data.data || response.data;
            const meta = response.data.meta || {};

            setUsers(data);
            setUserPagination({
                current_page: meta.current_page || 1,
                last_page: meta.last_page || 1,
                per_page: meta.per_page || 10,
                total: meta.total || data.length,
            });

        } catch (err) {
            console.error("Erreur de chargement des utilisateurs:", err);
            setError("Impossible de charger la liste des utilisateurs.");
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

// --- Fonction de suppression des véhicules ---
const deleteVehicle = async (vehicleId) => {
    openConfirmModal(
        'Supprimer le véhicule',
        'Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.',
        async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression');
                }

                showToast('Véhicule supprimé avec succès !', 'success');
                fetchVehicles(pagination.current_page);

            } catch (err) {
                showToast('Erreur lors de la suppression du véhicule', 'error');
                console.error('deleteVehicle error:', err);
            }
        },
        'danger'
    );
};

// --- Fonction de suppression des parcelles ---
const deleteParcelle = async (parcelleId) => {
    openConfirmModal(
        'Supprimer la parcelle',
        'Êtes-vous sûr de vouloir supprimer cette parcelle ? Cette action est irréversible.',
        async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/parcelles/${parcelleId}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression');
                }

                showToast('Parcelle supprimée avec succès !', 'success');
                fetchParcelles(parcellePagination.current_page);

            } catch (err) {
                showToast('Erreur lors de la suppression de la parcelle', 'error');
                console.error('deleteParcelle error:', err);
            }
        },
        'danger'
    );
};

// --- Fonction de suppression des locations ---
const deleteLocation = async (locationId) => {
    openConfirmModal(
        'Supprimer la location',
        'Êtes-vous sûr de vouloir supprimer cette location ? Cette action est irréversible.',
        async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/locations/${locationId}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression');
                }

                showToast('Location supprimée avec succès !', 'success');
                fetchLocations(locationPagination.current_page);

            } catch (err) {
                showToast('Erreur lors de la suppression de la location', 'error');
                console.error('deleteLocation error:', err);
            }
        },
        'danger'
    );
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

// --- Fonctions de Gestion des Locations ---
const closeLocationModal = () => {
    setIsLocationModalOpen(false);
    setSelectedLocation(null);
    setLocationFormErrors({});
    fetchLocations(locationPagination.current_page);
};

const closeLocationDetailModal = () => {
    setShowLocationDetail(false);
    setSelectedLocation(null);
};

const openCreateLocationModal = () => {
    setLocationModalMode('create');
    setSelectedLocation({});
    setLocationFormData({
        title: '', location: '', price: '', type: '', surface: '', rooms: '',
        bedrooms: '', bathrooms: '', description: '', is_featured: false,
        contact_number: '', status: 'active',
    });
    setLocationFormErrors({});
    setIsLocationModalOpen(true);
};

const openEditLocationModal = (location) => {
    setLocationModalMode('edit');
    setSelectedLocation(location);
    setLocationFormData({
        id: location.id,
        title: location.title ?? '',
        location: location.location ?? '',
        price: location.price ?? '',
        type: location.type ?? '',
        surface: location.surface ?? '',
        rooms: location.rooms ?? '',
        bedrooms: location.bedrooms ?? '',
        bathrooms: location.bathrooms ?? '',
        description: location.description ?? '',
        is_featured: !!location.is_featured,
        contact_number: location.contact_number ?? '',
        status: location.status ?? 'active',
    });
    setLocationFormErrors({});
    setIsLocationModalOpen(true);
};

const openLocationDetailModal = (location) => {
    setSelectedLocation(location);
    setShowLocationDetail(true);
};

const submitLocation = async (e) => {
    e.preventDefault();

    if (!token) {
        setLocationFormErrors({ general: ['Vous devez être connecté pour effectuer cette action.'] });
        return;
    }

    setLocationFormSubmitting(true);
    setLocationFormErrors({});

    try {
        const body = new FormData();

        Object.entries(locationFormData).forEach(([key, val]) => {
            if (key === 'is_featured') {
                body.append(key, val ? '1' : '0');
            } else if (val !== undefined && val !== null) {
                body.append(key, String(val));
            }
        });

        if (locationFormData.photos && locationFormData.photos.length > 0) {
            for (let i = 0; i < locationFormData.photos.length; i++) {
                body.append('photos[]', locationFormData.photos[i]);
            }
        }

        let url = `${API_BASE_URL}/locations`;
        let method = 'POST';

        if (locationModalMode === 'edit') {
            body.append('_method', 'PUT');
            url = `${API_BASE_URL}/locations/${locationFormData.id}`;
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
            setLocationFormErrors(data.errors || { general: [data.message || 'Erreur inconnue lors de la soumission.'] });
            return;
        }

        alert(`Location ${locationModalMode === 'create' ? 'ajoutée' : 'modifiée'} avec succès !`);
        closeLocationModal();

    } catch (err) {
        setLocationFormErrors({ general: ['Erreur de connexion au serveur.'] });
        console.error('submitLocation error:', err);
    } finally {
        setLocationFormSubmitting(false);
    }
};

// Fonction pour gérer les changements dans le formulaire des locations
const handleLocationChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    if (type === 'file' && name === 'images') {
        setLocationFormData(prev => ({ ...prev, photos: files }));
        return;
    }

    setLocationFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
    }));
};

// --- Fonctions de Gestion des Utilisateurs ---
const closeUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUser(null);
    setUserFormErrors({});
    fetchUsers(userPagination.current_page);
};

const closeUserDetailModal = () => {
    setShowUserDetail(false);
    setSelectedUser(null);
};

const openCreateUserModal = () => {
    setUserModalMode('create');
    setSelectedUser({});
    setUserFormData({
        name: '', email: '', password: '', password_confirmation: '', status: 'active'
    });
    setUserFormErrors({});
    setIsUserModalOpen(true);
};

const openEditUserModal = (user) => {
    setUserModalMode('edit');
    setSelectedUser(user);
    setUserFormData({
        id: user.id,
        name: user.name ?? '',
        email: user.email ?? '',
        password: '',
        password_confirmation: '',
        status: user.status ?? 'active'
    });
    setUserFormErrors({});
    setIsUserModalOpen(true);
};

const openUserDetailModal = (user) => {
    setSelectedUser(user);
    setShowUserDetail(true);
};

const submitUser = async (e) => {
    e.preventDefault();

    if (!token) {
        setUserFormErrors({ general: ['Vous devez être connecté pour effectuer cette action.'] });
        return;
    }

    setUserFormSubmitting(true);
    setUserFormErrors({});

    try {
        const body = new FormData();

        Object.entries(userFormData).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== '') {
                body.append(key, String(val));
            }
        });

        let url = `${API_BASE_URL}/users`;
        let method = 'POST';

        if (userModalMode === 'edit') {
            body.append('_method', 'PUT');
            url = `${API_BASE_URL}/users/${userFormData.id}`;
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
            setUserFormErrors(data.errors || { general: [data.message || 'Erreur inconnue lors de la soumission.'] });
            return;
        }

        alert(`Utilisateur ${userModalMode === 'create' ? 'ajouté' : 'modifié'} avec succès !`);
        closeUserModal();

    } catch (err) {
        setUserFormErrors({ general: ['Erreur de connexion au serveur.'] });
        console.error('submitUser error:', err);
    } finally {
        setUserFormSubmitting(false);
    }
};

const deleteUser = async (userId) => {
    openConfirmModal(
        'Supprimer l\'utilisateur',
        'Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.',
        async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression');
                }

                showToast('Utilisateur supprimé avec succès !', 'success');
                fetchUsers(userPagination.current_page);

            } catch (err) {
                showToast('Erreur lors de la suppression de l\'utilisateur', 'error');
                console.error('deleteUser error:', err);
            }
        },
        'danger'
    );
};

// Fonction pour gérer les changements dans le formulaire des utilisateurs
const handleUserChange = (e) => {
    const { name, type, value, checked } = e.target;

    setUserFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
    }));
};

// --- Fonction pour ouvrir le Modal de Confirmation ---
const openConfirmModal = (title, message, onConfirm, type = 'danger') => {
    setConfirmModalData({
        title,
        message,
        onConfirm: () => {
            onConfirm();
            setShowConfirmModal(false);
        },
        type
    });
    setShowConfirmModal(true);
};

const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setConfirmModalData({
        title: '',
        message: '',
        onConfirm: null,
        type: 'danger'
    });
};

// --- Fonction pour afficher le Toast ---
const showToast = (message, type = 'success') => {
    setToast({
        isVisible: true,
        message,
        type
    });
};

const closeToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
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
            } else if (activeTab === 'locations') {
                await fetchLocations(locationPagination.current_page);
            } else if (activeTab === 'users') {
                await fetchUsers(userPagination.current_page);
            }

            setIsLoading(false);
        };

        loadData();
    }, [activeTab, fetchDashboardStats, fetchVehicles, fetchBrands, fetchFilterOptions, fetchParcelles, fetchParcelleFilterOptions, fetchLocations, fetchUsers, pagination.current_page, parcellePagination.current_page, locationPagination.current_page, userPagination.current_page]);

    const tabs = [
        { id: 'dashboard', name: 'Tableau de bord', icon: BarChart3 },
        { id: 'vehicles', name: 'Véhicules', icon: Car },
        { id: 'parcelles', name: 'Parcelles', icon: Home },
        { id: 'locations', name: 'Locations', icon: Building },
        { id: 'brands', name: 'Marques', icon: Tag },
        { id: 'users', name: 'Utilisateurs', icon: Users },
        { id: 'settings', name: 'Paramètres', icon: Settings },
    ];

    if (isLoading && (activeTab === 'dashboard' || activeTab === 'vehicles' || activeTab === 'parcelles' || activeTab === 'locations' || activeTab === 'users')) {
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
                                                <button onClick={() => deleteVehicle(vehicle.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
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
                                                <button onClick={() => deleteParcelle(parcelle.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
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

            {/* Tab Content: Locations */}
            {activeTab === 'locations' && (
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Gestion des locations ({locationPagination.total})</h2>
                        <button
                            onClick={openCreateLocationModal}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Ajouter une location
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {locations.length > 0 ? locations.map(location => (
                                    <tr key={location.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{location.title || 'N/A'}</div>
                                            <div className="text-sm text-gray-500">{location.location || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                {location.type ? location.type.charAt(0).toUpperCase() + location.type.slice(1) : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(location.price)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(location.status)}`}>
                                                {location.status === 'active' ? 'Actif' : location.status === 'inactive' ? 'Inactif' : location.status || 'Inconnu'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => openLocationDetailModal(location)} className="text-blue-600 hover:text-blue-900"><Eye className="h-4 w-4" /></button>
                                                <button onClick={() => openEditLocationModal(location)} className="text-yellow-600 hover:text-yellow-900"><Edit className="h-4 w-4" /></button>
                                                <button onClick={() => deleteLocation(location.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Aucune location trouvée.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {locations.length > 0 && (
                        <div className="p-4">
                            <Pagination pagination={locationPagination} fetchVehicles={fetchLocations} />
                        </div>
                    )}
                </div>
            )}

            {/* Tab Content: Users */}
            {activeTab === 'users' && (
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Gestion des utilisateurs ({userPagination.total})</h2>
                        <button
                            onClick={openCreateUserModal}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Ajouter un utilisateur
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'inscription</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.length > 0 ? users.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                                            <div className="text-sm text-gray-500">ID: {user.id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                user.status === 'active' ? 'bg-green-100 text-green-800' :
                                                user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {user.status === 'active' ? 'Actif' :
                                                 user.status === 'inactive' ? 'Inactif' :
                                                 user.status === 'suspended' ? 'Suspendu' : user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => openUserDetailModal(user)} className="text-blue-600 hover:text-blue-900"><Eye className="h-4 w-4" /></button>
                                                <button onClick={() => openEditUserModal(user)} className="text-yellow-600 hover:text-yellow-900"><Edit className="h-4 w-4" /></button>
                                                <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Aucun utilisateur trouvé.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.length > 0 && (
                        <div className="p-4">
                            <Pagination pagination={userPagination} fetchVehicles={fetchUsers} />
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

            {/* Modales des Locations */}
            {isLocationModalOpen && (
                <LocationModal
                    modalMode={locationModalMode}
                    formData={locationFormData}
                    formErrors={locationFormErrors}
                    formSubmitting={locationFormSubmitting}
                    closeModal={closeLocationModal}
                    handleChange={handleLocationChange}
                    submitLocation={submitLocation}
                />
            )}

            {showLocationDetail && selectedLocation && (
                <LocationDetailModal
                    location={selectedLocation}
                    onClose={closeLocationDetailModal}
                    API_URL={API_BASE_URL}
                />
            )}

            {/* Modales des Utilisateurs */}
            {isUserModalOpen && (
                <UserModal
                    modalMode={userModalMode}
                    formData={userFormData}
                    formErrors={userFormErrors}
                    formSubmitting={userFormSubmitting}
                    closeModal={closeUserModal}
                    handleChange={handleUserChange}
                    submitUser={submitUser}
                />
            )}

            {showUserDetail && selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    onClose={closeUserDetailModal}
                />
            )}

            {/* Modal de Confirmation */}
            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={closeConfirmModal}
                onConfirm={confirmModalData.onConfirm}
                title={confirmModalData.title}
                message={confirmModalData.message}
                type={confirmModalData.type}
            />

            {/* Toast de Notification */}
            <Toast
                isVisible={toast.isVisible}
                onClose={closeToast}
                message={toast.message}
                type={toast.type}
            />
        </div>
    );
}
