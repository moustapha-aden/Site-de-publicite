import React from 'react';
import { Search, Filter } from 'lucide-react';

const FilterBar = ({
    filters,
    filterOptions,
    showFilters,
    setShowFilters,
    handleFilterChange,
    clearFilters
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Rechercher par marque, modèle ou description..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <Filter className="h-5 w-5" />
                    Filtres
                </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 border-t">
                    {/* Brand Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Marque
                        </label>
                        <select
                            value={filters.brand}
                            onChange={(e) => handleFilterChange('brand', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Toutes les marques</option>
                            {filterOptions.brands.map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                    </div>

                    {/* Fuel Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Carburant
                        </label>
                        <select
                            value={filters.fuel}
                            onChange={(e) => handleFilterChange('fuel', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Tous les carburants</option>
                            {filterOptions.fuel_types.map(fuel => (
                                <option key={fuel} value={fuel}>{fuel}</option>
                            ))}
                        </select>
                    </div>

                    {/* Transmission Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Transmission
                        </label>
                        <select
                            value={filters.transmission}
                            onChange={(e) => handleFilterChange('transmission', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Toutes les transmissions</option>
                            {filterOptions.transmission_types.map(transmission => (
                                <option key={transmission} value={transmission}>{transmission}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price Range */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prix (€)
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                value={filters.price_min}
                                onChange={(e) => handleFilterChange('price_min', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                           <input
                            type="number"
                            placeholder="Max"
                            value={filters.price_max}
                            onChange={(e) => handleFilterChange('price_max', e.target.value)}
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                    </div>

                    {/* Year Range */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Année
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                value={filters.year_min}
                                onChange={(e) => handleFilterChange('year_min', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                min="1900"
                                max={new Date().getFullYear() + 1}
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={filters.year_max}
                                onChange={(e) => handleFilterChange('year_max', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                min="1900"
                                max={new Date().getFullYear() + 1}
                            />
                        </div>
                    </div>

                    {/* Featured/New Filters */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <select
                                value={filters.is_featured}
                                onChange={(e) => handleFilterChange('is_featured', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                                <option value="">Tous</option>
                                <option value="true">En vedette</option>
                            </select>
                            <select
                                value={filters.is_new}
                                onChange={(e) => handleFilterChange('is_new', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                                <option value="">Tous</option>
                                <option value="true">Neufs</option>
                                <option value="false">Occasions</option>
                            </select>
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Trier par
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <select
                                value={filters.sort_by}
                                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                                <option value="created_at">Date d'ajout</option>
                                <option value="price">Prix</option>
                                <option value="year">Année</option>
                                <option value="mileage">Kilométrage</option>
                                <option value="brand">Marque</option>
                            </select>
                            <select
                                value={filters.sort_order}
                                onChange={(e) => handleFilterChange('sort_order', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                                <option value="desc">Décroissant</option>
                                <option value="asc">Croissant</option>
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                        <button
                            onClick={clearFilters}
                            className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Effacer les filtres
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterBar;
