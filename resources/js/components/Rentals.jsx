import React from 'react';
import { Plus, Loader2, Building2, Star, ArrowRight, Sparkles } from 'lucide-react';
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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section - Premium Style */}
            <div className="relative bg-gradient-to-br from-slate-700 via-gray-800 to-zinc-900 py-24 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgMCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
                    <div className="absolute top-20 left-10 w-72 h-72 bg-slate-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg px-6 py-3 rounded-full mb-8 border border-white/20 shadow-2xl">
                            <Building2 className="h-5 w-5 text-yellow-300 animate-pulse" />
                            <span className="text-white font-semibold">Locations Premium</span>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                            Locations
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-gray-300 to-zinc-300 mt-2">
                                de Luxe
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Découvrez notre sélection de {pagination.total} appartements et maisons disponibles à la location
                        </p>

                        {isAuthenticated && (
                            <button
                                onClick={openCreateModal}
                                className="group inline-flex items-center gap-3 bg-white text-slate-700 px-8 py-4 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                            >
                                <Plus className="h-5 w-5" />
                                Ajouter une location
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
                    <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full mb-6">
                        <Star className="h-4 w-4 text-slate-600" />
                        <span className="text-slate-600 font-semibold text-sm">Toutes les Locations</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Explorez notre collection
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Trouvez le logement idéal qui correspond à vos besoins et à votre budget
                    </p>
                </div>

                {/* FilterBar */}
                <div className="mb-8">
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
                    <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl shadow-lg">
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
                        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
                            <Building2 className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune location trouvée</h3>
                            <p className="text-gray-500">Essayez de modifier vos filtres de recherche</p>
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
