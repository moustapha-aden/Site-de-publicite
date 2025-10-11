// resources/js/hooks/useVehicles.js

import { useState, useEffect, useCallback } from 'react';
// import { useAuth } from '../contexts/AuthContext'; // Non utilisé directement ici, mais utile pour le contexte
import { formatPrice, getFuelIcon } from '../../utils';
import { API_URL } from '../../api';

const emptyForm = {
    brand: '', model: '', year: '', price: '', mileage: '', fuel: '',
    transmission: '', color: '', description: '', is_featured: false, is_new: false,contact_number: '',
};

const initialFilters = {
    search: '', brand: '', fuel: '', transmission: '', is_featured: '',
    is_new: '', price_min: '', price_max: '', year_min: '', year_max: '',
    sort_by: 'created_at', sort_order: 'desc'
};

export const useVehicles = (token) => {
    // #######################################################
    // STATES
    // #######################################################
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter States
    const [filters, setFilters] = useState(initialFilters);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 15, total: 0 });
    const [filterOptions, setFilterOptions] = useState({ brands: [], fuel_types: [], transmission_types: [] });
    const [showFilters, setShowFilters] = useState(false);

    // Modal Add/Edit States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [formData, setFormData] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // ÉTAT POUR LES FICHIERS
    const [imageFiles, setImageFiles] = useState(null);

    // Detail Modal States
    const [showDetail, setShowDetail] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);


    // #######################################################
    // LOGIQUE DE RÉCUPÉRATION DES DONNÉES ET D'ACTION
    // #######################################################

    const fetchVehicles = useCallback(async (page = pagination.current_page) => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page,
                per_page: pagination.per_page,
                ...Object.fromEntries(
                    Object.entries(filters).filter(([_, value]) => value !== '')
                )
            });

            // --- CORRECTION CLÉ : Ajout des headers d'authentification ---
            const headers = {
                'Accept': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/vehicles?${queryParams}`, {
                headers: headers
            });
            // ------------------------------------------------------------

            // AMÉLIORATION: Gestion des erreurs HTTP (401, 500, etc.)
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText || 'Erreur réseau inconnue' }));
                throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setVehicles(data.data);
                setPagination({
                    current_page: data.meta.current_page,
                    last_page: data.meta.last_page,
                    per_page: data.meta.per_page,
                    total: data.meta.total
                });
                setError(null);
            } else {
                 throw new Error(data.message || 'Erreur lors du chargement des véhicules (JSON)');
            }
        } catch (err) {
            setError(err.message || 'Erreur de connexion ou d\'accès au serveur.');
            setVehicles([]);
            console.error('Error fetching vehicles:', err);
        } finally {
            setLoading(false);
        }
    }, [filters, pagination.per_page, token]); // FIX : Ajout de 'token' aux dépendances

    const fetchFilterOptions = async () => {
        try {
            const response = await fetch(`${API_URL}/vehicles/filter/options`);
            const data = await response.json();
            if (data.success) {
                setFilterOptions(data.data);
            }
        } catch (err) {
            console.error('Error fetching filter options:', err);
        }
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
            if (imageFiles) {
                for (let i = 0; i < imageFiles.length; i++) {
                    body.append('photos[]', imageFiles[i]);
                }
            }

            // --- CORRECTION CLÉ POUR PUT/PATCH AVEC FormData ---
            let url = `${API_URL}/vehicles`;
            let method = 'POST'; // Doit être POST pour l'envoi de FormData (fichiers)

            if (modalMode === 'edit') {
                // Ajout du champ caché pour simuler la méthode PUT côté backend (ex: Laravel)
                body.append('_method', 'PUT');
                url = `${API_URL}/vehicles/${editingId}`;
            }
            // ----------------------------------------------------------------

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

            setIsModalOpen(false);
            setImageFiles(null);
            // Re-fetch la première page pour voir la nouvelle/mise à jour
            await fetchVehicles(1);

        } catch (err) {
            setFormErrors({ general: ['Erreur de connexion au serveur.'] });
            console.error('submitVehicle error:', err);
        } finally {
            setFormSubmitting(false);
        }
    };

    // #######################################################
    // EFFETS DE BORD
    // #######################################################

    useEffect(() => {
        fetchVehicles();
    }, [filters, fetchVehicles]);


    useEffect(() => {
        fetchFilterOptions();
    }, []);

    // #######################################################
    // HANDLERS
    // #######################################################

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, current_page: 1 }));
    };

    const clearFilters = () => {
        setFilters(initialFilters);
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file' && name === 'images') {
            setImageFiles(files);
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const openCreateModal = () => {
        setModalMode('create');
        setFormData(emptyForm);
        setEditingId(null);
        setFormErrors({});
        setImageFiles(null);
        setIsModalOpen(true);
    };

    const openEditModal = (vehicle) => {
        setModalMode('edit');
        setEditingId(vehicle.id);
        // Assurez-vous d'avoir les données exactes du véhicule pour l'édition
        setFormData({
            brand: vehicle.brand ?? '', model: vehicle.model ?? '', year: vehicle.year ?? '',
            price: vehicle.price ?? '', mileage: vehicle.mileage ?? '', fuel: vehicle.fuel ?? '',
            transmission: vehicle.transmission ?? '', color: vehicle.color ?? '',
            description: vehicle.description ?? '', is_featured: !!vehicle.is_featured,
            is_new: !!vehicle.is_new,
            contact_number:vehicle.contact_number ?? '', // 👈 Ajout ici

        });
        setFormErrors({});
        setImageFiles(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (formSubmitting) return;
        setIsModalOpen(false);
        setImageFiles(null);
    };

    const openDetailModal = (vehicle) => {
        setSelectedVehicle(vehicle);
        setShowDetail(true);
    };

    const closeDetailModal = () => {
        setShowDetail(false);
        setSelectedVehicle(null);
    };

    return {
        vehicles, loading, error, API_URL, formatPrice, getFuelIcon,
        filters, pagination, filterOptions, showFilters, setShowFilters,
        handleFilterChange, clearFilters, fetchVehicles,
        isModalOpen, modalMode, formData, formErrors, formSubmitting,
        openCreateModal, openEditModal, closeModal, handleChange, submitVehicle,
        showDetail, selectedVehicle, openDetailModal, closeDetailModal,
        imageFiles,
    };
};
