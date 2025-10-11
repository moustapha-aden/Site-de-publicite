import React, { useState, useEffect } from 'react';
import { Plus, Home, Filter, X } from 'lucide-react';
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
        return `€${Number(price).toLocaleString('fr-FR')}`;
    };

    if (loading && parcelles.length === 0) {
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Parcelles à Vendre</h1>
                    <p className="text-gray-600">
                        Découvrez notre sélection de {pagination.total} terrains et propriétés
                    </p>
                </div>
                {isAuthenticated && (
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Ajouter une parcelle
                    </button>
                )}
            </div>

            {/* Filter Toggle */}
            <div className="mb-4">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <Filter className="h-4 w-4" />
                    {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
                </button>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Recherche
                            </label>
                            <input
                                type="text"
                                placeholder="Titre, localisation..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type
                            </label>
                            <select
                                value={filters.type}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Localisation
                            </label>
                            <input
                                type="text"
                                placeholder="Ville ou région"
                                value={filters.location}
                                onChange={(e) => handleFilterChange('location', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prix max (€)
                            </label>
                            <input
                                type="number"
                                placeholder="Prix maximum"
                                value={filters.price_max}
                                onChange={(e) => handleFilterChange('price_max', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Effacer les filtres
                        </button>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
                    <strong>Erreur :</strong> {error}
                </div>
            )}

            {/* Properties Grid */}
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
                {!loading && parcelles.length === 0 && (
                    <div className="col-span-full text-center text-gray-500">
                        Aucune parcelle trouvée.
                    </div>
                )}
            </div>

            {/* Pagination */}
            <Pagination pagination={pagination} fetchVehicles={fetchParcelles} />

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
