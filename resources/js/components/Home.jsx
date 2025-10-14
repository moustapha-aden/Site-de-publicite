import React, { useState, useEffect } from 'react';
import { Car, TrendingUp, Users, Star, Home as HomeIcon, MapPin, Filter, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../api';
import { formatPrice, getFuelIcon } from '../utils';
import VehicleCard from './modal/VehicleCard';
import ParcelleCard from './modal/ParcelleCard';
import LocationCard from './modal/LocationCard';
import DetailModal from './modal/DetailModal';
import ParcelleDetailModal from './modal/ParcelleDetailModal';
import LocationDetailModal from './modal/LocationDetailModal';

export default function Home() {
    const navigate = useNavigate();
    const [featuredVehicles, setFeaturedVehicles] = useState([]);
    const [newVehicles, setNewVehicles] = useState([]);
    const [featuredParcelles, setFeaturedParcelles] = useState([]);
    const [featuredLocations, setFeaturedLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    // États pour la modale de détail
    // States for the detail modals
    const [showDetail, setShowDetail] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [showParcelleDetail, setShowParcelleDetail] = useState(false);
    const [selectedParcelle, setSelectedParcelle] = useState(null);
    const [showLocationDetail, setShowLocationDetail] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    // Les fonctions utilitaires formatPrice et getFuelIcon sont maintenant importées depuis utils.js

    // Fonctions de navigation avec filtres
    const navigateToVehicles = (filterType = null, filterValue = null) => {
        const params = new URLSearchParams();
        if (filterType && filterValue) {
            params.set(filterType, filterValue);
        }
        const queryString = params.toString();
        navigate(`/vehicles${queryString ? `?${queryString}` : ''}`);
    };

    const navigateToProperties = () => navigate('/properties');
    const navigateToRentals = () => navigate('/rentals');

    // Fonctions pour les modales de détail
    const openDetailModal = (vehicle) => {
        setSelectedVehicle(vehicle);
        setShowDetail(true);
    };

    const closeDetailModal = () => {
        setShowDetail(false);
        setSelectedVehicle(null);
    };

    const openParcelleDetailModal = (parcelle) => {
        setSelectedParcelle(parcelle);
        setShowParcelleDetail(true);
    };

    const closeParcelleDetailModal = () => {
        setShowParcelleDetail(false);
        setSelectedParcelle(null);
    };

    const openLocationDetailModal = (location) => {
        setSelectedLocation(location);
        setShowLocationDetail(true);
    };

    const closeLocationDetailModal = () => {
        setShowLocationDetail(false);
        setSelectedLocation(null);
    };

    // Charger les données
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vehiclesRes, parcellesRes, locationsRes] = await Promise.all([
                    fetch(`${API_URL}/vehicles?featured=1&limit=6`),
                    fetch(`${API_URL}/parcelles?featured=1&limit=6`),
                    fetch(`${API_URL}/locations?featured=1&limit=6`)
                ]);

                const vehiclesData = await vehiclesRes.json();
                const parcellesData = await parcellesRes.json();
                const locationsData = await locationsRes.json();

                // Séparer les véhicules en vedette et neufs
                const featured = vehiclesData.data?.filter(v => v.is_featured) || [];
                const newVehicles = vehiclesData.data?.filter(v => v.is_new) || [];

                setFeaturedVehicles(featured);
                setNewVehicles(newVehicles);
                setFeaturedParcelles(parcellesData.data || []);
                setFeaturedLocations(locationsData.data || []);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % 3);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + 3) % 3);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <div className="relative text-center mb-16 rounded-xl overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200)',
                        filter: 'brightness(0.5)'
                    }}
                />
                <div className="relative z-10 py-32 px-4">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Bienvenue sur AutoMarket
                    </h1>
                    <p className="text-2xl md:text-3xl text-gray-100 mb-4">
                        Véhicules • Parcelles à Vendre • Locations Disponibles
                    </p>
                    <p className="text-lg text-gray-200 mb-10 max-w-3xl mx-auto">
                        Trouvez ce que vous cherchez : voitures de qualité, terrains à bâtir, ou logements à louer
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={navigateToVehicles}
                            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold cursor-pointer"
                        >
                            Voir les offres
                        </button>
                        <button
                            onClick={() => window.scrollTo({ top: document.querySelector('.animate-fade-in').offsetTop - 100, behavior: 'smooth' })}
                            className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-gray-900 transition-colors text-lg font-semibold cursor-pointer"
                        >
                            En savoir plus
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation par catégories */}
            <div className="mb-12">
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                    <button
                        onClick={() => navigateToVehicles()}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
                    >
                        <Car className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-sm sm:text-base">Véhicules</span>
                    </button>
                    <button
                        onClick={() => navigateToVehicles('is_featured', 'true')}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
                    >
                        <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-sm sm:text-base">En Vedette</span>
                    </button>
                    <button
                        onClick={() => navigateToVehicles('is_new', 'true')}
                        className="flex items-center gap-2 bg-purple-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
                    >
                        <HomeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-sm sm:text-base">Véhicules Neufs</span>
                    </button>
                    <button
                        onClick={navigateToProperties}
                        className="flex items-center gap-2 bg-orange-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
                    >
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-sm sm:text-base">Parcelles</span>
                    </button>
                    <button
                        onClick={navigateToRentals}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
                    >
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-sm sm:text-base">Locations</span>
                    </button>
                </div>
            </div>

            {/* Véhicules */}
            <section className="mb-16 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Véhicules</h2>
                        <p className="text-gray-600">Véhicules en vedette et neufs disponibles</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={() => navigateToVehicles()}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300 cursor-pointer"
                        >
                            Voir tous <ArrowRight className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => navigateToVehicles('is_featured', 'true')}
                            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors duration-300 cursor-pointer"
                        >
                            En vedette <ArrowRight className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => navigateToVehicles('is_new', 'true')}
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-300 cursor-pointer"
                        >
                            Neufs <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Véhicules en Vedette */}
                {(featuredVehicles.length > 0 || newVehicles.length > 0) ? (
                    <div className="space-y-8">
                        {featuredVehicles.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Star className="h-5 w-5 text-yellow-500" />
                                    Véhicules en Vedette
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {featuredVehicles.slice(0, 3).map((vehicle, index) => (
                                        <div
                                            key={vehicle.id}
                                            className="animate-slide-up"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <VehicleCard
                                                vehicle={vehicle}
                                                API_URL={API_URL}
                                                isAuthenticated={false}
                                                formatPrice={formatPrice}
                                                getFuelIcon={getFuelIcon}
                                                openDetailModal={openDetailModal}
                                                openEditModal={() => {}}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {newVehicles.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Car className="h-5 w-5 text-green-500" />
                                    Véhicules Neufs
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {newVehicles.slice(0, 3).map((vehicle, index) => (
                                        <div
                                            key={vehicle.id}
                                            className="animate-slide-up"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <VehicleCard
                                                vehicle={vehicle}
                                                API_URL={API_URL}
                                                isAuthenticated={false}
                                                formatPrice={formatPrice}
                                                getFuelIcon={getFuelIcon}
                                                openDetailModal={openDetailModal}
                                                openEditModal={() => {}}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg animate-pulse">
                        <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Aucun véhicule disponible pour le moment</p>
                    </div>
                )}
            </section>

            {/* Parcelles */}
            <section className="mb-16 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Parcelles à Vendre</h2>
                        <p className="text-gray-600">Trouvez votre terrain idéal pour construire</p>
                    </div>
                    <button
                        onClick={navigateToProperties}
                        className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-300 self-start sm:self-auto cursor-pointer"
                    >
                        Voir tous <ArrowRight className="h-4 w-4" />
                    </button>
                </div>

                {featuredParcelles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {featuredParcelles.slice(0, 6).map((parcelle, index) => (
                            <div
                                key={parcelle.id}
                                className="animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <ParcelleCard
                                    parcelle={parcelle}
                                    API_URL={API_URL}
                                    isAuthenticated={false}
                                    formatPrice={formatPrice}
                                    openDetailModal={openParcelleDetailModal}
                                    openEditModal={() => {}}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg animate-pulse">
                        <HomeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Aucune parcelle disponible pour le moment</p>
                    </div>
                )}
            </section>

            {/* Locations */}
            <section className="mb-16 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Locations Disponibles</h2>
                        <p className="text-gray-600">Logements et espaces à louer</p>
                    </div>
                    <button
                        onClick={navigateToRentals}
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-300 self-start sm:self-auto cursor-pointer"
                    >
                        Voir tous <ArrowRight className="h-4 w-4" />
                    </button>
                </div>

                {featuredLocations.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {featuredLocations.slice(0, 6).map((location, index) => (
                            <div
                                key={location.id}
                                className="animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <LocationCard
                                    location={location}
                                    API_URL={API_URL}
                                    isAuthenticated={false}
                                    openDetailModal={openLocationDetailModal}
                                    openEditModal={() => {}}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg animate-pulse">
                        <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Aucune location disponible pour le moment</p>
                    </div>
                )}
            </section>

            {/* Stats Section */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow duration-300">
                    <Car className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-900">500+</h3>
                    <p className="text-sm sm:text-base text-gray-600">Véhicules disponibles</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow duration-300">
                    <Users className="h-8 w-8 sm:h-12 sm:w-12 text-green-600 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-900">1000+</h3>
                    <p className="text-sm sm:text-base text-gray-600">Clients satisfaits</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow duration-300">
                    <Star className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-600 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-900">4.9/5</h3>
                    <p className="text-sm sm:text-base text-gray-600">Note moyenne</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow duration-300">
                    <TrendingUp className="h-8 w-8 sm:h-12 sm:w-12 text-purple-600 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-900">10+</h3>
                    <p className="text-sm sm:text-base text-gray-600">Années d'expérience</p>
                </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                        <Car className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Large Sélection</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                        Plus de 500 véhicules de toutes marques et tous budgets
                    </p>
                </div>
                <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                        <Star className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Qualité Garantie</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                        Tous nos véhicules sont vérifiés et garantis
                    </p>
                </div>
                <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                        <Users className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Service Client</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                        Notre équipe est là pour vous accompagner
                    </p>
                </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 sm:p-8 text-center text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Prêt à trouver votre prochain achat ?</h2>
                <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90">
                    Rejoignez des milliers de clients satisfaits
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={navigateToVehicles}
                        className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-base sm:text-lg font-semibold shadow-lg cursor-pointer"
                    >
                        Commencer maintenant
                    </button>
                    <button
                        onClick={() => window.open('mailto:contact@automarket.com', '_blank')}
                        className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 text-base sm:text-lg font-semibold cursor-pointer"
                    >
                        Nous contacter
                    </button>
                </div>
            </div>

            {/* Modale de détail des véhicules */}
            {showDetail && selectedVehicle && (
                <DetailModal
                    vehicule={selectedVehicle}
                    onClose={closeDetailModal}
                    formatPrice={formatPrice}
                />
            )}

            {/* Modale de détail des parcelles */}
            {showParcelleDetail && selectedParcelle && (
                <ParcelleDetailModal
                    parcelle={selectedParcelle}
                    onClose={closeParcelleDetailModal}
                    formatPrice={formatPrice}
                />
            )}

            {/* Modale de détail des locations */}
            {showLocationDetail && selectedLocation && (
                <LocationDetailModal
                    location={selectedLocation}
                    onClose={closeLocationDetailModal}
                />
            )}
        </div>
    );
}
