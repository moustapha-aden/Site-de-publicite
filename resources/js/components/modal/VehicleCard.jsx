// VehicleCard.jsx

import React from 'react';
import { Car, Star, Calendar, Settings, DollarSign, Edit } from 'lucide-react';

const VehicleCard = ({
    vehicle,
    API_URL,
    isAuthenticated,
    formatPrice,
    getFuelIcon,
    openDetailModal,
    openEditModal
}) => {
    // Déterminez le composant icône de carburant
    const FuelIconComponent = getFuelIcon(vehicle.fuel);

    // CORRECTION: Gérer les photos (photo_urls vient de l'accessor Laravel)
    const getVehicleImage = () => {
        // Helper pour normaliser les URLs - utiliser l'URL du serveur Laravel
        const normalizeUrl = (url) => {
            if (!url) return null;
            // Si c'est déjà une URL complète, la retourner telle quelle
            if (url.startsWith('http://') || url.startsWith('https://')) {
                return url;
            }
            // Sinon, construire l'URL complète avec l'URL du serveur Laravel (127.0.0.1:8000)
            // Extraire l'URL de base depuis API_URL
            const baseUrl = API_URL.replace('/api', '');
            return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
        };

        // Option 1: Si vous utilisez l'accessor photo_urls du modèle (préféré)
        if (vehicle.photo_urls && Array.isArray(vehicle.photo_urls) && vehicle.photo_urls.length > 0) {
            return normalizeUrl(vehicle.photo_urls[0]);
        }

        // Option 2: Si vous recevez directement les photos (fallback)
        if (vehicle.photos && Array.isArray(vehicle.photos) && vehicle.photos.length > 0) {
            const photo = vehicle.photos[0];
            // Si c'est déjà une URL complète
            if (photo.startsWith('http://') || photo.startsWith('https://')) {
                return photo;
            }
            // Construire l'URL complète avec le chemin storage
            const baseUrl = API_URL.replace('/api', '');
            const photoPath = photo.startsWith('/') ? photo : `/${photo}`;
            return `${baseUrl}/storage${photoPath}`;
        }

        return null;
    };

    const vehicleImage = getVehicleImage();
    
    // Debug: Afficher les informations sur les images (à retirer en production)
    React.useEffect(() => {
        if (vehicleImage) {
            console.log(`[VehicleCard] Image URL pour ${vehicle.brand} ${vehicle.model}:`, vehicleImage);
            console.log(`[VehicleCard] photo_urls:`, vehicle.photo_urls);
            console.log(`[VehicleCard] photos:`, vehicle.photos);
        } else {
            console.warn(`[VehicleCard] Aucune image trouvée pour ${vehicle.brand} ${vehicle.model}`);
            console.log(`[VehicleCard] photo_urls:`, vehicle.photo_urls);
            console.log(`[VehicleCard] photos:`, vehicle.photos);
        }
    }, [vehicle.id, vehicleImage]);

    return (
        <div className="relative bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
            {/* Image du véhicule */}
            <div className="relative w-full h-48 overflow-hidden rounded-t-lg bg-gray-200">
                {vehicleImage ? (
                    <>
                        <img
                            src={vehicleImage}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                            onError={(e) => {
                                // Log pour déboguer
                                console.warn('Erreur de chargement d\'image:', vehicleImage, e);
                                // Fallback si l'image ne charge pas
                                e.target.style.display = 'none';
                                const fallbackDiv = e.target.nextElementSibling;
                                if (fallbackDiv) {
                                    fallbackDiv.style.display = 'flex';
                                }
                            }}
                            onLoad={() => {
                                // Masquer le fallback si l'image charge correctement
                                const fallbackDiv = document.querySelector(`[data-vehicle-fallback="${vehicle.id}"]`);
                                if (fallbackDiv) {
                                    fallbackDiv.style.display = 'none';
                                }
                            }}
                        />
                        {/* Fallback pour image qui ne charge pas */}
                        <div
                            data-vehicle-fallback={vehicle.id}
                            className="absolute inset-0 bg-gray-200 flex items-center justify-center hidden"
                        >
                            <div className="text-center">
                                <Car className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Image non disponible</p>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Fallback pour image manquante */
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <div className="text-center">
                            <Car className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Image non disponible</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Contenu principal */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {vehicle.brand} {vehicle.model}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            {vehicle.year}
                        </div>
                    </div>
                    <div className="flex gap-1">
                        {vehicle.is_featured && (
                            <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        )}
                        {vehicle.is_new && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                Neuf
                            </span>
                        )}
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    {/* Prix */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold text-lg text-gray-900">
                            {formatPrice(vehicle.price)}
                        </span>
                    </div>
                    {/* Carburant */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FuelIconComponent className="h-4 w-4" />
                        <span>{vehicle.fuel}</span>
                    </div>
                    {/* Transmission */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Settings className="h-4 w-4" />
                        <span>{vehicle.transmission}</span>
                    </div>
                    {/* Kilométrage */}
                    <div className="text-sm text-gray-600">
                        {Number(vehicle.mileage).toLocaleString('fr-FR')} km
                    </div>
                    {/* Couleur */}
                    {vehicle.color && (
                        <div className="text-sm text-gray-600">
                            Couleur : {vehicle.color}
                        </div>
                    )}
                </div>

                {vehicle.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {vehicle.description}
                    </p>
                )}

                {/* Bouton détails */}
                <button
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => openDetailModal(vehicle)}
                >
                    Voir les détails
                </button>
            </div>

            {/* Bouton édition pour les admins */}
            {isAuthenticated && (
                <button
                    onClick={() => openEditModal(vehicle)}
                    className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs px-2 py-1 bg-white/90 border border-gray-200 rounded-md hover:bg-white shadow-sm"
                    title="Éditer le véhicule"
                >
                    <Edit className="h-4 w-4" /> Éditer
                </button>
            )}
        </div>
    );
};

export default VehicleCard;
