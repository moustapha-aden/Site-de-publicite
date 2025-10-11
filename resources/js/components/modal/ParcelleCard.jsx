import React from 'react';
import { MapPin, Home, DollarSign, Eye, Edit, Trash2 } from 'lucide-react';

const ParcelleCard = ({
    parcelle,
    API_URL,
    isAuthenticated,
    formatPrice,
    openDetailModal,
    openEditModal
}) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

        const getStatusLabel = (status) => {
            switch (status) {
                case 'active':
                    return 'Disponible';
                case 'inactive':
                    return 'Non disponible';
                default:
                    return status || 'Inconnu';
            }
        };



    const getTypeColor = (type) => {
        switch (type) {
            case 'terrain': return 'bg-green-100 text-green-800';
            case 'maison': return 'bg-blue-100 text-blue-800';
            case 'appartement': return 'bg-purple-100 text-purple-800';
            case 'villa': return 'bg-yellow-100 text-yellow-800';
            case 'bureau': return 'bg-gray-100 text-gray-800';
            case 'commerce': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeLabel = (type) => {
        const labels = {
            'terrain': 'Terrain',
            'maison': 'Maison',
            'appartement': 'Appartement',
            'villa': 'Villa',
            'bureau': 'Bureau',
            'commerce': 'Commerce'
        };
        return labels[type] || type;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            {/* Image */}
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg flex items-center justify-center">
                {parcelle.photo_urls && parcelle.photo_urls.length > 0 ? (
                    <img
                        src={parcelle.photo_urls[0]}
                        alt={parcelle.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                    />
                ) : (
                    <Home className="h-16 w-16 text-gray-400" />
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {parcelle.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                            <MapPin className="h-4 w-4" />
                            {parcelle.location}
                        </div>
                        {parcelle.surface && (
                            <p className="text-sm text-gray-500">
                                {parcelle.surface} m²
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(parcelle.type)}`}>
                            {getTypeLabel(parcelle.type)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(parcelle.status)}`}>
                            {getStatusLabel(parcelle.status)}
                        </span>
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="h-4 w-4 text-gray-600" />
                    <span className="font-semibold text-lg text-gray-900">
                        {formatPrice(parcelle.price)}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={() => openDetailModal(parcelle)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Eye className="h-4 w-4" />
                        Voir détails
                    </button>

                    {isAuthenticated && (
                        <>
                            <button
                                onClick={() => openEditModal(parcelle)}
                                className="px-3 py-2 text-yellow-600 hover:text-yellow-900 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors"
                            >
                                <Edit className="h-4 w-4" />
                            </button>
                            <button className="px-3 py-2 text-red-600 hover:text-red-900 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParcelleCard;
