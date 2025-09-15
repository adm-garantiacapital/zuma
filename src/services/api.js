// api.js - Mejoras MÍNIMAS para producción
import router from '@/router';
import axios from 'axios';

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

      // ✅ Logging seguro (sin datos sensibles)
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      // ❌ NO logear headers ni data que pueden contener tokens/passwords

      return config;
    },
    (error) => {
      console.error('❌ Request Error:', error.message);
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response) => {
      console.log(`✅ API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
      return response;
    },
    (error) => {
      // ✅ Logging seguro de errores
      const status = error.response?.status;
      console.error(`❌ API Error [${status}]:`, error.response?.data?.message || error.message);

      if (status === 401) {
        console.warn('🔑 Token inválido o expirado, limpiando sesión...');
        localStorage.removeItem('api_token');
        localStorage.removeItem('customer_data');

        if (router.currentRoute.value.name !== 'login') {
          router.push({ name: 'login' });
        }
      } else if (status === 403) {
        console.warn('🚫 Acceso denegado');
      } else if (status >= 500) {
        console.error('🔥 Error del servidor');
      }

      return Promise.reject(error);
    }
  );

  return client;
}

// ✅ Validar URLs de environment
const admin1URL = import.meta.env.VITE_API_ADMIN1;
const admin2URL = import.meta.env.VITE_API_ADMIN2;

if (!admin1URL || !admin2URL) {
  throw new Error('API URLs no están configuradas en las variables de entorno');
}

export const apiAdmin1 = createApiClient(admin1URL);
export const apiAdmin2 = createApiClient(admin2URL);