import { apiAdmin1 } from './api.js';
    export const dniService = {
    consultarDni(dni) {
        if (!dni || !/^\d{8}$/.test(dni)) {
        return Promise.reject(new Error('Debe proporcionar un DNI válido de 8 dígitos'));
        }
        return apiAdmin1.get(`/consultar-dni/${dni}`);
    }
};
