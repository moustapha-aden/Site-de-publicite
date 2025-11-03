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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section - Premium Style */}
            <div className="relative bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 py-24 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgMCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg px-6 py-3 rounded-full mb-8 border border-white/20 shadow-2xl">
                            <Car className="h-5 w-5 text-yellow-300 animate-pulse" />
                            <span className="text-white font-semibold">Catalogue Complet</span>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                            Véhicules
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-blue-200 to-teal-200 mt-2">
                                Disponibles
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Découvrez notre sélection de {pagination.total} véhicules neufs et d'occasion soigneusement vérifiés
                        </p>

                        {isAuthenticated && (
                            <button
                                onClick={openCreateModal}
                                className="group inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                            >
                                <Plus className="h-5 w-5" />
                                Ajouter un véhicule
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-6">
                        <Star className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-600 font-semibold text-sm">Tous les Véhicules</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Explorez notre collection
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Trouvez le véhicule parfait qui correspond à vos besoins et à votre budget
                    </p>
                </div>

                {/* FilterBar */}
                <div className="mb-8">
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
                        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
                            <Car className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun véhicule trouvé</h3>
                            <p className="text-gray-500">Essayez de modifier vos filtres de recherche</p>
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
