import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';

export default function Contact() {

    const contactInfo = [
        {
            icon: Phone,
            title: "Téléphone",
            details: ["+253 77 12 34 56", "+253 21 35 67 89"],
            color: "text-green-600",
            bgColor: "bg-green-100",
            action: "tel:+25377123456"
        },
        {
            icon: Mail,
            title: "Email",
            details: ["contact@automarket.dj", "info@automarket.dj"],
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            action: "mailto:contact@automarket.dj"
        },
    ];

    // Extraction des informations d'adresse
    const adresseInfo = contactInfo.find(info => info.title === "Adresse");

    // Construction du lien Google Maps
    const fullAddress = adresseInfo ? `${adresseInfo.details[0]}, ${adresseInfo.details[1]}` : 'Djibouti';
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section - Premium Style */}
            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 py-24 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgMCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg px-6 py-3 rounded-full mb-8 border border-white/20 shadow-2xl">
                        <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                        <span className="text-white font-semibold">Support Client</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                        Contactez
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 mt-2">
                            -Nous
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                        Nous sommes là pour vous aider. Contactez-nous directement par téléphone, WhatsApp ou email.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Informations de contact */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-6">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-600 font-semibold text-sm">Nos Coordonnées</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Comment nous joindre</h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Choisissez le moyen de communication qui vous convient le mieux
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {contactInfo.map((info, index) => (
                        <div key={index} className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-200">
                            <div className={`${info.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <info.icon className={`h-8 w-8 ${info.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{info.title}</h3>
                            <div className="text-center space-y-2">
                                {info.details.map((detail, idx) => (
                                    <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                                ))}
                            </div>
                            {info.action && (
                                <div className="mt-6 text-center">
                                    <a
                                        href={info.action}
                                        className={`group/btn inline-flex items-center gap-2 ${info.color.replace('text-', 'bg-').replace('-600', '-500')} text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105`}
                                    >
                                        <info.icon className="h-4 w-4" />
                                        {info.title === "Téléphone" ? "Appeler" : "Envoyer un email"}
                                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* WhatsApp Section - Premium Style */}
                <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl p-12 text-center text-white mb-16 overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0">
                        <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-10 left-10 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000"></div>
                    </div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <div className="bg-white/20 backdrop-blur-sm w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <MessageCircle className="h-12 w-12" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black mb-4">Chattez avec nous sur WhatsApp</h2>
                        <p className="text-xl mb-8 opacity-90 leading-relaxed">
                            Réponse rapide garantie ! Envoyez-nous un message directement.
                        </p>
                        <a
                            href="https://wa.me/25377123456?text=Bonjour, je suis intéressé par vos services AutoMarket"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-3 bg-white text-green-600 px-10 py-5 rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-lg font-bold shadow-2xl"
                        >
                            <MessageCircle className="h-6 w-6" />
                            Ouvrir WhatsApp
                            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
