import React from 'react';
import { MapPin, Home, DollarSign } from 'lucide-react';

export default function Properties() {
    const properties = [
        {
            id: 1,
            title: "Terrain à bâtir - 500m²",
            location: "Paris 15ème",
            price: 250000,
            type: "Terrain",
            image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400"
        },
        {
            id: 2,
            title: "Maison familiale - 120m²",
            location: "Lyon",
            price: 450000,
            type: "Maison",
            image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400"
        },
        {
            id: 3,
            title: "Appartement T3 - 75m²",
            location: "Marseille",
            price: 180000,
            type: "Appartement",
            image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"
        },
        {
            id: 4,
            title: "Villa avec piscine - 200m²",
            location: "Nice",
            price: 850000,
            type: "Villa",
            image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400"
        }
    ];

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Parcelles à Vendre
                </h1>
                <p className="text-gray-600">
                    Découvrez notre sélection de terrains et propriétés
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">Tous les types</option>
                            <option value="terrain">Terrain</option>
                            <option value="maison">Maison</option>
                            <option value="appartement">Appartement</option>
                            <option value="villa">Villa</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Localisation
                        </label>
                        <input
                            type="text"
                            placeholder="Ville ou région"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-end">
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            Rechercher
                        </button>
                    </div>
                </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                    <div key={property.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                        <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg flex items-center justify-center">
                            <Home className="h-16 w-16 text-gray-400" />
                        </div>
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        {property.title}
                                    </h3>
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <MapPin className="h-4 w-4" />
                                        {property.location}
                                    </div>
                                </div>
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    {property.type}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <DollarSign className="h-4 w-4 text-gray-600" />
                                <span className="font-semibold text-lg text-gray-900">
                                    {formatPrice(property.price)}
                                </span>
                            </div>
                            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                Voir les détails
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
