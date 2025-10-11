import React, { useState, useEffect } from 'react';
import { Plus, Car } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useVehicles } from './hooks/VehiclesHooks';
import DetailModal from './modal/DetailModal';
import VehicleModal from './modal/VehicleModal';
import FilterBar from './commun/FilterBar';
import VehicleCard from './modal/VehicleCard';
import Pagination from './commun/Pagination';
import { formatPrice, getFuelIcon } from '../utils';

const Vehicles = () => {
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

    useEffect(() => {
        fetchBrands();
    }, []);

    if (loading && vehicles.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Catalogue de Véhicules</h1>
                    <p className="text-gray-600">
                        Découvrez notre sélection de {pagination.total} véhicules
                    </p>
                </div>
                {isAuthenticated && (
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Ajouter un véhicule
                    </button>
                )}
            </div>

            {/* FilterBar */}
            <FilterBar
                filters={filters}
                filterOptions={filterOptions}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                handleFilterChange={handleFilterChange}
                clearFilters={clearFilters}
            />

            {/* Error */}
            {(error || brandsError) && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
                    <strong>Erreur :</strong> {error || brandsError}
                </div>
            )}

            {/* Vehicles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                {!loading && vehicles.length === 0 && (
                    <div className="col-span-full text-center text-gray-500">
                        Aucun véhicule trouvé.
                    </div>
                )}
            </div>

            {/* Pagination */}
            <Pagination pagination={pagination} fetchVehicles={fetchVehicles} />

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
