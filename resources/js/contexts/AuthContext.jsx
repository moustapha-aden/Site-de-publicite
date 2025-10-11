import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user && !!token;

    // --- Login ---
    const login = useCallback(async (email, password) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/login', { email, password });
            const payload = response?.data?.data || {};
            const authToken = payload?.token;
            const userData = payload?.user;

            if (!authToken || !userData) throw new Error('Données de connexion invalides');

            // Debug minimal (ne logue pas tout le token)
            console.debug('[Auth] Login token preview:', String(authToken).slice(0, 12), 'hasPipe=', String(authToken).includes('|'));

            // Sauvegarde dans localStorage
            localStorage.setItem('token', authToken);
            localStorage.setItem('user', JSON.stringify(userData));

            // Config Axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

            // Mise à jour état
            setToken(authToken);
            setUser(userData);

            return { success: true, data: payload };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || error.message || 'Erreur de connexion' };
        }
    }, []);

    // --- Logout ---
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
        console.log('Déconnexion effectuée');
    }, []);

    // --- Vérification de session au chargement ---
    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                console.debug('[Auth] checkAuth: token preview =', String(storedToken).slice(0, 12), 'hasPipe=', String(storedToken).includes('|'));
                let parsedUser = null;
                try {
                    parsedUser = JSON.parse(storedUser);
                    if (!parsedUser || typeof parsedUser !== 'object') throw new Error('Données utilisateur invalides');
                } catch (e) {
                    console.warn('JSON utilisateur invalide, suppression possible du localStorage');
                    logout();
                    setIsLoading(false);
                    return;
                }

                // Config Axios avec le token existant
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                console.debug('[Auth] checkAuth: axios.Authorization =', axios.defaults.headers.common['Authorization']?.slice(0, 20) + '...');

                try {
                    // Vérifie si le token est valide via le backend
                    console.debug('[Auth] GET /api/auth/me ...');
                    const response = await axios.get('http://127.0.0.1:8000/api/auth/me');
                    console.debug('[Auth] /me status =', response?.status);
                    const meUser = response?.data?.data || parsedUser;
                    setUser(meUser);
                    setToken(storedToken);
                } catch (error) {
                    const status = error?.response?.status;
                    const looksInvalid = !String(storedToken).includes('|');
                    console.warn('Impossible de vérifier le token auprès du backend', { status, looksInvalid, authHeader: axios.defaults.headers.common['Authorization']?.slice(0, 20) + '...' });
                    // Ne pas effacer la session au refresh: on garde la session locale
                    setUser(parsedUser);
                    setToken(storedToken);
                }
            }

            setIsLoading(false);
        };

        checkAuth();
    }, [logout]);

    const value = { user, token, isAuthenticated, isLoading, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
