import React from 'react';
import { X, MapPin, Home, DollarSign, Calendar, Users, ChevronLeft, ChevronRight, Phone, MessageCircle } from 'lucide-react';

const LocationDetailModal = ({ location, onClose }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = React.useState(0);

    if (!location) return null;

    const photoUrls = location.photo_urls || [];
    const totalPhotos = photoUrls.length;
    const currentPhotoUrl = totalPhotos > 0 ? photoUrls[currentPhotoIndex] : null;

    const getStatusColor = (status) => {
        return status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    const getStatusText = (status) => {
        return status === 'active' ? 'Disponible' : 'Réservé / InDisponible';
    };

    const goToPrevious = () => {
        setCurrentPhotoIndex((prevIndex) =>
            prevIndex === 0 ? totalPhotos - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentPhotoIndex((prevIndex) =>
            prevIndex === totalPhotos - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-2 sm:p-4 transition-opacity"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-4 sm:p-6 transform transition-all max-h-[95vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start border-b pb-3 mb-4 sticky top-0 bg-white">
                    <h3 className="text-lg sm:text-2xl font-extrabold text-blue-700 flex items-center">
                        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        {location.formatted_price}
                        <span className="text-sm text-gray-500 ml-1">/ mois</span>
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1">
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">{location.title}</h4>

                <div className="space-y-4 text-gray-700">

                    {/* SECTION CARROUSEL DE PHOTOS */}
                    <div className="relative mb-6">
                        {currentPhotoUrl ? (
                            <>
                                <img
                                    src={currentPhotoUrl}
                                    alt={location.title}
                                    className="w-full h-64 sm:h-80 object-cover rounded-lg"
                                />
                                {totalPhotos > 1 && (
                                    <>
                                        <button
                                            onClick={goToPrevious}
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition"
                                            aria-label="Photo précédente"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
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
                            </>
                        ) : (
                            <div className="w-full h-64 sm:h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Home className="h-16 w-16 text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* Informations principales */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <span className="font-medium">Localisation:</span>
                            <span>{location.location}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Home className="w-5 h-5 text-green-600" />
                            <span className="font-medium">Type:</span>
                            <span className="capitalize">{location.type}</span>
                        </div>

                        {location.surface && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Surface:</span>
                                <span>{location.surface} m²</span>
                            </div>
                        )}

                        {location.rooms && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Pièces:</span>
                                <span>{location.rooms}</span>
                            </div>
                        )}

                        {location.bedrooms && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Chambres:</span>
                                <span>{location.bedrooms}</span>
                            </div>
                        )}

                        {location.bathrooms && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Salles de bain:</span>
                                <span>{location.bathrooms}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(location.status)}`}>
                                {getStatusText(location.status)}
                            </span>
                        </div>

                        {location.is_featured && (
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                    En vedette
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {location.description && (
                        <div>
                            <h5 className="font-semibold text-gray-900 mb-2">Description</h5>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {location.description}
                            </p>
                        </div>
                    )}

                    {/* Informations supplémentaires */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-900 mb-3">Informations détaillées</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            {location.created_at && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-600">Ajouté le:</span>
                                    <span>{new Date(location.created_at).toLocaleDateString('fr-FR')}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Fermer
                        </button>
                    </div>

                    {/* Section Contact */}
                    {location.contact_number && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h5 className="font-semibold text-gray-900 mb-3">Contacter le propriétaire</h5>
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Bouton WhatsApp */}
                                <a
                                    href={`https://wa.me/${location.contact_number.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-md transition"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    WhatsApp
                                </a>

                                {/* Bouton Appel */}
                                <a
                                    href={`tel:${location.contact_number}`}
                                    className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md transition"
                                >
                                    <Phone className="w-5 h-5" />
                                    Appeler
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocationDetailModal;
