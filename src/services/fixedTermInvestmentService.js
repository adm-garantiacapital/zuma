import { apiAdmin1 } from './api.js';

export const fixedTermInvestmentService = {
  // Registrar una inversión de tasa fija
  store(data) {
    return apiAdmin1.post('/panel/fixed-term-investments', data);
  },

  // Generar y guardar cronograma
  storeCronograma(data) {
    return apiAdmin1.post('/panel/fixed-term-investments/cronograma', data);
  },

  // Listar inversiones (paginado)
  index(params = { page: 1, per_page: 10 }) {
    return apiAdmin1.get('/panel/fixed-term-investments', { params });
  },

  // Mostrar una inversión por ID
  show(id) {
    return apiAdmin1.get(`/panel/fixed-term-investments/${id}`);
  },

  // Obtener la última inversión del usuario
  getLast() {
    return apiAdmin1.get('/tasas-fijas/last');
  },

  // Obtener los principales inversionistas
  getTopInvestors() {
    return apiAdmin1.get('/tasas-fijas/top');
  },

  // 🆕 Obtener todas las cooperativas/inversiones pendientes del usuario
  getPending() {
    return apiAdmin1.get('/tasas-fijas/fixed-term-investments/pendientes');
  },

  // ✅ Obtener todas las reservas pendientes del usuario autenticado
  getReservasPendientes() {
    return apiAdmin1.get('/reservas');
  }
};
