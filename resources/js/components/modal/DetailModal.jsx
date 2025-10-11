import React, { useState } from 'react'; // 👈 Importez useState
import { X, DollarSign, Car, Settings, Calendar, Fuel, ChevronLeft, ChevronRight } from 'lucide-react'; // 👈 Ajoutez les Chevrons pour la navigation

const DetailModal = ({ vehicule, onClose, formatPrice }) => {
    // État pour suivre l'index de la photo affichée
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const localFormatPrice = formatPrice || ((price) => new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price));

    if (!vehicule) return null;

    const photoUrls = vehicule.photo_urls || [];
    const totalPhotos = photoUrls.length;
    const currentPhotoUrl = totalPhotos > 0 ? photoUrls[currentPhotoIndex] : null;

    // --- Fonctions de navigation ---
    const goToPrevious = () => {
        setCurrentPhotoIndex((prevIndex) =>
            // Revient à la dernière image si on est à la première
            prevIndex === 0 ? totalPhotos - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentPhotoIndex((prevIndex) =>
            // Revient à la première image si on est à la dernière
            prevIndex === totalPhotos - 1 ? 0 : prevIndex + 1
        );
    };
    // -----------------------------

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 transition-opacity"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 transform transition-all max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
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

                    {/* SECTION CARROUSEL DE PHOTOS AJOUTÉE ICI 👇 */}
                    <div className="relative mb-6">
                        <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-lg">
                            {currentPhotoUrl ? (
                                <img
                                    src={currentPhotoUrl}
                                    alt={`Photo ${currentPhotoIndex + 1} de ${vehicule.brand} ${vehicule.model}`}
                                    className="w-full h-full object-cover transition-opacity duration-300"
                                />
                            ) : (
                                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                    <Car className="h-12 w-12 text-gray-400" />
                                </div>
                            )}
                        </div>

                        {/* Boutons de navigation (seulement si plus d'une photo) */}
                        {totalPhotos > 1 && (
                            <>
                                {/* Bouton Précédent */}
                                <button
                                    onClick={goToPrevious}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition"
                                    aria-label="Photo précédente"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                {/* Bouton Suivant */}
                                <button
                                    onClick={goToNext}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition"
                                    aria-label="Photo suivante"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                {/* Indicateur de position */}
                                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                                    {photoUrls.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`h-2 w-2 rounded-full cursor-pointer transition-colors ${
                                                index === currentPhotoIndex ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
                                            }`}
                                            onClick={() => setCurrentPhotoIndex(index)}
                                            aria-label={`Aller à la photo ${index + 1}`}
                                        ></div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    {/* FIN DE LA SECTION CARROUSEL 👆 */}


                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {/* ... Le reste des détails du véhicule ... */}
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
