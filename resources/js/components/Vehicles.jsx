// Vehicles.jsx

import React from 'react';
import { Plus, Car, Search, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useVehicles } from './hooks/VehiclesHooks'; // Importez le nouveau hook
import DetailModal from './modal/DetailModal';
import VehicleModal from './modal/VehicleModal'; // Créez ce composant
import FilterBar from './commun/FilterBar';       // Créez ce composant
import VehicleCard from './modal/VehicleCard';   // Créez ce composant
import Pagination from './commun/Pagination';     // Créez ce composant
import { formatPrice, getFuelIcon } from '../utils'; // Créez ce fichier utilitaire


const Vehicles = () => {
    const { isAuthenticated, token } = useAuth();

    // Utilisez le hook pour accéder à toute la logique !
    const {
        vehicles, loading, error, API_URL,
        filters, pagination, filterOptions, showFilters, setShowFilters,
        handleFilterChange, clearFilters, fetchVehicles,
        isModalOpen, modalMode, formData, formErrors, formSubmitting,
        openCreateModal, openEditModal, closeModal, handleChange, submitVehicle,
        showDetail, selectedVehicle, openDetailModal, closeDetailModal,
    } = useVehicles(token); // Passez le token

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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Catalogue de Véhicules
                    </h1>
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

            {/* Search and Filters COMPONENT */}
            <FilterBar
                filters={filters}
                filterOptions={filterOptions}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                handleFilterChange={handleFilterChange}
                clearFilters={clearFilters}
            />

            {/* Error State */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
                    <strong>Erreur :</strong> {error.message || String(error)}
                </div>
            )}

            {/* Vehicles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {vehicles.map((vehicle) => (
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
            {/* Empty State */}
            {!loading && vehicles.length === 0 && (
                <div className="col-span-full text-center text-gray-500">
                    Aucun véhicule trouvé.
                </div>
            )}
            </div>

            {/* Pagination COMPONENT */}
            <Pagination
                pagination={pagination}
                fetchVehicles={fetchVehicles}
            />


            {/* Add/Edit Modal COMPONENT */}
            {isAuthenticated && isModalOpen && (
                <VehicleModal
                    modalMode={modalMode}
                    formData={formData}
                    formErrors={formErrors}
                    formSubmitting={formSubmitting}
                    filterOptions={filterOptions}
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
