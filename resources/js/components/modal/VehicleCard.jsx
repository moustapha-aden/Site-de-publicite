// VehicleCard.jsx

import React from 'react';
// Ajoutez l'icône Fuel pour la rendre disponible, même si nous utiliserons l'icône retournée par getFuelIcon
import { Car, Star, Calendar, Settings, DollarSign, Edit, Fuel } from 'lucide-react';

const VehicleCard = ({
    vehicle,
    API_URL,
    isAuthenticated,
    formatPrice,
    getFuelIcon, // Le composant utilitaire qui retourne le composant icône
    openDetailModal,
    openEditModal
}) => {
    // 1. Déterminez le composant Icône de carburant à l'aide de l'utilitaire.
    // getFuelIcon retourne un composant React (ex: Droplet, Zap).
    const FuelIconComponent = getFuelIcon(vehicle.fuel);

    // Correction majeure : Suppression de la boucle 'vehicles.map' et de la grille.
    // Ce composant ne rend QU'UNE SEULE carte.
    return (
        <div
            className="relative bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
        >
            {/* Image du véhicule */}
            <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-t-lg">
                {vehicle.images && vehicle.images.length > 0 ? (
                    <img
                        // Assurez-vous que l'API_URL est utilisé correctement
                        src={`${API_URL.replace('/api', '')}/storage/${vehicle.images[0].path}`}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="h-full w-full object-cover object-center"
                    />
                ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <Car className="h-16 w-16 text-gray-400" />
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
                    {/* Carburant - CORRECTION : Utilisation de FuelIconComponent */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        {/* Utilise le composant retourné par l'utilitaire */}
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
                    <div className="text-sm text-gray-600">
                        Couleur : {vehicle.color}
                    </div>
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
