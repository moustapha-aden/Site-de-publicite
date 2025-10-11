import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.common['Accept'] = 'application/json';
window.axios.defaults.withCredentials = false; // we use Bearer tokens, not cookies

// Attach Authorization header from localStorage for every request
window.axios.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    } catch (_) {
        // ignore storage errors
    }
    return config;
});

// Optional: handle 401 globally to keep session clean
// Laisse la logique 401 au AuthContext (évite d'effacer la session au simple refresh)
window.axios.interceptors.response.use((response) => response, (error) => Promise.reject(error));
