import React from 'react';
import { X, DollarSign, Car, Settings, Calendar, Fuel } from 'lucide-react'; // Ajout d'icônes pour les détails

// Le composant est maintenant un modal fonctionnel et réutilisable.
const DetailModal = ({ vehicule, onClose, formatPrice }) => {

    // Définition de la fonction utilitaire si elle n'est pas passée (au cas où)
    const localFormatPrice = formatPrice || ((price) => new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price));

    if (!vehicule) return null;

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 transition-opacity"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 transform transition-all max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()} // Empêche la fermeture au clic à l'intérieur
            >
                <div className="flex justify-between items-start border-b pb-3 mb-4 sticky top-0 bg-white">
                    <h3 className="text-2xl font-extrabold text-blue-700 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2" />
                        {localFormatPrice(vehicule.price)}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <h4 className="text-xl font-bold text-gray-900 mb-4">{vehicule.brand} {vehicule.model}</h4>

                <div className="space-y-4 text-gray-700">
                    {/* Placeholder Image */}
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                        <Car className="h-12 w-12 text-gray-400" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <p className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <strong>Année:</strong> {vehicule.year}
                        </p>
                        <p className="flex items-center gap-2">
                            <Fuel className="w-4 h-4 text-gray-500" />
                            <strong>Carburant:</strong> {vehicule.fuel}
                        </p>
                        <p className="flex items-center gap-2">
                            <Settings className="w-4 h-4 text-gray-500" />
                            <strong>Transmission:</strong> {vehicule.transmission}
                        </p>
                        <p>
                            <strong>Kilométrage:</strong> {vehicule.mileage?.toLocaleString('fr-FR') || 'N/A'} km
                        </p>
                        <p className="col-span-2">
                            <strong>Couleur:</strong> {vehicule.color || 'N/A'}
                        </p>
                    </div>

                    <p>
                        <strong className="block mb-1">Description:</strong>
                        {vehicule.description || "Aucune description détaillée n'est disponible pour ce véhicule."}
                    </p>

                    {/* Vous pouvez ajouter d'autres détails ici si disponibles (ex: options, images) */}

                </div>

                <div className="mt-6 text-right">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailModal;
