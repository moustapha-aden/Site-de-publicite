import React from 'react';
import { Calendar, MapPin, Users, Car } from 'lucide-react';

export default function Rentals() {
    const rentals = [
        {
            id: 1,
            title: "BMW X5 - Location longue durée",
            location: "Paris",
            price: 800,
            period: "Mois",
            availability: "Disponible",
            image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400"
        },
        {
            id: 2,
            title: "Mercedes Classe C - Location courte durée",
            location: "Lyon",
            price: 120,
            period: "Jour",
            availability: "Disponible",
            image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400"
        },
        {
            id: 3,
            title: "Audi A4 - Location week-end",
            location: "Marseille",
            price: 80,
            period: "Jour",
            availability: "Réservé",
            image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400"
        },
        {
            id: 4,
            title: "Toyota Prius - Location écologique",
            location: "Nice",
            price: 60,
            period: "Jour",
            availability: "Disponible",
            image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400"
        }
    ];

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const getAvailabilityColor = (availability) => {
        return availability === 'Disponible'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Locations Disponibles
                </h1>
                <p className="text-gray-600">
                    Louez un véhicule pour vos déplacements
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type de location
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">Tous les types</option>
                            <option value="courte">Courte durée</option>
                            <option value="longue">Longue durée</option>
                            <option value="weekend">Week-end</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Localisation
                        </label>
                        <input
                            type="text"
                            placeholder="Ville"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Période
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="date"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex items-end">
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            Rechercher
                        </button>
                    </div>
                </div>
            </div>

            {/* Rentals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rentals.map((rental) => (
                    <div key={rental.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                        <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg flex items-center justify-center">
                            <Car className="h-16 w-16 text-gray-400" />
                        </div>
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        {rental.title}
                                    </h3>
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <MapPin className="h-4 w-4" />
                                        {rental.location}
                                    </div>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(rental.availability)}`}>
                                    {rental.availability}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="h-4 w-4 text-gray-600" />
                                <span className="font-semibold text-lg text-gray-900">
                                    {formatPrice(rental.price)}/{rental.period}
                                </span>
                            </div>
                            <button
                                className={`w-full py-2 px-4 rounded-lg transition-colors ${
                                    rental.availability === 'Disponible'
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                                disabled={rental.availability !== 'Disponible'}
                            >
                                {rental.availability === 'Disponible' ? 'Réserver' : 'Indisponible'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
