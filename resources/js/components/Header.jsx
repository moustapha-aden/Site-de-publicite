import React, { useState } from 'react';
import { href, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    const navigation = [
        { name: 'Accueil', href: '/', current: location.pathname === '/' },
        { name: 'Véhicules', href: '/vehicles', current: location.pathname === '/vehicles' },
        { name: 'Parcelles à Vendre', href: '/properties', current: location.pathname === '/properties' },
        { name: 'Locations Disponibles', href: '/rentals', current: location.pathname === '/rentals' },
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
        logout();
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
                    {/* Logo */}
                    <div className="flex justify-start lg:w-0 lg:flex-1">
                        <Link to="/" className="text-2xl font-extrabold text-indigo-700 hover:text-indigo-600 transition-colors">
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
                                        ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1'
                                        : 'text-gray-500 hover:text-gray-900'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* User Menu Desktop */}
                    <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={toggleUserMenu}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition duration-150 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100"
                                >
                                    <User className="h-5 w-5" />
                                    {user?.name || 'Mon compte'}
                                </button>

                                {/* Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">
                                                {user?.name || 'Utilisateur'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {user?.email || ''}
                                            </p>
                                        </div>
                                        <Link
                                            to="/admin/dashboard"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <User className="h-4 w-4 mr-3" />
                                            Administration
                                        </Link>
                                        <button
                                            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            onClick={handleLogout}
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
                                className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition duration-150"
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
                            className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium transition duration-150 ${
                                        item.current
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {/* Mobile User Menu */}
                            {isAuthenticated ? (
                                <>
                                    <div className="border-t border-gray-200 my-2"></div>
                                    <div className="px-3 py-2">
                                        <p className="text-sm font-medium text-gray-900">
                                            {user?.name || 'Utilisateur'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {user?.email || ''}
                                        </p>
                                    </div>
                                    <Link
                                        to="/admin/dashboard"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition duration-150"
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        Administration
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition duration-150"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Se déconnecter
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="border-t border-gray-200 my-2"></div>
                                <button
                                    onClick={handleLoginClick}
                                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-150"
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
                    className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}
        </header>
    );
}
