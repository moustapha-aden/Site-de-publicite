import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <Link to="/" className="text-2xl font-extrabold text-white hover:text-gray-300 transition-colors">
                            AutoMarket
                        </Link>
                        <p className="text-gray-300 mt-4">
                            Votre partenaire de confiance pour l'achat, la vente et la location de véhicules.
                        </p>
                        <div className="flex space-x-4 mt-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                                    Accueil
                                </Link>
                            </li>
                            <li>
                                <Link to="/vehicles" className="text-gray-300 hover:text-white transition-colors">
                                    Véhicules
                                </Link>
                            </li>
                            <li>
                                <Link to="/properties" className="text-gray-300 hover:text-white transition-colors">
                                    Parcelles à Vendre
                                </Link>
                            </li>
                            <li>
                                <Link to="/rentals" className="text-gray-300 hover:text-white transition-colors">
                                    Locations
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Services</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Vente de véhicules</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Achat de véhicules</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Location courte durée</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Location longue durée</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Estimation gratuite</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-gray-300">
                                <Phone className="h-4 w-4" />
                                01 23 45 67 89
                            </li>
                            <li className="flex items-center gap-2 text-gray-300">
                                <Mail className="h-4 w-4" />
                                contact@automarket.fr
                            </li>
                            <li className="flex items-center gap-2 text-gray-300">
                                <MapPin className="h-4 w-4" />
                                123 Rue de la Paix<br />
                                75001 Paris, France
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-700 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-300 text-sm">
                            © 2024 AutoMarket. Tous droits réservés.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                                Mentions légales
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                                Politique de confidentialité
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                                CGV
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
