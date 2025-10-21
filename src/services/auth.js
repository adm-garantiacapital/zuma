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
            // ✅ Validar credenciales antes de enviar
            if (!credentials?.email || !credentials?.password) {
                throw new Error('Documento y contraseña son requeridos');
            }

            // ✅ Sanitizar entrada básica
            const cleanCredentials = {
                email: String(credentials.email).trim(),
                password: String(credentials.password)
            };

            const api = source === 'admin2' ? apiAdmin2 : apiAdmin1;
            const response = await api.post('/login', cleanCredentials);

            console.log('📥 Respuesta completa del servidor:', response.data);

            // ✅ CORRECCIÓN: Cambiar 'customer' por 'data' para coincidir con la API
            const { api_token, data: userData, success } = response.data;

            // ✅ Validar respuesta del servidor
            if (!success) {
                throw new Error('Login no exitoso según el servidor');
            }

            if (!api_token) {
                throw new Error('Token no encontrado en la respuesta');
            }

            if (!userData) {
                throw new Error('Datos de usuario no encontrados en la respuesta');
            }

            console.log('✅ Token recibido:', api_token);
            console.log('✅ Datos de usuario recibidos:', userData);
            console.log('✅ Tipo de usuario:', userData.type); // ✅ Log del tipo

            this.setToken(api_token);
            this.setCustomer(userData);

            return {
                success: true,
                user: userData,
                token: api_token,
                message: response.data.message
            };

        } catch (error) {
            console.error('Error en login:', error.message);            
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