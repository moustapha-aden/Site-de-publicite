// resources/js/hooks/useParcelles.js

import { useState, useEffect, useCallback } from 'react';
import { formatPrice } from '../../utils';
import { API_URL } from '../../api';

const emptyForm = {
    title: '', location: '', price: '', type: '', surface: '', rooms: '',
    bedrooms: '', bathrooms: '', description: '', is_featured: false,
    contact_number: '', status: 'active',
};

const initialFilters = {
    search: '', type: '', location: '', is_featured: '',
    price_min: '', price_max: '', surface_min: '', surface_max: '',
    sort_by: 'created_at', sort_order: 'desc'
};

export const useParcelles = (token) => {
    // #######################################################
    // STATES
    // #######################################################
    const [parcelles, setParcelles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter States
    const [filters, setFilters] = useState(initialFilters);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 15, total: 0 });
    const [filterOptions, setFilterOptions] = useState({ types: [], statuses: [] });
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
    const [selectedParcelle, setSelectedParcelle] = useState(null);

    // #######################################################
    // LOGIQUE DE RÉCUPÉRATION DES DONNÉES ET D'ACTION
    // #######################################################

    const fetchParcelles = useCallback(async (page = pagination.current_page) => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page,
                per_page: pagination.per_page,
                ...Object.fromEntries(
                    Object.entries(filters).filter(([_, value]) => value !== '')
                )
            });

            const headers = {
                'Accept': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/parcelles?${queryParams}`, {
                headers: headers
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText || 'Erreur réseau inconnue' }));
                throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setParcelles(data.data);
                setPagination({
                    current_page: data.meta.current_page,
                    last_page: data.meta.last_page,
                    per_page: data.meta.per_page,
                    total: data.meta.total
                });
                setError(null);
            } else {
                 throw new Error(data.message || 'Erreur lors du chargement des parcelles (JSON)');
            }
        } catch (err) {
            setError(err.message || 'Erreur de connexion ou d\'accès au serveur.');
            setParcelles([]);
            console.error('Error fetching parcelles:', err);
        } finally {
            setLoading(false);
        }
    }, [filters, pagination.per_page, token]);

    const fetchFilterOptions = async () => {
        try {
            const response = await fetch(`${API_URL}/parcelles/filter/options`);
            const data = await response.json();
            if (data.success) {
                setFilterOptions(data.data);
            }
        } catch (err) {
            console.error('Error fetching filter options:', err);
        }
    };

    const submitParcelle = async (e) => {
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
                if (key === 'is_featured') {
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

            let url = `${API_URL}/parcelles`;
            let method = 'POST';

            if (modalMode === 'edit') {
                body.append('_method', 'PUT');
                url = `${API_URL}/parcelles/${editingId}`;
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
                setFormErrors(data.errors || { general: [data.message || 'Erreur inconnue lors de la soumission.'] });
                return;
            }

            setIsModalOpen(false);
            setImageFiles(null);
            await fetchParcelles(1);

        } catch (err) {
            setFormErrors({ general: ['Erreur de connexion au serveur.'] });
            console.error('submitParcelle error:', err);
        } finally {
            setFormSubmitting(false);
        }
    };

    // #######################################################
    // EFFETS DE BORD
    // #######################################################

    useEffect(() => {
        fetchParcelles();
    }, [filters, fetchParcelles]);

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

    const openEditModal = (parcelle) => {
        setModalMode('edit');
        setEditingId(parcelle.id);
        setFormData({
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
        setFormErrors({});
        setImageFiles(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (formSubmitting) return;
        setIsModalOpen(false);
        setImageFiles(null);
    };

    const openDetailModal = (parcelle) => {
        setSelectedParcelle(parcelle);
        setShowDetail(true);
    };

    const closeDetailModal = () => {
        setShowDetail(false);
        setSelectedParcelle(null);
    };

    return {
        parcelles, loading, error, API_URL, formatPrice,
        filters, pagination, filterOptions, showFilters, setShowFilters,
        handleFilterChange, clearFilters, fetchParcelles,
        isModalOpen, modalMode, formData, formErrors, formSubmitting,
        openCreateModal, openEditModal, closeModal, handleChange, submitParcelle,
        showDetail, selectedParcelle, openDetailModal, closeDetailModal,
        imageFiles,
    };
};
