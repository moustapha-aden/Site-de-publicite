import React, { useState } from 'react';
import { X, MapPin, Home, DollarSign, Square, Bed, Bath, Phone, ChevronLeft, ChevronRight, MessageCircle, Calendar, Star } from 'lucide-react';

const LocationDetailModal = ({ location, onClose, API_URL }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!location) return null;

    const getLocationImages = () => {
        if (location.photo_urls && location.photo_urls.length > 0) {
            return location.photo_urls.map(photo => {
                // Vérifier si c'est une URL externe (picsum.photos)
                if (photo.startsWith('http')) {
                    return photo;
                }
                // Sinon, construire l'URL complète
                return `${API_URL.replace('/api', '')}${photo}`;
            });
        }
        if (location.photos && Array.isArray(location.photos) && location.photos.length > 0) {
            return location.photos.map(photo => {
                // Vérifier si c'est une URL externe
                if (photo.startsWith('http')) {
                    return photo;
                }
                // Construire l'URL complète pour les chemins locaux
                return `${API_URL.replace('/api', '')}/storage/${photo}`;
            });
        }
        return [];
    };

    const locationImages = getLocationImages();

    const nextImage = () => {
        if (locationImages.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === locationImages.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (locationImages.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? locationImages.length - 1 : prev - 1
            );
        }
    };

    const handleCall = () => {
        if (location.contact_number) {
            window.open(`tel:${location.contact_number}`, '_self');
        }
    };

    const handleWhatsApp = () => {
        if (location.contact_number) {
            const message = `Bonjour, je suis intéressé par la location "${location.title}" située à ${location.location}. Pourriez-vous me donner plus d'informations ?`;
            const whatsappUrl = `https://wa.me/${location.contact_number.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
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
            'maison': 'Maison',
            'appartement': 'Appartement',
            'villa': 'Villa',
            'bureau': 'Bureau',
            'commerce': 'Commerce'
        };
        return labels[type] || type;
    };

    const getStatusText = (status) => {
        return status === 'active' ? 'Disponible' : 'Réservé / Inactif';
    };

    const getStatusColor = (status) => {
        return status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Détails de la location</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Images Gallery */}
                    {locationImages.length > 0 && (
                        <div className="mb-6">
                            <div className="relative">
                                <img
                                    src={locationImages[currentImageIndex]}
                                    alt={`${location.title} - Image ${currentImageIndex + 1}`}
                                    className="w-full h-64 md:h-80 object-cover rounded-lg"
                                />

                                {/* Navigation buttons */}
                                {locationImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                                        >
                                            <ChevronLeft className="h-6 w-6" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                                        >
                                            <ChevronRight className="h-6 w-6" />
                                        </button>
                                    </>
                                )}

                                {/* Image counter */}
                                {locationImages.length > 1 && (
                                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                        {currentImageIndex + 1} / {locationImages.length}
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail navigation */}
                            {locationImages.length > 1 && (
                                <div className="flex gap-2 mt-4 overflow-x-auto">
                                    {locationImages.map((photo, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                                index === currentImageIndex
                                                    ? 'border-blue-500'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={photo}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Title and Type */}
                    <div className="mb-6">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-2xl font-bold text-gray-900">{location.title}</h3>
                            <div className="flex gap-2">
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(location.type)}`}>
                                    {getTypeLabel(location.type)}
                                </span>
                                {location.is_featured && (
                                    <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                        <Star className="h-4 w-4" />
                                        En vedette
                                    </span>
                                )}
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(location.status)}`}>
                                    {getStatusText(location.status)}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 text-gray-600 mb-4">
                            <MapPin className="h-5 w-5" />
                            <span className="text-lg">{location.location}</span>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign className="h-6 w-6 text-green-600" />
                            <span className="text-3xl font-bold text-gray-900">
                                {location.formatted_price}
                            </span>
                            <span className="text-lg text-gray-500">/ mois</span>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {location.surface && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Square className="h-5 w-5 text-gray-600" />
                                    <span className="font-medium text-gray-900">Surface</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-700">{location.surface} m²</p>
                            </div>
                        )}

                        {location.rooms && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Home className="h-5 w-5 text-gray-600" />
                                    <span className="font-medium text-gray-900">Pièces</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-700">{location.rooms}</p>
                            </div>
                        )}

                        {location.bedrooms && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Bed className="h-5 w-5 text-gray-600" />
                                    <span className="font-medium text-gray-900">Chambres</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-700">{location.bedrooms}</p>
                            </div>
                        )}

                        {location.bathrooms && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Bath className="h-5 w-5 text-gray-600" />
                                    <span className="font-medium text-gray-900">Salles de bain</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-700">{location.bathrooms}</p>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {location.description && (
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                            <p className="text-gray-700 leading-relaxed">{location.description}</p>
                        </div>
                    )}

                    {/* Date de création */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                        <Calendar className="h-4 w-4" />
                        <span>Ajouté le {new Date(location.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>

                    {/* Contact */}
                    {location.contact_number && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                                <Phone className="h-5 w-5 text-blue-600" />
                                <span className="font-medium text-gray-900">Contact</span>
                            </div>
                            <p className="text-lg font-semibold text-blue-700 mb-4">{location.formatted_contact || location.contact_number}</p>

                            {/* Action buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCall}
                                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <Phone className="h-4 w-4" />
                                    Appeler
                                </button>
                                <button
                                    onClick={handleWhatsApp}
                                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    WhatsApp
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocationDetailModal;
