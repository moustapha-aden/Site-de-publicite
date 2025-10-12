import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const useLocations = (token) => {
    // États principaux
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });

    // États pour les filtres
    const [filters, setFilters] = useState({
        search: '',
        type: '',
        location: '',
        price_min: '',
        price_max: '',
        surface_min: '',
        surface_max: '',
        status: '',
        is_featured: false,
    });

    const [showFilters, setShowFilters] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        types: [],
        statuses: [],
    });

    // États pour les modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' ou 'edit'
    const [showDetail, setShowDetail] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    // États pour le formulaire
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        price: '',
        type: '',
        surface: '',
        rooms: '',
        bedrooms: '',
        bathrooms: '',
        description: '',
        contact_number: '',
        status: 'active',
        is_featured: false,
        photos: null,
    });

    const [formErrors, setFormErrors] = useState({});
    const [formSubmitting, setFormSubmitting] = useState(false);

    // Récupération des options de filtrage
    const fetchFilterOptions = async () => {
        try {
            const response = await fetch(`${API_URL}/locations/filter/options`);
            if (response.ok) {
                const data = await response.json();
                setFilterOptions(data);
            }
        } catch (err) {
            console.error('Erreur lors de la récupération des options de filtrage:', err);
        }
    };

    // Récupération des locations
    const fetchLocations = async (page = 1) => {
        setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                ...Object.fromEntries(
                    Object.entries(filters).filter(([_, value]) => value !== '' && value !== false)
                ),
            });

            const response = await fetch(`${API_URL}/locations?${queryParams}`);
            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status}`);
            }

            const data = await response.json();
            setLocations(data.data || []);
            setPagination({
                current_page: data.current_page || 1,
                last_page: data.last_page || 1,
                per_page: data.per_page || 10,
                total: data.total || 0,
            });
        } catch (err) {
            setError(err.message);
            console.error('Erreur lors de la récupération des locations:', err);
        } finally {
            setLoading(false);
        }
    };

    // Gestion des filtres
    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            type: '',
            location: '',
            price_min: '',
            price_max: '',
            surface_min: '',
            surface_max: '',
            status: '',
            is_featured: false,
        });
    };

    // Gestion des modals
    const openCreateModal = () => {
        setFormData({
            title: '',
            location: '',
            price: '',
            type: '',
            surface: '',
            rooms: '',
            bedrooms: '',
            bathrooms: '',
            description: '',
            contact_number: '',
            status: 'active',
            is_featured: false,
            photos: null,
        });
        setFormErrors({});
        setModalMode('create');
        setSelectedLocation(null);
        setIsModalOpen(true);
    };

    const openEditModal = (location) => {
        setFormData({
            title: location.title || '',
            location: location.location || '',
            price: location.price || '',
            type: location.type || '',
            surface: location.surface || '',
            rooms: location.rooms || '',
            bedrooms: location.bedrooms || '',
            bathrooms: location.bathrooms || '',
            description: location.description || '',
            contact_number: location.contact_number || '',
            status: location.status || 'active',
            is_featured: location.is_featured || false,
            photos: null,
        });
        setFormErrors({});
        setModalMode('edit');
        setSelectedLocation(location);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalMode('create');
        setSelectedLocation(null);
        setFormData({
            title: '',
            location: '',
            price: '',
            type: '',
            surface: '',
            rooms: '',
            bedrooms: '',
            bathrooms: '',
            description: '',
            contact_number: '',
            status: 'active',
            is_featured: false,
            photos: null,
        });
        setFormErrors({});
        setFormSubmitting(false);
    };

    const openDetailModal = (location) => {
        setSelectedLocation(location);
        setShowDetail(true);
    };

    const closeDetailModal = () => {
        setShowDetail(false);
        setSelectedLocation(null);
    };

    // Gestion du formulaire
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Nettoyage des erreurs
        setFormErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            delete newErrors.general;
            return newErrors;
        });
    };

    const submitLocation = async (e) => {
        e.preventDefault();

        if (!token) {
            setFormErrors({ general: ['Vous devez être connecté pour effectuer cette action.'] });
            return;
        }

        const requiredFields = ['title', 'location', 'price', 'type', 'status'];
        const frontendErrors = {};

        requiredFields.forEach(field => {
            const value = formData[field];
            if (!value || value === '' || value === null || value === undefined) {
                const fieldNames = {
                    title: 'titre',
                    location: 'localisation',
                    price: 'prix',
                    type: 'type',
                    status: 'statut'
                };
                frontendErrors[field] = [`Le ${fieldNames[field]} est obligatoire.`];
            }
        });

        if (Object.keys(frontendErrors).length > 0) {
            setFormErrors(frontendErrors);
            setFormSubmitting(false);
            return;
        }

        setFormSubmitting(true);
        setFormErrors({});

        try {
            const formDataToSend = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'photos' && value && value.length > 0) {
                    Array.from(value).forEach(file => {
                        formDataToSend.append('photos[]', file);
                    });
                } else {
                    const requiredFields = ['title', 'location', 'price', 'type', 'status'];

                    if (requiredFields.includes(key) || (value !== null && value !== '' && value !== undefined)) {
                        if (['price', 'surface', 'rooms', 'bedrooms', 'bathrooms'].includes(key) && value !== '') {
                            formDataToSend.append(key, parseFloat(value));
                        } else if (key === 'is_featured') {
                            formDataToSend.append(key, value ? '1' : '0');
                        } else {
                            formDataToSend.append(key, value || '');
                        }
                    }
                }
            });

            const headers = {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            };

            let url = `${API_URL}/locations`;
            let method = 'POST';

            if (modalMode === 'edit' && selectedLocation) {
                url = `${API_URL}/locations/${selectedLocation.id}`;
                method = 'POST'; // Utiliser POST avec _method=PUT pour Laravel
                formDataToSend.append('_method', 'PUT');
            }

            const response = await fetch(url, {
                method,
                headers,
                body: formDataToSend,
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    setFormErrors({ general: ['Votre session a expiré. Veuillez vous reconnecter.'] });
                } else if (result.errors) {
                    setFormErrors(result.errors);
                } else {
                    setFormErrors({ general: [result.message || 'Une erreur est survenue lors de la soumission'] });
                }
                return;
            }

            closeModal();
            fetchLocations(pagination.current_page);

        } catch (err) {
            console.error('Erreur lors de la soumission:', err);
            setFormErrors({ general: ['Une erreur est survenue lors de la soumission. Veuillez réessayer.'] });
        } finally {
            setFormSubmitting(false);
        }
    };

    // Suppression d'une location
    const deleteLocation = async (location) => {
        if (!token) {
            alert('Vous devez être connecté pour supprimer une location.');
            return;
        }

        if (!confirm(`Êtes-vous sûr de vouloir supprimer la location "${location.title}" ?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/locations/${location.id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status}`);
            }

            fetchLocations(pagination.current_page);
        } catch (err) {
            console.error('Erreur lors de la suppression:', err);
            alert('Erreur lors de la suppression de la location.');
        }
    };

    // Effects
    useEffect(() => {
        fetchFilterOptions();
    }, []);

    useEffect(() => {
        fetchLocations();
    }, [filters]);

    useEffect(() => {
        if (isModalOpen) {
            setFormErrors({});
        }
    }, [isModalOpen]);

    return {
        // États
        locations,
        loading,
        error,
        pagination,
        filters,
        showFilters,
        filterOptions,
        isModalOpen,
        modalMode,
        formData,
        formErrors,
        formSubmitting,
        showDetail,
        selectedLocation,

        // Fonctions
        fetchLocations,
        handleFilterChange,
        clearFilters,
        setShowFilters,
        openCreateModal,
        openEditModal,
        closeModal,
        handleChange,
        submitLocation,
        openDetailModal,
        closeDetailModal,
        deleteLocation,

        // API URL pour compatibilité
        API_URL,
    };
};
