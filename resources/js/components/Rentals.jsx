import React from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocations } from './hooks/LocationsHooks';
import LocationDetailModal from './modal/LocationDetailModal';
import LocationModal from './modal/LocationModal';
import LocationFilterBar from './commun/LocationFilterBar';
import LocationCard from './modal/LocationCard';
import Pagination from './commun/Pagination';

export default function Rentals() {
    const { isAuthenticated, token } = useAuth();
    const {
        locations, loading, error, pagination, API_URL,
        filters, showFilters, filterOptions,
        isModalOpen, modalMode, formData, formErrors, formSubmitting,
        openCreateModal, openEditModal, closeModal, handleChange, submitLocation,
        showDetail, selectedLocation, openDetailModal, closeDetailModal,
        deleteLocation, setShowFilters, handleFilterChange, clearFilters, fetchLocations,
    } = useLocations(token);

    if (loading && locations.length === 0) {
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Catalogue de Locations</h1>
                    <p className="text-gray-600">
                        Découvrez notre sélection de {pagination.total} locations
                    </p>
                </div>
                {isAuthenticated && (
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Ajouter une location
                    </button>
                )}
            </div>

            {/* FilterBar */}
            <LocationFilterBar
                filters={filters}
                filterOptions={filterOptions}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                handleFilterChange={handleFilterChange}
                clearFilters={clearFilters}
            />

            {/* Error */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
                    <strong>Erreur :</strong> {error}
                </div>
            )}

            {/* Locations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {locations.map(location => (
                    <LocationCard
                        key={location.id}
                        location={location}
                        API_URL={API_URL}
                        isAuthenticated={isAuthenticated}
                        openDetailModal={openDetailModal}
                        openEditModal={openEditModal}
                    />
                ))}
                {!loading && locations.length === 0 && (
                    <div className="col-span-full text-center text-gray-500">
                        Aucune location trouvée.
                    </div>
                )}
            </div>

            {/* Pagination */}
            <Pagination pagination={pagination} fetchLocations={fetchLocations} />

            {/* Location Modal */}
            {isAuthenticated && isModalOpen && (
                <LocationModal
                    modalMode={modalMode}
                    formData={formData}
                    formErrors={formErrors}
                    formSubmitting={formSubmitting}
                    filterOptions={filterOptions}
                    closeModal={closeModal}
                    handleChange={handleChange}
                    submitLocation={submitLocation}
                    selectedLocation={selectedLocation}
                />
            )}

            {/* Detail Modal */}
            {showDetail && selectedLocation && (
                <LocationDetailModal
                    location={selectedLocation}
                    onClose={closeDetailModal}
                    API_URL={API_URL}
                />
            )}
        </div>
    );
}
