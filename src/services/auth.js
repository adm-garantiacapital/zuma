// services/auth.js
import { apiAdmin1, apiAdmin2 } from './api.js';
import router from '@/router';

const TOKEN_KEY = 'api_token';
const CUSTOMER_KEY = 'customer_data';

export const authService = {
    // Obtener token del localStorage
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    // Guardar token en localStorage
    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    },

    // Obtener datos del cliente
    getCustomer() {
        const customerData = localStorage.getItem(CUSTOMER_KEY);
        return customerData ? JSON.parse(customerData) : null;
    },

    // Guardar datos del cliente
    setCustomer(customer) {
        localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
    },

    // Verificar si está autenticado
    isAuthenticated() {
        return !!this.getToken();
    },

    /**
     * Login contra el backend seleccionado
     * @param {'admin1' | 'admin2'} source - qué API usar
     * @param {object} credentials - { email, password }
     */
    async login(source = 'admin2', credentials) {
        try {
            const api = source === 'admin2' ? apiAdmin2 : apiAdmin1;

            const response = await api.post('/login', credentials);

            const { api_token, customer } = response.data;

            this.setToken(api_token);
            this.setCustomer(customer);

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Logout desde el backend activo
     * @param {'admin1' | 'admin2'} source
     */
    async logout(source = 'admin2') {
        try {
            const api = source === 'admin2' ? apiAdmin2 : apiAdmin1;
            const token = this.getToken();

            if (token) {
                await api.post('/logout');
            }
        } catch (error) {
            console.error('Error durante logout:', error);
        } finally {
            this.clearSession();
        }
    },

    // Limpiar sesión local
    clearSession() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(CUSTOMER_KEY);
    },

    // Redirigir al login
    redirectToLogin() {
        router.push('/login');
    }
};
