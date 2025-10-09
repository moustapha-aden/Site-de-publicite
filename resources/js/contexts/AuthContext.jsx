import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Vérifier si l'utilisateur est connecté
    const isAuthenticated = !!user && !!token;

    // Fonction de connexion
    const login = useCallback(async (email, password) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/login', {
                email,
                password,
            });

            // Backend shape: { success, message, data: { user, token, token_type, expires_at } }
            const payload = response?.data?.data || {};
            const authToken = payload?.token;
            const userData = payload?.user;

            // Vérifier que les données sont valides
            if (!authToken || !userData) {
                throw new Error('Données de connexion invalides');
            }

            // Sauvegarder dans localStorage avec vérification
            try {
                localStorage.setItem('token', authToken);
                localStorage.setItem('user', JSON.stringify(userData));
            } catch (storageError) {
                console.error('Erreur lors de la sauvegarde dans localStorage:', storageError);
                throw new Error('Impossible de sauvegarder la session');
            }

            // Configurer Axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

            // Mettre à jour l'état
            setToken(authToken);
            setUser(userData);

            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Erreur de connexion'
            };
        }
    }, []);

    // Fonction de déconnexion
    const logout = useCallback(() => {
        // Supprimer du localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Supprimer le header Axios
        delete axios.defaults.headers.common['Authorization'];

        // Réinitialiser l'état
        setToken(null);
        setUser(null);

        console.log('Déconnexion effectuée');
    }, []);

    // Vérifier la session au chargement
    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                try {
                    // Vérifier que storedUser n'est pas "undefined" ou null
                    if (storedUser === 'undefined' || storedUser === 'null' || !storedUser.trim()) {
                        console.warn('Données utilisateur invalides dans localStorage, nettoyage...');
                        logout();
                        return;
                    }

                    const userData = JSON.parse(storedUser);

                    // Vérifier que userData est un objet valide
                    if (!userData || typeof userData !== 'object') {
                        console.warn('Données utilisateur corrompues, nettoyage...');
                        logout();
                        return;
                    }

                    // Configurer Axios
                    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

                    // Vérifier si le token est encore valide
            const response = await axios.get('http://127.0.0.1:8000/api/auth/me');

                    // me response shape: { success, message, data: { ...user } }
                    const meUser = response?.data?.data || userData;

                    setToken(storedToken);
                    setUser(meUser);
                } catch (error) {
                    console.error('Erreur lors de la vérification de la session:', error);

                    // Si c'est une erreur de parsing JSON, nettoyer le localStorage
                    if (error instanceof SyntaxError) {
                        console.warn('Données JSON corrompues, nettoyage du localStorage...');
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }

                    logout();
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, [logout]);

    const value = {
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
