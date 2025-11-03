import React, { useState, useEffect } from 'react';
import { Plus, Home, Filter, X, MapPin, Star, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useParcelles } from './hooks/ParcellesHooks';
import ParcelleCard from './modal/ParcelleCard';
import ParcelleModal from './modal/ParcelleModal';
import ParcelleDetailModal from './modal/ParcelleDetailModal';
import Pagination from './commun/Pagination';

const Properties = () => {
    const { isAuthenticated, token } = useAuth();
    const {
        parcelles, loading, error, API_URL,
        filters, pagination, filterOptions, showFilters, setShowFilters,
        handleFilterChange, clearFilters, fetchParcelles,
        isModalOpen, modalMode, formData, formErrors, formSubmitting,
        openCreateModal, openEditModal, closeModal, handleChange, submitParcelle,
        showDetail, selectedParcelle, openDetailModal, closeDetailModal,
    } = useParcelles(token);

    const formatPrice = (price) => {
        if (price === undefined || price === null) return 'N/A';
        return `${Number(price).toLocaleString('fr-FR')} Fdj`;
    };

    if (loading && parcelles.length === 0) {
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
            <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 py-24 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgMCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
                    <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg px-6 py-3 rounded-full mb-8 border border-white/20 shadow-2xl">
                            <MapPin className="h-5 w-5 text-yellow-300 animate-pulse" />
                            <span className="text-white font-semibold">Investissement Immobilier</span>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                            Parcelles
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-200 via-red-200 to-pink-200 mt-2">
                                et Terrains
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Découvrez notre sélection de {pagination.total} terrains et propriétés soigneusement vérifiés
                        </p>

                        {isAuthenticated && (
                            <button
                                onClick={openCreateModal}
                                className="group inline-flex items-center gap-3 bg-white text-orange-600 px-8 py-4 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                            >
                                <Plus className="h-5 w-5" />
                                Ajouter une parcelle
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
                    <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-6">
                        <Star className="h-4 w-4 text-orange-600" />
                        <span className="text-orange-600 font-semibold text-sm">Toutes les Parcelles</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Explorez notre collection
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Investissez dans l'immobilier à Djibouti avec nos parcelles soigneusement sélectionnées
                    </p>
                </div>

                {/* Filter Toggle */}
                <div className="mb-6">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold text-gray-700 hover:border-orange-500"
                    >
                        <Filter className="h-5 w-5" />
                        {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
                    </button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Recherche
                                </label>
                                <input
                                    type="text"
                                    placeholder="Titre, localisation..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type
                                </label>
                                <select
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                >
                                    <option value="">Tous les types</option>
                                    {filterOptions.types?.map((type) => (
                                        <option key={type} value={type}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Localisation
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ville ou région"
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Prix max (Fdj)
                                </label>
                                <input
                                    type="number"
                                    placeholder="Prix maximum"
                                    value={filters.price_max}
                                    onChange={(e) => handleFilterChange('price_max', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={clearFilters}
                                className="px-6 py-3 text-gray-600 hover:text-orange-600 font-semibold transition-colors"
                            >
                                Effacer les filtres
                            </button>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl shadow-lg">
                        <strong>Erreur :</strong> {error}
                    </div>
                )}

                {/* Properties Grid */}
                {parcelles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {parcelles.map(parcelle => (
                            <ParcelleCard
                                key={parcelle.id}
                                parcelle={parcelle}
                                API_URL={API_URL}
                                isAuthenticated={isAuthenticated}
                                formatPrice={formatPrice}
                                openDetailModal={openDetailModal}
                                openEditModal={openEditModal}
                            />
                        ))}
                    </div>
                ) : (
                    !loading && (
                        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
                            <MapPin className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune parcelle trouvée</h3>
                            <p className="text-gray-500">Essayez de modifier vos filtres de recherche</p>
                        </div>
                    )
                )}

                {/* Pagination */}
                {parcelles.length > 0 && (
                    <div className="mt-8">
                        <Pagination pagination={pagination} fetchVehicles={fetchParcelles} />
                    </div>
                )}
            </div>

            {/* Parcelle Modal */}
            {isAuthenticated && isModalOpen && (
                <ParcelleModal
                    modalMode={modalMode}
                    formData={formData}
                    formErrors={formErrors}
                    formSubmitting={formSubmitting}
                    filterOptions={filterOptions}
                    closeModal={closeModal}
                    handleChange={handleChange}
                    submitParcelle={submitParcelle}
                />
            )}

            {/* Detail Modal */}
            {showDetail && selectedParcelle && (
                <ParcelleDetailModal
                    parcelle={selectedParcelle}
                    onClose={closeDetailModal}
                    formatPrice={formatPrice}
                />
            )}
        </div>
    );
};

export default Properties;
