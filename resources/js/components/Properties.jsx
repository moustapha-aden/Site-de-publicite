import React, { useState, useEffect } from 'react';
import { Plus, Filter, MapPin, Star, ArrowRight } from 'lucide-react';
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
        <div className="min-h-screen bg-white">
            {/* Hero Section - Noir & Blanc */}
            <div className="bg-white border-b-2 border-black py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-black/10 px-6 py-2 rounded-full mb-8 border border-black/20">
                            <MapPin className="h-5 w-5 text-black" />
                            <span className="text-black font-semibold text-sm uppercase tracking-wide">Investissement Immobilier</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight">
                            Parcelles et Terrains
                        </h1>

                        <div className="w-24 h-0.5 bg-black mx-auto mb-6"></div>

                        <p className="text-xl md:text-2xl text-black/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Découvrez notre sélection de {pagination.total} terrains et propriétés soigneusement vérifiés
                        </p>

                        {isAuthenticated && (
                            <button
                                onClick={openCreateModal}
                                className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 font-semibold border-2 border-black hover:bg-black/90 transition-colors duration-200"
                            >
                                <Plus className="h-5 w-5" />
                                Ajouter une parcelle
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
                        <span className="text-black font-semibold text-sm">Toutes les Parcelles</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                        Explorez notre collection
                    </h2>
                    <p className="text-black/70 text-lg max-w-2xl mx-auto">
                        Investissez dans l'immobilier à Djibouti avec nos parcelles soigneusement sélectionnées
                    </p>
                </div>

                {/* Filter Toggle */}
                <div className="mb-6">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-6 py-3 border-2 border-black rounded-xl font-semibold text-black hover:bg-black hover:text-white transition-all duration-200"
                    >
                        <Filter className="h-5 w-5" />
                        {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
                    </button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="bg-white border-2 border-black p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                    Recherche
                                </label>
                                <input
                                    type="text"
                                    placeholder="Titre, localisation..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                    Type
                                </label>
                                <select
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-0 bg-white"
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
                                <label className="block text-sm font-medium text-black mb-2">
                                    Localisation
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ville ou région"
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                    Prix max (Fdj)
                                </label>
                                <input
                                    type="number"
                                    placeholder="Prix maximum"
                                    value={filters.price_max}
                                    onChange={(e) => handleFilterChange('price_max', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-0"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={clearFilters}
                                className="px-6 py-3 text-black hover:text-white hover:bg-black border-2 border-black transition-colors duration-200"
                            >
                                Effacer les filtres
                            </button>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700">
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
                        <div className="text-center py-16 bg-white border-2 border-black">
                            <MapPin className="h-20 w-20 text-black mx-auto mb-6" />
                            <h3 className="text-xl font-semibold text-black mb-2">Aucune parcelle trouvée</h3>
                            <p className="text-black/70">Essayez de modifier vos filtres de recherche</p>
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
