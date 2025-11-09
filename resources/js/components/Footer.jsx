import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
    return (
            <footer className="bg-black border-t-2 border-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <h3 className="text-2xl font-bold mb-4 text-white">
                                AutoMarket
                            </h3>
                            <p className="text-white/70 leading-relaxed mb-6 text-sm">
                                Votre plateforme de confiance pour véhicules, parcelles et locations à Djibouti.
                            </p>
                            <div className="flex gap-3">
                                <a href="#" className="bg-white/10 hover:bg-white/20 border border-white/20 w-10 h-10 flex items-center justify-center transition-colors">
                                    <Facebook className="h-5 w-5 text-white" />
                                </a>
                                <a href="#" className="bg-white/10 hover:bg-white/20 border border-white/20 w-10 h-10 flex items-center justify-center transition-colors">
                                    <Instagram className="h-5 w-5 text-white" />
                                </a>
                                <a href="#" className="bg-white/10 hover:bg-white/20 border border-white/20 w-10 h-10 flex items-center justify-center transition-colors">
                                    <Twitter className="h-5 w-5 text-white" />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4 text-lg text-white">Services</h4>
                            <ul className="space-y-3 text-white/70">
                                <li><a href="#" className="hover:text-white transition-colors text-sm">Véhicules</a></li>
                                <li><a href="#" className="hover:text-white transition-colors text-sm">Parcelles</a></li>
                                <li><a href="#" className="hover:text-white transition-colors text-sm">Locations</a></li>
                                <li><a href="#" className="hover:text-white transition-colors text-sm">Financement</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4 text-lg text-white">À Propos</h4>
                            <ul className="space-y-3 text-white/70">
                                <li><a href="#" className="hover:text-white transition-colors text-sm">Qui sommes-nous</a></li>
                                <li><a href="#" className="hover:text-white transition-colors text-sm">Notre équipe</a></li>
                                <li><a href="#" className="hover:text-white transition-colors text-sm">Témoignages</a></li>
                                <li><a href="#" className="hover:text-white transition-colors text-sm">Blog</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4 text-lg text-white">Contact</h4>
                            <ul className="space-y-3 text-white/70">
                                <li className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 flex-shrink-0 text-white" />
                                    <span>+253 XX XX XX XX</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 flex-shrink-0 text-white" />
                                    <span>contact@automarket.dj</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm">
                                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-white" />
                                    <span>Djibouti, République de Djibouti</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/20 pt-8 text-center text-white/70 text-sm">
                        <p>&copy; 2024 AutoMarket. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
    );
}
