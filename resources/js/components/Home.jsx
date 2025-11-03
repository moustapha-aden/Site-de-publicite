import React, { useState, useEffect } from 'react';
import { Car, TrendingUp, Users, Star, Home as HomeIcon, MapPin, Shield, Award, Clock, ArrowRight, ChevronRight, Check, Search, Phone, Mail, Sparkles, Building2, CheckCircle2, Heart, Zap, Target, Facebook, Instagram, Twitter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    // États pour les modales
    const [showDetail, setShowDetail] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [showParcelleDetail, setShowParcelleDetail] = useState(false);
    const [selectedParcelle, setSelectedParcelle] = useState(null);
    const [showLocationDetail, setShowLocationDetail] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    // Navigation
    const navigateToVehicles = (filterType = null, filterValue = null) => {
        const params = new URLSearchParams();
        if (filterType && filterValue) params.set(filterType, filterValue);
        navigate(`/vehicles${params.toString() ? `?${params}` : ''}`);
    };

    const navigateToProperties = () => navigate('/properties');
    const navigateToRentals = () => navigate('/rentals');
    const navigateToContact = () => navigate('/contact');

    // Fonctions pour les modales
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

    // Recherche globale
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    // Charger les données
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [vehiclesRes, parcellesRes, locationsRes] = await Promise.all([
                    fetch(`${API_URL}/vehicles?featured=true&limit=8`),
                    fetch(`${API_URL}/parcelles?featured=true&limit=6`),
                    fetch(`${API_URL}/locations?featured=true&limit=6`)
                ]);

                const vehiclesData = await vehiclesRes.json();
                const parcellesData = await parcellesRes.json();
                const locationsData = await locationsRes.json();

                setFeaturedVehicles(vehiclesData.data?.filter(v => v.is_featured) || []);
                setNewVehicles(vehiclesData.data?.filter(v => v.is_new) || []);
                setFeaturedParcelles(parcellesData.data || []);
                setFeaturedLocations(locationsData.data || []);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        setIsVisible(true);
    }, []);

    // Slides hero avec le design premium
    const heroSlides = [
        {
            title: "Bienvenue sur AutoMarket",
            subtitle: "Votre plateforme tout-en-un à Djibouti",
            description: "Véhicules, Parcelles et Locations - Tout ce dont vous avez besoin",
            gradient: "from-blue-600 via-cyan-500 to-teal-500",
            icon: Sparkles,
            buttonText: "Explorer maintenant",
            onClick: () => navigateToVehicles()
        },
        {
            title: "Véhicules Premium",
            subtitle: `${featuredVehicles.length + newVehicles.length}+ véhicules vérifiés et certifiés`,
            description: "Des voitures neuves et d'occasion pour tous les budgets",
            gradient: "from-orange-500 via-red-500 to-pink-500",
            icon: Car,
            buttonText: "Voir les véhicules",
            onClick: () => navigateToVehicles()
        },
        {
            title: "Investissez Malin",
            subtitle: `${featuredParcelles.length}+ parcelles et terrains à fort potentiel`,
            description: "Les meilleures opportunités immobilières à Djibouti",
            gradient: "from-green-500 via-emerald-500 to-teal-500",
            icon: MapPin,
            buttonText: "Découvrir les parcelles",
            onClick: () => navigateToProperties()
        },
        {
            title: "Locations de Luxe",
            subtitle: `${featuredLocations.length}+ appartements et maisons disponibles`,
            description: "Trouvez votre logement idéal dès aujourd'hui",
            gradient: "from-slate-700 via-gray-800 to-zinc-900",
            icon: Building2,
            buttonText: "Voir les locations",
            onClick: () => navigateToRentals()
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
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section - Ultra Premium */}
            <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgMCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

                    {/* Floating Orbs */}
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                    <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg px-6 py-3 rounded-full mb-8 border border-white/20 shadow-2xl">
                            <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                            <span className="text-white font-semibold">Plateforme N°1 à Djibouti</span>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
                            Trouvez Tout
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 mt-2">
                                En Un Seul Endroit
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Véhicules, Parcelles et Locations - La plateforme la plus complète pour vos projets à Djibouti
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-4xl mx-auto mb-12">
                            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2">
                                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                                    <Search className="h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un véhicule, une parcelle ou une location..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <Search className="h-5 w-5" />
                                    Rechercher
                                </button>
                            </form>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap justify-center gap-4 mb-16">
                            <button
                                onClick={() => navigateToVehicles()}
                                className="group bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
                            >
                                <Car className="h-5 w-5" />
                                Voir les Véhicules
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigateToProperties()}
                                className="group bg-white/10 backdrop-blur-lg text-white px-8 py-4 rounded-xl font-bold border-2 border-white/20 hover:bg-white/20 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
                            >
                                <MapPin className="h-5 w-5" />
                                Voir les Parcelles
                            </button>
                        </div>

                        {/* Stats Preview */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{featuredVehicles.length + newVehicles.length}+</h3>
                                <p className="text-gray-300 text-sm">Véhicules</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{featuredParcelles.length}+</h3>
                                <p className="text-gray-300 text-sm">Parcelles</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{featuredLocations.length}+</h3>
                                <p className="text-gray-300 text-sm">Locations</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">1000+</h3>
                                <p className="text-gray-300 text-sm">Clients</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                        <div className="w-1 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-6">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-600 font-semibold text-sm">Nos Services</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Que cherchez-vous aujourd'hui ?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Explorez nos trois catégories principales et trouvez exactement ce dont vous avez besoin
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Véhicules Card */}
                    <div className="group relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>

                        <div className="relative z-10">
                            <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Car className="h-8 w-8 text-white" />
                            </div>

                            <h3 className="text-3xl font-bold text-white mb-4">Véhicules</h3>
                            <p className="text-blue-100 mb-6 leading-relaxed">
                                Plus de {featuredVehicles.length + newVehicles.length} véhicules neufs et d'occasion, inspectés et garantis par nos experts
                            </p>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-white">
                                    <Check className="h-5 w-5 flex-shrink-0" />
                                    <span>Inspection complète</span>
                                </li>
                                <li className="flex items-center gap-2 text-white">
                                    <Check className="h-5 w-5 flex-shrink-0" />
                                    <span>Garantie constructeur</span>
                                </li>
                                <li className="flex items-center gap-2 text-white">
                                    <Check className="h-5 w-5 flex-shrink-0" />
                                    <span>Financement disponible</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => navigateToVehicles()}
                                className="w-full bg-white text-blue-600 px-6 py-4 rounded-xl font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Explorer
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Parcelles Card */}
                    <div className="group relative bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl p-8 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>

                        <div className="relative z-10">
                            <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <MapPin className="h-8 w-8 text-white" />
                            </div>

                            <h3 className="text-3xl font-bold text-white mb-4">Parcelles</h3>
                            <p className="text-orange-100 mb-6 leading-relaxed">
                                {featuredParcelles.length}+ terrains et parcelles à vendre partout à Djibouti, idéal pour vos investissements
                            </p>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-white">
                                    <Check className="h-5 w-5 flex-shrink-0" />
                                    <span>Titres fonciers vérifiés</span>
                                </li>
                                <li className="flex items-center gap-2 text-white">
                                    <Check className="h-5 w-5 flex-shrink-0" />
                                    <span>Meilleurs emplacements</span>
                                </li>
                                <li className="flex items-center gap-2 text-white">
                                    <Check className="h-5 w-5 flex-shrink-0" />
                                    <span>Prix transparents</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => navigateToProperties()}
                                className="w-full bg-white text-orange-600 px-6 py-4 rounded-xl font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Explorer
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Locations Card */}
                    <div className="group relative bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl p-8 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>

                        <div className="relative z-10">
                            <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>

                            <h3 className="text-3xl font-bold text-white mb-4">Locations</h3>
                            <p className="text-slate-200 mb-6 leading-relaxed">
                                {featuredLocations.length}+ appartements et maisons disponibles à la location dans toute la ville
                            </p>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-white">
                                    <Check className="h-5 w-5 flex-shrink-0" />
                                    <span>Visites virtuelles</span>
                                </li>
                                <li className="flex items-center gap-2 text-white">
                                    <Check className="h-5 w-5 flex-shrink-0" />
                                    <span>Contrats sécurisés</span>
                                </li>
                                <li className="flex items-center gap-2 text-white">
                                    <Check className="h-5 w-5 flex-shrink-0" />
                                    <span>Support 7j/7</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => navigateToRentals()}
                                className="w-full bg-white text-slate-700 px-6 py-4 rounded-xl font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Explorer
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Véhicules en Vedette */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Véhicules Disponibles</h2>
                    <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
                        Découvrez notre sélection de véhicules neufs et d'occasion soigneusement vérifiés
                    </p>
                </div>

                {featuredVehicles.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <Star className="h-6 w-6 text-yellow-500" />
                                Véhicules en Vedette
                            </h3>
                            <button
                                onClick={() => navigateToVehicles('featured', 'true')}
                                className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Voir tout
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredVehicles.slice(0, 3).map((vehicle, index) => (
                                <VehicleCard
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                    API_URL={API_URL}
                                    isAuthenticated={false}
                                    formatPrice={formatPrice}
                                    getFuelIcon={getFuelIcon}
                                    openDetailModal={openDetailModal}
                                    openEditModal={() => {}}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {newVehicles.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <Car className="h-6 w-6 text-green-500" />
                                Véhicules Neufs
                            </h3>
                            <button
                                onClick={() => navigateToVehicles('new', 'true')}
                                className="group flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
                            >
                                Voir tout
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {newVehicles.slice(0, 3).map((vehicle, index) => (
                                <VehicleCard
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                    API_URL={API_URL}
                                    isAuthenticated={false}
                                    formatPrice={formatPrice}
                                    getFuelIcon={getFuelIcon}
                                    openDetailModal={openDetailModal}
                                    openEditModal={() => {}}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {(featuredVehicles.length === 0 && newVehicles.length === 0) && (
                    <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
                        <Car className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun véhicule disponible</h3>
                        <p className="text-gray-500 mb-6">Revenez bientôt pour découvrir nos nouvelles offres</p>
                        <button
                            onClick={navigateToContact}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Être notifié des nouvelles arrivages
                        </button>
                    </div>
                )}
            </section>

            {/* Why Choose Us */}
            <div className="bg-gradient-to-b from-gray-50 to-white py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-6">
                            <Heart className="h-4 w-4 text-green-600" />
                            <span className="text-green-600 font-semibold text-sm">Pourquoi Nous Choisir</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Votre satisfaction est notre priorité
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Des milliers de clients nous font confiance pour leur projet
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-200">
                            <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                                <Shield className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">100% Vérifié</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Tous nos produits sont inspectés et certifiés par des experts qualifiés
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-200">
                            <div className="bg-gradient-to-br from-blue-400 to-cyan-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                                <Award className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Meilleurs Prix</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Prix compétitifs et transparents, sans frais cachés ni mauvaises surprises
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-orange-200">
                            <div className="bg-gradient-to-br from-orange-400 to-red-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                                <Clock className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Service Rapide</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Réponse en moins de 24h et accompagnement personnalisé 7j/7
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-teal-200">
                            <div className="bg-gradient-to-br from-teal-400 to-cyan-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                                <Users className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">1000+ Clients</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Des milliers de clients satisfaits qui nous recommandent
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-yellow-200">
                            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                                <Star className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Note 4.9/5</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Excellence reconnue par nos clients sur toutes nos prestations
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-pink-200">
                            <div className="bg-gradient-to-br from-pink-400 to-rose-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                                <Zap className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Technologie de pointe pour une expérience utilisateur optimale
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Parcelles */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Parcelles et Terrains</h2>
                    <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
                        Investissez dans l'immobilier à Djibouti avec nos parcelles soigneusement sélectionnées
                    </p>
                </div>

                {featuredParcelles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredParcelles.slice(0, 6).map((parcelle) => (
                            <ParcelleCard
                                key={parcelle.id}
                                parcelle={parcelle}
                                API_URL={API_URL}
                                isAuthenticated={false}
                                formatPrice={formatPrice}
                                openDetailModal={openParcelleDetailModal}
                                openEditModal={() => {}}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
                        <MapPin className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune parcelle disponible</h3>
                        <p className="text-gray-500">De nouvelles parcelles seront bientôt disponibles</p>
                    </div>
                )}
            </section>

            {/* Section Locations */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Locations Disponibles</h2>
                    <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
                        Trouvez le logement idéal qui correspond à vos besoins et à votre budget
                    </p>
                </div>

                {featuredLocations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredLocations.slice(0, 6).map((location) => (
                            <LocationCard
                                key={location.id}
                                location={location}
                                API_URL={API_URL}
                                isAuthenticated={false}
                                openDetailModal={openLocationDetailModal}
                                openEditModal={() => {}}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
                        <HomeIcon className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune location disponible</h3>
                        <p className="text-gray-500">De nouveaux logements seront bientôt disponibles à la location</p>
                    </div>
                )}
            </section>

            {/* Testimonials Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full mb-6">
                            <Star className="h-4 w-4 text-yellow-600" />
                            <span className="text-yellow-600 font-semibold text-sm">Témoignages</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Ce que disent nos clients
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-100">
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6 leading-relaxed italic">
                                "J'ai trouvé ma voiture idéale en moins d'une semaine. Service excellent et équipe très professionnelle !"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                    AM
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Ahmed Mohamed</p>
                                    <p className="text-sm text-gray-600">Client Véhicules</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border-2 border-orange-100">
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6 leading-relaxed italic">
                                "Investissement réussi grâce à AutoMarket. Parcelle bien située et prix honnête. Je recommande !"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                                    FH
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Fatima Hassan</p>
                                    <p className="text-sm text-gray-600">Cliente Parcelles</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-8 border-2 border-slate-100">
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6 leading-relaxed italic">
                                "Appartement trouvé rapidement et processus très simple. Équipe réactive et à l'écoute !"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white font-bold">
                                    OA
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Omar Ali</p>
                                    <p className="text-sm text-gray-600">Client Locations</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full mb-8 border border-white/30">
                        <Sparkles className="h-5 w-5 text-white" />
                        <span className="text-white font-semibold">Commencez Dès Maintenant</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Prêt à réaliser votre projet ?
                    </h2>

                    <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Plus de 1000 clients ont déjà trouvé ce qu'ils cherchaient. À votre tour !
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigateToVehicles()}
                            className="group bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 text-lg"
                        >
                            Voir toutes les offres
                            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={() => navigateToContact()}
                            className="group border-3 border-white text-white px-10 py-5 rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 text-lg font-bold backdrop-blur-sm bg-white/10 flex items-center justify-center gap-3"
                        >
                            <Phone className="h-6 w-6" />
                            Nous contacter
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                AutoMarket
                            </h3>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                Votre plateforme de confiance pour véhicules, parcelles et locations à Djibouti.
                            </p>
                            <div className="flex gap-4">
                                <button className="bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                                    <Facebook className="h-5 w-5" />
                                </button>
                                <button className="bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                                    <Instagram className="h-5 w-5" />
                                </button>
                                <button className="bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                                    <Twitter className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4 text-lg">Services</h4>
                            <ul className="space-y-3 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Véhicules</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Parcelles</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Locations</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Financement</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4 text-lg">À Propos</h4>
                            <ul className="space-y-3 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Qui sommes-nous</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Notre équipe</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Témoignages</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4 text-lg">Contact</h4>
                            <ul className="space-y-3 text-gray-400">
                                <li className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span>+253 XX XX XX XX</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span>contact@automarket.dj</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                                    <span>Djibouti, République de Djibouti</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 AutoMarket. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>

            {/* Modales */}
            {showDetail && selectedVehicle && (
                <DetailModal
                    vehicule={selectedVehicle}
                    onClose={closeDetailModal}
                    formatPrice={formatPrice}
                />
            )}

            {showParcelleDetail && selectedParcelle && (
                <ParcelleDetailModal
                    parcelle={selectedParcelle}
                    onClose={closeParcelleDetailModal}
                    formatPrice={formatPrice}
                />
            )}

            {showLocationDetail && selectedLocation && (
                <LocationDetailModal
                    location={selectedLocation}
                    onClose={closeLocationDetailModal}
                />
            )}
        </div>
    );
}