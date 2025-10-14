import React from 'react';
import { MapPin, Home, Edit } from 'lucide-react';

const LocationCard = ({
    location,
    API_URL,
    isAuthenticated,
    openDetailModal,
    openEditModal
}) => {
    const getStatusText = (status) => {
        return status === 'active' ? 'Disponible' : 'Réservé / InDisponible';
    };

    const getStatusColor = (status) => {
        return status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'maison':
            case 'villa':
                return <Home className="h-16 w-16 text-gray-400" />;
            case 'appartement':
                return <Home className="h-16 w-16 text-gray-400" />;
            case 'bureau':
            case 'commerce':
                return <Home className="h-16 w-16 text-gray-400" />;
            default:
                return <Home className="h-16 w-16 text-gray-400" />;
        }
    };

    // Gérer les photos comme VehicleCard
    const getLocationImage = () => {
        // Option 1: Si vous utilisez l'accessor photo_urls du modèle
        if (location.photo_urls && location.photo_urls.length > 0) {
            // Vérifier si c'est une URL externe (picsum.photos)
            if (location.photo_urls[0].startsWith('http')) {
                return location.photo_urls[0];
            }
            // Sinon, construire l'URL complète
            return `${API_URL.replace('/api', '')}${location.photo_urls[0]}`;
        }

        // Option 2: Si vous recevez directement les photos
        if (location.photos && Array.isArray(location.photos) && location.photos.length > 0) {
            // Vérifier si c'est une URL externe
            if (location.photos[0].startsWith('http')) {
                return location.photos[0];
            }
            // Construire l'URL complète pour les chemins locaux
            return `${API_URL.replace('/api', '')}/storage/${location.photos[0]}`;
        }

        return null;
    };

    const locationImage = getLocationImage();

    return (
        <div className="relative bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
            {/* Image Section */}
            <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-t-lg">
                {locationImage ? (
                    <img
                        src={locationImage}
                        alt={location.title}
                        className="h-full w-full object-cover object-center"
                        onError={(e) => {
                            // Fallback si l'image ne charge pas
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                                <div class="h-full w-full bg-gray-200 flex items-center justify-center">
                                    <svg class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                            `;
                        }}
                    />
                ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        {getTypeIcon(location.type)}
                    </div>
                )}
                <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full uppercase shadow-md ${getStatusColor(location.status)}`}>
                    {getStatusText(location.status)}
                </span>
            </div>

            {/* Contenu principal */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {location.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            {location.location}
                        </div>
                    </div>
                    <div className="flex gap-1">
                        {location.is_featured && (
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                En vedette
                            </span>
                        )}
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    {/* Prix */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-semibold text-lg text-gray-900">
                            {location.formatted_price}
                        </span>
                        <span className="text-sm text-gray-500">/ mois</span>
                    </div>
                    {/* Type */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Home className="h-4 w-4" />
                        <span>{location.type.charAt(0).toUpperCase() + location.type.slice(1)}</span>
                    </div>
                    {/* Surface */}
                    {location.surface && (
                        <div className="text-sm text-gray-600">
                            {location.surface} m²
                        </div>
                    )}
                    {/* Pièces */}
                    {location.rooms && (
                        <div className="text-sm text-gray-600">
                            {location.rooms} Pièce(s)
                        </div>
                    )}
                    {/* Chambres */}
                    {location.bedrooms && (
                        <div className="text-sm text-gray-600">
                            {location.bedrooms} Chambre(s)
                        </div>
                    )}
                    {/* Salle de bain */}
                    {location.bathrooms && (
                        <div className="text-sm text-gray-600">
                            {location.bathrooms} SdB
                        </div>
                    )}
                </div>

                {location.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {location.description}
                    </p>
                )}

                {/* Bouton détails */}
                <button
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => openDetailModal(location)}
                >
                    Voir les détails
                </button>
            </div>

            {/* Bouton édition pour les admins */}
            {isAuthenticated && (
                <button
                    onClick={() => openEditModal(location)}
                    className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs px-2 py-1 bg-white/90 border border-gray-200 rounded-md hover:bg-white shadow-sm"
                    title="Éditer la location"
                >
                    <Edit className="h-4 w-4" /> Éditer
                </button>
            )}
        </div>
    );
};

export default LocationCard;
