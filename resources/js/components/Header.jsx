import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, LogIn } from 'lucide-react';
import { useAuth as useAuthContext } from '../contexts/AuthContext';

const useSafeAuth = () => {
    try {
        return useAuthContext();
    } catch (error) {
        return {
            user: null,
            isAuthenticated: false,
            isLoading: false,
            logout: () => {},
        };
    }
};


export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout, isLoading } = useSafeAuth();
    const isLoggedIn = Boolean(isAuthenticated);

    const navigation = [
        { name: 'Accueil', href: '/', current: location.pathname === '/' },
        { name: 'Véhicules', href: '/vehicles', current: location.pathname === '/vehicles' },
        { name: 'Parcelles à Vendre', href: '/properties', current: location.pathname === '/properties' },
        { name: 'Locations Disponibles', href: '/rentals', current: location.pathname === '/rentals' },
        { name: 'Contact', href: '/contact', current: location.pathname === '/contact' },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const handleLoginClick = () => {
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        if (typeof logout === 'function') {
            logout();
        }
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    return (
        <header className="bg-white border-b-2 border-black shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
                    {/* Logo */}
                    <div className="flex justify-start lg:w-0 lg:flex-1">
                        <Link to="/" className="text-2xl font-extrabold text-black hover:text-black/70 transition-colors">
                            AutoMarket
                        </Link>
                    </div>

                    {/* Navigation Desktop */}
                    <nav className="hidden md:flex space-x-8 text-sm font-medium">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`transition duration-150 ${
                                    item.current
                                        ? 'text-black border-b-2 border-black pb-1'
                                        : 'text-black/70 hover:text-black'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* User Menu Desktop */}
                    <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
                        {isLoading ? (
                            <div className="text-sm text-black/60 animate-pulse">Chargement…</div>
                        ) : isLoggedIn ? (
                            <div className="relative">
                                <button
                                    onClick={toggleUserMenu}
                                    type="button"
                                    className="flex items-center gap-2 text-sm font-medium text-black bg-white border-2 border-black px-3 py-2 rounded-lg hover:bg-black hover:text-white transition duration-150"
                                >
                                    <User className="h-5 w-5" />
                                    {user?.name || 'Mon compte'}
                                </button>

                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border-2 border-black">
                                        <div className="px-4 py-2 border-b border-black/10">
                                            <p className="text-sm font-medium text-black">
                                                {user?.name || 'Utilisateur'}
                                            </p>
                                            <p className="text-xs text-black/60">
                                                {user?.email || ''}
                                            </p>
                                        </div>
                                        <Link
                                            to="/admin/dashboard"
                                            className="flex items-center px-4 py-2 text-sm text-black hover:bg-black/10 transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <User className="h-4 w-4 mr-3" />
                                            Administration
                                        </Link>
                                        <button
                                            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            onClick={handleLogout}
                                            type="button"
                                        >
                                            <LogOut className="h-4 w-4 mr-3" />
                                            Se déconnecter
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={handleLoginClick}
                                type="button"
                                className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-white bg-black hover:bg-black/80 px-4 py-2 rounded-lg border-2 border-black transition duration-150"
                            >
                                <LogIn className="h-4 w-4" />
                                Se connecter
                            </button>
                        )}
                    </div>

                    {/* Menu Mobile Button */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            onClick={toggleMobileMenu}
                            className="bg-white border-2 border-black rounded-md p-2 inline-flex items-center justify-center text-black hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black"
                        >
                            <span className="sr-only">Ouvrir le menu</span>
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Menu Mobile */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t-2 border-black pb-3 shadow-lg">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium transition duration-150 ${
                                        item.current
                                            ? 'bg-black text-white'
                                            : 'text-black hover:bg-black/10'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {/* Mobile User Menu */}
                            {isLoading ? (
                                <div className="border-t border-black/10 my-2 px-3 py-2 text-sm text-black/60">
                                    Chargement…
                                </div>
                            ) : isLoggedIn ? (
                                <>
                                    <div className="border-t border-black/10 my-2"></div>
                                    <div className="px-3 py-2">
                                        <p className="text-sm font-medium text-black">
                                            {user?.name || 'Utilisateur'}
                                        </p>
                                        <p className="text-xs text-black/60">
                                            {user?.email || ''}
                                        </p>
                                    </div>
                                    <Link
                                        to="/admin/dashboard"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-black hover:bg-black/10 transition duration-150"
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        Administration
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        type="button"
                                        className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-black/10 transition duration-150"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Se déconnecter
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="border-t border-black/10 my-2"></div>
                                    <button
                                        onClick={handleLoginClick}
                                        type="button"
                                        className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white bg-black hover:bg-black/80 border-2 border-black transition duration-150"
                                    >
                                        <LogIn className="h-4 w-4 mr-2" />
                                        Se connecter
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Overlay pour fermer le menu mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}
        </header>
    );
}
