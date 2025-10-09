import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Vérification de l'authentification...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Rediriger vers login avec l'URL de retour
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
