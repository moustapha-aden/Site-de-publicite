import React, { useState, useEffect } from 'react';
import { Car, TrendingUp, Users, Star, Home as HomeIcon, MapPin, Shield, Award, Clock, ArrowRight, ChevronRight, Check } from 'lucide-react';
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
    const [currentHero, setCurrentHero] = useState(0);

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


    const heroSlides = [
        {
            title: "Trouvez votre véhicule idéal",
            subtitle: "Plus de 500 véhicules vérifiés et garantis",
            gradient: "from-blue-600 to-purple-600"
        },
        {
            title: "Parcelles et terrains disponibles",
            subtitle: "Investissez dans l'immobilier à Djibouti",
            gradient: "from-orange-500 to-red-600"
        },
        {
            title: "Locations de qualité",
            subtitle: "Trouvez votre prochain logement",
            gradient: "from-indigo-600 to-blue-600"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentHero((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section with Auto-Rotation */}
            <div className="relative h-screen max-h-[800px] overflow-hidden">
                {heroSlides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentHero ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}>
                            <div className="absolute inset-0 bg-black opacity-20"></div>
                        </div>
                        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
                            <div className="max-w-4xl animate-fade-in">
                                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                                    {slide.title}
                                </h1>
                                <p className="text-xl md:text-2xl text-gray-100 mb-8">
                                    {slide.subtitle}
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <button
                                        onClick={navigateToVehicles}
                                        className="bg-white text-gray-900 px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-lg font-bold shadow-2xl"
                                    >
                                        Découvrir maintenant
                                    </button>
                                    <button
                                        onClick={() => window.scrollTo({ top: document.querySelector('.animate-fade-in').offsetTop - 100, behavior: 'smooth' })}
                                        className="border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 text-lg font-bold"
                                    >
                                        En savoir plus
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Hero Indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentHero(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentHero ? 'bg-white w-8' : 'bg-white/50'
                            }`}
                        />
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Quick Access Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-32 mb-20 relative z-10">
                    <div className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue-600">
                        <Car className="h-12 w-12 text-blue-600 mb-4" />
                        <h3 className="text-2xl font-bold mb-2 text-gray-900">Véhicules</h3>
                        <p className="text-gray-600 mb-4">Neufs et d'occasion vérifiés</p>
                        <button
                            onClick={navigateToVehicles}
                            className="text-blue-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                        >
                            Explorer <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-orange-600">
                        <MapPin className="h-12 w-12 text-orange-600 mb-4" />
                        <h3 className="text-2xl font-bold mb-2 text-gray-900">Parcelles</h3>
                        <p className="text-gray-600 mb-4">Terrains à vendre à Djibouti</p>
                        <button
                            onClick={navigateToProperties}
                            className="text-orange-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                        >
                            Explorer <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-indigo-600">
                        <HomeIcon className="h-12 w-12 text-indigo-600 mb-4" />
                        <h3 className="text-2xl font-bold mb-2 text-gray-900">Locations</h3>
                        <p className="text-gray-600 mb-4">Logements disponibles</p>
                        <button
                            onClick={navigateToRentals}
                            className="text-indigo-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                        >
                            Explorer <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Featured Vehicles Section */}
                <section className="mb-20">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-2">Véhicules en Vedette</h2>
                            <p className="text-gray-600 text-lg">Nos meilleures offres du moment</p>
                        </div>
                        <button
                            onClick={() => navigateToVehicles()}
                            className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors font-semibold"
                        >
                            Voir tout <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>

                    {(featuredVehicles.length > 0 || newVehicles.length > 0) ? (
                        <div className="space-y-12">
                            {featuredVehicles.length > 0 && (
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <Star className="h-6 w-6 text-yellow-500" />
                                        Véhicules en Vedette
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {featuredVehicles.slice(0, 3).map((vehicle, index) => (
                                            <div key={vehicle.id} style={{ animationDelay: `${index * 150}ms` }}>
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
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <Car className="h-6 w-6 text-green-500" />
                                        Véhicules Neufs
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {newVehicles.slice(0, 3).map((vehicle, index) => (
                                            <div key={vehicle.id} style={{ animationDelay: `${index * 150}ms` }}>
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
                        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
                            <Car className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun véhicule disponible</h3>
                            <p className="text-gray-500">Revenez bientôt pour découvrir nos nouvelles offres</p>
                        </div>
                    )}
                </section>

                {/* Stats Section */}
                <section className="mb-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -ml-48 -mb-48"></div>

                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold text-center mb-12">AutoMarket en chiffres</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="bg-white/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                    <Car className="h-10 w-10" />
                                </div>
                                <h3 className="text-4xl font-bold mb-2">500+</h3>
                                <p className="text-blue-100">Véhicules disponibles</p>
                            </div>

                            <div className="text-center">
                                <div className="bg-white/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                    <Users className="h-10 w-10" />
                                </div>
                                <h3 className="text-4xl font-bold mb-2">1000+</h3>
                                <p className="text-blue-100">Clients satisfaits</p>
                            </div>

                            <div className="text-center">
                                <div className="bg-white/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                    <Star className="h-10 w-10" />
                                </div>
                                <h3 className="text-4xl font-bold mb-2">4.9/5</h3>
                                <p className="text-blue-100">Note moyenne</p>
                            </div>

                            <div className="text-center">
                                <div className="bg-white/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                    <TrendingUp className="h-10 w-10" />
                                </div>
                                <h3 className="text-4xl font-bold mb-2">10+</h3>
                                <p className="text-blue-100">Années d'expérience</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Properties Section */}
                <section className="mb-20">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-2">Parcelles à Vendre</h2>
                            <p className="text-gray-600 text-lg">Investissez dans l'immobilier à Djibouti</p>
                        </div>
                        <button
                            onClick={navigateToProperties}
                            className="hidden md:flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold"
                        >
                            Voir tout <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>

                    {featuredParcelles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredParcelles.slice(0, 6).map((parcelle, index) => (
                                <div key={parcelle.id} style={{ animationDelay: `${index * 150}ms` }}>
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
                        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
                            <MapPin className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune parcelle disponible</h3>
                            <p className="text-gray-500">Revenez bientôt pour découvrir nos nouvelles offres</p>
                        </div>
                    )}
                </section>

                {/* Featured Locations Section */}
                <section className="mb-20">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-2">Locations Disponibles</h2>
                            <p className="text-gray-600 text-lg">Logements et espaces à louer</p>
                        </div>
                        <button
                            onClick={navigateToRentals}
                            className="hidden md:flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors font-semibold"
                        >
                            Voir tout <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>

                    {featuredLocations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredLocations.slice(0, 6).map((location, index) => (
                                <div key={location.id} style={{ animationDelay: `${index * 150}ms` }}>
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
                        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
                            <HomeIcon className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune location disponible</h3>
                            <p className="text-gray-500">Revenez bientôt pour découvrir nos nouvelles offres</p>
                        </div>
                    )}
                </section>

                {/* Why Choose Us */}
                <section className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Pourquoi choisir AutoMarket ?</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Nous offrons une expérience unique et des garanties solides pour tous nos clients
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                                <Shield className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Qualité Garantie</h3>
                            <p className="text-gray-600 mb-4">Tous nos véhicules sont inspectés et certifiés par nos experts</p>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    Inspection complète en 150 points
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    Garantie constructeur disponible
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                                <Award className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Meilleurs Prix</h3>
                            <p className="text-gray-600 mb-4">Des prix compétitifs et transparents sans frais cachés</p>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    Prix négociables
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    Financement disponible
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                                <Clock className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Service Rapide</h3>
                            <p className="text-gray-600 mb-4">Support client disponible 7j/7 pour vous accompagner</p>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                    Réponse sous 24h
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                    Processus simplifié
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 opacity-10 rounded-full -mr-48 -mt-48"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 opacity-10 rounded-full -ml-48 -mb-48"></div>

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Prêt à commencer ?</h2>
                        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                            Rejoignez des milliers de clients qui ont trouvé leur bonheur avec AutoMarket
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={navigateToVehicles}
                                className="bg-blue-600 text-white px-10 py-4 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 text-lg font-bold shadow-2xl"
                            >
                                Parcourir les offres
                            </button>
                            <button
                                onClick={() => window.open('mailto:contact@automarket.com', '_blank')}
                                className="border-2 border-white text-white px-10 py-4 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 text-lg font-bold"
                            >
                                Nous contacter
                            </button>
                        </div>
                    </div>
                </section>
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

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
