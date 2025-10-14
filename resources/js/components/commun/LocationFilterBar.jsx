import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const LocationFilterBar = ({
    filters,
    filterOptions,
    showFilters,
    setShowFilters,
    handleFilterChange,
    clearFilters
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border mb-8">
            {/* Header avec bouton toggle */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-medium text-gray-900">Filtres</h3>
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        {showFilters ? (
                            <>
                                <X className="h-4 w-4" />
                                Masquer
                            </>
                        ) : (
                            <>
                                <Filter className="h-4 w-4" />
                                Afficher
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Contenu des filtres */}
            {showFilters && (
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        {/* Recherche */}
                        <div className="xl:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Recherche
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="search"
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    placeholder="Titre, localisation..."
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type
                            </label>
                            <select
                                name="type"
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

                        {/* Localisation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Localisation
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={filters.location}
                                onChange={(e) => handleFilterChange('location', e.target.value)}
                                placeholder="Ville, région..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Prix minimum */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prix min (€)
                            </label>
                            <input
                                type="number"
                                name="price_min"
                                value={filters.price_min}
                                onChange={(e) => handleFilterChange('price_min', e.target.value)}
                                placeholder="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Prix maximum */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prix max (€)
                            </label>
                            <input
                                type="number"
                                name="price_max"
                                value={filters.price_max}
                                onChange={(e) => handleFilterChange('price_max', e.target.value)}
                                placeholder="∞"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Surface minimum */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Surface min (m²)
                            </label>
                            <input
                                type="number"
                                name="surface_min"
                                value={filters.surface_min}
                                onChange={(e) => handleFilterChange('surface_min', e.target.value)}
                                placeholder="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Surface maximum */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Surface max (m²)
                            </label>
                            <input
                                type="number"
                                name="surface_max"
                                value={filters.surface_max}
                                onChange={(e) => handleFilterChange('surface_max', e.target.value)}
                                placeholder="∞"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Statut */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Statut
                            </label>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Tous les statuts</option>
                                {filterOptions.statuses?.map((status) => (
                                    <option key={status} value={status}>
                                        {status === 'active' ? 'Disponible' : 'InDisponible'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* En vedette */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                En vedette
                            </label>
                            <select
                                name="is_featured"
                                value={filters.is_featured}
                                onChange={(e) => handleFilterChange('is_featured', e.target.value === 'true')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Toutes</option>
                                <option value="true">En vedette</option>
                                <option value="false">Normales</option>
                            </select>
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            Effacer les filtres
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationFilterBar;
