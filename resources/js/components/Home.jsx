import React from 'react';
import { Car, TrendingUp, Users, Star } from 'lucide-react';

export default function Home() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
           {/* Hero Section */}
           <div className="relative text-center mb-12 rounded-xl overflow-hidden">
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
                        <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
                            Voir les offres
                        </button>
                        <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-gray-900 transition-colors text-lg font-semibold">
                            En savoir plus
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                    <Car className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900">500+</h3>
                    <p className="text-gray-600">Véhicules disponibles</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                    <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900">1000+</h3>
                    <p className="text-gray-600">Clients satisfaits</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                    <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900">4.9/5</h3>
                    <p className="text-gray-600">Note moyenne</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                    <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900">10+</h3>
                    <p className="text-gray-600">Années d'expérience</p>
                </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Car className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Large Sélection</h3>
                    <p className="text-gray-600">
                        Plus de 500 véhicules de toutes marques et tous budgets
                    </p>
                </div>
                <div className="text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Qualité Garantie</h3>
                    <p className="text-gray-600">
                        Tous nos véhicules sont vérifiés et garantis
                    </p>
                </div>
                <div className="text-center">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Service Client</h3>
                    <p className="text-gray-600">
                        Notre équipe est là pour vous accompagner
                    </p>
                </div>
            </div>
        </div>
    );
}
