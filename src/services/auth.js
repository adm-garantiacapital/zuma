// services/auth.js - Versión con tipo de usuario
import { apiAdmin1, apiAdmin2 } from './api.js';
import router from '@/router';

const TOKEN_KEY = 'api_token';
const CUSTOMER_KEY = 'customer_data';

export const authService = {
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    setToken(token) {
        // ✅ Validar token antes de guardar
        if (!token || typeof token !== 'string') {
            throw new Error('Token inválido');
        }
        localStorage.setItem(TOKEN_KEY, token);
    },

    getCustomer() {
        try {
            const customerData = localStorage.getItem(CUSTOMER_KEY);
            return customerData ? JSON.parse(customerData) : null;
        } catch (error) {
            // ✅ Manejar JSON corrupto
            console.error('Error parsing customer data:', error);
            localStorage.removeItem(CUSTOMER_KEY);
            return null;
        }
    },

    setCustomer(customer) {
        // ✅ Validar datos antes de guardar
        if (!customer || typeof customer !== 'object') {
            throw new Error('Datos de cliente inválidos');
        }
        // ✅ Filtrar datos sensibles (mantener solo lo necesario) + tipo de usuario
        const safeCustomer = {
            id: customer.id,
            name: customer.name,
            first_last_name: customer.first_last_name,
            second_last_name: customer.second_last_name,
            alias: customer.alias,
            document: customer.document,
            email: customer.email,
            telephone: customer.telephone,
            status: customer.status,
            type: customer.type, // ✅ AGREGAR TIPO DE USUARIO
            // NO guardar passwords u otros datos sensibles
        };
        localStorage.setItem(CUSTOMER_KEY, JSON.stringify(safeCustomer));
    },

    // ✅ NUEVO: Método para obtener solo el tipo de usuario
    getUserType() {
        const customer = this.getCustomer();
        return customer?.type || null;
    },

    isAuthenticated() {
        const token = this.getToken();
        console.log('🔍 Verificando autenticación:');
        console.log(' - Token:', token ? 'EXISTE' : 'NO EXISTE');
        console.log(' - Longitud token:', token ? token.length : 0);
        const result = !!token;
        console.log(' - Resultado:', result);
        return result;
    },
    async login(source = 'admin2', credentials) {
    try {
        const cleanCredentials = {
            email: String(credentials.email).trim(),
            password: String(credentials.password)
        };

        const api = source === 'admin2' ? apiAdmin2 : apiAdmin1;
        const response = await api.post('/login', cleanCredentials);

        console.log('📥 Respuesta completa del servidor:', response.data);

        const { api_token, data: userData, success, cross_domain_redirect } = response.data;

        if (!success || !api_token || !userData) {
            throw new Error('Login no exitoso según el servidor');
        }

        console.log('✅ Token recibido:', api_token);
        console.log('✅ Redirección cross-domain:', cross_domain_redirect);

        // ✅ VERIFICACIÓN CRÍTICA: Asegurarnos que cross_domain_redirect existe
        if (!cross_domain_redirect) {
            console.error('❌ ERROR: cross_domain_redirect es null o undefined');
            throw new Error('No se recibió URL de redirección del servidor');
        }

        // Guardar token para Vue (por si acaso)
        this.setToken(api_token);
        this.setCustomer(userData);

        // ✅ CORRECCIÓN DEFINITIVA: Redirigir DIRECTAMENTE sin intermediarios
        console.log('🔄 REDIRIGIENDO DIRECTAMENTE a:', cross_domain_redirect);
        
        // Usar location.replace para evitar que el usuario pueda volver atrás
        window.location.replace(cross_domain_redirect);
        
        return {
            success: true,
            redirecting: true,
            redirectUrl: cross_domain_redirect
        };

    } catch (error) {
        console.error('❌ Error en login:', error.message);
        
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        
        throw error;
    }
},
    async logout(source = 'admin2') {
        try {
            const api = source === 'admin2' ? apiAdmin2 : apiAdmin1;
            const token = this.getToken();
            
            if (token) {
                await api.post('/logout');
            }
        } catch (error) {
            console.error('Error durante logout:', error.message);
        } finally {
            this.clearSession();
        }
    },

    clearSession() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(CUSTOMER_KEY);
    },

    redirectToLogin() {
        this.clearSession();
        router.push('/login');
    }
};
