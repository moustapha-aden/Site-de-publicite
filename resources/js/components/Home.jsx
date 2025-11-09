import React, { useState, useEffect, useMemo } from 'react';
import { Car, Users, Star, Home as HomeIcon, MapPin, Shield, Award, Clock, ArrowRight, Check, Search, Phone, Mail, Building2, Heart, Target, Facebook, Instagram, Twitter, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../api';
import { formatPrice, getFuelIcon } from '../utils';
import VehicleCard from './modal/VehicleCard';
import ParcelleCard from './modal/ParcelleCard';
import LocationCard from './modal/LocationCard';
import DetailModal from './modal/DetailModal';
import ParcelleDetailModal from './modal/ParcelleDetailModal';
import LocationDetailModal from './modal/LocationDetailModal';
import Footer from './Footer';

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

    // Slides hero avec style professionnel
    const heroSlides = useMemo(() => [
        {
            title: "Bienvenue sur AutoMarket",
            subtitle: "Votre partenaire de confiance à Djibouti",
            description: "Véhicules, Parcelles et Locations - Tout ce dont vous avez besoin",
            buttonText: "Explorer maintenant",
            onClick: () => navigateToVehicles()
        },
        {
            title: "Véhicules Premium",
            subtitle: `${featuredVehicles.length + newVehicles.length}+ véhicules vérifiés et certifiés`,
            description: "Des voitures neuves et d'occasion pour tous les budgets",
            buttonText: "Voir les véhicules",
            onClick: () => navigateToVehicles()
        },
        {
            title: "Investissez Malin",
            subtitle: `${featuredParcelles.length}+ parcelles et terrains à fort potentiel`,
            description: "Les meilleures opportunités immobilières à Djibouti",
            buttonText: "Découvrir les parcelles",
            onClick: () => navigateToProperties()
        },
        {
            title: "Locations de Luxe",
            subtitle: `${featuredLocations.length}+ appartements et maisons disponibles`,
            description: "Trouvez votre logement idéal dès aujourd'hui",
            buttonText: "Voir les locations",
            onClick: () => navigateToRentals()
        }
    ], [featuredVehicles.length, newVehicles.length, featuredParcelles.length, featuredLocations.length]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentHero((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroSlides.length]);

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
        <div className="min-h-screen bg-white">
            {/* Hero Section - Noir et Blanc */}
            <div className="relative bg-white">
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="min-h-[85vh] flex items-center py-20">
                        <div className={`w-full text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            {/* Badge minimaliste */}
                            {/* <div className="inline-block bg-black/10 px-6 py-2 mb-8 border border-black/20"> */}
                                {/* <span className="text-black font-semibold text-sm tracking-wide uppercase">VOTRE PARTENAIRE DE CONFIANCE</span> */}
                            {/* </div> */}

                            {/* Titre principal */}
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight tracking-tight">
                                AutoMarket
                            </h1>

                            <div className="w-24 h-0.5 bg-black mx-auto mb-6"></div>

                            <p className="text-xl md:text-2xl text-black/90 mb-4 max-w-3xl mx-auto font-light">
                                Trouvez votre véhicule, parcelle ou location idéale
                            </p>
                            <p className="text-lg md:text-xl text-black/70 mb-12 max-w-2xl mx-auto font-light">
                                La plateforme complète pour tous vos besoins à Djibouti
                            </p>

                            {/* Barre de recherche - Style minimaliste */}
                            <div className="max-w-3xl mx-auto mb-12">
                                <form onSubmit={handleSearch} className="bg-white border-2 border-black overflow-hidden flex flex-col md:flex-row">
                                    <div className="flex-1 flex items-center gap-3 px-5 py-4">
                                        <Search className="h-5 w-5 text-black/50 flex-shrink-0" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher un véhicule, une parcelle ou une location..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="flex-1 bg-transparent border-none outline-none text-black placeholder-black/50 text-base"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-black hover:bg-black/90 text-white px-8 py-4 font-semibold transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap border-l-2 border-black"
                                    >
                                        <Search className="h-5 w-5" />
                                        Rechercher
                                    </button>
                                </form>
                            </div>

                            {/* Boutons CTA - Noir et Blanc */}
                            <div className="flex flex-wrap justify-center gap-4 mb-16">
                                <button
                                    onClick={() => navigateToVehicles()}
                                    className="bg-black text-white px-8 py-4 font-semibold hover:bg-black/90 transition-colors duration-200 flex items-center gap-2 border-2 border-black"
                                >
                                    <Car className="h-5 w-5" />
                                    Voir les Véhicules
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => navigateToProperties()}
                                    className="bg-transparent border-2 border-black text-black px-8 py-4 font-semibold hover:bg-black hover:text-white transition-all duration-200 flex items-center gap-2"
                                >
                                    <MapPin className="h-5 w-5" />
                                    Voir les Parcelles
                                </button>
                                <button
                                    onClick={() => navigateToRentals()}
                                    className="bg-transparent border-2 border-black text-black px-8 py-4 font-semibold hover:bg-black hover:text-white transition-all duration-200 flex items-center gap-2"
                                >
                                    <Building2 className="h-5 w-5" />
                                    Voir les Locations
                                </button>
                            </div>

                            {/* Statistiques - Style minimaliste */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                                <div className="bg-black/5 border border-black/20 p-6">
                                    <h3 className="text-4xl md:text-5xl font-bold text-black mb-2">{featuredVehicles.length + newVehicles.length}+</h3>
                                    <p className="text-black/70 text-sm uppercase tracking-wide">Véhicules</p>
                                </div>
                                <div className="bg-black/5 border border-black/20 p-6">
                                    <h3 className="text-4xl md:text-5xl font-bold text-black mb-2">{featuredParcelles.length}+</h3>
                                    <p className="text-black/70 text-sm uppercase tracking-wide">Parcelles</p>
                                </div>
                                <div className="bg-black/5 border border-black/20 p-6">
                                    <h3 className="text-4xl md:text-5xl font-bold text-black mb-2">{featuredLocations.length}+</h3>
                                    <p className="text-black/70 text-sm uppercase tracking-wide">Locations</p>
                                </div>
                                <div className="bg-black/5 border border-black/20 p-6">
                                    <h3 className="text-4xl md:text-5xl font-bold text-black mb-2">1000+</h3>
                                    <p className="text-black/70 text-sm uppercase tracking-wide">Clients</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Section - Noir et Blanc */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                            Que cherchez-vous aujourd'hui ?
                        </h2>
                        <div className="w-20 h-0.5 bg-black mx-auto mb-6"></div>
                        <p className="text-lg text-black/70 max-w-2xl mx-auto">
                            Explorez nos trois catégories principales et trouvez exactement ce dont vous avez besoin
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Véhicules Card */}
                        <div className="bg-white border-2 border-black p-8 hover:shadow-lg transition-all duration-300">
                            <div className="bg-black w-16 h-16 flex items-center justify-center mb-6">
                                <Car className="h-8 w-8 text-white" />
                            </div>

                            <h3 className="text-2xl font-bold text-black mb-4">Véhicules</h3>
                            <p className="text-black/70 mb-6 leading-relaxed">
                                Plus de {featuredVehicles.length + newVehicles.length} véhicules neufs et d'occasion, inspectés et garantis par nos experts
                            </p>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-black">
                                    <Check className="h-5 w-5 flex-shrink-0 text-black" />
                                    <span>Inspection complète</span>
                                </li>
                                <li className="flex items-center gap-2 text-black">
                                    <Check className="h-5 w-5 flex-shrink-0 text-black" />
                                    <span>Garantie constructeur</span>
                                </li>
                                <li className="flex items-center gap-2 text-black">
                                    <Check className="h-5 w-5 flex-shrink-0 text-black" />
                                    <span>Financement disponible</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => navigateToVehicles()}
                                className="w-full bg-black hover:bg-gray-900 text-white px-6 py-3 font-semibold transition-colors duration-200 flex items-center justify-center gap-2 border-2 border-black"
                            >
                                Explorer
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Parcelles Card */}
                        <div className="bg-white border-2 border-black p-8 hover:shadow-lg transition-all duration-300">
                            <div className="bg-black w-16 h-16 flex items-center justify-center mb-6">
                                <MapPin className="h-8 w-8 text-white" />
                            </div>

                            <h3 className="text-2xl font-bold text-black mb-4">Parcelles</h3>
                            <p className="text-black/70 mb-6 leading-relaxed">
                                {featuredParcelles.length}+ terrains et parcelles à vendre partout à Djibouti, idéal pour vos investissements
                            </p>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-black">
                                    <Check className="h-5 w-5 flex-shrink-0 text-black" />
                                    <span>Titres fonciers vérifiés</span>
                                </li>
                                <li className="flex items-center gap-2 text-black">
                                    <Check className="h-5 w-5 flex-shrink-0 text-black" />
                                    <span>Meilleurs emplacements</span>
                                </li>
                                <li className="flex items-center gap-2 text-black">
                                    <Check className="h-5 w-5 flex-shrink-0 text-black" />
                                    <span>Prix transparents</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => navigateToProperties()}
                                className="w-full bg-black hover:bg-gray-900 text-white px-6 py-3 font-semibold transition-colors duration-200 flex items-center justify-center gap-2 border-2 border-black"
                            >
                                Explorer
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Locations Card */}
                        <div className="bg-white border-2 border-black p-8 hover:shadow-lg transition-all duration-300">
                            <div className="bg-black w-16 h-16 flex items-center justify-center mb-6">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>

                            <h3 className="text-2xl font-bold text-black mb-4">Locations</h3>
                            <p className="text-black/70 mb-6 leading-relaxed">
                                {featuredLocations.length}+ appartements et maisons disponibles à la location dans toute la ville
                            </p>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-black">
                                    <Check className="h-5 w-5 flex-shrink-0 text-black" />
                                    <span>Visites virtuelles</span>
                                </li>
                                <li className="flex items-center gap-2 text-black">
                                    <Check className="h-5 w-5 flex-shrink-0 text-black" />
                                    <span>Contrats sécurisés</span>
                                </li>
                                <li className="flex items-center gap-2 text-black">
                                    <Check className="h-5 w-5 flex-shrink-0 text-black" />
                                    <span>Support 7j/7</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => navigateToRentals()}
                                className="w-full bg-black hover:bg-gray-900 text-white px-6 py-3 font-semibold transition-colors duration-200 flex items-center justify-center gap-2 border-2 border-black"
                            >
                                Explorer
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Véhicules en Vedette */}
            <section className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Véhicules Disponibles</h2>
                    <div className="w-20 h-0.5 bg-black mx-auto mb-6"></div>
                    <p className="text-black/70 text-lg max-w-3xl mx-auto leading-relaxed">
                        Découvrez notre sélection de véhicules neufs et d'occasion soigneusement vérifiés
                    </p>
                </div>

                {featuredVehicles.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-black flex items-center gap-3">
                                <Star className="h-6 w-6 text-black" />
                                Véhicules en Vedette
                            </h3>
                            <button
                                onClick={() => navigateToVehicles('featured', 'true')}
                                className="group flex items-center gap-2 text-black hover:text-gray-700 font-semibold"
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
                            <h3 className="text-2xl font-bold text-black flex items-center gap-3">
                                <Car className="h-6 w-6 text-black" />
                                Véhicules Neufs
                            </h3>
                            <button
                                onClick={() => navigateToVehicles('new', 'true')}
                                className="group flex items-center gap-2 text-black hover:text-gray-700 font-semibold"
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
                    <div className="text-center py-16 bg-white border-2 border-black">
                        <Car className="h-20 w-20 text-black mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-black mb-2">Aucun véhicule disponible</h3>
                        <p className="text-black/70 mb-6">Revenez bientôt pour découvrir nos nouvelles offres</p>
                        <button
                            onClick={navigateToContact}
                            className="bg-black text-white px-6 py-3 hover:bg-black/90 transition-colors border-2 border-black"
                        >
                            Être notifié des nouvelles arrivages
                        </button>
                    </div>
                )}
            </section>

            {/* Why Choose Us - Noir et Blanc */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                            Pourquoi Nous Choisir
                        </h2>
                        <div className="w-20 h-0.5 bg-black mx-auto mb-6"></div>
                        <p className="text-lg text-black/70 max-w-3xl mx-auto">
                            Votre satisfaction est notre priorité - Des milliers de clients nous font confiance
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-8 border-2 border-black hover:shadow-lg transition-all duration-300">
                            <div className="bg-black w-14 h-14 flex items-center justify-center mb-6">
                                <Shield className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-black mb-3">100% Vérifié</h3>
                            <p className="text-black/70 leading-relaxed">
                                Tous nos produits sont inspectés et certifiés par des experts qualifiés
                            </p>
                        </div>

                        <div className="bg-white p-8 border-2 border-black hover:shadow-lg transition-all duration-300">
                            <div className="bg-black w-14 h-14 flex items-center justify-center mb-6">
                                <Award className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-black mb-3">Meilleurs Prix</h3>
                            <p className="text-black/70 leading-relaxed">
                                Prix compétitifs et transparents, sans frais cachés ni mauvaises surprises
                            </p>
                        </div>

                        <div className="bg-white p-8 border-2 border-black hover:shadow-lg transition-all duration-300">
                            <div className="bg-black w-14 h-14 flex items-center justify-center mb-6">
                                <Clock className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-black mb-3">Service Rapide</h3>
                            <p className="text-black/70 leading-relaxed">
                                Réponse en moins de 24h et accompagnement personnalisé 7j/7
                            </p>
                        </div>

                        <div className="bg-white p-8 border-2 border-black hover:shadow-lg transition-all duration-300">
                            <div className="bg-black w-14 h-14 flex items-center justify-center mb-6">
                                <Users className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-black mb-3">1000+ Clients</h3>
                            <p className="text-black/70 leading-relaxed">
                                Des milliers de clients satisfaits qui nous recommandent
                            </p>
                        </div>

                        <div className="bg-white p-8 border-2 border-black hover:shadow-lg transition-all duration-300">
                            <div className="bg-black w-14 h-14 flex items-center justify-center mb-6">
                                <Star className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-black mb-3">Note 4.9/5</h3>
                            <p className="text-black/70 leading-relaxed">
                                Excellence reconnue par nos clients sur toutes nos prestations
                            </p>
                        </div>

                        <div className="bg-white p-8 border-2 border-black hover:shadow-lg transition-all duration-300">
                            <div className="bg-black w-14 h-14 flex items-center justify-center mb-6">
                                <Heart className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-black mb-3">Engagement</h3>
                            <p className="text-black/70 leading-relaxed">
                                Technologie de pointe pour une expérience utilisateur optimale
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Parcelles */}
            <section className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Parcelles et Terrains</h2>
                    <div className="w-20 h-0.5 bg-black mx-auto mb-6"></div>
                    <p className="text-black/70 text-lg max-w-3xl mx-auto leading-relaxed">
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
                    <div className="text-center py-16 bg-white border-2 border-black">
                        <MapPin className="h-20 w-20 text-black mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-black mb-2">Aucune parcelle disponible</h3>
                        <p className="text-black/70">De nouvelles parcelles seront bientôt disponibles</p>
                    </div>
                )}
            </section>

            {/* Section Locations */}
            <section className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Locations Disponibles</h2>
                    <div className="w-20 h-0.5 bg-black mx-auto mb-6"></div>
                    <p className="text-black/70 text-lg max-w-3xl mx-auto leading-relaxed">
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
                    <div className="text-center py-16 bg-white border-2 border-black">
                        <HomeIcon className="h-20 w-20 text-black mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-black mb-2">Aucune location disponible</h3>
                        <p className="text-black/70">De nouveaux logements seront bientôt disponibles à la location</p>
                    </div>
                )}
            </section>

            {/* Testimonials Section */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                            Ce que disent nos clients
                        </h2>
                        <div className="w-20 h-0.5 bg-black mx-auto mb-6"></div>
                        <p className="text-lg text-black/70 max-w-2xl mx-auto">
                            Découvrez les expériences de nos clients satisfaits
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 border-2 border-black hover:shadow-lg transition-all duration-300">
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-black text-black" />
                                ))}
                            </div>
                            <p className="text-black/80 mb-6 leading-relaxed italic">
                                "J'ai trouvé ma voiture idéale en moins d'une semaine. Service excellent et équipe très professionnelle !"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">
                                    AM
                                </div>
                                <div>
                                    <p className="font-bold text-black">Ahmed Mohamed</p>
                                    <p className="text-sm text-black/70">Client Véhicules</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 border-2 border-black hover:shadow-lg transition-all duration-300">
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-black text-black" />
                                ))}
                            </div>
                            <p className="text-black/80 mb-6 leading-relaxed italic">
                                "Investissement réussi grâce à AutoMarket. Parcelle bien située et prix honnête. Je recommande !"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">
                                    FH
                                </div>
                                <div>
                                    <p className="font-bold text-black">Fatima Hassan</p>
                                    <p className="text-sm text-black/70">Cliente Parcelles</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 border-2 border-black hover:shadow-lg transition-all duration-300">
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-black text-black" />
                                ))}
                            </div>
                            <p className="text-black/80 mb-6 leading-relaxed italic">
                                "Appartement trouvé rapidement et processus très simple. Équipe réactive et à l'écoute !"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">
                                    OA
                                </div>
                                <div>
                                    <p className="font-bold text-black">Omar Ali</p>
                                    <p className="text-sm text-black/70">Client Locations</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section - Noir et Blanc */}
            <div className="py-20 bg-white border-t-2 border-black">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
                        Prêt à réaliser votre projet ?
                    </h2>
                    <div className="w-20 h-0.5 bg-black mx-auto mb-6"></div>
                    <p className="text-xl text-black/70 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Plus de 1000 clients ont déjà trouvé ce qu'ils cherchaient. À votre tour !
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigateToVehicles()}
                            className="bg-black text-white px-10 py-4 font-semibold hover:bg-black/90 transition-colors duration-200 flex items-center justify-center gap-3 text-lg border-2 border-black"
                        >
                            Voir toutes les offres
                            <ArrowRight className="h-6 w-6" />
                        </button>

                        <button
                            onClick={() => navigateToContact()}
                            className="bg-transparent border-2 border-black text-black px-10 py-4 hover:bg-black hover:text-white transition-all duration-200 text-lg font-semibold flex items-center justify-center gap-3"
                        >
                            <Phone className="h-6 w-6" />
                            Nous contacter
                        </button>
                    </div>
                </div>
            </div>
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
