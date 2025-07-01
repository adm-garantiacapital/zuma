import axios from 'axios';
import router from '@/router';

function createApiClient(baseURL) {
    const client = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        timeout: 10000
    });

    client.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('api_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
                headers: config.headers,
                data: config.data
            });

            return config;
        },
        (error) => {
            console.error('❌ Request Error:', error);
            return Promise.reject(error);
        }
    );

    client.interceptors.response.use(
        (response) => {
            console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
            return response;
        },
        (error) => {
            console.error('❌ API Error:', error.response?.data || error.message);

            if (error.response?.status === 401) {
                console.warn('🔑 Token inválido o expirado, limpiando sesión...');
                localStorage.removeItem('api_token');

                if (router.currentRoute.value.name !== 'login') {
                    router.push({ name: 'login' });
                }
            } else if (error.response?.status === 403) {
                console.warn('🚫 Acceso denegado');
            } else if (error.response?.status >= 500) {
                console.error('🔥 Error del servidor');
            }

            return Promise.reject(error);
        }
    );

    return client;
}

// Exportamos dos clientes separados
export const apiAdmin1 = createApiClient(import.meta.env.VITE_API_ADMIN1);
export const apiAdmin2 = createApiClient(import.meta.env.VITE_API_ADMIN2);
