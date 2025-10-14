import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

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
        {
            icon: MapPin,
            title: "Adresse",
            details: ["Cité aviation", "Djibouti-Ville, Djibouti"],
            color: "text-red-600",
            bgColor: "bg-red-100"
        },
        {
            icon: Clock,
            title: "Horaires",
            details: ["Lun - Ven: 8h00 - 18h00", "Sam: 9h00 - 16h00"],
            color: "text-purple-600",
            bgColor: "bg-purple-100"
        }
    ];

    // Extraction des informations d'adresse
    const adresseInfo = contactInfo.find(info => info.title === "Adresse");

    // Construction du lien Google Maps
    const fullAddress = adresseInfo ? `${adresseInfo.details[0]}, ${adresseInfo.details[1]}` : 'Djibouti';
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Contactez-nous
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto">
                        Nous sommes là pour vous aider. Contactez-nous directement par téléphone, WhatsApp ou email.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Informations de contact */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos coordonnées</h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Choisissez le moyen de communication qui vous convient le mieux
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {contactInfo.map((info, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className={`${info.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
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
                                        className={`inline-flex items-center gap-2 ${info.color.replace('text-', 'bg-').replace('-600', '-500')} text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-300 font-semibold`}
                                    >
                                        <info.icon className="h-4 w-4" />
                                        {info.title === "Téléphone" ? "Appeler" : "Envoyer un email"}
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* WhatsApp Section (inchangée) */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-12 text-center text-white mb-16">
                    <div className="max-w-2xl mx-auto">
                        <MessageCircle className="h-20 w-20 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-4">Chattez avec nous sur WhatsApp</h2>
                        <p className="text-xl mb-8 opacity-90">
                            Réponse rapide garantie ! Envoyez-nous un message directement.
                        </p>
                        <a
                            href="https://wa.me/25377123456?text=Bonjour, je suis intéressé par vos services AutoMarket"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-white text-green-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-lg font-bold shadow-2xl"
                        >
                            <MessageCircle className="h-6 w-6" />
                            Ouvrir WhatsApp
                        </a>
                    </div>
                </div>

                {/* Carte de localisation MISE À JOUR (cliquable) */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-8 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre localisation</h2>
                        <p className="text-gray-600 text-lg mb-8">Cliquez pour ouvrir l'itinéraire sur la carte !</p>
                    </div>

                    {/* Le bloc de carte est maintenant un lien (<a>) */}
                    <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-96 bg-gray-200 flex items-center justify-center hover:bg-red-50 transition-colors duration-300"
                    >
                        <div className="text-center p-4">
                            {adresseInfo && <adresseInfo.icon className={`h-20 w-20 mx-auto mb-4 ${adresseInfo.color}`} />}
                            {adresseInfo?.details.length > 0 && (
                                <>
                                    <p className="text-red-600 text-xl font-bold">
                                        {adresseInfo.details[0]}
                                    </p>
                                    <p className="text-gray-600 text-lg">
                                        {adresseInfo.details[1]}
                                    </p>
                                    <p className="mt-4 text-sm text-red-500 font-semibold underline">
                                        Voir sur Google Maps
                                    </p>
                                </>
                            )}
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
