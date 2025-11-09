import React, { useState, useEffect } from 'react';
import { Plus, Car, Sparkles, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useVehicles } from './hooks/VehiclesHooks';
import DetailModal from './modal/DetailModal';
import VehicleModal from './modal/VehicleModal';
import FilterBar from './commun/FilterBar';
import VehicleCard from './modal/VehicleCard';
import Pagination from './commun/Pagination';
import { formatPrice, getFuelIcon } from '../utils';
import { useLocation, useNavigate } from 'react-router-dom';

const Vehicles = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, token } = useAuth();
    const {
        vehicles, loading, error, API_URL,
        filters, pagination, filterOptions, showFilters, setShowFilters,
        handleFilterChange, clearFilters, fetchVehicles,
        isModalOpen, modalMode, formData, formErrors, formSubmitting,
        openCreateModal, openEditModal, closeModal, handleChange, submitVehicle,
        showDetail, selectedVehicle, openDetailModal, closeDetailModal,
    } = useVehicles(token);

    // --- State pour les brands ---
    const [brands, setBrands] = useState([]);
    const [brandsError, setBrandsError] = useState(null);

    // --- Récupération des brands ---
    const fetchBrands = async () => {
        try {
            const headers = { 'Accept': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${API_URL}/brand`, { headers });
            if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);


            const data = await res.json();
            if (data.success) setBrands(data.data);
            else throw new Error(data.message || 'Erreur lors du chargement des brands');
            console.log('brand',brands);
        } catch (err) {
            setBrandsError(err.message);
            console.error('Erreur fetching brands:', err);
        }

    };

    // Appliquer les filtres depuis l'URL au chargement
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const urlFilters = {};

        // Appliquer tous les filtres présents dans l'URL
        for (const [key, value] of urlParams.entries()) {
            if (value !== '') {
                urlFilters[key] = value;
                handleFilterChange(key, value);
            }
        }

        fetchBrands();
    }, [location.search]);

    if (loading && vehicles.length === 0) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Noir & Blanc */}
            <div className="bg-white border-b-2 border-black py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight">
                            Véhicules Disponibles
                        </h1>

                        <div className="w-24 h-0.5 bg-black mx-auto mb-6"></div>

                        <p className="text-xl md:text-2xl text-black/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Découvrez notre sélection de {pagination.total} véhicules neufs et d'occasion soigneusement vérifiés
                        </p>

                        {isAuthenticated && (
                            <button
                                onClick={openCreateModal}
                                className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 font-semibold border-2 border-black hover:bg-black/90 transition-colors duration-200"
                            >
                                <Plus className="h-5 w-5" />
                                Ajouter un véhicule
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full mb-6 border border-black/20">
                        <Star className="h-4 w-4 text-black" />
                        <span className="text-black font-semibold text-sm">Tous les Véhicules</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                        Explorez notre collection
                    </h2>
                    <p className="text-black/70 text-lg max-w-2xl mx-auto">
                        Trouvez le véhicule parfait qui correspond à vos besoins et à votre budget
                    </p>
                </div>

                {/* FilterBar */}
                <div className="mb-8 bg-white border-2 border-black p-4">
                    <FilterBar
                        filters={filters}
                        filterOptions={filterOptions}
                        showFilters={showFilters}
                        setShowFilters={setShowFilters}
                        handleFilterChange={handleFilterChange}
                        clearFilters={clearFilters}
                    />
                </div>

                {/* Error */}
                {(error || brandsError) && (
                    <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl shadow-lg">
                        <strong>Erreur :</strong> {error || brandsError}
                    </div>
                )}

                {/* Vehicles Grid */}
                {vehicles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {vehicles.map(vehicle => (
                            <VehicleCard
                                key={vehicle.id}
                                vehicle={vehicle}
                                API_URL={API_URL}
                                isAuthenticated={isAuthenticated}
                                formatPrice={formatPrice}
                                getFuelIcon={getFuelIcon}
                                openDetailModal={openDetailModal}
                                openEditModal={openEditModal}
                            />
                        ))}
                    </div>
                ) : (
                    !loading && (
                        <div className="text-center py-16 bg-white border-2 border-black">
                            <Car className="h-20 w-20 text-black mx-auto mb-6" />
                            <h3 className="text-xl font-semibold text-black mb-2">Aucun véhicule trouvé</h3>
                            <p className="text-black/70">Essayez de modifier vos filtres de recherche</p>
                        </div>
                    )
                )}

                {/* Pagination */}
                {vehicles.length > 0 && (
                    <div className="mt-8">
                        <Pagination pagination={pagination} fetchVehicles={fetchVehicles} />
                    </div>
                )}
            </div>

            {/* Vehicle Modal */}
            {isAuthenticated && isModalOpen && (
                <VehicleModal
                    modalMode={modalMode}
                    formData={formData}
                    formErrors={formErrors}
                    formSubmitting={formSubmitting}
                    filterOptions={filterOptions}
                    brands={brands} // Passe les brands
                    closeModal={closeModal}
                    handleChange={handleChange}
                    submitVehicle={submitVehicle}
                />
            )}

            {/* Detail Modal */}
            {showDetail && selectedVehicle && (
                <DetailModal
                    vehicule={selectedVehicle}
                    onClose={closeDetailModal}
                    formatPrice={formatPrice}
                />
            )}
        </div>
    );
};

export default Vehicles;
