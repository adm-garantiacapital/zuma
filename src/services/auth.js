import axios from 'axios';
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
    
    // Obtener datos del customer
    getCustomer() {
        const customerData = localStorage.getItem(CUSTOMER_KEY);
        return customerData ? JSON.parse(customerData) : null;
    },
    
    // Guardar datos del customer
    setCustomer(customer) {
        localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
    },
    
    // Verificar si está autenticado
    isAuthenticated() {
        return !!this.getToken();
    },
    
    // Login
    async login(credentials) {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/login`,
                credentials
            );
            
            const { api_token, customer } = response.data;
            
            // Guardar token y datos del customer
            this.setToken(api_token);
            this.setCustomer(customer);
            
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    // Logout
    async logout() {
        try {
            const token = this.getToken();
            if (token) {
                // Llamar al endpoint de logout del backend
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/logout`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
            }
        } catch (error) {
            console.error('Error durante logout:', error);
        } finally {
            // Limpiar datos locales siempre
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