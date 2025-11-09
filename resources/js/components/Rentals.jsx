import React from 'react';
import { Plus, Building2, Star, ArrowRight } from 'lucide-react';
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
                        <div className="inline-flex items-center gap-2 bg-black/10 px-6 py-2 rounded-full mb-8 border border-black/20">
                            <Building2 className="h-5 w-5 text-black" />
                            <span className="text-black font-semibold text-sm uppercase tracking-wide">Locations Premium</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight">
                            Locations Disponibles
                        </h1>

                        <div className="w-24 h-0.5 bg-black mx-auto mb-6"></div>

                        <p className="text-xl md:text-2xl text-black/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Découvrez notre sélection de {pagination.total} appartements et maisons disponibles à la location
                        </p>

                        {isAuthenticated && (
                            <button
                                onClick={openCreateModal}
                                className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 font-semibold border-2 border-black hover:bg-black/90 transition-colors duration-200"
                            >
                                <Plus className="h-5 w-5" />
                                Ajouter une location
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
                        <span className="text-black font-semibold text-sm">Toutes les Locations</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                        Explorez notre collection
                    </h2>
                    <p className="text-black/70 text-lg max-w-2xl mx-auto">
                        Trouvez le logement idéal qui correspond à vos besoins et à votre budget
                    </p>
                </div>

                {/* FilterBar */}
                <div className="mb-8 bg-white border-2 border-black p-4">
                    <LocationFilterBar
                        filters={filters}
                        filterOptions={filterOptions}
                        showFilters={showFilters}
                        setShowFilters={setShowFilters}
                        handleFilterChange={handleFilterChange}
                        clearFilters={clearFilters}
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700">
                        <strong>Erreur :</strong> {error}
                    </div>
                )}

                {/* Locations Grid */}
                {locations.length > 0 ? (
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
                    </div>
                ) : (
                    !loading && (
                        <div className="text-center py-16 bg-white border-2 border-black">
                            <Building2 className="h-20 w-20 text-black mx-auto mb-6" />
                            <h3 className="text-xl font-semibold text-black mb-2">Aucune location trouvée</h3>
                            <p className="text-black/70">Essayez de modifier vos filtres de recherche</p>
                        </div>
                    )
                )}

                {/* Pagination */}
                {locations.length > 0 && (
                    <div className="mt-8">
                        <Pagination pagination={pagination} fetchLocations={fetchLocations} />
                    </div>
                )}
            </div>

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
